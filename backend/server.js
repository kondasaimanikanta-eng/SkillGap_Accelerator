const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json());

// Database Connection with graceful fallback
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillgap_db';
  try {
    // Attempt standard connection with 3s timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected successfully to: ${uri}`);
  } catch (err) {
    console.warn(`[MongoDB] Standard connection to ${uri} failed: ${err.message}`);
    console.log('[MongoDB] Attempting in-memory MongoDB fallback for instant local demo...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      await mongoose.connect(memUri);
      console.log(`[MongoDB] Connected to In-Memory MongoDB Server at: ${memUri}`);
    } catch (memErr) {
      console.error(
        '[MongoDB] Could not initialize in-memory fallback. Please ensure MongoDB is running or install mongodb-memory-server.',
        memErr.message
      );
    }
  }

  // Auto-seed demo student if database is empty
  try {
    const User = require('./models/User');
    const StudentProfile = require('./models/StudentProfile');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const demoUser = await User.create({
        name: 'Priya Sharma',
        username: 'priyasharma',
        email: 'demo.student@college.edu',
        password: 'password123',
      });
      await StudentProfile.create({
        user: demoUser._id,
        name: 'Priya Sharma',
        college: 'National Institute of Technology',
        degree: 'B.Tech',
        branch: 'Computer Science and Engineering',
        currentYear: '3rd Year',
        knownSkills: ['HTML', 'CSS', 'Basic JavaScript', 'Git'],
        preferredRole: 'Frontend Developer Intern',
        dailyTimeMinutes: 60,
      });
      console.log('[Seed] Demo student automatically seeded: demo.student@college.edu / password123');
    }
  } catch (seedErr) {
    console.warn('[Seed] Auto-seed check note:', seedErr.message);
  }
};

connectDB();

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    name: 'SkillGap-to-Action API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    dbConnected: mongoose.connection.readyState === 1,
  });
});

// Routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const planRoutes = require('./routes/planRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { getRoles } = require('./controllers/assessmentController');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.get('/api/roles', getRoles);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/plan', planRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: `API endpoint ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(500).json({
    message: err.message || 'An unexpected server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` SkillGap-to-Action Server running on port ${PORT}`);
  console.log(` API Health: http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});
