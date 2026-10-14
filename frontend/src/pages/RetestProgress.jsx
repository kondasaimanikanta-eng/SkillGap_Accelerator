import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assessmentService, planService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const RetestProgress = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [comparison, setComparison] = useState(null);
  const [history, setHistory] = useState([]);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRetestData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch comparison data
        try {
          const compData = await assessmentService.getComparison(user?.preferredRole);
          setComparison(compData);
        } catch (err) {
          console.warn('Comparison fetch note:', err.message);
        }

        // Fetch attempt history
        const histData = await assessmentService.getHistory();
        if (histData.attempts) {
          setHistory(histData.attempts);
        }

        // Fetch plan progress
        try {
          const planData = await planService.getCurrentPlan();
          if (planData.hasPlan) {
            setPlan(planData.plan);
          }
        } catch {
          // No active plan
        }
      } catch (err) {
        console.error('Error loading retest progress:', err);
        setError('Failed to load progress data.');
      } finally {
        setLoading(false);
      }
    };

    loadRetestData();
  }, [user]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-2">Loading progress and comparison...</p>
      </div>
    );
  }

  const role = user?.preferredRole || comparison?.role || 'Internship Candidate';
  const attemptsCount = history.length;
  const canCompare = comparison?.canCompare || attemptsCount >= 2;

  return (
    <div className="container-fluid max-w-5xl px-0" style={{ maxWidth: '960px' }}>
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge badge-soft-primary">{role}</span>
            <span className="text-muted small">&bull; Verified Learning Measurement</span>
          </div>
          <h1 className="h3 fw-bold mb-0">Progress Tracking & Retest Analysis</h1>
        </div>

        <div className="d-flex gap-2">
          <Link
            to="/assessment?set=2"
            className="btn-primary-saas btn-sm text-nowrap"
          >
            <i className="bi bi-play-circle-fill"></i> Take Retest (Set 2)
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger rounded-3 small mb-4" role="alert">
          {error}
        </div>
      )}

      {/* Snapshot Cards */}
      <div className="row g-3 mb-4">
        {/* Total Attempts */}
        <div className="col-12 col-sm-6 col-md-3">
          <div className="card-saas p-4 h-100">
            <span className="text-muted small fw-semibold text-uppercase">
              Attempts Logged
            </span>
            <div className="h3 fw-bold mb-1 mt-2">{attemptsCount}</div>
            <small className="text-muted">
              {attemptsCount === 0
                ? 'No attempts yet'
                : attemptsCount === 1
                ? 'Initial diagnostic taken'
                : 'Initial & Retest logged'}
            </small>
          </div>
        </div>

        {/* 7-Day Plan Progress */}
        <div className="col-12 col-sm-6 col-md-3">
          <div className="card-saas p-4 h-100">
            <span className="text-muted small fw-semibold text-uppercase">
              Plan Progress
            </span>
            <div className="h3 fw-bold mb-1 mt-2">
              {plan ? `${plan.progressPercentage}%` : '0%'}
            </div>
            <small className="text-muted">
              {plan
                ? `${plan.completedTasks}/${plan.totalTasks} tasks completed`
                : 'Plan not generated'}
            </small>
          </div>
        </div>

        {/* Score Improvement */}
        <div className="col-12 col-sm-6 col-md-3">
          <div className="card-saas p-4 h-100">
            <span className="text-muted small fw-semibold text-uppercase">
              Score Improvement
            </span>
            <div className="h3 fw-bold mb-1 mt-2">
              {canCompare ? (
                <span
                  className={
                    comparison.scoreDifference >= 0
                      ? 'text-success'
                      : 'text-danger'
                  }
                >
                  {comparison.percentageChangeText}
                </span>
              ) : (
                <span className="text-muted">--</span>
              )}
            </div>
            <small className="text-muted">
              {canCompare ? 'Difference vs Attempt #1' : 'Requires Retest'}
            </small>
          </div>
        </div>

        {/* Improved Topics Count */}
        <div className="col-12 col-sm-6 col-md-3">
          <div className="card-saas p-4 h-100">
            <span className="text-muted small fw-semibold text-uppercase">
              Topics Mastered
            </span>
            <div className="h3 fw-bold mb-1 mt-2 text-primary">
              {canCompare ? comparison.topicsImproved?.length || 0 : '--'}
            </div>
            <small className="text-muted">
              {canCompare ? 'Gaps closed through plan' : 'Awaiting Retest'}
            </small>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      {canCompare ? (
        <div className="card-saas p-4 p-md-5 mb-4 shadow-sm border-0">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h4 fw-bold mb-1">
                Before & After Retest Performance
              </h2>
              <p className="text-muted small mb-0">
                Direct comparison between your initial diagnostic assessment and your subsequent retest.
              </p>
            </div>
            <span
              className={`badge py-2 px-3 fs-6 ${
                comparison.scoreDifference >= 0
                  ? 'bg-success'
                  : 'bg-warning text-dark'
              }`}
            >
              {comparison.percentageChangeText} Score Delta
            </span>
          </div>

          {/* Visual Score Comparison Bar */}
          <div className="row g-4 mb-4">
            {/* Initial Attempt */}
            <div className="col-12 col-md-6">
              <div className="p-4 rounded-3 border bg-light h-100">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-secondary text-white">
                    Initial Diagnostic (Attempt #{comparison.initialAttempt?.attemptNumber})
                  </span>
                  <small className="text-muted">
                    {new Date(comparison.initialAttempt?.date).toLocaleDateString()}
                  </small>
                </div>
                <div className="display-5 fw-bold text-dark mb-1">
                  {comparison.initialAttempt?.scorePercentage}%
                </div>
                <p className="text-muted small mb-3">
                  Score: {comparison.initialAttempt?.correctCount} / {comparison.initialAttempt?.totalQuestions} Correct
                </p>

                <div className="small">
                  <strong className="text-muted d-block mb-1">Weak Topics Identified:</strong>
                  {comparison.initialAttempt?.weakTopics?.length > 0 ? (
                    <div className="d-flex flex-wrap gap-1">
                      {comparison.initialAttempt.weakTopics.map((topic, i) => (
                        <span key={i} className="badge badge-soft-danger">
                          {topic}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-success">None</span>
                  )}
                </div>
              </div>
            </div>

            {/* Retest Attempt */}
            <div className="col-12 col-md-6">
              <div className="p-4 rounded-3 border bg-white border-primary shadow-sm h-100 position-relative">
                <span
                  className="position-absolute top-0 end-0 translate-middle badge rounded-pill bg-primary"
                  style={{ transform: 'translate(-10px, -10px)' }}
                >
                  Latest
                </span>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-primary text-white">
                    Retest Result (Attempt #{comparison.latestAttempt?.attemptNumber})
                  </span>
                  <small className="text-muted">
                    {new Date(comparison.latestAttempt?.date).toLocaleDateString()}
                  </small>
                </div>
                <div className="display-5 fw-bold text-primary mb-1">
                  {comparison.latestAttempt?.scorePercentage}%
                </div>
                <p className="text-muted small mb-3">
                  Score: {comparison.latestAttempt?.correctCount} / {comparison.latestAttempt?.totalQuestions} Correct
                </p>

                <div className="small">
                  <strong className="text-muted d-block mb-1">Current Skill Status:</strong>
                  {comparison.latestAttempt?.weakTopics?.length > 0 ? (
                    <div className="d-flex flex-wrap gap-1">
                      {comparison.latestAttempt.weakTopics.map((topic, i) => (
                        <span key={i} className="badge badge-soft-danger">
                          {topic}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="badge badge-soft-success">
                      <i className="bi bi-check2 me-1"></i> All Identified Topics Mastered!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Topics Improved & Remaining Gaps */}
          <div className="row g-4 pt-3 border-top">
            <div className="col-12 col-md-6">
              <h3 className="h6 fw-bold text-success text-uppercase mb-2">
                <i className="bi bi-trophy-fill me-1"></i> Topics Improved Through 7-Day Plan
              </h3>
              {comparison.topicsImproved?.length > 0 ? (
                <ul className="list-group list-group-flush small">
                  {comparison.topicsImproved.map((topic, i) => (
                    <li key={i} className="list-group-item px-0 py-2 d-flex align-items-center gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      <span className="fw-medium text-dark">{topic}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted small mb-0">
                  Scores remained consistent across topics.
                </p>
              )}
            </div>

            <div className="col-12 col-md-6">
              <h3 className="h6 fw-bold text-secondary text-uppercase mb-2">
                <i className="bi bi-exclamation-circle-fill me-1 text-warning"></i> Remaining Focus Areas
              </h3>
              {comparison.remainingWeakTopics?.length > 0 ? (
                <ul className="list-group list-group-flush small">
                  {comparison.remainingWeakTopics.map((topic, i) => (
                    <li key={i} className="list-group-item px-0 py-2 d-flex align-items-center gap-2">
                      <i className="bi bi-arrow-right-circle text-warning"></i>
                      <span className="fw-medium text-dark">{topic}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-success small mb-0 fw-semibold">
                  <i className="bi bi-stars me-1"></i> Zero remaining gaps! Fully prepared for internship screening.
                </p>
              )}
            </div>
          </div>

          {/* Next Recommended Practice Tasks */}
          <div className="mt-4 pt-3 border-top">
            <h3 className="h6 fw-bold text-uppercase text-secondary mb-2">
              Recommended Next Practice Steps:
            </h3>
            <div className="d-flex flex-column gap-2">
              {comparison.recommendedNextSteps?.map((step, i) => (
                <div key={i} className="d-flex align-items-start gap-2 small">
                  <i className="bi bi-compass-fill text-primary mt-1"></i>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* If only 1 attempt or none */
        <div className="card-saas p-4 p-md-5 mb-4 text-center">
          <div className="display-4 text-warning mb-3">
            <i className="bi bi-hourglass-split"></i>
          </div>
          <h2 className="h4 fw-bold mb-2">Retest Awaiting You</h2>
          <p className="text-muted small mb-4" style={{ maxWidth: '580px', margin: '0 auto' }}>
            {attemptsCount === 1
              ? 'You have completed your initial diagnostic assessment. Work through your 7-day action plan, then take the Retest (Set 2) to measure your improvement!'
              : 'Complete your first diagnostic assessment to begin your roadmap.'}
          </p>
          <div className="d-flex justify-content-center gap-3">
            {attemptsCount === 1 ? (
              <>
                <Link to="/assessment?set=2" className="btn-primary-saas">
                  Take Retest Assessment Now <i className="bi bi-arrow-right"></i>
                </Link>
                <Link to="/plan" className="btn-outline-saas">
                  View 7-Day Plan
                </Link>
              </>
            ) : (
              <Link to="/assessment" className="btn-primary-saas">
                Take Diagnostic Assessment <i className="bi bi-arrow-right"></i>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Historical Attempts Table */}
      <div className="card-saas p-4">
        <h2 className="h5 fw-bold mb-3 d-flex align-items-center gap-2">
          <i className="bi bi-clock-history text-secondary"></i>
          Assessment Attempt History
        </h2>

        {history.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th>Attempt</th>
                  <th>Role</th>
                  <th>Set</th>
                  <th>Score</th>
                  <th>Gaps Found</th>
                  <th>Date</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map((att) => (
                  <tr key={att._id}>
                    <td>
                      <span className="fw-bold">#{att.attemptNumber}</span>
                    </td>
                    <td>{att.role}</td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        Set {att.setNumber}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`fw-bold ${
                          att.scorePercentage >= 70
                            ? 'text-success'
                            : 'text-warning'
                        }`}
                      >
                        {att.scorePercentage}%
                      </span>
                      <span className="text-muted ms-1">
                        ({att.correctCount}/{att.totalQuestions})
                      </span>
                    </td>
                    <td>
                      {att.weakTopics?.length > 0 ? (
                        <span className="badge badge-soft-danger">
                          {att.weakTopics.length} Gaps
                        </span>
                      ) : (
                        <span className="badge badge-soft-success">None</span>
                      )}
                    </td>
                    <td className="text-muted">
                      {new Date(att.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-end">
                      <Link
                        to={`/results/${att._id}`}
                        className="btn btn-sm btn-outline-primary py-0 px-2"
                      >
                        View Results
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted small mb-0">No attempts recorded yet.</p>
        )}
      </div>
    </div>
  );
};

export default RetestProgress;
