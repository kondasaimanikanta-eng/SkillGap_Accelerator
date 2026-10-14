const jwt = require('jsonwebtoken');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'skillgap_jwt_secret_key_hackathon_2026_mvp',
    {
      expiresIn: '7d',
    }
  );
};

// @desc    Register a new student user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({
        message: 'Please provide all required fields: name, username, email, password',
      });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res
        .status(400)
        .json({ message: 'An account with this email already exists' });
    }

    const usernameExists = await User.findOne({
      username: username.toLowerCase(),
    });
    if (usernameExists) {
      return res
        .status(400)
        .json({ message: 'This username is already taken. Please choose another.' });
    }

    const user = await User.create({
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Please complete your student profile.',
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        hasProfile: false,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res
      .status(500)
      .json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { loginIdentifier, password } = req.body;

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        message: 'Please provide email or username and password',
      });
    }

    // Allow login by email OR username
    const user = await User.findOne({
      $or: [
        { email: loginIdentifier.toLowerCase() },
        { username: loginIdentifier.toLowerCase() },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Incorrect password.' });
    }

    // Check if profile exists
    const profile = await StudentProfile.findOne({ user: user._id });

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        hasProfile: !!profile,
        preferredRole: profile ? profile.preferredRole : null,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res
      .status(500)
      .json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Get current logged in user details
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const profile = await StudentProfile.findOne({ user: req.user._id });

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        hasProfile: !!profile,
        preferredRole: profile ? profile.preferredRole : null,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user (stateless JWT client cleanup confirmation)
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
  return res.json({ success: true, message: 'Logged out successfully' });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
};
