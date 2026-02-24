# Introspect - AI-Powered Therapeutic Chatbot

<p align="center">
  An open-source AI therapeutic chatbot featuring Dr. Samuel Bennett, MD - a sophisticated AI counselor designed to provide culturally-aware mental health support.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#getting-started"><strong>Getting Started</strong></a> ·
  <a href="#deployment"><strong>Deployment</strong></a> ·
  <a href="#contributing"><strong>Contributing</strong></a>
</p>

## ✨ Features

- **Dr. Samuel Bennett AI Persona**: A sophisticated AI counselor with a carefully crafted personality, cultural awareness, and therapeutic expertise
- **Advanced Conversation System**: Smart routing between different conversation modes and therapeutic approaches
- **Vector-Based Context**: Uses Pinecone for intelligent context retrieval and memory
- **Authentication**: GitHub OAuth integration with NextAuth.js
- **Voice Integration**: Text-to-speech capabilities with Deepgram
- **Modern UI**: Beautiful, responsive interface built with Next.js 13+ and Tailwind CSS
- **Extensive Therapeutic Resources**: Includes curated PDFs and materials for therapeutic support
- **Real-time Chat**: Streaming AI responses with message persistence

## 🧠 About Dr. Samuel Bennett

Dr. Samuel Bennett is the AI counselor at the heart of MH - a thirty-seven-year-old Black psychiatrist from Atlanta, GA, with a rich background in cultural awareness and therapeutic expertise. His personality integrates:

- **Cultural Competency**: Deep understanding of Black experiences and cultural contexts
- **Academic Excellence**: Education from Morehouse, Howard, and Stanford
- **Conversational Authenticity**: Natural, barbershop-style communication with humor and personality
- **Therapeutic Expertise**: Grounded in Black Posthumanism and Systems Theory
- **Personal Connection**: Shares opinions, takes stances, and builds genuine rapport

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- OpenAI API key
- Pinecone account and API key
- Tavily API key (for web search capabilities)
- GitHub OAuth app (for authentication)
- Vercel KV database (for session storage)
- Firebase project (optional, for user profile images)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/m1110/introspect.git
   cd introspect
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables in `.env.local`:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   AUTH_SECRET=your_auth_secret_here
   AUTH_GITHUB_ID=your_github_oauth_client_id
   AUTH_GITHUB_SECRET=your_github_oauth_client_secret
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_ENVIRONMENT=your_pinecone_environment
   PINECONE_INDEX=your_pinecone_index_name
   TAVILY_API_KEY=your_tavily_api_key
   KV_URL=your_vercel_kv_redis_url
   # ... see .env.example for complete list
   ```

4. **Set up Pinecone**
   - Create a Pinecone index with dimensions: 1536 (for OpenAI embeddings)
   - Use cosine similarity metric

5. **Set up GitHub OAuth**
   - Create a GitHub OAuth app
   - Set authorization callback URL to: `http://localhost:3000/api/auth/callback/github`

6. **Run the development server**
   ```bash
   pnpm dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠 Technology Stack

- **Frontend**: Next.js 13+, React, Tailwind CSS
- **AI/ML**: OpenAI GPT-4, LangChain, Pinecone Vector Database
- **Authentication**: NextAuth.js with GitHub provider
- **Database**: Vercel KV (Redis)
- **Voice**: Deepgram TTS
- **Search**: Tavily API
- **Deployment**: Vercel (recommended)

## 📚 Key Components

### AI Conversation Flow
- **Graph-based routing**: Intelligent decision making for conversation flow
- **Context awareness**: Vector-based memory and context retrieval
- **Therapeutic modes**: Multiple conversation styles and approaches

### Dr. Bennett's Personality System
- **Cultural grounding**: Atlanta/Southern cultural references and authenticity
- **Therapeutic approach**: Integration of Black Posthumanism and Systems Theory
- **Dynamic responses**: Context-aware personality that adapts to conversation needs

### Therapeutic Resources
- Curated collection of therapeutic PDFs and materials
- Integration with conversation context for relevant resource suggestions

## 🚀 Deployment

### Vercel (Recommended)

1. **Deploy to Vercel**
   ```bash
   npx vercel
   ```

2. **Set environment variables** in Vercel dashboard

3. **Set up Vercel KV database** in your Vercel project

### Other Platforms

MH can be deployed to any platform that supports Next.js applications:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Dr. Samuel Bennett's Character**: Inspired by real therapeutic practices and cultural awareness
- **Therapeutic Resources**: Curated collection of materials for mental health support
- **Community**: Built with love for open-source mental health technology

## ⚠️ Important Notes

- **Not a Replacement for Professional Help**: MH is designed to provide support and guidance, but should not replace professional mental health treatment
- **Crisis Situations**: The system includes crisis detection and referral protocols
- **Cultural Sensitivity**: Dr. Bennett's persona is designed with cultural awareness and authenticity

## 📞 Support

- **Documentation**: Check our [docs](./docs) for detailed guides
- **Issues**: Report bugs or request features in [GitHub Issues](https://github.com/m1110/introspect/issues)
- **Community**: Join our discussions in [GitHub Discussions](https://github.com/m1110/introspect/discussions)
- **Developer**: Connect with the developer at [camburley.com](https://camburley.com)

---

**Made with ❤️ for accessible, culturally-aware AI therapy**