# Resumind AI — Backend API

Production Express REST API for Resumind AI. Features MongoDB Atlas persistence, JWT authentication, rate limiting, Helmet security headers, Zod validation, and Groq LLM integration.

## Key Features

- **RESTful Endpoints**: Versioned under `/api/v1`
- **Authentication**: JWT tokens with bcryptjs hashing
- **Security**: Helmet, CORS with explicit origin allowlist, Express Rate Limit, Zod validation
- **Database**: Mongoose with connection pooling and serverless caching for Vercel
- **AI Service**: Groq API integration (`llama-3.3-70b-versatile`) with structured JSON schema validation and retry repair
- **Serverless Ready**: Exported for Vercel via `api/index.js`

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env
# Edit .env and enter your MONGODB_URI and GROQ_API_KEY

# 3. Run development server with nodemon
npm run dev

# 4. Run tests
npm test
```

## API Endpoints

### System
- `GET /api/v1/health` — Service health & DB connection status

### Authentication
- `POST /api/v1/auth/register` — Register a new user account
- `POST /api/v1/auth/login` — Login and receive JWT token
- `GET /api/v1/auth/me` — Get authenticated user details

### Resumes
- `POST /api/v1/resumes` — Create new resume
- `GET /api/v1/resumes` — List all resumes owned by user
- `GET /api/v1/resumes/:id` — Get single resume
- `PATCH /api/v1/resumes/:id` — Update resume
- `DELETE /api/v1/resumes/:id` — Delete resume

### AI Processing
- `POST /api/v1/ai/analyze-resume` — Analyze resume text against ATS rubric
- `POST /api/v1/ai/improve-resume` — Propose bullet rewrites and skills grouping

### Analysis History
- `GET /api/v1/analyses` — List saved resume evaluations
- `GET /api/v1/analyses/:id` — View full evaluation breakdown
- `DELETE /api/v1/analyses/:id` — Delete evaluation report
