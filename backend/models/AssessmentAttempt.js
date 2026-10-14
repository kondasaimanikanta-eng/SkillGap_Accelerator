const mongoose = require('mongoose');

const answerItemSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    enum: ['mcq', 'output_prediction', 'debugging'],
    default: 'mcq',
  },
  topic: {
    type: String,
    required: true,
  },
  selectedAnswer: {
    type: String,
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  explanation: {
    type: String,
  },
});

const topicBreakdownSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  correctQuestions: {
    type: Number,
    required: true,
  },
  scorePercentage: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Strong', 'Needs Improvement', 'Critical Gap'],
    required: true,
  },
});

const assessmentAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    attemptNumber: {
      type: Number,
      required: true,
      default: 1,
    },
    setNumber: {
      type: Number,
      required: true,
      default: 1,
    },
    answers: [answerItemSchema],
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctCount: {
      type: Number,
      required: true,
    },
    scorePercentage: {
      type: Number,
      required: true,
    },
    strongTopics: [String],
    weakTopics: [String],
    topicBreakdown: [topicBreakdownSchema],
    recommendedImprovements: [String],
    prioritySkills: [String],
    notes: {
      type: String,
      default: 'Preliminary assessment for diagnostic guidance, not an official certification.',
    },
  },
  {
    timestamps: true,
  }
);

// High-performance compound indexes for rapid user and role lookups
assessmentAttemptSchema.index({ user: 1, createdAt: -1 });
assessmentAttemptSchema.index({ user: 1, role: 1, createdAt: -1 });
assessmentAttemptSchema.index({ role: 1 });

module.exports = mongoose.model('AssessmentAttempt', assessmentAttemptSchema);
