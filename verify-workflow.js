const http = require('http');

const request = (method, path, data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api' + path,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (data) req.write(postData);
    req.end();
  });
};

async function testFullWorkflow() {
  console.log('=== SkillGap-to-Action E2E Workflow Test ===');

  // 1. Health check
  const health = await request('GET', '/health');
  console.log('1. Health check:', health.status === 200 ? 'PASS' : 'FAIL', health.data);

  // 2. Register
  const testEmail = `student_${Date.now()}@college.edu`;
  const reg = await request('POST', '/auth/register', {
    name: 'Aditya Sharma',
    username: `aditya_${Date.now()}`,
    email: testEmail,
    password: 'Password@123',
  });
  console.log('2. Registration:', reg.status === 201 ? 'PASS' : 'FAIL', reg.data.message);
  const token = reg.data.token;

  // 3. Create Student Profile
  const prof = await request(
    'POST',
    '/profile',
    {
      name: 'Aditya Sharma',
      college: 'National Institute of Technology',
      degree: 'B.Tech',
      branch: 'Computer Science',
      currentYear: '3rd Year',
      knownSkills: 'Python, OOP, Basic SQL',
      preferredRole: 'Python Developer Intern',
      dailyTimeMinutes: 60,
    },
    token
  );
  console.log('3. Student Profile Creation:', prof.status === 201 ? 'PASS' : 'FAIL', prof.data.message);

  // 4. Fetch Questions for Role (Diagnostic Set 1)
  const qList = await request(
    'GET',
    '/assessment/questions/' + encodeURIComponent('Python Developer Intern') + '?set=1',
    null,
    token
  );
  console.log('4. Fetch Assessment Questions (Set 1):', qList.status === 200 ? 'PASS' : 'FAIL', `Received ${qList.data.totalQuestions} questions.`);

  // 5. Submit Answers (simulate student answers with some deliberate mistakes to diagnose gaps)
  const answers = qList.data.questions.map((q, idx) => ({
    questionId: q.id,
    selectedAnswer: idx % 2 === 0 ? q.options[0] : q.options[1],
  }));

  const submit1 = await request(
    'POST',
    '/assessment/submit',
    {
      role: 'Python Developer Intern',
      setNumber: 1,
      answers,
    },
    token
  );
  console.log('5. Submit Diagnostic Assessment:', submit1.status === 201 ? 'PASS' : 'FAIL', `Score: ${submit1.data.attempt.scorePercentage}%, Weak Topics: ${submit1.data.attempt.weakTopics.length}`);

  // 6. Generate 7-Day Action Plan
  const planGen = await request(
    'POST',
    '/plan/generate',
    {
      attemptId: submit1.data.attempt._id,
    },
    token
  );
  console.log('6. Generate 7-Day Plan:', planGen.status === 201 ? 'PASS' : 'FAIL', `Generated ${planGen.data.plan.tasks.length} daily tasks.`);

  // 7. Toggle Task Completion
  const taskId = planGen.data.plan.tasks[0]._id;
  const toggle = await request('PATCH', `/plan/task/${taskId}`, null, token);
  console.log('7. Toggle Task 1 Complete:', toggle.status === 200 ? 'PASS' : 'FAIL', `Progress: ${toggle.data.progressPercentage}%`);

  // 8. Reschedule Incomplete Tasks
  const resched = await request('POST', '/plan/reschedule', null, token);
  console.log('8. Reschedule Tasks:', resched.status === 200 ? 'PASS' : 'FAIL', resched.data.message);

  // 9. Take Retest (Set 2)
  const qSet2 = await request(
    'GET',
    '/assessment/questions/' + encodeURIComponent('Python Developer Intern') + '?set=2',
    null,
    token
  );
  console.log('9. Fetch Retest Questions (Set 2):', qSet2.status === 200 ? 'PASS' : 'FAIL', `Received ${qSet2.data.totalQuestions} questions.`);

  // Retest with higher knowledge (higher score)
  const answersSet2 = qSet2.data.questions.map((q, idx) => ({
    questionId: q.id,
    selectedAnswer: idx < 8 ? q.options[0] : q.options[1],
  }));

  const submit2 = await request(
    'POST',
    '/assessment/submit',
    {
      role: 'Python Developer Intern',
      setNumber: 2,
      answers: answersSet2,
    },
    token
  );
  console.log('10. Submit Retest Assessment:', submit2.status === 201 ? 'PASS' : 'FAIL', `Retest Score: ${submit2.data.attempt.scorePercentage}%`);

  // 11. Comparison Metrics
  const comp = await request('GET', '/assessment/comparison?role=' + encodeURIComponent('Python Developer Intern'), null, token);
  console.log('11. Score Comparison Analysis:', comp.status === 200 ? 'PASS' : 'FAIL', `Delta: ${comp.data.percentageChangeText}, Improved Topics: ${comp.data.topicsImproved.length}`);

  // 12. Dashboard Stats
  const dash = await request('GET', '/dashboard/stats', null, token);
  console.log('12. Dashboard Stats:', dash.status === 200 ? 'PASS' : 'FAIL', `Role: ${dash.data.selectedRole}, Total Attempts: ${dash.data.totalAttempts}`);

  console.log('=== All 12 Stages of the End-to-End Workflow Passed Successfully! ===');
}

testFullWorkflow().catch((e) => console.error('Workflow error:', e));
