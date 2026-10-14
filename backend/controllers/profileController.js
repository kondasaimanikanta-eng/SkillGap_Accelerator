const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');

// @desc    Get current user's profile
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({
        hasProfile: false,
        message: 'No student profile found for this account',
      });
    }

    return res.json({
      hasProfile: true,
      profile,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update student profile
// @route   POST /api/profile
// @access  Private
const upsertProfile = async (req, res) => {
  try {
    const {
      name,
      college,
      degree,
      branch,
      currentYear,
      knownSkills,
      preferredRole,
      dailyTimeMinutes,
    } = req.body;

    if (
      !name ||
      !college ||
      !degree ||
      !branch ||
      !currentYear ||
      !preferredRole
    ) {
      return res.status(400).json({
        message:
          'Please fill all required profile fields: Name, College, Degree, Branch, Year, and Preferred Role',
      });
    }

    const validRoles = [
      'Python Developer Intern',
      'Frontend Developer Intern',
      'Data Analyst Intern',
    ];
    if (!validRoles.includes(preferredRole)) {
      return res.status(400).json({
        message: `Invalid role selected. Must be one of: ${validRoles.join(', ')}`,
      });
    }

    // Process knownSkills
    let skillsArray = [];
    if (Array.isArray(knownSkills)) {
      skillsArray = knownSkills.map((s) => s.trim()).filter(Boolean);
    } else if (typeof knownSkills === 'string') {
      skillsArray = knownSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // Parse daily time
    const timeInMins = Number(dailyTimeMinutes) || 60;

    let profile = await StudentProfile.findOne({ user: req.user._id });

    if (profile) {
      // Update existing
      profile.name = name.trim();
      profile.college = college.trim();
      profile.degree = degree.trim();
      profile.branch = branch.trim();
      profile.currentYear = currentYear;
      profile.knownSkills = skillsArray;
      profile.preferredRole = preferredRole;
      profile.dailyTimeMinutes = timeInMins;

      await profile.save();

      // Also keep user's name in sync
      await User.findByIdAndUpdate(req.user._id, { name: name.trim() });

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        profile,
      });
    } else {
      // Create new profile
      profile = await StudentProfile.create({
        user: req.user._id,
        name: name.trim(),
        college: college.trim(),
        degree: degree.trim(),
        branch: branch.trim(),
        currentYear,
        knownSkills: skillsArray,
        preferredRole,
        dailyTimeMinutes: timeInMins,
      });

      // Update user name in sync
      await User.findByIdAndUpdate(req.user._id, { name: name.trim() });

      return res.status(201).json({
        success: true,
        message: 'Profile completed successfully!',
        profile,
      });
    }
  } catch (error) {
    console.error('Upsert profile error:', error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  upsertProfile,
};
