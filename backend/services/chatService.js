import { streamText, convertToModelMessages } from 'ai';
import { SYSTEM_PROMPT } from '../prompt.js';
import {
  buildRagContext,
  getLatestUserQuery,
  isQdrantEnabled,
  retrieveKnowledge,
  retrieveKnowledgeVector,
} from '../rag.js';

export async function createChatStream({ messages, model, ensureKnowledgeReady }) {
  await ensureKnowledgeReady();

  const recentMessages = messages.slice(-4);
  const modelMessages = await convertToModelMessages(recentMessages);
  const latestQuery = getLatestUserQuery(messages);
  let retrievedDocs = [];

  if (latestQuery) {
    if (isQdrantEnabled()) {
      try {
        retrievedDocs = await retrieveKnowledgeVector(latestQuery, 3);
      } catch (error) {
        console.error('Qdrant retrieval failed, using fallback:', error);
        retrievedDocs = retrieveKnowledge(latestQuery, 3);
      }
    } else {
      retrievedDocs = retrieveKnowledge(latestQuery, 3);
    }
  }

  const ragContext = buildRagContext(retrievedDocs);
  const systemPrompt = ragContext
    ? `${SYSTEM_PROMPT}\n\n${ragContext}`
    : SYSTEM_PROMPT;

  return streamText({
    model,
    system: systemPrompt,
    messages: modelMessages,
    maxTokens: 300,
    temperature: 0.7,
  });
}
