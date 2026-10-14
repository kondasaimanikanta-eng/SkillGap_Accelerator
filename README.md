# SkillGap-to-Action — College Internship Preparation MVP

> **College Hackathon MVP:** A responsive web application designed to help college students prepare for internships by diagnosing technical skill gaps, generating a personalized 7-day action plan, and measuring improvement through a retest.

---

## 🎯 Project Objective

1. **Diagnose Skill Gaps:** Practical code output and debugging assessments across 3 predefined internship roles.
2. **Personalized 7-Day Action Plan:** Rule-based scheduling tailoring daily micro-tasks, durations, and free official documentation links to the student's available daily time.
3. **Quantifiable Improvement:** Complete retest comparison measuring score jumps (e.g. +22%), topics mastered, and remaining focus areas.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 with Vite, React Router v6, Axios |
| **Styling** | Bootstrap 5, Bootstrap Icons, Custom SaaS Design System (Vanilla CSS) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose (with automatic in-memory fallback support) |
| **Authentication** | Genuine JWT-based authentication with bcrypt password hashing |

---

## 📂 Project Structure

```text
SkillGap-to-Action/
├── backend/
│   ├── controllers/
│   │   ├── assessmentController.js   # Question delivery, answer evaluation, score diff
│   │   ├── authController.js         # Register, Login, JWT issuing, Logout
│   │   ├── dashboardController.js    # Aggregated metrics, progress percentage
│   │   ├── planController.js         # Rule-based 7-day plan generator & rescheduling
│   │   └── profileController.js     # Student profile CRUD & role preference
│   ├── data/
│   │   ├── learningCatalog.js        # Curated official documentation links & tasks
│   │   ├── questions.js              # Diagnostic (Set 1) & Retest (Set 2) questions
│   │   └── roles.js                  # Predefined internship roles & skill benchmarks
│   ├── middleware/
│   │   └── auth.js                   # Bearer JWT verification middleware
│   ├── models/
│   │   ├── AssessmentAttempt.js      # Scores, question reviews, weak/strong topics
│   │   ├── LearningPlan.js           # 7 daily tasks, duration, completion status
│   │   ├── StudentProfile.js         # College, degree, branch, preferred role, daily time
│   │   └── User.js                   # Name, username, email, hashed password
│   ├── scripts/
│   │   └── seed.js                   # Demo student account seed script
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx            # Desktop sidebar + mobile header wrapper
│   │   │   ├── Navbar.jsx            # Mobile responsive navigation bar
│   │   │   ├── ProtectedRoute.jsx    # Auth & profile guard
│   │   │   └── Sidebar.jsx           # Modern SaaS sidebar navigation
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Auth state, login/register/logout actions
│   │   ├── pages/
│   │   │   ├── Assessment.jsx        # Question cards, code snippets, instant feedback
│   │   │   ├── Dashboard.jsx         # Readiness summary, weak skills, plan progress
│   │   │   ├── LearningPlan.jsx      # 7-day roadmap, task completion, rescheduling
│   │   │   ├── Login.jsx             # Sign in with email/username + show/hide password
│   │   │   ├── Profile.jsx           # Academic details & internship role selection
│   │   │   ├── Register.jsx          # Student account creation with validation
│   │   │   ├── Results.jsx           # Score breakdown, weak topics, priority skills
│   │   │   └── RetestProgress.jsx    # Retest (Set 2) comparison & score jump analysis
│   │   ├── services/
│   │   │   └── api.js                # Centralized Axios client with JWT interceptor
│   │   ├── App.jsx
│   │   ├── index.css                 # Clean SaaS design system styling
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
├── copy-to-d-drive.bat               # 1-click script to copy project to D:\SkillGap-to-Action
├── copy-to-d-drive.ps1               # PowerShell copy script
├── package.json
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB** running locally on port 27017 (or will automatically fallback to in-memory MongoDB in dev)

---

### 2. Backend Setup

```bash
cd backend

# Copy environment variables
copy .env.example .env

# Install backend dependencies
npm install

# (Optional) Seed demo student account
npm run seed

# Start backend server
npm start
# -> Backend starts at http://localhost:5000
```

---

### 3. Frontend Setup

In a new terminal:

```bash
cd frontend

# Copy environment variables
copy .env.example .env

# Install frontend dependencies
npm install

# Start Vite dev server
npm run dev
# -> Frontend starts at http://localhost:3000
```

---

## ⚡ 1-Click Copy to D:\ Drive

If you want the project folder directly inside `D:\SkillGap-to-Action`:

Double-click `copy-to-d-drive.bat` or run:
```powershell
.\copy-to-d-drive.ps1
```
This instantly copies all source code to `D:\SkillGap-to-Action`!

---

## 🔄 Complete Demonstration Workflow

A student or hackathon evaluator can complete this entire journey seamlessly without touching the database:

1. **Register Account:**
   - Go to `http://localhost:3000/register`.
   - Enter your name, username, email, and password.
2. **Complete Student Profile:**
   - Enter your college, degree, branch, year of study.
   - Choose your target role:
     - `Python Developer Intern`
     - `Frontend Developer Intern`
     - `Data Analyst Intern`
   - Set your daily available study time (e.g., 60 mins).
3. **Take Diagnostic Assessment (Set 1):**
   - Answer 9 practical questions featuring code output predictions and debugging scenarios.
   - Submit for instant backend evaluation.
4. **View Identified Skill Gaps:**
   - Inspect overall score %, strong topics, weak topics, and prioritized skills.
   - Expand the question-by-question review with explanations.
5. **Generate 7-Day Action Plan:**
   - Click **"Generate 7-Day Action Plan"**.
   - Review 7 daily micro-tasks tailored to your weakest topics and available time.
   - Explore verified free documentation links (MDN, Python.org, Pandas, W3Schools).
   - Check off completed tasks as you practice.
   - Try the **"Reschedule Incomplete"** feature to dynamically reorganize missed days.
6. **Take Retest Assessment (Set 2):**
   - Click **"Take Retest (Set 2)"** to answer a fresh question set testing the same core topics.
7. **Compare Results & Track Improvement:**
   - View before & after score difference (e.g., `+22%`), list of improved topics, and recommended next steps.

---

## 🛡️ Predefined Internship Roles & Topics

### 1. Python Developer Intern
- Core Python & Data Types
- Functions & Scope
- Object-Oriented Programming (OOP)
- Data Structures (Lists, Dicts, Sets)
- Error Handling & Exception Debugging
- FastAPI / Flask & REST APIs
- SQL & Database Operations

### 2. Frontend Developer Intern
- HTML5 & Semantic Markup
- CSS3, Flexbox & Responsive Design
- Modern JavaScript (ES6+)
- DOM Manipulation & Event Handling
- React Components & Hooks (useState, useEffect)
- Async JavaScript & Axios/Fetch API
- Frontend Debugging & State Management

### 3. Data Analyst Intern
- SQL Queries & Aggregate Functions
- SQL Joins & Relationship Modeling
- Pandas DataFrames & Indexing
- Data Cleaning & Missing Value Imputation
- Data Visualization (Matplotlib / Charts)
- Descriptive Statistics & Correlation
- Business Metric Calculation (CAC, Churn, AOV)

---

## 🧪 Demo Credentials

If you ran `npm run seed` in the backend:
- **Email:** `demo.student@college.edu`
- **Password:** `password123`
- Preloaded with: `Frontend Developer Intern`, NIT, B.Tech CSE.
