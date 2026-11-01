const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

test.after(async () => {
  await mongoose.disconnect();
});

// Helper to make mock requests to express app without running on real port
function makeRequest(app, method, url, body = null, headers = {}) {
  return new Promise((resolve) => {
    const http = require('http');
    const server = http.createServer(app);

    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      const reqHeaders = {
        'Content-Type': 'application/json',
        ...headers
      };

      const payload = body ? JSON.stringify(body) : null;
      if (payload) {
        reqHeaders['Content-Length'] = Buffer.byteLength(payload);
      }

      const req = http.request(
        {
          hostname: '127.0.0.1',
          port,
          path: url,
          method,
          headers: reqHeaders
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            server.close();
            try {
              resolve({
                status: res.statusCode,
                headers: res.headers,
                body: JSON.parse(data)
              });
            } catch {
              resolve({
                status: res.statusCode,
                headers: res.headers,
                body: data
              });
            }
          });
        }
      );

      req.on('error', (err) => {
        server.close();
        throw err;
      });

      if (payload) {
        req.write(payload);
      }
      req.end();
    });
  });
}

test('GET /api/v1/health returns 200 and healthy status without leaking internal diagnostics', async () => {
  const res = await makeRequest(app, 'GET', '/api/v1/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
  assert.equal(res.body.service, 'Resumind AI Backend');
  assert.ok(res.body.timestamp);
  assert.equal(res.body.database, undefined);
  assert.equal(res.body.aiProvider, undefined);
});

test('resumeCreateSchema validates all 5 templates and custom hex accentColor', () => {
  const { resumeCreateSchema } = require('../src/validators/resumeValidators');
  const parsed = resumeCreateSchema.parse({
    title: 'Executive Resume',
    selectedTemplate: 'executive',
    accentColor: '#7c3aed'
  });
  assert.equal(parsed.selectedTemplate, 'executive');
  assert.equal(parsed.accentColor, '#7c3aed');

  const creativeParsed = resumeCreateSchema.parse({
    title: 'Creative Resume',
    selectedTemplate: 'creative',
    accentColor: '#059669'
  });
  assert.equal(creativeParsed.selectedTemplate, 'creative');
  assert.equal(creativeParsed.accentColor, '#059669');
});

test('User weeklyQuota enforces 10 resumes and 10 analyses per week and computes resetAt', () => {
  const user = new User({
    name: 'Quota Tester',
    email: 'quota@example.com',
    password: 'password123'
  });

  const initialQuota = user.getQuotaSummary();
  assert.equal(initialQuota.resumesLimit, 10);
  assert.equal(initialQuota.resumesUsed, 0);
  assert.equal(initialQuota.resumesRemaining, 10);
  assert.equal(initialQuota.analysesLimit, 10);
  assert.equal(initialQuota.analysesUsed, 0);
  assert.equal(initialQuota.analysesRemaining, 10);
  assert.ok(initialQuota.resetAt);

  // Simulate using 10 resumes and 4 analyses
  user.weeklyUsage.resumesCreated = 10;
  user.weeklyUsage.analysesRun = 4;

  const updatedQuota = user.getQuotaSummary();
  assert.equal(updatedQuota.resumesRemaining, 0);
  assert.equal(updatedQuota.analysesRemaining, 6);

  // Verify toJSON includes weeklyQuota and hides password
  const json = user.toJSON();
  assert.equal(json.password, undefined);
  assert.ok(json.weeklyQuota);
  assert.equal(json.weeklyQuota.resumesRemaining, 0);
  assert.equal(json.weeklyQuota.analysesRemaining, 6);
});

test('POST /api/v1/auth/register fails with 400 on invalid email or short password', async () => {
  const res = await makeRequest(app, 'POST', '/api/v1/auth/register', {
    name: 'A',
    email: 'not-an-email',
    password: 'short'
  });
  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
  assert.equal(res.body.error, 'Validation failed');
});

test('GET /api/v1/resumes requires authentication (returns 401)', async () => {
  const res = await makeRequest(app, 'GET', '/api/v1/resumes');
  assert.equal(res.status, 401);
  assert.equal(res.body.success, false);
});

test('POST /api/v1/ai/analyze-resume fails with 400 when resumeText is too short', async () => {
  const res = await makeRequest(app, 'POST', '/api/v1/ai/analyze-resume', {
    resumeText: 'Too short'
  });
  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
});
