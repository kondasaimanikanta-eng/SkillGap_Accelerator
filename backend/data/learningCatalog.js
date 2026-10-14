// Learning resources and curriculum templates mapped by topic for rule-based plan generation
const LEARNING_CATALOG = {
  // ==========================================
  // PYTHON DEVELOPER INTERN TOPICS
  // ==========================================
  'Core Python & Data Types': {
    title: 'Master Python Data Types, References & Memory Semantics',
    instructions:
      'Review mutable vs immutable objects (lists vs tuples/strings), shallow vs deep copy, and reference sharing. Practice writing 5 short scripts manipulating dictionaries and sets without mutating original input.',
    resourceTitle: 'Python Official Documentation - Data Structures',
    resourceLink: 'https://docs.python.org/3/tutorial/datastructures.html',
    baseMinutes: 60,
  },
  'Functions & Scope': {
    title: 'Functions, Default Argument Traps & Closures',
    instructions:
      'Study why mutable default arguments (e.g., def fn(arg=[])) cause shared state bugs. Implement functions using *args, **kwargs, and list/dict comprehensions with filtering.',
    resourceTitle: 'Real Python - Defining Your Own Python Function',
    resourceLink: 'https://realpython.com/defining-your-own-python-function/',
    baseMinutes: 60,
  },
  'Object-Oriented Programming (OOP)': {
    title: 'Object-Oriented Architecture & Inheritance in Python',
    instructions:
      'Build a small hierarchy of 3 classes using inheritance, super(), encapsulation, and dunder methods (__init__, __str__, __repr__). Understand class methods vs static methods.',
    resourceTitle: 'Python Official Tutorial - Classes & Inheritance',
    resourceLink: 'https://docs.python.org/3/tutorial/classes.html',
    baseMinutes: 75,
  },
  'Data Structures (Lists, Dicts, Sets)': {
    title: 'Algorithmic Complexity & Practical Collections',
    instructions:
      'Analyze Big-O time complexity for list indexing, dict key lookups, and set unions. Write solutions for duplicate elimination, anagram detection, and frequency counting.',
    resourceTitle: 'Python Wiki - Time Complexity of Data Structures',
    resourceLink: 'https://wiki.python.org/moin/TimeComplexity',
    baseMinutes: 60,
  },
  'Error Handling & Exception Debugging': {
    title: 'Defensive Programming: Try, Except, Finally & Custom Exceptions',
    instructions:
      'Create custom Exception classes for input validation. Implement try-except-else-finally blocks handling specific errors (ValueError, KeyError, FileNotFoundError) cleanly without silent failures.',
    resourceTitle: 'Python Official Tutorial - Errors and Exceptions',
    resourceLink: 'https://docs.python.org/3/tutorial/errors.html',
    baseMinutes: 45,
  },
  'FastAPI / Flask & REST APIs': {
    title: 'RESTful API Design & HTTP Status Codes',
    instructions:
      'Understand HTTP methods (GET, POST, PUT, PATCH, DELETE) and status codes (200, 201, 400, 404, 500). Build a minimal REST endpoint returning JSON with input validation.',
    resourceTitle: 'FastAPI Official Tutorial - First Steps',
    resourceLink: 'https://fastapi.tiangolo.com/tutorial/first-steps/',
    baseMinutes: 75,
  },
  'SQL & Database Operations': {
    title: 'SQL Fundamentals & Safe Parameterized Queries',
    instructions:
      'Write parameterized SELECT, INSERT, UPDATE queries. Understand foreign keys, primary keys, and index lookups. Practice preventing SQL injection attacks in backend scripts.',
    resourceTitle: 'W3Schools SQL Tutorial - SQL Injection & Queries',
    resourceLink: 'https://www.w3schools.com/sql/sql_injection.asp',
    baseMinutes: 60,
  },

  // ==========================================
  // FRONTEND DEVELOPER INTERN TOPICS
  // ==========================================
  'HTML5 & Semantic Markup': {
    title: 'Semantic HTML5, Accessibility & Page Structure',
    instructions:
      'Refactor a page from generic <div> tags to semantic elements (<main>, <section>, <article>, <nav>, <header>). Link form labels to inputs using htmlFor/for attributes.',
    resourceTitle: 'MDN Web Docs - HTML Semantic Elements',
    resourceLink: 'https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html',
    baseMinutes: 45,
  },
  'CSS3, Flexbox & Responsive Design': {
    title: 'Modern CSS Layouts: Flexbox, CSS Grid & Media Queries',
    instructions:
      'Build a mobile-first responsive 3-column card grid using CSS Grid (repeat(auto-fit, minmax(...))) and Flexbox for component alignment. Test breakpoints at 768px and 1024px.',
    resourceTitle: 'MDN Web Docs - Basic Concepts of Flexbox',
    resourceLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox',
    baseMinutes: 60,
  },
  'Modern JavaScript (ES6+)': {
    title: 'ES6+ Syntax: Destructuring, Spread, Arrow Functions & Array Methods',
    instructions:
      'Practice transforming complex datasets using array methods (.map(), .filter(), .reduce()). Use object destructuring with defaults and spread operators to merge configurations.',
    resourceTitle: 'JavaScript.info - Array Methods and Modern ES6',
    resourceLink: 'https://javascript.info/array-methods',
    baseMinutes: 60,
  },
  'DOM Manipulation & Event Handling': {
    title: 'DOM Events, Bubbling & Event Delegation',
    instructions:
      'Implement an interactive task list using event delegation on a single parent <ul>. Prevent default page submission using event.preventDefault() and inspect event.target.',
    resourceTitle: 'MDN Web Docs - Event Delegation & Event Bubbling',
    resourceLink: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_delegation',
    baseMinutes: 60,
  },
  'React Components & Hooks (useState, useEffect)': {
    title: 'React Core: Declarative State & Effect Lifecycles',
    instructions:
      'Write a functional component using useState with updater functions. Build a useEffect hook with proper dependency arrays to fetch data without triggering infinite render loops.',
    resourceTitle: 'React Official Documentation - Describing the UI & State',
    resourceLink: 'https://react.dev/learn/state-a-components-memory',
    baseMinutes: 75,
  },
  'Async JavaScript & Axios/Fetch API': {
    title: 'Asynchronous JavaScript: Promises, Async/Await & Error Handling',
    instructions:
      'Understand the JavaScript event loop, microtask queue, and Promise lifecycle. Write an async/await API wrapper handling loading states, 4xx/5xx errors, and network disconnects.',
    resourceTitle: 'MDN Web Docs - How to use Promises in JavaScript',
    resourceLink: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises',
    baseMinutes: 60,
  },
  'Frontend Debugging & State Management': {
    title: 'React State Immutability & DevTools Debugging',
    instructions:
      'Debug why direct state mutations break React re-renders. Use React Developer Tools to inspect component hierarchies, props changes, and optimize render passes.',
    resourceTitle: 'React Official Documentation - Updating Objects in State',
    resourceLink: 'https://react.dev/learn/updating-objects-in-state',
    baseMinutes: 60,
  },

  // ==========================================
  // DATA ANALYST INTERN TOPICS
  // ==========================================
  'SQL Queries & Aggregate Functions': {
    title: 'SQL Aggregations, GROUP BY & HAVING Logic',
    instructions:
      'Master the operational order of SQL execution. Write queries combining COUNT, SUM, AVG, GROUP BY, and HAVING to filter aggregated sales or student metrics.',
    resourceTitle: 'W3Schools SQL - GROUP BY and Aggregate Functions',
    resourceLink: 'https://www.w3schools.com/sql/sql_groupby.asp',
    baseMinutes: 60,
  },
  'SQL Joins & Data Relationship Modeling': {
    title: 'Relational Joins: INNER, LEFT, RIGHT & FULL OUTER',
    instructions:
      'Formulate queries joining 3 relational tables (users, orders, payments). Handle NULL records resulting from unmatched rows in LEFT JOINs using COALESCE.',
    resourceTitle: 'W3Schools SQL - SQL Joins Explained',
    resourceLink: 'https://www.w3schools.com/sql/sql_join.asp',
    baseMinutes: 60,
  },
  'Pandas DataFrames & Indexing': {
    title: 'Pandas Fundamentals: Filtering, loc/iloc & Vectorization',
    instructions:
      'Load sample CSV data into a Pandas DataFrame. Filter rows based on multiple boolean conditions. Practice selecting subsets using both label-based (.loc) and index-based (.iloc) indexing.',
    resourceTitle: 'Pandas Official Tutorial - 10 Minutes to pandas',
    resourceLink: 'https://pandas.pydata.org/docs/user_guide/10min.html',
    baseMinutes: 60,
  },
  'Data Cleaning & Missing Value Imputation': {
    title: 'Data Hygiene: Handling Nulls, Duplicates & Type Casting',
    instructions:
      'Identify missing values with df.isna().sum(). Apply mean/median imputation on skewed numeric columns and mode imputation on categorical columns. Remove duplicate records cleanly.',
    resourceTitle: 'Pandas User Guide - Working with Missing Data',
    resourceLink: 'https://pandas.pydata.org/docs/user_guide/missing_data.html',
    baseMinutes: 60,
  },
  'Data Visualization (Matplotlib / Charts)': {
    title: 'Exploratory Visualization: Histograms, Box Plots & Scatter Plots',
    instructions:
      'Create clear charts with descriptive titles, labeled axes, and legends. Plot distribution histograms and box plots to identify outliers, and scatter plots to inspect variable relationships.',
    resourceTitle: 'Matplotlib Official Documentation - Quick Start Guide',
    resourceLink: 'https://matplotlib.org/stable/users/explain/quick_start.html',
    baseMinutes: 60,
  },
  'Descriptive Statistics & Correlation': {
    title: 'Descriptive Statistics & Correlation Interpretation',
    instructions:
      'Compute mean, median, standard deviation, interquartile range (IQR), and Pearson correlation coefficients. Understand when median is superior to mean for skewed distributions.',
    resourceTitle: 'Kaggle Learn - Intro to Descriptive Statistics',
    resourceLink: 'https://www.kaggle.com/learn/intro-to-machine-learning',
    baseMinutes: 60,
  },
  'Business Metric Calculation & Interpretation': {
    title: 'Translating Data into Business KPIs (CAC, Churn, AOV)',
    instructions:
      'Calculate key business metrics including Customer Churn Rate, Average Order Value (AOV), and retention rates. Write a short 3-bullet summary translating raw metrics into recommendations.',
    resourceTitle: 'Corporate Finance Institute - Business KPIs & Metrics Guide',
    resourceLink: 'https://corporatefinanceinstitute.com/resources/accounting/kpi-key-performance-indicator/',
    baseMinutes: 45,
  },
};

module.exports = LEARNING_CATALOG;
