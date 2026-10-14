const ROLES = [
  {
    id: 'python-dev',
    title: 'Python Developer Intern',
    description:
      'Focuses on backend services, clean object-oriented Python, RESTful API development, data structures, and database interactions.',
    icon: 'bi-filetype-py',
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
    id: 'frontend-dev',
    title: 'Frontend Developer Intern',
    description:
      'Focuses on modern responsive user interfaces, JavaScript ES6+, React component architecture, state management, and API integration.',
    icon: 'bi-code-slash',
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
    id: 'data-analyst',
    title: 'Data Analyst Intern',
    description:
      'Focuses on structured querying with SQL, data transformation with Pandas, statistical summaries, visualization, and actionable insights.',
    icon: 'bi-bar-chart-line',
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
