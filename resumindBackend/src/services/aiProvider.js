const { config } = require('../config/env');
const { z } = require('zod');

// Schema for validated analysis result
const analysisResponseSchema = z.object({
  overallScore: z.number().min(0).max(100),
  scoreBreakdown: z.object({
    contentRelevance: z.object({
      score: z.number(),
      max: z.number().default(25),
      explanation: z.string()
    }),
    impactClarity: z.object({
      score: z.number(),
      max: z.number().default(20),
      explanation: z.string()
    }),
    skillsAlignment: z.object({
      score: z.number(),
      max: z.number().default(20),
      explanation: z.string()
    }),
    structureReadability: z.object({
      score: z.number(),
      max: z.number().default(15),
      explanation: z.string()
    }),
    completenessConsistency: z.object({
      score: z.number(),
      max: z.number().default(10),
      explanation: z.string()
    }),
    languageGrammar: z.object({
      score: z.number(),
      max: z.number().default(10),
      explanation: z.string()
    })
  }),
  strengths: z.array(
    z.object({
      title: z.string(),
      evidence: z.string()
    })
  ),
  issues: z.array(
    z.object({
      severity: z.enum(['critical', 'warning', 'tip']),
      section: z.string(),
      issue: z.string(),
      recommendation: z.string()
    })
  ),
  keywordGaps: z.array(
    z.object({
      keyword: z.string(),
      context: z.string().optional().default(''),
      recommendation: z.string()
    })
  ),
  rewriteSuggestions: z.array(
    z.object({
      original: z.string(),
      suggested: z.string(),
      reason: z.string(),
      section: z.string().default('Experience')
    })
  ),
  disclaimer: z.string()
});

// Schema for validated improve result
const improveResponseSchema = z.object({
  proposedSummary: z.string(),
  proposedBullets: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      original: z.string(),
      improved: z.string(),
      metricAddedOrActionVerb: z.string()
    })
  ),
  skillsSuggestions: z.array(
    z.object({
      category: z.string(),
      suggestedItems: z.array(z.string()),
      rationale: z.string()
    })
  ),
  targetedQuestions: z.array(z.string()),
  changelog: z.array(z.string())
});

class AIProviderService {
  getApiKey() {
    return (process.env.GROQ_API_KEY || config.GROQ_API_KEY || '').trim();
  }

  getModel() {
    return (process.env.GROQ_MODEL || config.GROQ_MODEL || 'llama-3.3-70b-versatile').trim();
  }

  isConfigured() {
    const key = this.getApiKey();
    return Boolean(key && key.length > 0);
  }

  async callGroqWithModel(modelName, messages, jsonMode = true) {
    const apiKey = this.getApiKey();
    const payload = {
      model: modelName,
      messages,
      temperature: 0.2,
      max_tokens: 4000
    };

    if (jsonMode) {
      payload.response_format = { type: 'json_object' };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeout);
      return response;
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  }

  async callGroq(messages, jsonMode = true) {
    if (!this.isConfigured()) {
      // Log the technical reason server-side only; never reveal configuration details to end users
      console.error('[AI Provider] GROQ_API_KEY is not configured.');
      const err = new Error(
        'The AI service is temporarily unavailable. Please try again in a few minutes.'
      );
      err.statusCode = 503;
      err.code = 'AI_PROVIDER_NOT_CONFIGURED';
      throw err;
    }

    const requestedModel = this.getModel();
    // Candidate fallback models in priority order
    const candidateModels = Array.from(
      new Set([
        requestedModel,
        'llama-3.3-70b-versatile',
        'openai/gpt-oss-120b',
        'qwen/qwen3.8-27b',
        'openai/gpt-oss-20b'
      ])
    );

    let lastError = null;

    for (const model of candidateModels) {
      try {
        const response = await this.callGroqWithModel(model, messages, jsonMode);

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            return content;
          }
        }

        const status = response.status;
        const errorText = await response.text();

        // If rate limit
        if (status === 429) {
          const err = new Error('AI rate limit exceeded. Please wait a moment and try again.');
          err.statusCode = 429;
          throw err;
        }

        // If invalid key
        if (status === 401) {
          // 503 (not 401) so the client never confuses this with an expired user session
          console.error('[AI Provider] Groq rejected the configured API key (401).');
          const err = new Error('The AI service is temporarily unavailable. Please try again in a few minutes.');
          err.statusCode = 503;
          throw err;
        }

        // If 404 (model does not exist) or 400 (decommissioned), try next candidate
        if (status === 404 || (status === 400 && errorText.includes('decommissioned'))) {
          console.warn(`[AI Provider] Model '${model}' unavailable on your account (${status}). Trying next available model...`);
          lastError = new Error(`Model ${model} unavailable: ${errorText.slice(0, 150)}`);
          continue;
        }

        // Other API error
        console.error(`[AI Provider] Groq API error (${status}): ${errorText.slice(0, 300)}`);
        const err = new Error('The AI service could not process this request right now. Please try again shortly.');
        err.statusCode = 502;
        throw err;
      } catch (err) {
        if (err.name === 'AbortError') {
          const timeoutErr = new Error('AI request timed out. Please try again with shorter text.');
          timeoutErr.statusCode = 504;
          throw timeoutErr;
        }
        if (err.statusCode) {
          throw err;
        }
        lastError = err;
      }
    }

    if (lastError) {
      console.error('[AI Provider] All candidate models failed:', lastError.message);
    }
    const finalErr = new Error('The AI service is temporarily unavailable. Please try again in a few minutes.');
    finalErr.statusCode = 503;
    throw finalErr;
  }

  async analyzeResume({ resumeText, targetRole, jobDescription }) {
    const systemPrompt = `You are Resumind AI, an expert executive resume reviewer and ATS analysis specialist.
Your task is to analyze the provided resume text against professional standards and (optionally) the target role / job description.

STRICT TRUTHFULNESS RULES:
1. NEVER fabricate or invent education, employers, titles, dates, skills, certificates, awards, achievements, metrics, or years of experience.
2. The score is an automated estimation based on standard ATS best practices, clarity, and industry standards, NOT a deterministic ATS scanner or guarantee of employment.
3. If no job description is provided, state clearly in skillsAlignment explanation that score is a general industry estimate.

SCORING RUBRIC (TOTAL 100 POINTS):
- contentRelevance (max: 25): Quality of content, relevance to professional domain, depth of accomplishments.
- impactClarity (max: 20): Use of action verbs, quantifiable achievements, concise phrasing.
- skillsAlignment (max: 20): Match with target role / job description keywords (or general domain keywords).
- structureReadability (max: 15): Logical ordering, section division, bullet length, scan-ability.
- completenessConsistency (max: 10): Contact info present, consistent date formats, absence of unexplained gaps.
- languageGrammar (max: 10): Professional tone, active voice, absence of typos or awkward phrasing.
overallScore MUST equal the sum of the 6 category scores.

OUTPUT FORMAT:
You MUST respond with valid JSON adhering EXACTLY to this schema:
{
  "overallScore": number (0-100),
  "scoreBreakdown": {
    "contentRelevance": { "score": number, "max": 25, "explanation": string },
    "impactClarity": { "score": number, "max": 20, "explanation": string },
    "skillsAlignment": { "score": number, "max": 20, "explanation": string },
    "structureReadability": { "score": number, "max": 15, "explanation": string },
    "completenessConsistency": { "score": number, "max": 10, "explanation": string },
    "languageGrammar": { "score": number, "max": 10, "explanation": string }
  },
  "strengths": [
    { "title": string, "evidence": string }
  ],
  "issues": [
    { "severity": "critical"|"warning"|"tip", "section": string, "issue": string, "recommendation": string }
  ],
  "keywordGaps": [
    { "keyword": string, "context": string, "recommendation": string }
  ],
  "rewriteSuggestions": [
    { "original": string, "suggested": string, "reason": string, "section": string }
  ],
  "disclaimer": "This score is an automated estimation based on standard ATS best practices and resume structure guidelines. It is not a guarantee of employment or ATS pass-through."
}`;

    const userPrompt = `Target Role: ${targetRole || 'Not specified'}
Target Job Description:
${jobDescription || 'None provided. Evaluate based on general professional best practices.'}

Resume Text to Analyze:
---BEGIN RESUME---
${resumeText.slice(0, config.MAX_RESUME_TEXT_CHARS)}
---END RESUME---

Remember: Return strictly valid JSON adhering to the required schema. Overall score must be 0-100. Provide concrete evidence for strengths and actionable before/after rewrites without fabricating facts.`;

    const raw = await this.callGroq([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (parseErr) {
      // Retry once with repair prompt
      const repairRaw = await this.callGroq([
        { role: 'system', content: 'You are a JSON repair assistant. Output only strictly valid JSON matching the schema.' },
        { role: 'user', content: `The following JSON is malformed. Fix it and return valid JSON only:\n${raw}` }
      ]);
      parsed = JSON.parse(repairRaw);
    }

    // Validate with Zod
    const validated = analysisResponseSchema.parse(parsed);

    // Ensure sum integrity
    const breakdownSum =
      validated.scoreBreakdown.contentRelevance.score +
      validated.scoreBreakdown.impactClarity.score +
      validated.scoreBreakdown.skillsAlignment.score +
      validated.scoreBreakdown.structureReadability.score +
      validated.scoreBreakdown.completenessConsistency.score +
      validated.scoreBreakdown.languageGrammar.score;

    validated.overallScore = Math.min(100, Math.max(0, Math.round(breakdownSum)));

    return validated;
  }

  async improveResume({ resumeData, targetJobDescription, targetRole, focusSection }) {
    const systemPrompt = `You are Resumind AI, a professional career coach and resume editor.
Your task is to propose enhancements for a user's resume data.

ABSOLUTE TRUTHFULNESS DIRECTIVE:
1. NEVER invent employers, job titles, education, credentials, certifications, metrics, or years of experience.
2. If metrics or specific data are missing, suggest improved phrasing with bracketed prompts like "[e.g., increased conversion by X%]" or provide targeted questions asking the user for their real numbers.
3. Return proposals only so the user can review, accept, or reject each change.

OUTPUT FORMAT:
Respond with valid JSON adhering to this schema:
{
  "proposedSummary": string,
  "proposedBullets": [
    {
      "company": string,
      "role": string,
      "original": string,
      "improved": string,
      "metricAddedOrActionVerb": string
    }
  ],
  "skillsSuggestions": [
    {
      "category": string,
      "suggestedItems": string[],
      "rationale": string
    }
  ],
  "targetedQuestions": string[],
  "changelog": string[]
}`;

    const userPrompt = `Target Role: ${targetRole || 'Not specified'}
Focus Section: ${focusSection || 'all'}
Target Job Description:
${targetJobDescription || 'None provided.'}

Current Resume Data:
${JSON.stringify(resumeData, null, 2).slice(0, 30000)}

Please propose actionable, truthful improvements, strong action verbs, and highlight any missing details with targeted questions. Return valid JSON only.`;

    const raw = await this.callGroq([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (parseErr) {
      const repairRaw = await this.callGroq([
        { role: 'system', content: 'You are a JSON repair assistant. Output only strictly valid JSON matching the schema.' },
        { role: 'user', content: `The following JSON is malformed. Fix it and return valid JSON only:\n${raw}` }
      ]);
      parsed = JSON.parse(repairRaw);
    }

    return improveResponseSchema.parse(parsed);
  }
}

module.exports = new AIProviderService();
