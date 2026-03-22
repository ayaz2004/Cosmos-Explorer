# Cosmos Explorer

## What I Built
Cosmos Explorer is a full-stack, AI-powered chat application designed to act as a dedicated educational guide for space exploration, astronomy, and astrophysics. 

Instead of a general-purpose AI, this application is strictly scoped to answer questions related to the universe. It uses a custom-built Retrieval-Augmented Generation (RAG) pipeline backed by Qdrant to ground its answers using a specialized knowledge base. The frontend features a highly customized, responsive user interface with an animated starfield background and tailored loading states to create an immersive learning environment.

## Why I Picked This Topic
Space is a subject that naturally sparks curiosity, but the concepts can often feel overwhelming due to their sheer scale and complexity. I wanted to build a tool that makes learning about the cosmos accessible, interactive, and engaging. 

I chose this specific domain because it provided a perfect use case for a specialized AI. A general chatbot will often lose focus or hallucinate when diving into physics or astronomy. By restricting the AI's scope and backing it with targeted knowledge through a vector database, I could ensure the assistant remains factual, stays on topic, and breaks down complex scientific concepts into easily digestible explanations.

## Technical Stack
- **Frontend:** React 19, Vite, Tailwind CSS (v4)
- **Backend:** Node.js, Express
- **AI & Data:** Groq (LLaMA 3 model) for fast inference, Vercel AI SDK, Qdrant for vector storage and RAG
- **Deployment:** Vercel (Frontend static build + Serverless API functions)

## Core Features
- **Domain-Restricted AI:** The system prompt refuses non-science questions, keeping the user focused on the educational goal.
- **Hybrid RAG Pipeline:** Integrates a Qdrant vector database to pull verified facts into the context window before answering. Includes a local keyword-search fallback.
- **Immersive UI:** Built from scratch without component libraries, featuring an animated parallax star layer, gradient text, and custom CSS animations.
- **Serverless Architecture:** Configured as a monorepo that Vercel deploys simultaneously as a static site and Node.js serverless functions.

## Running Locally

1. Install dependencies at the root level:
\\\ash
npm install
\\\`n
2. Create a \.env\ file in the root directory based on the following variables:
\\\	ext
GROQ_API_KEY=your_groq_api_key
QDRANT_ENABLED=true
QDRANT_URL=your_qdrant_cluster_url
QDRANT_API_KEY=your_qdrant_api_key
ALLOW_VERCEL_PREVIEW_ORIGINS=true
\\\`n
3. Start the development servers:
\\\ash
# Terminal 1 - Start the Express backend on port 3001
npm run dev:backend

# Terminal 2 - Start the Vite React frontend
npm run dev:frontend
\\\`n
