import fs from 'node:fs';
import { QdrantClient } from '@qdrant/js-client-rest';
import { env } from './config.js';

const documentsPath = new URL('./knowledge/documents.json', import.meta.url);
const documents = JSON.parse(fs.readFileSync(documentsPath, 'utf-8'));

const VECTOR_SIZE = env.qdrant.vectorSize;
const COLLECTION_NAME = env.qdrant.collection;
const QDRANT_ENABLED = env.qdrant.enabled;

let qdrantClient;

const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'how', 'i', 'in',
  'is', 'it', 'of', 'on', 'or', 'that', 'the', 'to', 'was', 'what', 'when', 'where',
  'which', 'who', 'why', 'with', 'you', 'your', 'me', 'my', 'we', 'our', 'they', 'their',
]);

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token && !STOPWORDS.has(token));
}

function hashToken(token) {
  let hash = 2166136261;
  for (let i = 0; i < token.length; i += 1) {
    hash ^= token.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function normalizeVector(vector) {
  let sumSquares = 0;
  for (let i = 0; i < vector.length; i += 1) {
    sumSquares += vector[i] * vector[i];
  }

  const norm = Math.sqrt(sumSquares) || 1;
  return vector.map((value) => value / norm);
}

function createHashedEmbedding(text) {
  const tokens = tokenize(text);
  const vector = new Array(VECTOR_SIZE).fill(0);

  for (const token of tokens) {
    const hash = hashToken(token);
    const idxA = hash % VECTOR_SIZE;
    const idxB = (Math.floor(hash / 131) + 17) % VECTOR_SIZE;
    vector[idxA] += 1;
    vector[idxB] += 0.5;
  }

  return normalizeVector(vector);
}

function termFrequency(tokens) {
  const tf = new Map();
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }
  return tf;
}

function overlapScore(queryTf, docTf) {
  let overlap = 0;
  let weightedOverlap = 0;

  for (const [token, qCount] of queryTf.entries()) {
    const dCount = docTf.get(token) || 0;
    if (dCount > 0) {
      overlap += 1;
      weightedOverlap += Math.min(qCount, dCount);
    }
  }

  const norm = Math.max(queryTf.size, 1);
  return overlap / norm + weightedOverlap / Math.max(norm * 2, 1);
}

function extractUserText(message) {
  if (!message || message.role !== 'user') return '';

  if (typeof message.content === 'string') {
    return message.content;
  }

  if (Array.isArray(message.parts)) {
    return message.parts
      .filter((part) => part?.type === 'text' && typeof part.text === 'string')
      .map((part) => part.text)
      .join(' ');
  }

  return '';
}

export function getLatestUserQuery(messages) {
  if (!Array.isArray(messages)) return '';

  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const text = extractUserText(messages[i]).trim();
    if (text) return text;
  }

  return '';
}

export function retrieveKnowledge(query, topK = 3) {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const queryTf = termFrequency(queryTokens);

  const scored = documents
    .map((doc) => {
      const docTokens = tokenize(`${doc.title} ${doc.content}`);
      const docTf = termFrequency(docTokens);
      const score = overlapScore(queryTf, docTf);
      return { ...doc, score };
    })
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return scored;
}

function getQdrantClient() {
  if (!QDRANT_ENABLED) return null;
  if (qdrantClient) return qdrantClient;

  qdrantClient = new QdrantClient({
    url: env.qdrant.url,
    apiKey: env.qdrant.apiKey,
  });

  return qdrantClient;
}

async function ensureCollection(client) {
  const collections = await client.getCollections();
  const hasCollection = collections.collections.some((c) => c.name === COLLECTION_NAME);

  if (!hasCollection) {
    await client.createCollection(COLLECTION_NAME, {
      vectors: {
        size: VECTOR_SIZE,
        distance: 'Cosine',
      },
    });
  }
}

export async function initializeKnowledgeStore() {
  const client = getQdrantClient();
  if (!client) return { enabled: false, indexed: 0 };

  await ensureCollection(client);

  const points = documents.map((doc, i) => ({
    id: i + 1,
    vector: createHashedEmbedding(`${doc.title} ${doc.content}`),
    payload: {
      id: doc.id,
      title: doc.title,
      url: doc.url,
      source: doc.source,
      content: doc.content,
    },
  }));

  await client.upsert(COLLECTION_NAME, { points, wait: true });
  return { enabled: true, indexed: points.length };
}

export async function retrieveKnowledgeVector(query, topK = 3) {
  const client = getQdrantClient();
  if (!client) {
    return [];
  }

  await ensureCollection(client);
  const queryVector = createHashedEmbedding(query);

  const searchResult = await client.search(COLLECTION_NAME, {
    vector: queryVector,
    limit: topK,
    with_payload: true,
  });

  return searchResult
    .filter((item) => item?.payload)
    .map((item) => ({
      id: item.payload.id,
      title: item.payload.title,
      url: item.payload.url,
      source: item.payload.source,
      content: item.payload.content,
      score: item.score,
    }));
}

export function isQdrantEnabled() {
  return QDRANT_ENABLED;
}

export function buildRagContext(retrievedDocs) {
  if (!Array.isArray(retrievedDocs) || retrievedDocs.length === 0) {
    return '';
  }

  const contextBlocks = retrievedDocs
    .map((doc, index) => {
      return [
        `Source ${index + 1}: ${doc.title}`,
        `URL: ${doc.url}`,
        `Publisher: ${doc.source}`,
        `Snippet: ${doc.content}`,
      ].join('\n');
    })
    .join('\n\n');

  return [
    'Use the verified context below when relevant.',
    'If context does not cover the question, say that clearly and answer conservatively.',
    'When using context, mention source title naturally in the answer.',
    '',
    contextBlocks,
  ].join('\n');
}

export function listKnowledgeSources() {
  return documents.map((doc) => ({
    id: doc.id,
    title: doc.title,
    url: doc.url,
    source: doc.source,
  }));
}
