# Introspect — Open-Source Mental Health Agent

An open-source conversational AI agent for mental health support. Built with LangChain, Pinecone, and Next.js.

Introspect uses retrieval-augmented generation to ground conversations in real therapeutic literature. It routes between conversation modes (open-ended, reflective, resource-oriented) based on what the user is bringing to the session, and includes crisis detection with automatic escalation.

## How It Works

The agent pulls from a vector store of indexed therapeutic materials (PDFs, articles, clinical frameworks) to inform its responses. Instead of generating advice from the model's general training data alone, it retrieves relevant passages and weaves them into the conversation naturally.

The conversation engine uses a graph-based routing system to decide how to respond:

- **Open conversation** — the user is talking freely. The agent listens, reflects, asks follow-up questions.
- **Resource retrieval** — the user raises a topic where specific therapeutic literature applies. The agent pulls from the knowledge base and integrates it.
- **Crisis detection** — the user signals distress or self-harm. The agent breaks from normal conversation flow and surfaces crisis resources immediately.

Conversations are persistent across sessions via Vercel KV, so the agent maintains context over time.

## Stack

- **Frontend**: Next.js 13+, React, Tailwind CSS
- **AI**: OpenAI GPT-4, LangChain (graph-based routing, prompt chaining)
- **Knowledge Base**: Pinecone vector store (1536-dim OpenAI embeddings)
- **Auth**: NextAuth.js (GitHub OAuth)
- **Storage**: Vercel KV (Redis) for session persistence
- **Voice**: Deepgram TTS
- **Search**: Tavily API for supplemental web retrieval

## Getting Started

### Prerequisites

- Node.js 18+, pnpm
- API keys: OpenAI, Pinecone, Tavily
- GitHub OAuth app
- Vercel KV database

### Setup

```bash
git clone https://github.com/m1110/introspect.git
cd introspect
pnpm install
cp .env.example .env.local
```

Fill in `.env.local` (see `.env.example` for the full list):

```
OPENAI_API_KEY=
PINECONE_API_KEY=
PINECONE_ENVIRONMENT=
PINECONE_INDEX=
TAVILY_API_KEY=
AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
KV_URL=
```

Set up Pinecone with a 1536-dimension index using cosine similarity. Set your GitHub OAuth callback to `http://localhost:3000/api/auth/callback/github`.

```bash
pnpm dev
```

## Deployment

```bash
npx vercel
```

Set environment variables in the Vercel dashboard and provision a KV database. Also runs on Netlify, Railway, DigitalOcean, or any platform that supports Next.js.

## Contributing

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Open a PR

## Important

This is a support tool, not a replacement for professional mental health treatment. The system includes crisis detection and will surface hotline resources when it detects distress signals.

## License

MIT — see [LICENSE](LICENSE).