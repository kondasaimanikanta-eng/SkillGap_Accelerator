const ROLES = [
  // ==========================================
  // PROFESSIONAL CAREER TRACKS
  // ==========================================
  {
    id: 'frontend-engineer',
    title: 'Frontend Engineer',
    category: 'Career Track',
    badge: 'Industry Standard',
    description:
      'Focuses on modern responsive user interfaces, JavaScript ES6+, React component architecture, state management, and API integration.',
    icon: 'bi-code-slash',
    color: '#0ea5e9',
    requiredSkills: [
      'HTML5 & Semantic Markup',
      'CSS3, Flexbox & Responsive Design',
      'Modern JavaScript (ES6+)',
      'DOM Manipulation & Event Handling',
      'React Components & Hooks (useState, useEffect)',
      'Async JavaScript & Axios/Fetch API',
      'Frontend Debugging & State Management',
    ],
    benchmarkPassingScore: 75,
  },
  {
    id: 'python-backend',
    title: 'Python & Backend Developer',
    category: 'Career Track',
    badge: 'High Demand',
    description:
      'Focuses on backend services, clean object-oriented Python, RESTful API development, data structures, and database interactions.',
    icon: 'bi-filetype-py',
    color: '#6366f1',
    requiredSkills: [
      'Core Python & Data Types',
      'Functions & Scope',
      'Object-Oriented Programming (OOP)',
      'Data Structures (Lists, Dicts, Sets)',
      'Error Handling & Exception Debugging',
      'FastAPI / Flask & REST APIs',
      'SQL & Database Operations',
    ],
    benchmarkPassingScore: 75,
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst & BI',
    category: 'Career Track',
    badge: 'Analytics Track',
    description:
      'Focuses on structured querying with SQL, data transformation with Pandas, statistical summaries, visualization, and actionable business insights.',
    icon: 'bi-bar-chart-line',
    color: '#10b981',
    requiredSkills: [
      'SQL Queries & Aggregate Functions',
      'SQL Joins & Data Relationship Modeling',
      'Pandas DataFrames & Indexing',
      'Data Cleaning & Missing Value Imputation',
      'Data Visualization (Matplotlib / Charts)',
      'Descriptive Statistics & Correlation',
      'Business Metric Calculation & Interpretation',
    ],
    benchmarkPassingScore: 75,
  },
  {
    id: 'fullstack-dev',
    title: 'Full Stack Software Engineer',
    category: 'Career Track',
    badge: 'Comprehensive',
    description:
      'Covers end-to-end web engineering from React client architecture to RESTful services, database modeling, and debugging.',
    icon: 'bi-layers-fill',
    color: '#8b5cf6',
    requiredSkills: [
      'Modern JavaScript (ES6+)',
      'React Components & Hooks (useState, useEffect)',
      'Core Python & Data Types',
      'FastAPI / Flask & REST APIs',
      'SQL Queries & Aggregate Functions',
      'Frontend Debugging & State Management',
      'Error Handling & Exception Debugging',
    ],
    benchmarkPassingScore: 75,
  },

  // ==========================================
  // DEDICATED INTERNSHIP MODULE TRACKS
  // ==========================================
  {
    id: 'frontend-dev',
    title: 'Frontend Developer Intern',
    category: 'Internship Module',
    badge: 'Internship Ready',
    description:
      'Calibrated for college internship screening rounds: HTML/CSS fundamentals, modern JS ES6+, and React core concepts.',
    icon: 'bi-mortarboard-fill',
    color: '#38bdf8',
    requiredSkills: [
      'HTML5 & Semantic Markup',
      'CSS3, Flexbox & Responsive Design',
      'Modern JavaScript (ES6+)',
      'DOM Manipulation & Event Handling',
      'React Components & Hooks (useState, useEffect)',
      'Async JavaScript & Axios/Fetch API',
      'Frontend Debugging & State Management',
    ],
    benchmarkPassingScore: 70,
  },
  {
    id: 'python-dev',
    title: 'Python Developer Intern',
    category: 'Internship Module',
    badge: 'Internship Ready',
    description:
      'Calibrated for college internship screening rounds: Python syntax, OOP, error handling, lists/dicts, and basic SQL.',
    icon: 'bi-mortarboard-fill',
    color: '#818cf8',
    requiredSkills: [
      'Core Python & Data Types',
      'Functions & Scope',
      'Object-Oriented Programming (OOP)',
      'Data Structures (Lists, Dicts, Sets)',
      'Error Handling & Exception Debugging',
      'FastAPI / Flask & REST APIs',
      'SQL & Database Operations',
    ],
    benchmarkPassingScore: 70,
  },
  {
    id: 'data-analyst-intern',
    title: 'Data Analyst Intern',
    category: 'Internship Module',
    badge: 'Internship Ready',
    description:
      'Calibrated for campus placements and internship tests: SQL queries, Joins, Pandas dataframes, and charting.',
    icon: 'bi-mortarboard-fill',
    color: '#34d399',
    requiredSkills: [
      'SQL Queries & Aggregate Functions',
      'SQL Joins & Data Relationship Modeling',
      'Pandas DataFrames & Indexing',
      'Data Cleaning & Missing Value Imputation',
      'Data Visualization (Matplotlib / Charts)',
      'Descriptive Statistics & Correlation',
      'Business Metric Calculation & Interpretation',
    ],
    benchmarkPassingScore: 70,
  },
];

module.exports = ROLES;

