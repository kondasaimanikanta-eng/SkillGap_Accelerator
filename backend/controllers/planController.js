const LearningPlan = require('../models/LearningPlan');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const StudentProfile = require('../models/StudentProfile');
const LEARNING_CATALOG = require('../data/learningCatalog');
const ROLES = require('../data/roles');

// @desc    Generate a personalized 7-day learning plan
// @route   POST /api/plan/generate
// @access  Private
const generatePlan = async (req, res) => {
  try {
    const { attemptId } = req.body;

    // Get student profile
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(400).json({
        message: 'Please complete your student profile before generating a learning plan.',
      });
    }

    // Get assessment attempt
    let attempt;
    if (attemptId) {
      attempt = await AssessmentAttempt.findOne({
        _id: attemptId,
        user: req.user._id,
      });
    } else {
      // Find latest attempt for user
      attempt = await AssessmentAttempt.findOne({ user: req.user._id }).sort({
        createdAt: -1,
      });
    }

    if (!attempt) {
      return res.status(400).json({
        message:
          'Please take the Skill Assessment first. The 7-day plan is customized directly from your assessment results.',
      });
    }

    const role = attempt.role;
    const dailyAvailableMins = profile.dailyTimeMinutes || 60;
    const roleMeta = ROLES.find((r) => r.title === role);
    const requiredSkills = roleMeta ? roleMeta.requiredSkills : [];

    // Identify weak skills and priority order
    const weakSkills = attempt.weakTopics || [];
    const strongSkills = attempt.strongTopics || [];

    // Build 7 daily tasks
    const tasks = [];
    const assignedSkills = new Set();

    // Helper to build task object
    const createTask = (dayNum, skillName, priority = 'High') => {
      const catalogEntry = LEARNING_CATALOG[skillName] || {
        title: `Deep Dive Practice: ${skillName}`,
        instructions: `Review key concepts of ${skillName}. Build small isolated code examples and test edge cases.`,
        resourceTitle: 'Comprehensive Technical Documentation',
        resourceLink: 'https://developer.mozilla.org/',
        baseMinutes: 60,
      };

      // Scale duration based on student's available daily time
      let adjustedDuration = Math.min(
        dailyAvailableMins,
        Math.max(30, catalogEntry.baseMinutes)
      );

      return {
        day: dayNum,
        title: `Day ${dayNum}: ${catalogEntry.title}`,
        skill: skillName,
        priority,
        durationMinutes: adjustedDuration,
        instructions: catalogEntry.instructions,
        resourceTitle: catalogEntry.resourceTitle,
        resourceLink: catalogEntry.resourceLink,
        completed: false,
        rescheduledCount: 0,
      };
    };

    let day = 1;

    // Priority 1: Weak skills from assessment
    for (const skill of weakSkills) {
      if (day > 5) break; // Leave days 6 and 7 for integration/consolidation
      if (!assignedSkills.has(skill)) {
        tasks.push(createTask(day, skill, 'High'));
        assignedSkills.add(skill);
        day++;
      }
    }

    // Priority 2: Other required skills not yet mastered or strong skills for reinforcement
    for (const skill of requiredSkills) {
      if (day > 5) break;
      if (!assignedSkills.has(skill) && !strongSkills.includes(skill)) {
        tasks.push(createTask(day, skill, 'Medium'));
        assignedSkills.add(skill);
        day++;
      }
    }

    // Fill up to Day 5 if needed with any remaining required skills
    for (const skill of requiredSkills) {
      if (day > 5) break;
      if (!assignedSkills.has(skill)) {
        tasks.push(createTask(day, skill, 'Review'));
        assignedSkills.add(skill);
        day++;
      }
    }

    // If still before Day 6 (e.g. perfect score user)
    while (day <= 5) {
      const fallbackSkill = requiredSkills[(day - 1) % requiredSkills.length];
      tasks.push(createTask(day, fallbackSkill, 'Review'));
      day++;
    }

    // Day 6: Real-World Mini Project / Hands-on Integration
    const day6Skill = weakSkills[0] || requiredSkills[0] || 'Full Project Integration';
    tasks.push({
      day: 6,
      title: `Day 6: Hands-on Practical Project & Code Debugging`,
      skill: `${day6Skill} & Applied Integration`,
      priority: 'High',
      durationMinutes: dailyAvailableMins,
      instructions:
        'Combine the skills you practiced over the past 5 days into a small functional mini-project or solve 3 practical debugging problems without looking at the solutions first.',
      resourceTitle: 'GitHub & Project Development Best Practices',
      resourceLink: 'https://docs.github.com/en/get-started',
      completed: false,
      rescheduledCount: 0,
    });

    // Day 7: Retest Simulation & Final Internship Readiness Review
    tasks.push({
      day: 7,
      title: 'Day 7: Final Assessment Retest & Skill Verification',
      skill: 'Full Diagnostic Retest & Mock Assessment',
      priority: 'High',
      durationMinutes: Math.min(dailyAvailableMins, 45),
      instructions:
        'Take the Retest on the SkillGap-to-Action platform to measure your score improvement against Day 1. Review any remaining gaps to solidify your internship preparation.',
      resourceTitle: 'SkillGap-to-Action Retest Module',
      resourceLink: '#/retest',
      completed: false,
      rescheduledCount: 0,
    });

    // Delete any existing unfinished plan for this user and role or archive
    await LearningPlan.deleteMany({ user: req.user._id, role });

    const newPlan = await LearningPlan.create({
      user: req.user._id,
      role,
      assessmentAttemptId: attempt._id,
      dailyTimeMinutes: dailyAvailableMins,
      tasks,
      totalTasks: tasks.length,
      completedTasks: 0,
      progressPercentage: 0,
    });

    return res.status(201).json({
      success: true,
      message: 'Personalized 7-day learning plan generated successfully!',
      plan: newPlan,
    });
  } catch (error) {
    console.error('Generate plan error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get current learning plan for logged-in user
// @route   GET /api/plan/current
// @access  Private
const getCurrentPlan = async (req, res) => {
  try {
    const plan = await LearningPlan.findOne({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('assessmentAttemptId', 'scorePercentage weakTopics strongTopics attemptNumber');

    if (!plan) {
      return res.status(404).json({
        hasPlan: false,
        message: 'No active learning plan found. Please take the assessment to generate one.',
      });
    }

    return res.json({
      hasPlan: true,
      plan,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle task completion status
// @route   PATCH /api/plan/task/:taskId
// @access  Private
const toggleTaskCompletion = async (req, res) => {
  try {
    const { taskId } = req.params;

    const plan = await LearningPlan.findOne({ user: req.user._id });
    if (!plan) {
      return res.status(404).json({ message: 'Learning plan not found' });
    }

    const task = plan.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found in plan' });
    }

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : null;

    plan.updateProgress();
    await plan.save();

    return res.json({
      success: true,
      message: task.completed ? 'Task marked complete!' : 'Task marked incomplete',
      task,
      progressPercentage: plan.progressPercentage,
      completedTasks: plan.completedTasks,
      totalTasks: plan.totalTasks,
      isCompleted: plan.isCompleted,
    });
  } catch (error) {
    console.error('Toggle task error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Reschedule incomplete tasks sensibly
// @route   POST /api/plan/reschedule
// @access  Private
const rescheduleTasks = async (req, res) => {
  try {
    const plan = await LearningPlan.findOne({ user: req.user._id }).sort({
      createdAt: -1,
    });

    if (!plan) {
      return res.status(404).json({ message: 'No active plan found' });
    }

    // Separate completed and incomplete tasks
    const completedTasks = plan.tasks.filter((t) => t.completed);
    const incompleteTasks = plan.tasks.filter((t) => !t.completed);

    if (incompleteTasks.length === 0) {
      return res.json({
        message: 'All tasks are already completed! Ready for the retest.',
        plan,
      });
    }

    // Reorder: Completed tasks retain their early slots; incomplete tasks get bumped
    // to current slots with rescheduled count incremented
    const reorganized = [];
    let currentDay = 1;

    // Place completed first
    completedTasks.forEach((task) => {
      task.day = currentDay++;
      reorganized.push(task);
    });

    // Place incomplete tasks sequentially
    incompleteTasks.forEach((task) => {
      task.day = currentDay++;
      task.rescheduledCount += 1;
      task.title = task.title.replace(/Day \d+:/, `Day ${task.day}:`);
      reorganized.push(task);
    });

    plan.tasks = reorganized;
    plan.updateProgress();
    await plan.save();

    return res.json({
      success: true,
      message: 'Incomplete tasks have been sensibly rescheduled across upcoming days.',
      plan,
    });
  } catch (error) {
    console.error('Reschedule error:', error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generatePlan,
  getCurrentPlan,
  toggleTaskCompletion,
  rescheduleTasks,
};
