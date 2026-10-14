import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        setError('Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-2">Loading your internship progress...</p>
      </div>
    );
  }

  const {
    selectedRole,
    studentName,
    college,
    degree,
    branch,
    dailyTimeMinutes,
    latestAssessment,
    totalAttempts,
    weakestSkills = [],
    strongSkills = [],
    learningPlanProgress = {},
    nextStep,
    nextStepMessage,
  } = stats || {};

  return (
    <div className="container-fluid max-w-7xl px-0">
      {/* Welcome Hero Banner */}
      <div
        className="card-saas p-4 p-md-5 mb-4 text-white position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
          border: 'none',
        }}
      >
        <div className="row align-items-center position-relative" style={{ zIndex: 1 }}>
          <div className="col-12 col-lg-8">
            <span className="badge bg-white text-primary fw-bold mb-3 px-3 py-1 rounded-pill small">
              College Internship Readiness Dashboard
            </span>
            <h1 className="h2 fw-bold text-white mb-2">
              Welcome back, {studentName || user?.name}!
            </h1>
            <p className="text-light opacity-75 mb-3" style={{ maxWidth: '600px' }}>
              Target Role: <strong className="text-white">{selectedRole}</strong> &bull;{' '}
              {college || 'Campus Prep'} &bull; {dailyTimeMinutes}m / day budget
            </p>

            {/* Dynamic Next Step Alert Bar */}
            <div className="p-3 bg-white bg-opacity-10 rounded-3 border border-white border-opacity-20 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-info-circle-fill text-warning fs-5"></i>
                <span className="small text-white fw-medium">{nextStepMessage}</span>
              </div>
              {nextStep === 'assessment' && (
                <Link to="/assessment" className="btn btn-warning btn-sm fw-bold px-3 text-nowrap">
                  Take Assessment <i className="bi bi-arrow-right"></i>
                </Link>
              )}
              {nextStep === 'plan' && (
                <Link to="/plan" className="btn btn-primary btn-sm fw-bold px-3 text-nowrap bg-white text-primary border-0">
                  Generate 7-Day Plan <i className="bi bi-arrow-right"></i>
                </Link>
              )}
              {nextStep === 'tasks' && (
                <Link to="/plan" className="btn btn-success btn-sm fw-bold px-3 text-nowrap">
                  Continue Day Plan <i className="bi bi-arrow-right"></i>
                </Link>
              )}
              {nextStep === 'retest' && (
                <Link to="/retest" className="btn btn-warning btn-sm fw-bold px-3 text-nowrap">
                  Take Retest Now <i className="bi bi-arrow-right"></i>
                </Link>
              )}
              {nextStep === 'completed' && (
                <Link to="/retest" className="btn btn-info btn-sm fw-bold px-3 text-nowrap text-white">
                  View Retest Comparison <i className="bi bi-arrow-right"></i>
                </Link>
              )}
            </div>
          </div>

          <div className="col-12 col-lg-4 text-center text-lg-end mt-4 mt-lg-0 d-none d-lg-block">
            <div className="p-3 bg-white bg-opacity-10 rounded-4 d-inline-block text-center border border-white border-opacity-15">
              <div className="small text-uppercase opacity-75 fw-semibold mb-1">
                Assessment Status
              </div>
              <div className="display-6 fw-bold text-white mb-0">
                {latestAssessment ? `${latestAssessment.scorePercentage}%` : 'Not Taken'}
              </div>
              <small className="text-light opacity-75">
                {latestAssessment ? `Score (${latestAssessment.correctCount}/${latestAssessment.totalQuestions})` : 'Diagnostic Pending'}
              </small>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger rounded-3 small mb-4" role="alert">
          {error}
        </div>
      )}

      {/* 4 Metric Stats Cards */}
      <div className="row g-3 mb-4">
        {/* Metric 1: Latest Score */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card-saas p-4 h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted small fw-semibold text-uppercase">
                Assessment Score
              </span>
              <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                <i className="bi bi-clipboard-data-fill fs-5"></i>
              </div>
            </div>
            <div className="h3 fw-bold mb-1">
              {latestAssessment ? `${latestAssessment.scorePercentage}%` : 'Pending'}
            </div>
            <p className="text-muted small mb-0">
              {latestAssessment
                ? `Attempt #${latestAssessment.attemptNumber} completed`
                : 'Take your diagnostic quiz'}
            </p>
          </div>
        </div>

        {/* Metric 2: Completed Tasks */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card-saas p-4 h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted small fw-semibold text-uppercase">
                Tasks Completed
              </span>
              <div className="p-2 rounded-3 bg-success bg-opacity-10 text-success">
                <i className="bi bi-check2-circle fs-5"></i>
              </div>
            </div>
            <div className="h3 fw-bold mb-1">
              {learningPlanProgress.completedTasks || 0} / {learningPlanProgress.totalTasks || 7}
            </div>
            <p className="text-muted small mb-0">
              {learningPlanProgress.remainingTasks || 0} tasks remaining
            </p>
          </div>
        </div>

        {/* Metric 3: 7-Day Plan Progress */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card-saas p-4 h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted small fw-semibold text-uppercase">
                Plan Progress
              </span>
              <div className="p-2 rounded-3 bg-info bg-opacity-10 text-info">
                <i className="bi bi-bar-chart-steps fs-5"></i>
              </div>
            </div>
            <div className="h3 fw-bold mb-1">
              {learningPlanProgress.progressPercentage || 0}%
            </div>
            <div className="progress progress-saas mt-2">
              <div
                className="progress-bar"
                style={{ width: `${learningPlanProgress.progressPercentage || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Metric 4: Retest / Attempts */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card-saas p-4 h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted small fw-semibold text-uppercase">
                Attempts Logged
              </span>
              <div className="p-2 rounded-3 bg-warning bg-opacity-10 text-warning">
                <i className="bi bi-arrow-repeat fs-5"></i>
              </div>
            </div>
            <div className="h3 fw-bold mb-1">{totalAttempts || 0}</div>
            <p className="text-muted small mb-0">
              {totalAttempts >= 2 ? 'Retest completed' : 'Retest after plan'}
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Section: Weak Skills & Roadmap Action */}
      <div className="row g-4 mb-4">
        {/* Left Column: Weak Skills & Identified Gaps */}
        <div className="col-12 col-lg-7">
          <div className="card-saas p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 fw-bold mb-0">
                <i className="bi bi-bullseye text-danger me-2"></i>
                Identified Skill Gaps
              </h2>
              {latestAssessment && (
                <Link to="/results" className="text-primary text-decoration-none small fw-semibold">
                  View Full Breakdown <i className="bi bi-arrow-right"></i>
                </Link>
              )}
            </div>

            {weakestSkills.length > 0 ? (
              <div>
                <p className="text-muted small mb-3">
                  Based on your latest assessment, these topics showed incorrect answers and represent high-priority practice areas:
                </p>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {weakestSkills.map((skill, idx) => (
                    <span key={idx} className="badge badge-soft-danger py-2 px-3">
                      <i className="bi bi-exclamation-circle me-1"></i> {skill}
                    </span>
                  ))}
                </div>

                {strongSkills.length > 0 && (
                  <div className="mt-4 pt-3 border-top">
                    <h3 className="h6 fw-semibold text-muted text-uppercase small mb-2">
                      Strong Topics Already Mastered:
                    </h3>
                    <div className="d-flex flex-wrap gap-2">
                      {strongSkills.map((skill, idx) => (
                        <span key={idx} className="badge badge-soft-success py-1 px-2 small">
                          <i className="bi bi-check-circle me-1"></i> {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : latestAssessment ? (
              <div className="text-center py-4">
                <div className="text-success display-6 mb-2">
                  <i className="bi bi-patch-check-fill"></i>
                </div>
                <h3 className="h5 fw-bold">No Critical Gaps Detected!</h3>
                <p className="text-muted small mb-0">
                  You scored exceptionally well across all tested topics for {selectedRole}.
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-muted display-6 mb-2">
                  <i className="bi bi-clipboard2-check"></i>
                </div>
                <h3 className="h6 fw-bold">Assessment Not Taken Yet</h3>
                <p className="text-muted small mb-3">
                  Take the diagnostic assessment to reveal which topics need practice for your internship.
                </p>
                <Link to="/assessment" className="btn-primary-saas btn-sm">
                  Start Assessment
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 7-Day Plan Snapshot & Retest */}
        <div className="col-12 col-lg-5">
          <div className="card-saas p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 fw-bold mb-0">
                  <i className="bi bi-calendar2-range text-primary me-2"></i>
                  Action Plan Roadmap
                </h2>
                <Link to="/plan" className="text-primary text-decoration-none small fw-semibold">
                  Open Plan <i className="bi bi-arrow-right"></i>
                </Link>
              </div>

              <div className="p-3 bg-light rounded-3 mb-3">
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Weekly Plan Completion</span>
                  <span className="fw-bold text-dark">{learningPlanProgress.progressPercentage || 0}%</span>
                </div>
                <div className="progress progress-saas">
                  <div
                    className="progress-bar"
                    style={{ width: `${learningPlanProgress.progressPercentage || 0}%` }}
                  ></div>
                </div>
              </div>

              <ul className="list-unstyled small mb-4">
                <li className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <span>Personalized 7 daily micro-tasks tailored to your gaps</span>
                </li>
                <li className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <span>Official documentation & proven free resources</span>
                </li>
                <li className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-check-circle-fill text-success"></i>
                  <span>Retest module to quantify improvement before applying</span>
                </li>
              </ul>
            </div>

            <div className="d-grid gap-2">
              <Link to="/plan" className="btn-primary-saas w-100">
                <i className="bi bi-list-task"></i> Manage 7-Day Learning Plan
              </Link>
              <Link to="/retest" className="btn-outline-saas w-100 justify-content-center">
                <i className="bi bi-arrow-repeat"></i> Go to Progress & Retest
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
