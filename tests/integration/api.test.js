const { describe, it } = require('node:test');
const assert = require('node:assert');
const http = require('http');

const makeRequest = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api' + path,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) options.headers['Authorization'] = `Bearer ${token}`;
    if (body) options.headers['Content-Length'] = Buffer.byteLength(postData);

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(postData);
    req.end();
  });
};

describe('Integration: SkillGap-to-Action End-to-End API Suite', () => {
  let authToken = null;
  let testUserId = null;
  let attemptId = null;
  let firstTaskId = null;

  it('1. GET /api/health - verifies server health, uptime, and security headers', async () => {
    const res = await makeRequest('GET', '/health');
    assert.strictEqual(res.status, 200, 'Health endpoint must respond with 200 OK');
    assert.strictEqual(res.data.status, 'healthy');
    assert.ok(res.data.uptimeSeconds !== undefined, 'Must report server uptime');

    // Verify security headers
    assert.strictEqual(res.headers['x-frame-options'], 'DENY');
    assert.strictEqual(res.headers['x-content-type-options'], 'nosniff');
  });

  it('2. GET /api/roles - retrieves all career tracks and internship tracks', async () => {
    const res = await makeRequest('GET', '/roles');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.data.roles), 'Must return roles array');
    assert.ok(res.data.roles.length >= 7, 'Must have at least 7 predefined tracks');

    const hasCareer = res.data.roles.some((r) => r.category === 'Career Track');
    const hasInternship = res.data.roles.some((r) => r.category === 'Internship Module');
    assert.strictEqual(hasCareer, true, 'Must include Career Tracks');
    assert.strictEqual(hasInternship, true, 'Must include Internship Tracks');
  });

  it('3. POST /api/auth/register - registers candidate and returns signed JWT', async () => {
    const uniqueEmail = `qa_candidate_${Date.now()}@skillgap.dev`;
    const payload = {
      name: 'Integration Test Candidate',
      username: `candidate_${Date.now()}`,
      email: uniqueEmail,
      password: 'Password@2026!',
    };

    const res = await makeRequest('POST', '/auth/register', payload);
    assert.ok([200, 201].includes(res.status), 'Register must return 200 or 201');
    assert.ok(res.data.token, 'Must return signed JWT token');
    authToken = res.data.token;
    testUserId = res.data.user?.id;
  });

  it('4. POST /api/profile - creates candidate background and target role', async () => {
    const payload = {
      name: 'Integration Test Candidate',
      college: 'Global Institute of Technology',
      degree: 'B.Tech',
      branch: 'Computer Science',
      currentYear: '3rd Year',
      knownSkills: ['JavaScript', 'HTML5', 'CSS3', 'React'],
      preferredRole: 'Frontend Engineer',
      dailyTimeMinutes: 60,
    };

    const res = await makeRequest('POST', '/profile', payload, authToken);
    assert.ok([200, 201].includes(res.status));
    assert.strictEqual(res.data.profile.preferredRole, 'Frontend Engineer');
  });

  it('5. GET /api/assessment/questions/:role - retrieves sanitized questions', async () => {
    const res = await makeRequest(
      'GET',
      `/assessment/questions/${encodeURIComponent('Frontend Engineer')}?set=1`,
      null,
      authToken
    );
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.totalQuestions, 9);
    assert.strictEqual(res.data.questions[0].correctAnswer, undefined, 'Must NOT expose answer key');
  });

  it('6. POST /api/assessment/submit - scores diagnostic quiz and isolates weak topics', async () => {
    const qRes = await makeRequest(
      'GET',
      `/assessment/questions/${encodeURIComponent('Frontend Engineer')}?set=1`,
      null,
      authToken
    );

    const submissionAnswers = qRes.data.questions.map((q, idx) => ({
      questionId: q.id,
      selectedAnswer: idx < 5 ? q.options[0] : q.options[1],
    }));

    const res = await makeRequest(
      'POST',
      '/assessment/submit',
      {
        role: 'Frontend Engineer',
        setNumber: 1,
        answers: submissionAnswers,
      },
      authToken
    );

    assert.ok([200, 201].includes(res.status));
    assert.ok(typeof res.data.attempt?.scorePercentage === 'number');
    assert.ok(Array.isArray(res.data.attempt?.weakTopics));
    attemptId = res.data.attempt._id;
  });

  it('7. POST /api/plan/generate - generates personalized 7-day action sprint', async () => {
    const res = await makeRequest('POST', '/plan/generate', { attemptId }, authToken);
    assert.ok([200, 201].includes(res.status));
    assert.strictEqual(res.data.plan.tasks.length, 7, 'Must generate 7 daily micro-tasks');
    firstTaskId = res.data.plan.tasks[0]._id;
  });

  it('8. PATCH /api/plan/task/:id/toggle - updates task completion and increments progress', async () => {
    const res = await makeRequest('PATCH', `/plan/task/${firstTaskId}/toggle`, null, authToken);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.task.completed, true);
    assert.strictEqual(res.data.progressPercentage, 14);
  });

  it('9. POST /api/plan/reschedule - reorganizes remaining tasks across days', async () => {
    const res = await makeRequest('POST', '/plan/reschedule', null, authToken);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.plan.tasks.length, 7);
  });

  it('10. GET /api/dashboard/stats - delivers aggregated metrics with lean query execution', async () => {
    const res = await makeRequest('GET', '/dashboard/stats', null, authToken);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.selectedRole, 'Frontend Engineer');
    assert.strictEqual(res.data.learningPlanProgress.completedTasks, 1);
  });
});
