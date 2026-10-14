const StudentProfile = require('../models/StudentProfile');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const LearningPlan = require('../models/LearningPlan');

// @desc    Get dashboard metrics, progress, and recommendations
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch profile
    const profile = await StudentProfile.findOne({ user: userId });

    // Fetch latest assessment attempt
    const latestAttempt = await AssessmentAttempt.findOne({ user: userId }).sort({
      createdAt: -1,
    });

    // Total attempts count
    const totalAttempts = await AssessmentAttempt.countDocuments({
      user: userId,
    });

    // Fetch current learning plan
    const learningPlan = await LearningPlan.findOne({ user: userId }).sort({
      createdAt: -1,
    });

    // Derived statistics
    const role = profile ? profile.preferredRole : 'Not Selected';
    const latestScore = latestAttempt ? latestAttempt.scorePercentage : null;
    const weakestSkills = latestAttempt ? latestAttempt.weakTopics : [];
    const strongSkills = latestAttempt ? latestAttempt.strongTopics : [];

    const totalTasks = learningPlan ? learningPlan.totalTasks : 0;
    const completedTasks = learningPlan ? learningPlan.completedTasks : 0;
    const remainingTasks = Math.max(0, totalTasks - completedTasks);
    const planProgressPercentage = learningPlan
      ? learningPlan.progressPercentage
      : 0;

    // Determine workflow step for student guidance
    let nextStep = 'profile';
    let nextStepMessage = 'Complete your profile to get started.';

    if (!profile) {
      nextStep = 'profile';
      nextStepMessage = 'Please fill out your student profile.';
    } else if (!latestAttempt) {
      nextStep = 'assessment';
      nextStepMessage = `Take the initial diagnostic skill assessment for ${profile.preferredRole}.`;
    } else if (!learningPlan) {
      nextStep = 'plan';
      nextStepMessage = 'Generate your tailored 7-day action plan based on your results.';
    } else if (remainingTasks > 0) {
      nextStep = 'tasks';
      nextStepMessage = `You have ${remainingTasks} task${remainingTasks > 1 ? 's' : ''} left in your 7-day plan. Keep practicing!`;
    } else if (totalAttempts < 2) {
      nextStep = 'retest';
      nextStepMessage = 'All tasks completed! Take the Retest to verify your skill improvements.';
    } else {
      nextStep = 'completed';
      nextStepMessage = 'Retest completed! Review your progress comparison and score jump.';
    }

    return res.json({
      success: true,
      hasProfile: !!profile,
      hasAssessment: !!latestAttempt,
      hasPlan: !!learningPlan,
      selectedRole: role,
      studentName: profile ? profile.name : req.user.name,
      college: profile ? profile.college : null,
      degree: profile ? profile.degree : null,
      branch: profile ? profile.branch : null,
      dailyTimeMinutes: profile ? profile.dailyTimeMinutes : 60,
      latestAssessment: latestAttempt
        ? {
            id: latestAttempt._id,
            attemptNumber: latestAttempt.attemptNumber,
            scorePercentage: latestAttempt.scorePercentage,
            correctCount: latestAttempt.correctCount,
            totalQuestions: latestAttempt.totalQuestions,
            date: latestAttempt.createdAt,
          }
        : null,
      totalAttempts,
      weakestSkills,
      strongSkills,
      learningPlanProgress: {
        totalTasks,
        completedTasks,
        remainingTasks,
        progressPercentage: planProgressPercentage,
        isCompleted: learningPlan ? learningPlan.isCompleted : false,
      },
      nextStep,
      nextStepMessage,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
};
