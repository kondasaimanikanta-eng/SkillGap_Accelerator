const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
    min: 1,
    max: 7,
  },
  title: {
    type: String,
    required: true,
  },
  skill: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Review'],
    default: 'High',
  },
  durationMinutes: {
    type: Number,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  resourceTitle: {
    type: String,
    required: true,
  },
  resourceLink: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
  rescheduledCount: {
    type: Number,
    default: 0,
  },
});

const learningPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    assessmentAttemptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AssessmentAttempt',
    },
    dailyTimeMinutes: {
      type: Number,
      required: true,
      default: 60,
    },
    tasks: [taskSchema],
    totalTasks: {
      type: Number,
      default: 7,
    },
    completedTasks: {
      type: Number,
      default: 0,
    },
    progressPercentage: {
      type: Number,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Helper method to recalculate progress
learningPlanSchema.methods.updateProgress = function () {
  this.totalTasks = this.tasks.length;
  this.completedTasks = this.tasks.filter((t) => t.completed).length;
  this.progressPercentage =
    this.totalTasks > 0
      ? Math.round((this.completedTasks / this.totalTasks) * 100)
      : 0;
  this.isCompleted = this.completedTasks === this.totalTasks;
};

// Performance indexes for fast query resolution
learningPlanSchema.index({ user: 1, createdAt: -1 });
learningPlanSchema.index({ assessmentAttemptId: 1 });
learningPlanSchema.index({ 'tasks._id': 1 });

module.exports = mongoose.model('LearningPlan', learningPlanSchema);
