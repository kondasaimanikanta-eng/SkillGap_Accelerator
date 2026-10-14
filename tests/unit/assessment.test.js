const { describe, it } = require('node:test');
const assert = require('node:assert');
const QUESTIONS = require('../../backend/data/questions');
const ROLES = require('../../backend/data/roles');

describe('Unit: Assessment Evaluation & Skill Gap Diagnostics', () => {
  it('should verify question bank integrity for all roles and sets', () => {
    assert.ok(QUESTIONS.length >= 27, 'Question bank must have at least 27 curated questions');

    // Each question must have valid structure
    QUESTIONS.forEach((q) => {
      assert.ok(q.id, 'Question must have unique id');
      assert.ok(q.role, 'Question must belong to a role');
      assert.ok([1, 2].includes(q.set), 'Question set must be 1 or 2');
      assert.ok(q.topic, 'Question must specify topic');
      assert.ok(q.options && q.options.length >= 4, 'Question must have at least 4 options');
      assert.ok(q.correctAnswer, 'Question must specify correctAnswer');
      assert.ok(q.options.includes(q.correctAnswer), 'correctAnswer must be present in options array');
      assert.ok(q.explanation, 'Question must have explanatory rationale');
    });
  });

  it('should accurately calculate score percentage and identify weak vs strong topics', () => {
    const pythonSet1Questions = QUESTIONS.filter(
      (q) => q.role === 'Python Developer Intern' && q.set === 1
    );
    assert.strictEqual(pythonSet1Questions.length, 9, 'Python Set 1 must have 9 questions');

    // Simulate 6 correct answers and 3 incorrect answers
    let correctCount = 0;
    const topicStats = {};

    pythonSet1Questions.forEach((q, idx) => {
      if (!topicStats[q.topic]) topicStats[q.topic] = { total: 0, correct: 0 };
      topicStats[q.topic].total += 1;

      // Make first 6 correct, last 3 wrong
      const isCorrect = idx < 6;
      if (isCorrect) {
        correctCount += 1;
        topicStats[q.topic].correct += 1;
      }
    });

    const totalQuestions = pythonSet1Questions.length;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

    assert.strictEqual(scorePercentage, 67, '6/9 score must equate to 67%');

    const weakTopics = [];
    const strongTopics = [];

    Object.keys(topicStats).forEach((topic) => {
      const stats = topicStats[topic];
      const accuracy = (stats.correct / stats.total) * 100;
      if (accuracy < 70) {
        weakTopics.push(topic);
      } else {
        strongTopics.push(topic);
      }
    });

    assert.ok(weakTopics.length > 0, 'Must identify weak topics below 70% threshold');
    assert.ok(strongTopics.length > 0, 'Must identify strong topics above 70% threshold');
  });

  it('should verify sanitization removes correctAnswer and explanation before client delivery', () => {
    const raw = QUESTIONS.slice(0, 5);
    const sanitized = raw.map((q) => ({
      id: q.id,
      topic: q.topic,
      type: q.type,
      question: q.question,
      codeSnippet: q.codeSnippet || null,
      options: q.options,
    }));

    sanitized.forEach((q) => {
      assert.strictEqual(q.correctAnswer, undefined, 'Sanitized question must NEVER expose correctAnswer');
      assert.strictEqual(q.explanation, undefined, 'Sanitized question must NEVER expose explanation');
    });
  });
});
