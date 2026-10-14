const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    college: {
      type: String,
      required: [true, 'College name is required'],
      trim: true,
    },
    degree: {
      type: String,
      required: [true, 'Degree is required'],
      trim: true,
    },
    branch: {
      type: String,
      required: [true, 'Branch/Specialization is required'],
      trim: true,
    },
    currentYear: {
      type: String,
      required: [true, 'Current year of study is required'],
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'],
    },
    knownSkills: {
      type: [String],
      default: [],
    },
    preferredRole: {
      type: String,
      required: [true, 'Preferred internship role is required'],
      enum: [
        'Python Developer Intern',
        'Frontend Developer Intern',
        'Data Analyst Intern',
      ],
    },
    dailyTimeMinutes: {
      type: Number,
      required: [true, 'Available daily learning time is required'],
      min: [15, 'Minimum daily learning time is 15 minutes'],
      max: [480, 'Maximum daily learning time is 8 hours'],
      default: 60,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
