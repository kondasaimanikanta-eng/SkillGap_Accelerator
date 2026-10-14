const ROLES = require('../data/roles');
const QUESTIONS = require('../data/questions');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const StudentProfile = require('../models/StudentProfile');

// @desc    Get all available internship roles
// @route   GET /api/roles
// @access  Public
const getRoles = (req, res) => {
  return res.json({
    success: true,
    roles: ROLES,
  });
};

// @desc    Get assessment questions for a role (safe: stripped of answer keys)
// @route   GET /api/assessment/questions/:role
// @access  Private
const getQuestions = async (req, res) => {
  try {
    const { role } = req.params;
    const setNumber = parseInt(req.query.set) || 1;

    // Decode URL encoded role title
    const decodedRole = decodeURIComponent(role);

    // Find questions matching role and set
    let questions = QUESTIONS.filter(
      (q) => q.role === decodedRole && q.set === setNumber
    );

    // Fallback if set 2 requested but empty, fallback to set 1
    if (questions.length === 0 && setNumber > 1) {
      questions = QUESTIONS.filter(
        (q) => q.role === decodedRole && q.set === 1
      );
    }

    if (questions.length === 0) {
      return res.status(404).json({
        message: `No assessment questions found for role: "${decodedRole}"`,
      });
    }

    // Strip out correctAnswer and explanation so client cannot inspect payload
    const sanitizedQuestions = questions.map((q) => ({
      id: q.id,
      topic: q.topic,
      type: q.type,
      question: q.question,
      codeSnippet: q.codeSnippet || null,
      options: q.options,
    }));

    return res.json({
      success: true,
      role: decodedRole,
      setNumber,
      totalQuestions: sanitizedQuestions.length,
      questions: sanitizedQuestions,
      disclaimer:
        'This is a diagnostic skill-gap assessment to guide your 7-day preparation, not an official certification.',
    });
  } catch (error) {
    console.error('Get questions error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Submit assessment answers and evaluate score
// @route   POST /api/assessment/submit
// @access  Private
const submitAssessment = async (req, res) => {
  try {
    const { role, setNumber = 1, answers = [] } = req.body;

    if (!role || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        message: 'Invalid submission data. Role and answers array required.',
      });
    }

    // Get question bank for this role and set
    const questionBank = QUESTIONS.filter(
      (q) => q.role === role && q.set === Number(setNumber)
    );

    if (questionBank.length === 0) {
      return res.status(400).json({
        message: `Invalid role or set number for assessment: ${role}`,
      });
    }

    // Map question bank by id for quick lookup
    const qMap = new Map();
    questionBank.forEach((q) => qMap.set(q.id, q));

    let correctCount = 0;
    const evaluatedAnswers = [];
    const topicStats = {};

    // Evaluate each question
    questionBank.forEach((q) => {
      // Initialize topic tracking
      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { total: 0, correct: 0 };
      }
      topicStats[q.topic].total += 1;

      // Find user submission
      const userSubmission = answers.find((a) => a.questionId === q.id);
      const selectedAnswer = userSubmission ? userSubmission.selectedAnswer : '';
      const isCorrect = selectedAnswer === q.correctAnswer;

      if (isCorrect) {
        correctCount += 1;
        topicStats[q.topic].correct += 1;
      }

      evaluatedAnswers.push({
        questionId: q.id,
        questionText: q.question,
        questionType: q.type,
        topic: q.topic,
        selectedAnswer: selectedAnswer || '(Unanswered)',
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      });
    });

    const totalQuestions = questionBank.length;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

    // Compute strong vs weak topics
    const strongTopics = [];
    const weakTopics = [];
    const topicBreakdown = [];

    Object.keys(topicStats).forEach((topic) => {
      const { total, correct } = topicStats[topic];
      const pct = Math.round((correct / total) * 100);
      let status = 'Strong';
      if (pct < 50) {
        status = 'Critical Gap';
        weakTopics.push(topic);
      } else if (pct < 80) {
        status = 'Needs Improvement';
        weakTopics.push(topic);
      } else {
        strongTopics.push(topic);
      }

      topicBreakdown.push({
        topic,
        totalQuestions: total,
        correctQuestions: correct,
        scorePercentage: pct,
        status,
      });
    });

    // Sort weak topics by lowest score first for priority practice
    const prioritySkills = [...weakTopics].sort((a, b) => {
      const pctA = topicStats[a].correct / topicStats[a].total;
      const pctB = topicStats[b].correct / topicStats[b].total;
      return pctA - pctB;
    });

    // Generate actionable recommendations
    const recommendedImprovements = [];
    if (weakTopics.length === 0) {
      recommendedImprovements.push(
        'Outstanding performance across all core topics! Continue to advanced full-stack projects and mock interview challenges.'
      );
    } else {
      prioritySkills.slice(0, 3).forEach((skill) => {
        recommendedImprovements.push(
          `Focus immediate daily practice on "${skill}" to eliminate foundational blind spots.`
        );
      });
      if (scorePercentage < 60) {
        recommendedImprovements.push(
          'Dedicate 60–90 minutes daily on hands-on coding exercises before applying to internship postings.'
        );
      } else {
        recommendedImprovements.push(
          'Target your weakest topic first, then complete the 7-day action plan to reach benchmark readiness (>80%).'
        );
      }
    }

    // Determine attempt number for this user and role
    const previousAttemptsCount = await AssessmentAttempt.countDocuments({
      user: req.user._id,
      role,
    });
    const attemptNumber = previousAttemptsCount + 1;

    // Save attempt to database
    const attempt = await AssessmentAttempt.create({
      user: req.user._id,
      role,
      attemptNumber,
      setNumber: Number(setNumber),
      answers: evaluatedAnswers,
      totalQuestions,
      correctCount,
      scorePercentage,
      strongTopics,
      weakTopics,
      topicBreakdown,
      recommendedImprovements,
      prioritySkills,
    });

    return res.status(201).json({
      success: true,
      message: 'Assessment submitted and evaluated successfully!',
      attempt,
    });
  } catch (error) {
    console.error('Submit assessment error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get assessment history for user
// @route   GET /api/assessment/history
// @access  Private
const getAssessmentHistory = async (req, res) => {
  try {
    const attempts = await AssessmentAttempt.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('-answers');

    return res.json({
      success: true,
      count: attempts.length,
      attempts,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get single attempt by ID
// @route   GET /api/assessment/attempt/:id
// @access  Private
const getAttemptById = async (req, res) => {
  try {
    const attempt = await AssessmentAttempt.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!attempt) {
      return res.status(404).json({ message: 'Assessment attempt not found' });
    }

    return res.json({
      success: true,
      attempt,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Compare initial attempt vs retest attempt for a role
// @route   GET /api/assessment/comparison
// @access  Private
const getComparison = async (req, res) => {
  try {
    const { role } = req.query;
    const query = { user: req.user._id };
    if (role) query.role = role;

    const attempts = await AssessmentAttempt.find(query).sort({
      createdAt: 1,
    });

    if (attempts.length === 0) {
      return res.status(404).json({
        hasData: false,
        message: 'No assessment attempts found to compare.',
      });
    }

    const initialAttempt = attempts[0];
    const latestAttempt = attempts[attempts.length - 1];

    if (attempts.length === 1) {
      return res.json({
        hasData: true,
        canCompare: false,
        message:
          'Only one assessment attempt found. Take the Retest after completing your 7-day learning plan to see score differences and improvements!',
        initialAttempt,
        latestAttempt,
        attemptsCount: 1,
      });
    }

    // Calculate score difference
    const scoreDiff =
      latestAttempt.scorePercentage - initialAttempt.scorePercentage;

    // Calculate topics improved
    const initialWeak = new Set(initialAttempt.weakTopics || []);
    const latestWeak = new Set(latestAttempt.weakTopics || []);

    const topicsImproved = [...initialWeak].filter(
      (topic) => !latestWeak.has(topic)
    );
    const remainingWeakTopics = [...latestWeak];

    return res.json({
      hasData: true,
      canCompare: true,
      attemptsCount: attempts.length,
      role: latestAttempt.role,
      initialAttempt: {
        id: initialAttempt._id,
        attemptNumber: initialAttempt.attemptNumber,
        scorePercentage: initialAttempt.scorePercentage,
        correctCount: initialAttempt.correctCount,
        totalQuestions: initialAttempt.totalQuestions,
        weakTopics: initialAttempt.weakTopics,
        strongTopics: initialAttempt.strongTopics,
        date: initialAttempt.createdAt,
      },
      latestAttempt: {
        id: latestAttempt._id,
        attemptNumber: latestAttempt.attemptNumber,
        scorePercentage: latestAttempt.scorePercentage,
        correctCount: latestAttempt.correctCount,
        totalQuestions: latestAttempt.totalQuestions,
        weakTopics: latestAttempt.weakTopics,
        strongTopics: latestAttempt.strongTopics,
        date: latestAttempt.createdAt,
      },
      scoreDifference: scoreDiff,
      percentageChangeText:
        scoreDiff > 0 ? `+${scoreDiff}%` : `${scoreDiff}%`,
      topicsImproved,
      remainingWeakTopics,
      recommendedNextSteps:
        remainingWeakTopics.length === 0
          ? [
              'Outstanding mastery achieved! You have eliminated all identified skill gaps.',
              'Begin applying for your target internship role with confidence.',
              'Build a portfolio project demonstrating your core competencies.',
            ]
          : [
              `Focus your next revision on: ${remainingWeakTopics.join(', ')}.`,
              'Work through hands-on project implementations touching these areas.',
              'Retake the assessment again when ready to confirm retention.',
            ],
    });
  } catch (error) {
    console.error('Get comparison error:', error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRoles,
  getQuestions,
  submitAssessment,
  getAssessmentHistory,
  getAttemptById,
  getComparison,
};
