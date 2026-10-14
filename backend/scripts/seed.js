const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const LearningPlan = require('../models/LearningPlan');

dotenv.config({ path: __dirname + '/../.env' });

const seedDatabase = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillgap_db';
  try {
    await mongoose.connect(uri);
    console.log(`Connected to MongoDB for seeding: ${uri}`);

    // Clean existing demo user
    await User.deleteMany({ email: 'demo.student@college.edu' });

    // Create demo student account
    const demoUser = await User.create({
      name: 'Priya Sharma',
      username: 'priyasharma',
      email: 'demo.student@college.edu',
      password: 'password123',
    });

    console.log(`Created demo user: ${demoUser.email} (Password: password123)`);

    // Create student profile
    const profile = await StudentProfile.create({
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

    console.log(`Created demo student profile for role: ${profile.preferredRole}`);
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
