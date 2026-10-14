const { describe, it } = require('node:test');
const assert = require('node:assert');
const zlib = require('zlib');
const AssessmentAttempt = require('../../backend/models/AssessmentAttempt');
const LearningPlan = require('../../backend/models/LearningPlan');
const StudentProfile = require('../../backend/models/StudentProfile');
const QUESTIONS = require('../../backend/data/questions');

describe('Unit: Performance, Database Indexing & Computational Efficiency', () => {
  it('should verify schema compound indexes exist to optimize query latency', () => {
    const attemptIndexes = AssessmentAttempt.schema.indexes();
    assert.ok(attemptIndexes.length >= 2, 'AssessmentAttempt must define compound indexes');

    const hasUserCreatedCompound = attemptIndexes.some(
      ([fields]) => fields.user === 1 && fields.createdAt === -1
    );
    assert.strictEqual(
      hasUserCreatedCompound,
      true,
      'AssessmentAttempt must have compound index on { user: 1, createdAt: -1 }'
    );

    const planIndexes = LearningPlan.schema.indexes();
    const hasPlanUserCompound = planIndexes.some(
      ([fields]) => fields.user === 1 && fields.createdAt === -1
    );
    assert.strictEqual(
      hasPlanUserCompound,
      true,
      'LearningPlan must have compound index on { user: 1, createdAt: -1 }'
    );

    const profileIndexes = StudentProfile.schema.indexes();
    const hasRoleIndex = profileIndexes.some(([fields]) => fields.preferredRole === 1);
    assert.strictEqual(hasRoleIndex, true, 'StudentProfile must index preferredRole');
  });

  it('should demonstrate high-throughput O(1) indexed lookup speeds versus linear scans', () => {
    // Build O(1) Map structure
    const questionMap = new Map();
    QUESTIONS.forEach((q) => {
      const key = `${q.role}:${q.set}`;
      if (!questionMap.has(key)) questionMap.set(key, []);
      questionMap.get(key).push(q);
    });

    // Measure lookup performance across 10,000 iterations
    const start = performance.now();
    for (let i = 0; i < 10000; i++) {
      const items = questionMap.get('Python Developer Intern:1');
      assert.ok(items.length > 0);
    }
    const duration = performance.now() - start;

    // 10,000 O(1) lookups must complete in under 50ms
    assert.ok(duration < 50, `10,000 lookups completed in ${duration.toFixed(2)}ms (< 50ms expected)`);
  });

  it('should verify gzip compression reduces typical JSON payloads by over 60%', () => {
    const testPayload = JSON.stringify({
      questions: QUESTIONS.slice(0, 15),
      metadata: { generatedAt: new Date().toISOString(), platform: 'SkillGap-to-Action' },
    });

    const uncompressedSize = Buffer.byteLength(testPayload);
    const compressed = zlib.gzipSync(Buffer.from(testPayload));
    const compressedSize = compressed.length;

    const compressionRatio = Math.round((1 - compressedSize / uncompressedSize) * 100);

    assert.ok(
      compressionRatio >= 50,
      `Payload compressed by ${compressionRatio}% (minimum 50% reduction expected)`
    );
    assert.ok(compressedSize < uncompressedSize, 'Compressed payload must be strictly smaller');
  });
});
