const QUESTIONS = [
  // ==========================================
  // PYTHON DEVELOPER INTERN - SET 1 (INITIAL)
  // ==========================================
  {
    id: 'py1_01',
    role: 'Python Developer Intern',
    set: 1,
    topic: 'Core Python & Data Types',
    type: 'output_prediction',
    question: 'What is the output of the following Python snippet?',
    codeSnippet: `a = [1, 2, 3]
b = a
b.append(4)
print(len(a), len(b))`,
    options: ['3 4', '4 4', '4 3', 'Error: mutable reference conflict'],
    correctAnswer: '4 4',
    explanation:
      'In Python, assigning a list assigns a reference to the same memory object. Modifying b also modifies a, so both have length 4.',
  },
  {
    id: 'py1_02',
    role: 'Python Developer Intern',
    set: 1,
    topic: 'Functions & Scope',
    type: 'debugging',
    question:
      'The following function unexpectedly shares list elements between calls. What is the bug?',
    codeSnippet: `def add_item(item, target_list=[]):
    target_list.append(item)
    return target_list`,
    options: [
      'target_list is using a default mutable argument',
      'The return statement should be outside the function',
      'append method does not return a value',
      'Python requires explicit type declarations for arguments',
    ],
    correctAnswer: 'target_list is using a default mutable argument',
    explanation:
      'Default parameter values are evaluated once when the function is defined. Using a mutable object like a list shares the same object across calls.',
  },
  {
    id: 'py1_03',
    role: 'Python Developer Intern',
    set: 1,
    topic: 'Data Structures (Lists, Dicts, Sets)',
    type: 'mcq',
    question:
      'Which data structure provides average O(1) time complexity for membership testing (checking if an item exists)?',
    options: [
      'Python list',
      'Python set or dict',
      'Linked list',
      'Tuple',
    ],
    correctAnswer: 'Python set or dict',
    explanation:
      'Sets and dict keys are implemented as hash tables in Python, offering average O(1) lookup times compared to O(n) for lists.',
  },
  {
    id: 'py1_04',
    role: 'Python Developer Intern',
    set: 1,
    topic: 'Object-Oriented Programming (OOP)',
    type: 'output_prediction',
    question: 'What will this Python class inheritance code output?',
    codeSnippet: `class Base:
    def greet(self):
        return "Base"

class Child(Base):
    def greet(self):
        return super().greet() + " -> Child"

print(Child().greet())`,
    options: [
        'Child',
        'Base -> Child',
        'Base',
        'AttributeError',
    ],
    correctAnswer: 'Base -> Child',
    explanation:
      'super().greet() calls the parent class method returning "Base", and concatenates " -> Child".',
  },
  {
    id: 'py1_05',
    role: 'Python Developer Intern',
    set: 1,
    topic: 'Error Handling & Exception Debugging',
    type: 'debugging',
    question:
      'Identify what happens if user_input is "0" in this error-handling block:',
    codeSnippet: `try:
    val = int(user_input)
    res = 100 / val
except ValueError:
    res = -1
print(res)`,
    options: [
      'res is set to -1',
      'ZeroDivisionError is unhandled and crashes the program',
      'res evaluates to 0',
      'res evaluates to infinity',
    ],
    correctAnswer: 'ZeroDivisionError is unhandled and crashes the program',
    explanation:
      'int("0") succeeds, so ValueError is not raised. Then 100 / 0 raises ZeroDivisionError which is unhandled.',
  },
  {
    id: 'py1_06',
    role: 'Python Developer Intern',
    set: 1,
    topic: 'FastAPI / Flask & REST APIs',
    type: 'mcq',
    question:
      'Which HTTP status code should a REST API return when a new resource is successfully created via POST?',
    options: ['200 OK', '201 Created', '204 No Content', '302 Found'],
    correctAnswer: '201 Created',
    explanation:
      'HTTP 201 Created is the standard RESTful response code indicating a new resource was successfully created on the server.',
  },
  {
    id: 'py1_07',
    role: 'Python Developer Intern',
    set: 1,
    topic: 'SQL & Database Operations',
    type: 'mcq',
    question:
      'Why is using parameterized queries or ORM bindings strongly recommended over string concatenation in Python database code?',
    options: [
      'To prevent SQL Injection vulnerabilities',
      'Because Python strings cannot contain quotation marks',
      'To automatically compress network packets',
      'Because SQL databases only accept binary encodings',
    ],
    correctAnswer: 'To prevent SQL Injection vulnerabilities',
    explanation:
      'Parameterized queries safely separate SQL code from untrusted user inputs, preventing SQL injection exploits.',
  },
  {
    id: 'py1_08',
    role: 'Python Developer Intern',
    set: 1,
    topic: 'Functions & Scope',
    type: 'output_prediction',
    question: 'What is the output of this list comprehension with condition?',
    codeSnippet: `nums = [1, 2, 3, 4, 5, 6]
result = [x * 2 for x in nums if x % 2 == 0]
print(result)`,
    options: ['[2, 4, 6]', '[4, 8, 12]', '[2, 4, 6, 8, 10, 12]', '[4, 16, 36]'],
    correctAnswer: '[4, 8, 12]',
    explanation:
      'The even numbers are 2, 4, 6. Each is multiplied by 2, yielding [4, 8, 12].',
  },
  {
    id: 'py1_09',
    role: 'Python Developer Intern',
    set: 1,
    topic: 'Core Python & Data Types',
    type: 'debugging',
    question:
      'A student writes this code to count character frequencies, but it throws KeyError on first encounter. How can it be fixed?',
    codeSnippet: `counts = {}
for char in "internship":
    counts[char] += 1`,
    options: [
      'Use counts[char] = counts.get(char, 0) + 1',
      'Initialize counts = [] instead of a dict',
      'Wrap in while loop instead of for loop',
      'Dictionaries cannot store characters as keys',
    ],
    correctAnswer: 'Use counts[char] = counts.get(char, 0) + 1',
    explanation:
      'counts.get(char, 0) safely returns 0 when the key is not yet present, avoiding KeyError.',
  },

  // ==========================================
  // PYTHON DEVELOPER INTERN - SET 2 (RETEST)
  // ==========================================
  {
    id: 'py2_01',
    role: 'Python Developer Intern',
    set: 2,
    topic: 'Core Python & Data Types',
    type: 'output_prediction',
    question: 'What is the output of slicing this list in Python?',
    codeSnippet: `data = [10, 20, 30, 40, 50]
print(data[1:4:2])`,
    options: ['[20, 30, 40]', '[20, 40]', '[10, 30]', '[20, 50]'],
    correctAnswer: '[20, 40]',
    explanation:
      'data[1:4:2] starts at index 1 (value 20), stops before index 4, stepping by 2, so it takes index 1 (20) and index 3 (40).',
  },
  {
    id: 'py2_02',
    role: 'Python Developer Intern',
    set: 2,
    topic: 'Functions & Scope',
    type: 'output_prediction',
    question: 'What will be printed when this Python lambda is executed?',
    codeSnippet: `multiplier = lambda x, y=2: x * y
print(multiplier(5), multiplier(5, 3))`,
    options: ['10 15', '10 10', '25 15', 'TypeError'],
    correctAnswer: '10 15',
    explanation:
      'The first call uses default y=2 (5*2=10). The second call overrides y with 3 (5*3=15).',
  },
  {
    id: 'py2_03',
    role: 'Python Developer Intern',
    set: 2,
    topic: 'Data Structures (Lists, Dicts, Sets)',
    type: 'debugging',
    question:
      'What occurs when trying to add a list as an element into a Python set?',
    codeSnippet: `my_set = set()
my_set.add([1, 2, 3])`,
    options: [
      'TypeError: unhashable type: "list"',
      'The list is added successfully',
      'The list elements are flattened automatically',
      'A duplicate item warning is emitted',
    ],
    correctAnswer: 'TypeError: unhashable type: "list"',
    explanation:
      'Set elements must be hashable and immutable. Lists are mutable and therefore unhashable. A tuple could be used instead.',
  },
  {
    id: 'py2_04',
    role: 'Python Developer Intern',
    set: 2,
    topic: 'Object-Oriented Programming (OOP)',
    type: 'mcq',
    question:
      'Which special method in Python is called automatically when an object is converted to a string or printed with print(obj)?',
    options: ['__init__', '__str__', '__call__', '__new__'],
    correctAnswer: '__str__',
    explanation:
      'The __str__ dunder method returns the readable string representation of an instance when str() or print() is called.',
  },
  {
    id: 'py2_05',
    role: 'Python Developer Intern',
    set: 2,
    topic: 'Error Handling & Exception Debugging',
    type: 'output_prediction',
    question: 'What gets executed in this try-except-finally construct?',
    codeSnippet: `def test():
    try:
        return 1
    finally:
        print("Done")

res = test()`,
    options: [
      'Prints "Done" and returns 1',
      'Returns 1 without printing',
      'SyntaxError on finally return',
      'Prints "Done" only if an error happens',
    ],
    correctAnswer: 'Prints "Done" and returns 1',
    explanation:
      'The finally block is guaranteed to execute before the function finishes returning, printing "Done".',
  },
  {
    id: 'py2_06',
    role: 'Python Developer Intern',
    set: 2,
    topic: 'FastAPI / Flask & REST APIs',
    type: 'debugging',
    question:
      'In a Flask or FastAPI endpoint, which HTTP method should be used to partially update an existing user record?',
    options: ['PATCH', 'GET', 'DELETE', 'OPTIONS'],
    correctAnswer: 'PATCH',
    explanation:
      'In REST design, PATCH is specified for partial updates of a resource, whereas PUT typically replaces the entire resource.',
  },
  {
    id: 'py2_07',
    role: 'Python Developer Intern',
    set: 2,
    topic: 'SQL & Database Operations',
    type: 'mcq',
    question:
      'What SQL clause is required to filter groups created by a GROUP BY query?',
    options: ['HAVING', 'WHERE', 'ORDER BY', 'LIMIT'],
    correctAnswer: 'HAVING',
    explanation:
      'WHERE filters rows before grouping occurs. HAVING is specifically used to filter aggregate results after GROUP BY.',
  },
  {
    id: 'py2_08',
    role: 'Python Developer Intern',
    set: 2,
    topic: 'Functions & Scope',
    type: 'debugging',
    question:
      'What happens when attempting to modify a global variable without the global keyword inside a function?',
    codeSnippet: `counter = 0
def increment():
    counter += 1
increment()`,
    options: [
      'UnboundLocalError: local variable "counter" referenced before assignment',
      'The global counter increases to 1',
      'A new local counter is created with value 1',
      'ZeroDivisionError',
    ],
    correctAnswer:
      'UnboundLocalError: local variable "counter" referenced before assignment',
    explanation:
      'Because counter is assigned inside the function, Python treats it as local, but reading it before assignment causes UnboundLocalError.',
  },
  {
    id: 'py2_09',
    role: 'Python Developer Intern',
    set: 2,
    topic: 'Core Python & Data Types',
    type: 'mcq',
    question:
      'Which of the following creates a true shallow copy of list original_list?',
    options: [
      'copied = original_list.copy() or original_list[:]',
      'copied = original_list',
      'copied = &original_list',
      'copied = list(set(original_list))',
    ],
    correctAnswer: 'copied = original_list.copy() or original_list[:]',
    explanation:
      'original_list.copy() or slicing original_list[:] produces a new list object containing the items, unlike simple assignment.',
  },

  // ==========================================
  // FRONTEND DEVELOPER INTERN - SET 1 (INITIAL)
  // ==========================================
  {
    id: 'fe1_01',
    role: 'Frontend Developer Intern',
    set: 1,
    topic: 'HTML5 & Semantic Markup',
    type: 'mcq',
    question:
      'Which HTML5 semantic element is best suited for wrapping the main navigation menu of a web application?',
    options: ['<nav>', '<header>', '<section>', '<aside>'],
    correctAnswer: '<nav>',
    explanation:
      'The <nav> element represents a section of a page whose purpose is to provide navigation links, supporting accessibility and SEO.',
  },
  {
    id: 'fe1_02',
    role: 'Frontend Developer Intern',
    set: 1,
    topic: 'CSS3, Flexbox & Responsive Design',
    type: 'debugging',
    question:
      'A developer wants to center an element horizontally and vertically inside a flex container, but items are stretched. Which rules achieve perfect centering?',
    codeSnippet: `.container {
    display: flex;
    /* Missing alignment rules */
}`,
    options: [
      'justify-content: center; align-items: center;',
      'text-align: center; vertical-align: middle;',
      'float: center; margin: auto 0;',
      'position: relative; top: 50%;',
    ],
    correctAnswer: 'justify-content: center; align-items: center;',
    explanation:
      'In CSS Flexbox, justify-content: center aligns items along the main axis, and align-items: center aligns items along the cross axis.',
  },
  {
    id: 'fe1_03',
    role: 'Frontend Developer Intern',
    set: 1,
    topic: 'Modern JavaScript (ES6+)',
    type: 'output_prediction',
    question: 'What is the console output of this JavaScript snippet?',
    codeSnippet: `const numbers = [1, 2, 3];
const result = numbers.map(n => n * 2);
console.log(numbers.length, result[1]);`,
    options: ['3 4', '3 2', '2 4', 'TypeError'],
    correctAnswer: '3 4',
    explanation:
      'Array.prototype.map returns a new array [2, 4, 6] without mutating the original numbers array (length remains 3). result[1] is 4.',
  },
  {
    id: 'fe1_04',
    role: 'Frontend Developer Intern',
    set: 1,
    topic: 'DOM Manipulation & Event Handling',
    type: 'debugging',
    question:
      'Submitting a form reloads the whole web page. Which line inside the submit event listener prevents this default browser behavior?',
    codeSnippet: `form.addEventListener('submit', (event) => {
    // What line belongs here?
    handleSubmit();
});`,
    options: [
      'event.preventDefault()',
      'event.stopPropagation()',
      'return true',
      'window.stopReload()',
    ],
    correctAnswer: 'event.preventDefault()',
    explanation:
      'event.preventDefault() stops the default browser action of submitting the form and refreshing the page.',
  },
  {
    id: 'fe1_05',
    role: 'Frontend Developer Intern',
    set: 1,
    topic: 'React Components & Hooks (useState, useEffect)',
    type: 'debugging',
    question:
      'The following React component causes an infinite re-render loop. Why?',
    codeSnippet: `function UserList() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        fetch('/api/users')
            .then(res => res.json())
            .then(data => setUsers(data));
    }); // Notice the dependency argument
}`,
    options: [
      'Missing empty dependency array [] causes useEffect to run on every render',
      'setUsers must be called synchronously',
      'useState cannot hold an array',
      'useEffect cannot contain async fetch calls',
    ],
    correctAnswer:
      'Missing empty dependency array [] causes useEffect to run on every render',
    explanation:
      'Without a dependency array, useEffect runs after every single render. Updating state causes a re-render, creating an infinite loop.',
  },
  {
    id: 'fe1_06',
    role: 'Frontend Developer Intern',
    set: 1,
    topic: 'Async JavaScript & Axios/Fetch API',
    type: 'output_prediction',
    question: 'In what order are the messages printed in the console?',
    codeSnippet: `console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');`,
    options: ['A, D, C, B', 'A, B, C, D', 'A, D, B, C', 'C, A, D, B'],
    correctAnswer: 'A, D, C, B',
    explanation:
      'Synchronous code runs first (A, D). Microtasks like Promise.then() run next (C). Macrotasks like setTimeout callbacks run last (B).',
  },
  {
    id: 'fe1_07',
    role: 'Frontend Developer Intern',
    set: 1,
    topic: 'Frontend Debugging & State Management',
    type: 'debugging',
    question:
      'Why does modifying React state directly like this fail to trigger a component re-render?',
    codeSnippet: `const [profile, setProfile] = useState({ name: 'Alex' });
// Inside handler:
profile.name = 'Jordan';`,
    options: [
      'React uses shallow object reference comparison and only detects updates via the setter function',
      'Object keys in React state are permanently frozen',
      'State can only be modified inside a class constructor',
      'Strings are immutable in JavaScript',
    ],
    correctAnswer:
      'React uses shallow object reference comparison and only detects updates via the setter function',
    explanation:
      'React compares state references with Object.is. Direct mutation does not change the object reference or trigger React’s reconciliation algorithm.',
  },
  {
    id: 'fe1_08',
    role: 'Frontend Developer Intern',
    set: 1,
    topic: 'Modern JavaScript (ES6+)',
    type: 'output_prediction',
    question: 'What is the result of destructuring with defaults here?',
    codeSnippet: `const config = { host: 'localhost' };
const { host, port = 8080 } = config;
console.log(host, port);`,
    options: [
      'localhost 8080',
      'localhost undefined',
      'localhost null',
      'ReferenceError: port is not defined',
    ],
    correctAnswer: 'localhost 8080',
    explanation:
      'host is extracted as "localhost". Because port is undefined in config, the default value 8080 is assigned.',
  },
  {
    id: 'fe1_09',
    role: 'Frontend Developer Intern',
    set: 1,
    topic: 'CSS3, Flexbox & Responsive Design',
    type: 'mcq',
    question:
      'In CSS Grid, which syntax creates a responsive grid that automatically fits as many 200px columns as possible?',
    options: [
      'grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));',
      'grid-columns: auto-fit 200px;',
      'display: responsive-grid;',
      'grid-template-columns: 200px * auto;',
    ],
    correctAnswer:
      'grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));',
    explanation:
      'repeat(auto-fit, minmax(200px, 1fr)) dynamically fills the row with columns of at least 200px expanding to 1fr.',
  },

  // ==========================================
  // FRONTEND DEVELOPER INTERN - SET 2 (RETEST)
  // ==========================================
  {
    id: 'fe2_01',
    role: 'Frontend Developer Intern',
    set: 2,
    topic: 'HTML5 & Semantic Markup',
    type: 'mcq',
    question:
      'Which HTML attribute improves accessibility by explicitly linking an <input> element to its descriptive <label>?',
    options: [
      'for attribute on label matching the input id',
      'name attribute on label',
      'aria-bind attribute',
      'input-ref attribute',
    ],
    correctAnswer: 'for attribute on label matching the input id',
    explanation:
      'The htmlFor (or for in HTML) attribute associates a label with an input matching the corresponding id for screen readers.',
  },
  {
    id: 'fe2_02',
    role: 'Frontend Developer Intern',
    set: 2,
    topic: 'CSS3, Flexbox & Responsive Design',
    type: 'mcq',
    question:
      'Which CSS property allows text to truncate with ellipsis (...) when it overflows a fixed-width container?',
    options: [
      'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;',
      'text-wrap: dot-dot-dot;',
      'clip-path: ellipsis;',
      'word-break: truncate;',
    ],
    correctAnswer:
      'overflow: hidden; white-space: nowrap; text-overflow: ellipsis;',
    explanation:
      'Combining overflow: hidden, white-space: nowrap, and text-overflow: ellipsis is the standard CSS technique for text truncation.',
  },
  {
    id: 'fe2_03',
    role: 'Frontend Developer Intern',
    set: 2,
    topic: 'Modern JavaScript (ES6+)',
    type: 'output_prediction',
    question: 'What does the spread operator produce in this object merge?',
    codeSnippet: `const defaults = { theme: 'light', font: 'sans' };
const userPrefs = { theme: 'dark' };
const merged = { ...defaults, ...userPrefs };
console.log(merged.theme, merged.font);`,
    options: [
      'dark sans',
      'light sans',
      'dark undefined',
      'TypeError',
    ],
    correctAnswer: 'dark sans',
    explanation:
      'Object spread copies properties from left to right; properties from userPrefs override matching keys from defaults.',
  },
  {
    id: 'fe2_04',
    role: 'Frontend Developer Intern',
    set: 2,
    topic: 'DOM Manipulation & Event Handling',
    type: 'debugging',
    question:
      'Why is attaching one event listener to a parent container (event delegation) better than attaching listeners to 100 individual table rows?',
    options: [
      'It uses less memory and automatically handles dynamically added child elements',
      'It prevents CSS animations from pausing',
      'HTML5 requires event delegation for tables',
      'Individual listeners cannot read event.target',
    ],
    correctAnswer:
      'It uses less memory and automatically handles dynamically added child elements',
    explanation:
      'Event delegation leverages event bubbling to handle events at a single ancestor, reducing memory footprint and handling dynamic elements.',
  },
  {
    id: 'fe2_05',
    role: 'Frontend Developer Intern',
    set: 2,
    topic: 'React Components & Hooks (useState, useEffect)',
    type: 'debugging',
    question:
      'A counter button clicked three times rapidly only increments by 1. What fixes this state batching bug?',
    codeSnippet: `// Problematic:
setCount(count + 1);
setCount(count + 1);
setCount(count + 1);`,
    options: [
      'Use updater function: setCount(prev => prev + 1)',
      'Use count++ directly on the state variable',
      'Wrap each call in a setTimeout',
      'Remove React.StrictMode',
    ],
    correctAnswer: 'Use updater function: setCount(prev => prev + 1)',
    explanation:
      'Using the functional update form setCount(prev => prev + 1) guarantees the latest pending state is used for each update.',
  },
  {
    id: 'fe2_06',
    role: 'Frontend Developer Intern',
    set: 2,
    topic: 'Async JavaScript & Axios/Fetch API',
    type: 'debugging',
    question:
      'When using native fetch(), how should HTTP error responses (such as 404 or 500) be properly detected?',
    codeSnippet: `fetch('/api/profile')
    .then(response => {
        // How to verify success?
    })`,
    options: [
      'Check if response.ok is true',
      'fetch automatically throws an error on 404/500',
      'Check if response.status === "SUCCESS"',
      'Inspect response.catchError()',
    ],
    correctAnswer: 'Check if response.ok is true',
    explanation:
      'fetch() only rejects on network failure. HTTP error status codes like 404 or 500 still resolve the promise; checking response.ok (status 200-299) is required.',
  },
  {
    id: 'fe2_07',
    role: 'Frontend Developer Intern',
    set: 2,
    topic: 'Frontend Debugging & State Management',
    type: 'output_prediction',
    question:
      'What is logged to the console when checking boolean conversion in JS?',
    codeSnippet: `console.log(Boolean([]), Boolean(''), Boolean(0));`,
    options: [
      'true false false',
      'false false false',
      'true true false',
      'false true false',
    ],
    correctAnswer: 'true false false',
    explanation:
      'In JavaScript, all objects including empty arrays [] are truthy. Empty string "" and 0 are falsy.',
  },
  {
    id: 'fe2_08',
    role: 'Frontend Developer Intern',
    set: 2,
    topic: 'Modern JavaScript (ES6+)',
    type: 'output_prediction',
    question: 'What is the output of Array.prototype.reduce here?',
    codeSnippet: `const scores = [10, 20, 30];
const total = scores.reduce((acc, curr) => acc + curr, 5);
console.log(total);`,
    options: ['65', '60', '55', 'NaN'],
    correctAnswer: '65',
    explanation:
      'The initial value accumulator is 5. Adding 10 + 20 + 30 yields 65.',
  },
  {
    id: 'fe2_09',
    role: 'Frontend Developer Intern',
    set: 2,
    topic: 'React Components & Hooks (useState, useEffect)',
    type: 'mcq',
    question:
      'When rendering a dynamic list in React, why should a stable unique ID be used for the key prop instead of array index?',
    options: [
      'Array indexes cause component state bugs and re-rendering inefficiencies when items are reordered or filtered',
      'React throws a compilation error if an index is used',
      'Indexes do not exist in JavaScript arrays',
      'Unique IDs make the DOM nodes invisible to CSS',
    ],
    correctAnswer:
      'Array indexes cause component state bugs and re-rendering inefficiencies when items are reordered or filtered',
    explanation:
      'Indexes change when items are inserted, deleted, or reordered, confusing React reconciliation and causing uncontrolled state leaks between components.',
  },

  // ==========================================
  // DATA ANALYST INTERN - SET 1 (INITIAL)
  // ==========================================
  {
    id: 'da1_01',
    role: 'Data Analyst Intern',
    set: 1,
    topic: 'SQL Queries & Aggregate Functions',
    type: 'output_prediction',
    question: 'What does this SQL query calculate?',
    codeSnippet: `SELECT department, AVG(salary) AS avg_sal
FROM employees
GROUP BY department
HAVING COUNT(*) > 5;`,
    options: [
      'Average salary for departments having more than 5 employees',
      'Top 5 highest paid employees per department',
      'Departments where the average salary is greater than 5',
      'Total salary expense for all employees',
    ],
    correctAnswer:
      'Average salary for departments having more than 5 employees',
    explanation:
      'GROUP BY department groups records, HAVING COUNT(*) > 5 filters only groups with more than 5 records, and AVG(salary) computes the mean.',
  },
  {
    id: 'da1_02',
    role: 'Data Analyst Intern',
    set: 1,
    topic: 'SQL Joins & Data Relationship Modeling',
    type: 'debugging',
    question:
      'An analyst wants all customers, including those who have never placed an order. Which JOIN is required?',
    codeSnippet: `SELECT c.name, o.order_date
FROM customers c
/* JOIN type */ orders o ON c.id = o.customer_id;`,
    options: [
      'LEFT JOIN',
      'INNER JOIN',
      'CROSS JOIN',
      'RIGHT JOIN (with orders on left)',
    ],
    correctAnswer: 'LEFT JOIN',
    explanation:
      'LEFT JOIN returns all records from the left table (customers), and matching records from the right table (orders), filling with NULL if no match exists.',
  },
  {
    id: 'da1_03',
    role: 'Data Analyst Intern',
    set: 1,
    topic: 'Pandas DataFrames & Indexing',
    type: 'output_prediction',
    question: 'What is the shape of the DataFrame after applying this filter?',
    codeSnippet: `import pandas as pd
df = pd.DataFrame({'age': [22, 25, 19, 30, 24]})
filtered = df[df['age'] >= 24]
print(len(filtered))`,
    options: ['3', '2', '5', '4'],
    correctAnswer: '3',
    explanation:
      'The values 25, 30, and 24 satisfy age >= 24, so the filtered DataFrame has 3 rows.',
  },
  {
    id: 'da1_04',
    role: 'Data Analyst Intern',
    set: 1,
    topic: 'Data Cleaning & Missing Value Imputation',
    type: 'debugging',
    question:
      'Which Pandas method correctly fills missing (NaN) values in a column with the column mean?',
    options: [
      "df['salary'] = df['salary'].fillna(df['salary'].mean())",
      "df['salary'] = df['salary'].drop_na(mean=True)",
      "df['salary'].replace_null(df['salary'].average())",
      "df['salary'] = df['salary'].impute()",
    ],
    correctAnswer: "df['salary'] = df['salary'].fillna(df['salary'].mean())",
    explanation:
      'fillna() is the standard Pandas method for replacing missing values, here passing df["salary"].mean().',
  },
  {
    id: 'da1_05',
    role: 'Data Analyst Intern',
    set: 1,
    topic: 'Data Visualization (Matplotlib / Charts)',
    type: 'mcq',
    question:
      'Which chart type is most appropriate for visualizing the distribution and skewness of a single continuous variable?',
    options: [
      'Histogram or Box Plot',
      'Pie Chart',
      'Scatter Plot with 4 dimensions',
      'Stacked Area Chart',
    ],
    correctAnswer: 'Histogram or Box Plot',
    explanation:
      'Histograms and box plots are designed to display distributions, medians, quartiles, and outliers of a continuous numerical variable.',
  },
  {
    id: 'da1_06',
    role: 'Data Analyst Intern',
    set: 1,
    topic: 'Descriptive Statistics & Correlation',
    type: 'mcq',
    question:
      'If a dataset contains extreme high outliers (e.g. billionaire incomes), which metric gives the most robust measure of central tendency?',
    options: ['Median', 'Mean', 'Standard Deviation', 'Range'],
    correctAnswer: 'Median',
    explanation:
      'The median is resistant to outliers because it represents the 50th percentile, unlike the arithmetic mean which is pulled toward extremes.',
  },
  {
    id: 'da1_07',
    role: 'Data Analyst Intern',
    set: 1,
    topic: 'Business Metric Calculation & Interpretation',
    type: 'debugging',
    question:
      'What formula correctly calculates Customer Churn Rate for a monthly subscription business?',
    options: [
      '(Lost Customers during month / Total Customers at start of month) * 100',
      '(New Customers gained / Total Customers) * 100',
      '(Monthly Revenue / Total Customers) * 100',
      '(Active Customers / Lost Customers) * 100',
    ],
    correctAnswer:
      '(Lost Customers during month / Total Customers at start of month) * 100',
    explanation:
      'Churn rate measures the percentage of existing customers lost over a specified period relative to starting customer count.',
  },
  {
    id: 'da1_08',
    role: 'Data Analyst Intern',
    set: 1,
    topic: 'SQL Queries & Aggregate Functions',
    type: 'output_prediction',
    question: 'What is returned by this DISTINCT query?',
    codeSnippet: `SELECT COUNT(DISTINCT country) FROM users;
-- Given users countries: ['US', 'IN', 'US', 'UK', 'IN']`,
    options: ['3', '5', '2', 'Error: duplicate country'],
    correctAnswer: '3',
    explanation:
      'Distinct countries are US, IN, and UK, so COUNT(DISTINCT country) is 3.',
  },
  {
    id: 'da1_09',
    role: 'Data Analyst Intern',
    set: 1,
    topic: 'Pandas DataFrames & Indexing',
    type: 'debugging',
    question:
      'In Pandas, what is the key difference between df.loc and df.iloc?',
    options: [
      '.loc is label-based indexing while .iloc is integer position-based indexing',
      '.loc operates on columns only, .iloc on rows only',
      '.loc is deprecated in newer Pandas versions',
      '.iloc only accepts string names',
    ],
    correctAnswer:
      '.loc is label-based indexing while .iloc is integer position-based indexing',
    explanation:
      '.loc selects rows and columns by labels/names, while .iloc selects strictly by numerical (0-based) index positions.',
  },

  // ==========================================
  // DATA ANALYST INTERN - SET 2 (RETEST)
  // ==========================================
  {
    id: 'da2_01',
    role: 'Data Analyst Intern',
    set: 2,
    topic: 'SQL Queries & Aggregate Functions',
    type: 'output_prediction',
    question: 'What is the result of using COALESCE in SQL?',
    codeSnippet: `SELECT COALESCE(bonus, 0) FROM employees;
-- Given bonus column with values: [500, NULL, 1200]`,
    options: [
      '[500, 0, 1200]',
      '[500, NULL, 1200]',
      '[0, 0, 0]',
      'Error: COALESCE requires strings',
    ],
    correctAnswer: '[500, 0, 1200]',
    explanation:
      'COALESCE returns the first non-null argument in its list, converting NULL into 0.',
  },
  {
    id: 'da2_02',
    role: 'Data Analyst Intern',
    set: 2,
    topic: 'SQL Joins & Data Relationship Modeling',
    type: 'mcq',
    question:
      'Which SQL construct computes row rankings without collapsing multiple rows into a single group?',
    options: [
      'Window functions (e.g., RANK() OVER (PARTITION BY ... ORDER BY ...))',
      'GROUP BY with HAVING',
      'INNER JOIN with UNION',
      'ORDER BY with OFFSET',
    ],
    correctAnswer:
      'Window functions (e.g., RANK() OVER (PARTITION BY ... ORDER BY ...))',
    explanation:
      'Window functions perform calculations across related rows without collapsing them, preserving row-level detail.',
  },
  {
    id: 'da2_03',
    role: 'Data Analyst Intern',
    set: 2,
    topic: 'Pandas DataFrames & Indexing',
    type: 'debugging',
    question:
      'What happens if you do not specify inplace=True or reassign when dropping a column in Pandas?',
    codeSnippet: `df.drop(columns=['unwanted_column'])
print('unwanted_column' in df.columns)`,
    options: [
      'True (The column is still present in df because drop returns a copy)',
      'False (The column is permanently removed)',
      'SyntaxError on drop method',
      'The column values turn to NaN',
    ],
    correctAnswer:
      'True (The column is still present in df because drop returns a copy)',
    explanation:
      'By default, df.drop() returns a new DataFrame copy. Without df = df.drop(...) or inplace=True, the original df remains unchanged.',
  },
  {
    id: 'da2_04',
    role: 'Data Analyst Intern',
    set: 2,
    topic: 'Data Cleaning & Missing Value Imputation',
    type: 'mcq',
    question:
      'When cleaning categorical data with a few missing values, which imputation method is standard?',
    options: [
      'Mode imputation (most frequent category)',
      'Mean imputation',
      'Exponential moving average',
      'Standard deviation replacement',
    ],
    correctAnswer: 'Mode imputation (most frequent category)',
    explanation:
      'Categorical variables cannot have numerical means; the mode (most common value) is the standard imputation choice.',
  },
  {
    id: 'da2_05',
    role: 'Data Analyst Intern',
    set: 2,
    topic: 'Data Visualization (Matplotlib / Charts)',
    type: 'debugging',
    question:
      'An analyst wants to show the relationship and correlation between Advertising Spend and Sales Revenue. What chart is ideal?',
    options: [
      'Scatter Plot',
      'Pie Chart',
      'Gauge Chart',
      'Donut Chart',
    ],
    correctAnswer: 'Scatter Plot',
    explanation:
      'A scatter plot plots two continuous variables against each other, making trends, clusters, and correlation immediately visible.',
  },
  {
    id: 'da2_06',
    role: 'Data Analyst Intern',
    set: 2,
    topic: 'Descriptive Statistics & Correlation',
    type: 'mcq',
    question:
      'A Pearson correlation coefficient between two variables is calculated as r = -0.85. How should this be interpreted?',
    options: [
      'Strong negative linear relationship',
      'Weak positive linear relationship',
      'No correlation whatsoever',
      'Direct causal relationship guaranteed',
    ],
    correctAnswer: 'Strong negative linear relationship',
    explanation:
      'A correlation coefficient of -0.85 indicates a strong inverse relationship (as one variable rises, the other tends to fall).',
  },
  {
    id: 'da2_07',
    role: 'Data Analyst Intern',
    set: 2,
    topic: 'Business Metric Calculation & Interpretation',
    type: 'output_prediction',
    question: 'If Total Revenue is $50,000 across 250 orders, what is the Average Order Value (AOV)?',
    options: ['$200', '$250', '$500', '$125'],
    correctAnswer: '$200',
    explanation:
      'Average Order Value (AOV) = Total Revenue / Total Orders = 50,000 / 250 = $200.',
  },
  {
    id: 'da2_08',
    role: 'Data Analyst Intern',
    set: 2,
    topic: 'Pandas DataFrames & Indexing',
    type: 'output_prediction',
    question: 'What does df.groupby("category")["sales"].sum() return in Pandas?',
    codeSnippet: `df = pd.DataFrame({
    'category': ['A', 'B', 'A'],
    'sales': [100, 200, 300]
})
print(df.groupby('category')['sales'].sum()['A'])`,
    options: ['400', '100', '300', '600'],
    correctAnswer: '400',
    explanation:
      'Category A has sales 100 + 300 = 400. Category B has 200.',
  },
  {
    id: 'da2_09',
    role: 'Data Analyst Intern',
    set: 2,
    topic: 'SQL Queries & Aggregate Functions',
    type: 'mcq',
    question:
      'What is the purpose of the SQL CASE statement?',
    options: [
      'To implement conditional IF-THEN-ELSE logic directly in queries',
      'To convert text strings to uppercase',
      'To switch between different database schemas',
      'To handle try-catch errors',
    ],
    correctAnswer:
      'To implement conditional IF-THEN-ELSE logic directly in queries',
    explanation:
      'CASE statements allow conditional logic in SQL SELECT, WHERE, and ORDER BY clauses.',
  },
];

module.exports = QUESTIONS;
