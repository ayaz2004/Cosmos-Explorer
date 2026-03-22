import dotenv from 'dotenv';

dotenv.config();

function asBoolean(value, fallback = false) {
  if (value == null) return fallback;
  return String(value).toLowerCase() === 'true';
}

function asNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const env = {
  port: process.env.PORT || 3001,
  frontendUrl: process.env.FRONTEND_URL || '',
  vercelUrl: process.env.VERCEL_URL || '',
  isVercel: process.env.VERCEL === '1',
  allowVercelPreviewOrigins: asBoolean(process.env.ALLOW_VERCEL_PREVIEW_ORIGINS, true),
  groqApiKey: process.env.GROQ_API_KEY,
  qdrant: {
    enabled: asBoolean(process.env.QDRANT_ENABLED, false),
    url: process.env.QDRANT_URL || 'http://127.0.0.1:6333',
    apiKey: process.env.QDRANT_API_KEY || undefined,
    collection: process.env.QDRANT_COLLECTION || 'cosmos_knowledge',
    vectorSize: asNumber(process.env.QDRANT_VECTOR_SIZE, 256),
  },
};
