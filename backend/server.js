const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Custom Security & Efficiency Middleware
const securityHeaders = require('./middleware/securityHeaders');
const compressionMiddleware = require('./middleware/compression');
const { sanitizeMiddleware } = require('./middleware/sanitize');
const { authLimiter, apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers (CSP, XSS, FrameGuard, HSTS, SniffGuard)
app.use(securityHeaders);

// Performance Gzip/Deflate Compression
app.use(compressionMiddleware);

// CORS configuration
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// Payload size limiting to protect against memory exhaustion attacks
app.use(express.json({ limit: '100kb' }));

// NoSQL & XSS Sanitization
app.use(sanitizeMiddleware);

// General API Rate Limiting
app.use('/api', apiLimiter);

// Database Connection with graceful fallback and connection pooling
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillgap_db';
  const mongooseOptions = {
    serverSelectionTimeoutMS: 3000,
    maxPoolSize: 10,
    minPoolSize: 2,
    socketTimeoutMS: 45000,
  };

  try {
    await mongoose.connect(uri, mongooseOptions);
    console.log(`[MongoDB] Connected successfully to: ${uri}`);
  } catch (err) {
    console.warn(`[MongoDB] Standard connection to ${uri} failed: ${err.message}`);
    console.log('[MongoDB] Attempting in-memory MongoDB fallback for instant local demo...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      await mongoose.connect(memUri, {
        maxPoolSize: 10,
        minPoolSize: 2,
      });
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
        preferredRole: 'Frontend Engineer',
        trackCategory: 'Career Track',
        dailyTimeMinutes: 60,
      });
      console.log('[Seed] Demo candidate automatically seeded: demo.student@college.edu / password123');
    }
  } catch (seedErr) {
    console.warn('[Seed] Auto-seed check note:', seedErr.message);
  }
};

connectDB();

// Health Check with Performance Metrics
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    name: 'SkillGap-to-Action API',
    version: '1.0.0',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    dbConnected: mongoose.connection.readyState === 1,
    memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
  });
});

// Routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const planRoutes = require('./routes/planRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { getRoles } = require('./controllers/assessmentController');

// Apply strict rate limiting to authentication endpoints
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/profile', profileRoutes);
app.get('/api/roles', getRoles);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/plan', planRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found`,
  });
});

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` SkillGap-to-Action Server running on port ${PORT}`);
  console.log(` API Health: http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});

module.exports = app;
