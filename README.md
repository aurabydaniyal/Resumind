# Resumind AI — Intelligent Resume Analysis & Builder

Resumind AI is a production-grade full-stack MERN + AI application engineered to elevate resumes using real large language model intelligence, ATS-friendly templates, and actionable feedback.

## Project Structure & Documentation

```
ResumindAI/
├── resumindFrontend/      # React 18 + Vite + Tailwind CSS + Lucide + Three.js + GSAP + @react-pdf/renderer
│   ├── vercel.json        # Client-side SPA routing rewrites to /index.html
│   └── README.md          # Detailed Frontend docs (features, state, design system)
├── resumindBackend/       # Express + MongoDB Atlas + Mongoose + JWT + Zod + Groq AI API
│   ├── vercel.json        # Serverless API routing rewrites to /api/index.js
│   └── README.md          # Detailed Backend docs (API endpoints, schemas, security)
├── SETUP_BEFORE_START.md  # Comprehensive step-by-step Atlas, Groq, and Vercel guide
└── README.md              # Root project overview & deployment guide
```

- 📖 **[Frontend Documentation](./resumindFrontend/README.md)**: Architecture, components, PDF rendering, client-side document parsers.
- 📖 **[Backend Documentation](./resumindBackend/README.md)**: Endpoints, JWT authentication, Mongoose connection pooling, Groq AI pipeline.
- 📖 **[Full Deployment & Setup Guide](./SETUP_BEFORE_START.md)**: Step-by-step credentials, database access, and environment setup.

## Vercel Monorepo Deployment Overview

Both `resumindFrontend` and `resumindBackend` contain dedicated `vercel.json` files tailored to their deployment type:
1. **Frontend (`resumindFrontend/vercel.json`)**: Configures client-side routing rewrites (`/(.*)` -> `/index.html`) so React Router routes resolve cleanly on reload.
2. **Backend (`resumindBackend/vercel.json`)**: Configures serverless execution (`/(.*)` -> `/api/index.js`) to route incoming requests to the Express application entry point.

When deploying to Vercel from this single repository, create **two projects** in your Vercel Dashboard (one for Frontend, one for Backend) and set the **Root Directory** setting to `resumindFrontend` and `resumindBackend` respectively.

## Quick Start (Local Development)

### 1. Prerequisites
- Node.js v18+ (tested on Node v20/v24)
- npm v9+
- A MongoDB Atlas connection string (or local MongoDB)
- A Groq API Key ([https://console.groq.com/](https://console.groq.com/))

### 2. Configure Backend
1. Go to `resumindBackend/`
2. Copy `.env.example` to `.env`
3. Fill in your `MONGODB_URI`, `JWT_SECRET`, and `GROQ_API_KEY`
4. Run:
   ```bash
   npm install
   npm run dev
   ```

### 3. Configure Frontend
1. Go to `resumindFrontend/`
2. Copy `.env.example` to `.env`
3. Run:
   ```bash
   npm install
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

See [SETUP_BEFORE_START.md](./SETUP_BEFORE_START.md) for full instructions on Atlas configuration and production Vercel deployment.

