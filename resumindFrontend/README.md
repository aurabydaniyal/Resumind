# Resumind AI — Frontend Client

The official client application for Resumind AI, built with React 18, Vite, Tailwind CSS, Lucide icons, Three.js, GSAP, in-browser PDF/DOCX parsing, and selectable-text PDF export.

## Key Features

- **Resume Analyzer**: Upload PDF/DOCX, extracts text entirely client-side, runs transparent ATS evaluation against a 100-point rubric.
- **Resume Builder**: Guided multi-section editor with live responsive preview.
- **AI Career Coach**: Propose bullet rewrites and skills grouping with interactive accept/reject diffs.
- **ATS Templates**: Classic ATS, Modern Cobalt, and Minimal Clean.
- **High-Fidelity PDF Export**: Powered by `@react-pdf/renderer` for crisp typography and selectable text.
- **Visual Aesthetic**: Tailored blue and black glassmorphism theme, radial glows, and responsive layout.

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Ensure VITE_API_BASE_URL (or API_BASE_URL) points to your backend (e.g., http://localhost:5000/api/v1)

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```
