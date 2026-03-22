import express from 'express';
import cors from 'cors';
import { createGroq } from '@ai-sdk/groq';
import { env } from './config.js';
import {
  initializeKnowledgeStore,
  listKnowledgeSources,
} from './rag.js';
import { createChatStream } from './services/chatService.js';

const groq = createGroq({
  apiKey: env.groqApiKey,
});

const app = express();
let knowledgeInitPromise;

function initializeKnowledge() {
  if (!knowledgeInitPromise) {
    knowledgeInitPromise = initializeKnowledgeStore()
      .then((result) => {
        if (result.enabled) {
          console.log(`📚 Qdrant enabled, indexed ${result.indexed} knowledge documents`);
        } else {
          console.log('📚 Qdrant disabled, using local keyword retrieval');
        }
        return result;
      })
      .catch((error) => {
        console.error('Knowledge store initialization failed:', error);
        console.log('📚 Continuing with local keyword retrieval fallback');
        return { enabled: false, indexed: 0 };
      });
  }

  return knowledgeInitPromise;
}

app.use(cors({
  origin: env.frontendUrl,
  methods: ['POST', 'GET'],
  credentials: true,
}));

app.use(express.json());

/* ── Health Check ──────────────────────────────── */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* ── Knowledge Sources ─────────────────────────── */
app.get('/api/sources', (_req, res) => {
  res.json({
    count: listKnowledgeSources().length,
    sources: listKnowledgeSources(),
  });
});

/* ── Reindex Knowledge Store ───────────────────── */
app.post('/api/admin/reindex', async (_req, res) => {
  try {
    const result = await initializeKnowledgeStore();
    knowledgeInitPromise = Promise.resolve(result);
    res.json({ status: 'ok', ...result });
  } catch (error) {
    console.error('Reindex error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to reindex knowledge store.',
    });
  }
});

/* ── Chat Endpoint (streaming) ─────────────────── */
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const result = await createChatStream({
      messages,
      model: groq('llama-3.3-70b-versatile'),
      ensureKnowledgeReady: initializeKnowledge,
    });

    result.pipeUIMessageStreamToResponse(res);
  } catch (error) {
    console.error('Chat API error:', error);

    if (!res.headersSent) {
      res.status(500).json({
        error: 'Houston, we have a problem! Something went wrong on our end.',
      });
    }
  }
});

initializeKnowledge();

export { app, initializeKnowledge };
export default app;
