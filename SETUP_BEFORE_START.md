# Resumind AI — Setup Guide & Pre-Deployment Checklist

Welcome to **Resumind AI**! This document provides complete, transparent, step-by-step instructions to configure your MongoDB Atlas database, AI provider (Groq), JWT secrets, local development environment, and independent Vercel production deployments.

---

## Architecture Overview

Resumind AI consists of two independently deployable modules:
1. `resumindBackend/`: Node.js + Express REST API with Mongoose, JWT authentication, rate limiting, Helmet, Zod validation, and Groq LLM integration. Ready for serverless deployment on Vercel (`api/index.js`).
2. `resumindFrontend/`: React 18 + Vite + Tailwind CSS + Lucide React + Three.js visual element + GSAP animations + in-browser PDF/DOCX parsing + `@react-pdf/renderer` high-fidelity selectable text export.

```
ResumindAI/
├── resumindFrontend/      # Independent React + Vite project (own git repo & Vercel project)
├── resumindBackend/       # Independent Node.js Express API (own git repo & Vercel project)
├── SETUP_BEFORE_START.md  # This configuration guide
└── README.md              # Project overview
```

---

## Step 1: Create MongoDB Atlas Database

1. Sign in or register at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a new cluster (the free M0 tier works great for development).
3. Create a **Database User**:
   - Go to **Database Access** > **Add New Database User**.
   - Select **Password Authentication**.
   - Generate a secure password and save it in a password manager.
   - Assign database user privileges: **Read and write to any database**.
4. Configure **Network Access**:
   - Go to **Network Access** > **Add IP Address**.
   - For local development: Choose **Add Current IP Address**.
   - For Vercel Serverless production deployment: Vercel serverless functions use dynamic IP pools. You can either configure Atlas Network Peering / Private Endpoint (on dedicated Atlas clusters) or add `0.0.0.0/0` (Allow Access from Anywhere) combined with a strong database user password and TLS.
5. Retrieve your connection string:
   - Go to **Database** > Click **Connect** on your cluster > Select **Drivers** (Node.js).
   - Copy the URI string formatted like:
     `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/resumind_ai?retryWrites=true&w=majority`
6. Paste your connection string into `resumindBackend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://<your_username>:<your_password>@cluster0.abcde.mongodb.net/resumind_ai?retryWrites=true&w=majority
   MONGODB_DB_NAME=resumind_ai
   ```
7. **Security Rule:** Never commit `.env` to Git and never paste database credentials into chat.

---

## Step 2: Obtain AI API Key (Groq)

1. Open [Groq Console](https://console.groq.com/) and sign in or create an account.
2. Navigate to **API Keys** > Click **Create API Key**.
3. Name your key (e.g., `resumind-ai-backend`) and copy the generated key string.
4. Open `resumindBackend/.env` and paste it:
   ```env
   AI_PROVIDER=groq
   GROQ_API_KEY=gsk_yourActualGroqApiKeyHere
   GROQ_MODEL=llama-3.3-70b-versatile
   ```
   *(Note: `llama-3.3-70b-versatile` or `llama-3.1-8b-instant` are supported. If Groq updates available model IDs, configure `GROQ_MODEL` accordingly).*
5. Check rate limits on the Groq Console dashboard. The application implements backend rate limiting and request timeouts to protect your quota.
6. **Provider Fallback Notice:** If `GROQ_API_KEY` is left blank, the API returns a clean, transparent 503 error (`AI provider is not configured. Please set GROQ_API_KEY in the backend environment.`) instead of generating fake simulated output.

---

## Step 3: Generate a JWT Secret

Generate a cryptographically secure random 64-character hex string:
```bash
# Using Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Paste it into `resumindBackend/.env`:
```env
JWT_SECRET=your_generated_random_64_character_hex_string
JWT_EXPIRES_IN=7d
```

---

## Step 4: Local Installation & Running

### Terminal 1: Backend
```bash
cd resumindBackend
npm install
npm run dev
```
Backend will start at: `http://localhost:5000`
Verify health: Open `http://localhost:5000/api/v1/health` in your browser.

### Terminal 2: Frontend
```bash
cd resumindFrontend
npm install
npm run dev
```
Frontend will start at: `http://localhost:5173`
Ensure `resumindFrontend/.env` has:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

## Step 5: Initialize Separate Git Repositories

Each folder is an independent project suitable for its own repository:

### For Frontend Repo:
```bash
cd resumindFrontend
git init
git add .
git commit -m "feat: initial commit for Resumind AI Frontend"
git branch -M main
git remote add origin https://github.com/your-username/resumind-frontend.git
git push -u origin main
```

### For Backend Repo:
```bash
cd resumindBackend
git init
git add .
git commit -m "feat: initial commit for Resumind AI Backend"
git branch -M main
git remote add origin https://github.com/your-username/resumind-backend.git
git push -u origin main
```

*(Ensure `.env` is listed in `.gitignore` on both before committing).*

---

## Step 6: Deploy Backend to Vercel

1. Log in to [Vercel](https://vercel.com).
2. Click **Add New** > **Project** > Import your `resumind-backend` repository.
3. Framework Preset: **Other** (Root directory is `.`).
4. Under **Environment Variables**, add all keys from `resumindBackend/.env`:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `your_atlas_connection_string`
   - `MONGODB_DB_NAME` = `resumind_ai`
   - `JWT_SECRET` = `your_jwt_secret`
   - `JWT_EXPIRES_IN` = `7d`
   - `AI_PROVIDER` = `groq`
   - `GROQ_API_KEY` = `your_groq_key`
   - `GROQ_MODEL` = `llama-3.3-70b-versatile`
   - `FRONTEND_ORIGINS` = `https://your-frontend-project.vercel.app` *(update after step 7)*
5. Click **Deploy**.
6. Note your deployed Backend URL (e.g. `https://resumind-backend.vercel.app`). Test `https://resumind-backend.vercel.app/api/v1/health`.

---

## Step 7: Deploy Frontend to Vercel

1. In Vercel, click **Add New** > **Project** > Import your `resumind-frontend` repository.
2. Framework Preset: **Vite**.
3. Under **Environment Variables**, add:
   - Key: `VITE_API_BASE_URL` (or `API_BASE_URL`)
   - Value: `https://resumind-backend.vercel.app/api/v1` *(or simply `https://resumind-backend.vercel.app` — do **NOT** add `/health` here, the frontend automatically appends the relevant endpoints!)*
   - **Vercel Notice:** If Vercel prompts with *"Remove the public framework prefix to keep this value private... change the variable to Config"*, simply select **Plaintext / Config** in the Type dropdown. This is expected and safe because frontend web applications must expose the API URL to make browser fetch requests.
4. Click **Deploy** (or **Redeploy** if already deployed).
5. Once deployed, copy your Frontend URL (e.g. `https://resumind-frontend.vercel.app`).
6. Return to your **Backend Vercel Project** > **Settings** > **Environment Variables** > update `FRONTEND_ORIGINS` to match your frontend domain (e.g., `https://resumind-frontend.vercel.app`), then trigger a redeploy of the backend so CORS allows client requests.

---

## Step 8: Production Verification Checklist

- [ ] `GET https://your-backend/api/v1/health` returns `{"status":"ok","database":"connected"}`.
- [ ] User registration persists the record in MongoDB Atlas with bcrypt hash (password never stored in plaintext).
- [ ] User login issues a valid JWT token.
- [ ] Resume Analyzer text extraction parses uploaded PDF/DOCX files client-side.
- [ ] Resume Analyzer AI review returns transparent rubric scoring, strengths, weaknesses, and keyword gaps.
- [ ] Resume Builder creates, updates, and persists resumes in Atlas.
- [ ] PDF Export produces selectable-text PDFs with clean typography across all three templates (Classic, Modern, Minimal).
- [ ] Mobile responsive layout verified across viewports without horizontal scroll.
