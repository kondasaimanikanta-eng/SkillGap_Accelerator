import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { planService } from '../services/api';

const LearningPlan = () => {
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rescheduling, setRescheduling] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'

  const fetchPlan = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      const res = await planService.getCurrentPlan();
      if (res.hasPlan) {
        setPlan(res.plan);
      } else {
        setPlan(null);
      }
    } catch (err) {
      console.error('Error fetching plan:', err);
      setPlan(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const handleToggleTask = async (taskId) => {
    try {
      setTogglingId(taskId);
      const res = await planService.toggleTask(taskId);
      // Update local state
      setPlan((prev) => {
        if (!prev) return prev;
        const updatedTasks = prev.tasks.map((t) =>
          t._id === taskId ? { ...t, completed: res.task.completed } : t
        );
        return {
          ...prev,
          tasks: updatedTasks,
          progressPercentage: res.progressPercentage,
          completedTasks: res.completedTasks,
          isCompleted: res.isCompleted,
        };
      });
      setMessage({
        type: 'success',
        text: res.message || 'Task status updated.',
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error('Error toggling task:', err);
      setMessage({ type: 'danger', text: 'Failed to update task status.' });
    } finally {
      setTogglingId(null);
    }
  };

  const handleReschedule = async () => {
    try {
      setRescheduling(true);
      const res = await planService.rescheduleTasks();
      setPlan(res.plan);
      setMessage({
        type: 'info',
        text: res.message || 'Incomplete tasks rescheduled.',
      });
    } catch (err) {
      console.error('Reschedule error:', err);
      setMessage({ type: 'danger', text: 'Failed to reschedule tasks.' });
    } finally {
      setRescheduling(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-2">Loading your 7-day action plan...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="container-fluid max-w-4xl px-0 text-center py-5" style={{ maxWidth: '720px' }}>
        <div className="card-saas p-5">
          <i className="bi bi-calendar-x text-muted display-4 mb-3"></i>
          <h1 className="h4 fw-bold">No Active Learning Plan</h1>
          <p className="text-muted small mb-4">
            You haven't generated a 7-day action plan yet. Complete the preliminary diagnostic assessment first so we can tailor tasks to your specific skill gaps.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/assessment" className="btn-primary-saas">
              Take Diagnostic Assessment <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const {
    role,
    dailyTimeMinutes,
    tasks = [],
    progressPercentage = 0,
    completedTasks = 0,
    totalTasks = 7,
    isCompleted,
  } = plan;

  const incompleteTasksCount = tasks.filter((t) => !t.completed).length;

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="container-fluid max-w-5xl px-0" style={{ maxWidth: '960px' }}>
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge badge-soft-primary">{role}</span>
            <span className="text-muted small">&bull; {dailyTimeMinutes} mins/day budget</span>
          </div>
          <h1 className="h3 fw-bold mb-0">Personalized 7-Day Action Plan</h1>
        </div>

        <div className="d-flex gap-2">
          {incompleteTasksCount > 0 && (
            <button
              onClick={handleReschedule}
              disabled={rescheduling}
              className="btn btn-outline-secondary btn-sm"
              title="Reschedules uncompleted tasks sequentially"
            >
              <i className="bi bi-arrow-repeat me-1"></i>
              {rescheduling ? 'Rescheduling...' : 'Reschedule Incomplete'}
            </button>
          )}

          <Link to="/assessment" className="btn btn-outline-primary btn-sm">
            <i className="bi bi-arrow-counterclockwise me-1"></i> Re-diagnose
          </Link>
        </div>
      </div>

      {message.text && (
        <div
          className={`alert alert-${message.type} alert-dismissible fade show rounded-3 small mb-4`}
          role="alert"
        >
          <i
            className={`bi ${
              message.type === 'success'
                ? 'bi-check-circle-fill'
                : 'bi-info-circle-fill'
            } me-2`}
          ></i>
          {message.text}
        </div>
      )}

      {/* Progress Overview Card */}
      <div className="card-saas p-4 mb-4">
        <div className="row align-items-center g-3">
          <div className="col-12 col-md-8">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="fw-bold small text-dark">
                Roadmap Progress: {completedTasks} of {totalTasks} Tasks Completed
              </span>
              <span className="fw-bold text-primary">{progressPercentage}%</span>
            </div>
            <div className="progress progress-saas mb-2">
              <div
                className="progress-bar"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-muted small mb-0">
              {progressPercentage === 100
                ? 'Congratulations! You have completed all 7 days of targeted preparation.'
                : `Complete each daily micro-task and mark it done to build verifiable competence.`}
            </p>
          </div>

          <div className="col-12 col-md-4 text-md-end">
            {progressPercentage === 100 ? (
              <Link to="/retest" className="btn btn-success fw-bold w-100 py-2">
                <i className="bi bi-award-fill me-1"></i> Take Retest Now!
              </Link>
            ) : (
              <div className="p-2 px-3 bg-light rounded-3 d-inline-block text-start">
                <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                  Next Target Milestone:
                </small>
                <strong className="text-dark small">
                  {incompleteTasksCount} task{incompleteTasksCount > 1 ? 's' : ''} left before Retest
                </strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="btn-group btn-group-sm" role="group">
          <button
            type="button"
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setFilter('all')}
          >
            All 7 Days ({tasks.length})
          </button>
          <button
            type="button"
            className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({incompleteTasksCount})
          </button>
          <button
            type="button"
            className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({completedTasks})
          </button>
        </div>

        <span className="text-muted small">
          Rule-based plan &bull; Official docs
        </span>
      </div>

      {/* 7 Daily Task Cards */}
      <div className="d-flex flex-column gap-3 mb-4">
        {filteredTasks.map((task) => {
          const isToggling = togglingId === task._id;
          return (
            <div
              key={task._id || task.day}
              className={`card-saas task-item p-4 ${
                task.completed ? 'completed' : ''
              }`}
            >
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-start gap-3">
                <div className="d-flex align-items-start gap-3 flex-grow-1">
                  {/* Task Checkbox Button */}
                  <button
                    onClick={() => handleToggleTask(task._id)}
                    disabled={isToggling}
                    className={`btn btn-sm rounded-circle d-flex align-items-center justify-content-center p-0 flex-shrink-0 mt-1 ${
                      task.completed
                        ? 'btn-success text-white'
                        : 'btn-outline-secondary'
                    }`}
                    style={{ width: '28px', height: '28px' }}
                    aria-label={`Mark Day ${task.day} complete`}
                  >
                    {isToggling ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      <i
                        className={`bi ${
                          task.completed ? 'bi-check-lg' : 'bi-circle'
                        }`}
                      ></i>
                    )}
                  </button>

                  <div className="flex-grow-1">
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                      <span className="badge bg-dark text-white fw-bold" style={{ fontSize: '0.72rem' }}>
                        Day {task.day}
                      </span>
                      <span className="badge badge-soft-primary" style={{ fontSize: '0.72rem' }}>
                        {task.skill}
                      </span>
                      <span className="badge bg-light text-muted border" style={{ fontSize: '0.72rem' }}>
                        <i className="bi bi-clock me-1"></i> {task.durationMinutes} mins
                      </span>
                      {task.rescheduledCount > 0 && (
                        <span className="badge badge-soft-warning" style={{ fontSize: '0.7rem' }}>
                          Rescheduled {task.rescheduledCount}x
                        </span>
                      )}
                    </div>

                    <h2 className="h6 fw-bold task-title mb-2 text-dark">
                      {task.title}
                    </h2>

                    <p className="text-muted small mb-3 lh-sm">
                      {task.instructions}
                    </p>

                    {/* Free Resource Link */}
                    {task.resourceLink && (
                      <div className="d-flex align-items-center gap-2">
                        <a
                          href={
                            task.resourceLink.startsWith('#')
                              ? task.resourceLink
                              : task.resourceLink
                          }
                          target={
                            task.resourceLink.startsWith('#') ? '_self' : '_blank'
                          }
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-primary py-1 px-2 d-inline-flex align-items-center gap-1 rounded-2"
                          style={{ fontSize: '0.8rem' }}
                        >
                          <i className="bi bi-box-arrow-up-right"></i>
                          <span>{task.resourceTitle || 'Free Learning Resource'}</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Toggle Button on right */}
                <div className="align-self-end align-self-sm-start text-end">
                  <button
                    onClick={() => handleToggleTask(task._id)}
                    disabled={isToggling}
                    className={`btn btn-sm ${
                      task.completed
                        ? 'btn-outline-secondary'
                        : 'btn-primary-saas'
                    } py-1 px-3`}
                    style={{ fontSize: '0.82rem' }}
                  >
                    {task.completed ? 'Mark Incomplete' : 'Mark Done'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Retest Promotion Callout */}
      <div className="card-saas p-4 p-md-5 text-center bg-light border">
        <i className="bi bi-award-fill text-warning display-5 mb-2"></i>
        <h2 className="h5 fw-bold mb-1">Verify Your Improvement with Retest</h2>
        <p className="text-muted small mb-3" style={{ maxWidth: '580px', margin: '0 auto' }}>
          After completing the daily tasks, take Retest Assessment (Set 2). The system will compare your scores, highlight improved topics, and reveal remaining gaps.
        </p>
        <Link to="/retest" className="btn-primary-saas mx-auto">
          Go to Progress & Retest Hub <i className="bi bi-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
};

export default LearningPlan;
