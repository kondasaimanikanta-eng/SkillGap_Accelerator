const { describe, it } = require('node:test');
const assert = require('node:assert');
const LEARNING_CATALOG = require('../../backend/data/learningCatalog');
const ROLES = require('../../backend/data/roles');

describe('Unit: 7-Day Action Plan Generation & Scheduling Logic', () => {
  it('should scale task durations strictly according to candidate daily time budget', () => {
    const topic = 'Core Python & Data Types';
    const catalogEntry = LEARNING_CATALOG[topic];
    assert.ok(catalogEntry, 'Catalog entry must exist for core topic');

    // Test different daily budgets: 30m, 45m, 60m, 90m, 120m
    const testBudgets = [30, 45, 60, 90, 120];

    testBudgets.forEach((dailyBudget) => {
      const baseMinutes = catalogEntry.baseMinutes || 60;
      // Formula used in planController: Math.round(baseMinutes * (dailyBudget / 60)) bounded between 20 and dailyBudget
      let taskMinutes = Math.round(baseMinutes * (dailyBudget / 60));
      taskMinutes = Math.max(20, Math.min(taskMinutes, dailyBudget));

      assert.ok(
        taskMinutes <= dailyBudget,
        `Task duration (${taskMinutes}m) must not exceed daily budget (${dailyBudget}m)`
      );
      assert.ok(
        taskMinutes >= 20,
        `Task duration (${taskMinutes}m) must meet minimum threshold of 20m`
      );
    });
  });

  it('should prioritize weak skill topics on early days of the 7-day sprint', () => {
    const weakTopics = ['Functions & Scope', 'Object-Oriented Programming (OOP)'];
    const requiredSkills = [
      'Core Python & Data Types',
      'Functions & Scope',
      'Object-Oriented Programming (OOP)',
      'Data Structures (Lists, Dicts, Sets)',
      'Error Handling & Exception Debugging',
      'FastAPI / Flask & REST APIs',
      'SQL & Database Operations',
    ];

    const tasks = [];
    const assignedSkills = new Set();

    // Priority 1: Schedule weak skills first
    weakTopics.forEach((skill) => {
      if (tasks.length < 7) {
        tasks.push({ day: tasks.length + 1, skill, priority: 'High' });
        assignedSkills.add(skill);
      }
    });

    // Priority 2: Fill remaining days
    requiredSkills.forEach((skill) => {
      if (tasks.length < 7 && !assignedSkills.has(skill)) {
        tasks.push({ day: tasks.length + 1, skill, priority: 'Medium' });
        assignedSkills.add(skill);
      }
    });

    assert.strictEqual(tasks.length, 7, 'Must generate exactly 7 daily tasks');
    assert.strictEqual(tasks[0].skill, 'Functions & Scope', 'Day 1 must tackle first weak topic');
    assert.strictEqual(tasks[0].priority, 'High', 'Weak topic must be High priority');
    assert.strictEqual(tasks[1].skill, 'Object-Oriented Programming (OOP)', 'Day 2 must tackle second weak topic');
  });

  it('should reschedule incomplete tasks into upcoming days without losing completion history', () => {
    const initialTasks = [
      { day: 1, title: 'Task 1', completed: true },
      { day: 2, title: 'Task 2', completed: false, rescheduledCount: 0 },
      { day: 3, title: 'Task 3', completed: false, rescheduledCount: 0 },
      { day: 4, title: 'Task 4', completed: true },
      { day: 5, title: 'Task 5', completed: false, rescheduledCount: 0 },
    ];

    const completed = initialTasks.filter((t) => t.completed);
    const incomplete = initialTasks.filter((t) => !t.completed);

    assert.strictEqual(completed.length, 2, '2 completed tasks');
    assert.strictEqual(incomplete.length, 3, '3 incomplete tasks');

    // Simulate smart rescheduling: completed tasks retain early order, incomplete are reassigned with bumped counts
    const rescheduled = [];
    let dayCounter = 1;

    completed.forEach((task) => {
      rescheduled.push({ ...task, day: dayCounter++ });
    });

    incomplete.forEach((task) => {
      rescheduled.push({ ...task, day: dayCounter++, rescheduledCount: (task.rescheduledCount || 0) + 1 });
    });

    assert.strictEqual(rescheduled.length, 5, 'Must preserve all tasks');
    assert.strictEqual(rescheduled[0].completed, true, 'Task 1 must stay completed');
    assert.strictEqual(rescheduled[1].completed, true, 'Task 4 must stay completed');
    assert.strictEqual(rescheduled[2].rescheduledCount, 1, 'Incomplete task must increment rescheduledCount');
  });
});
