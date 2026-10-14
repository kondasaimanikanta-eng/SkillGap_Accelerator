import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardService, planService, assessmentService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('gaps'); // 'gaps', 'tasks', 'benchmarks', 'internship'
  const [allRoles, setAllRoles] = useState([]);
  const [planTasks, setPlanTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [taskTogglingId, setTaskTogglingId] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [dashData, rolesData, currentPlanData] = await Promise.all([
          dashboardService.getStats(),
          assessmentService.getRoles().catch(() => ({ roles: [] })),
          planService.getCurrentPlan().catch(() => ({ hasPlan: false })),
        ]);
        setStats(dashData);
        if (rolesData.roles) setAllRoles(rolesData.roles);
        if (currentPlanData.hasPlan && currentPlanData.plan?.tasks) {
          setPlanTasks(currentPlanData.plan.tasks);
        }
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        setError('Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleToggleTaskInDashboard = async (taskId) => {
    try {
      setTaskTogglingId(taskId);
      const res = await planService.toggleTask(taskId);
      setPlanTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, completed: res.task.completed } : t))
      );
      // Refresh dashboard stats to keep progress percentage accurate
      const updatedStats = await dashboardService.getStats();
      setStats(updatedStats);
    } catch (err) {
      console.error('Failed to toggle task:', err);
    } finally {
      setTaskTogglingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container-xl text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-2 fw-semibold">Loading your career skill dashboard...</p>
      </div>
    );
  }

  const {
    selectedRole = 'Frontend Engineer',
    studentName,
    dailyTimeMinutes = 60,
    latestAssessment,
    totalAttempts = 0,
    weakestSkills = [],
    strongSkills = [],
    learningPlanProgress = {},
    nextStep,
    nextStepMessage,
  } = stats || {};

  const currentRoleMeta = allRoles.find((r) => r.title === selectedRole) || {};
  const benchmarkScore = currentRoleMeta.benchmarkPassingScore || 75;
  const currentScore = latestAssessment ? latestAssessment.scorePercentage : null;
  const isPassing = currentScore !== null && currentScore >= benchmarkScore;

  return (
    <div className="container-xl py-2">
      {/* Colorful Gradient Hero Banner */}
      <div
        className="card-saas p-4 p-md-5 mb-4 text-white position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 35%, #4338ca 75%, #0891b2 100%)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        <div className="row align-items-center">
          <div className="col-12 col-lg-8">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
              <span className="badge bg-white text-primary fw-bold px-3 py-1 rounded-pill small">
                <i className="bi bi-crosshair me-1"></i> Technical Skill Gap to Action
              </span>
              <span className="badge bg-info bg-opacity-25 text-white border border-info border-opacity-50 px-2 py-1 rounded-pill small">
                Target: {selectedRole}
              </span>
              <span className="badge bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 px-2 py-1 rounded-pill small">
                ⚡ {dailyTimeMinutes}m / day budget
              </span>
            </div>

            <h1 className="h2 fw-bold text-white mb-2">
              Welcome back, {studentName || user?.name || 'Engineer'}!
            </h1>
            <p className="text-light opacity-90 mb-4" style={{ maxWidth: '640px' }}>
              Pinpoint precise knowledge gaps with micro-diagnostics, execute your daily 7-day action sprint, and verify score improvements.
            </p>

            {/* Next Action Alert Bar */}
            <div className="p-3 bg-white bg-opacity-10 rounded-3 border border-white border-opacity-20 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-lightning-charge-fill text-warning fs-5"></i>
                <span className="small text-white fw-medium">{nextStepMessage}</span>
              </div>
              <div>
                {nextStep === 'assessment' && (
                  <Link to="/assessment" className="btn btn-warning btn-sm fw-bold px-3 text-nowrap">
                    Take Diagnostic <i className="bi bi-arrow-right"></i>
                  </Link>
                )}
                {nextStep === 'plan' && (
                  <Link to="/plan" className="btn btn-light btn-sm fw-bold px-3 text-nowrap text-primary">
                    Generate 7-Day Plan <i className="bi bi-arrow-right"></i>
                  </Link>
                )}
                {nextStep === 'tasks' && (
                  <Link to="/plan" className="btn btn-success btn-sm fw-bold px-3 text-nowrap">
                    Resume Action Plan <i className="bi bi-arrow-right"></i>
                  </Link>
                )}
                {nextStep === 'retest' && (
                  <Link to="/retest" className="btn btn-warning btn-sm fw-bold px-3 text-nowrap">
                    Take Retest Verification <i className="bi bi-arrow-right"></i>
                  </Link>
                )}
                {nextStep === 'completed' && (
                  <Link to="/retest" className="btn btn-info btn-sm fw-bold px-3 text-nowrap text-white">
                    View Score Growth <i className="bi bi-arrow-right"></i>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Right Hero Readiness Card */}
          <div className="col-12 col-lg-4 text-center text-lg-end mt-4 mt-lg-0">
            <div className="p-4 bg-white bg-opacity-10 rounded-4 d-inline-block text-start border border-white border-opacity-20" style={{ minWidth: '240px' }}>
              <div className="small text-uppercase text-white-50 fw-semibold mb-1">
                Diagnostic Mastery
              </div>
              <div className="d-flex align-items-baseline gap-2 mb-1">
                <span className="display-5 fw-bold text-white">
                  {currentScore !== null ? `${currentScore}%` : 'Pending'}
                </span>
                {currentScore !== null && (
                  <span className={`badge ${isPassing ? 'bg-success' : 'bg-warning text-dark'} small`}>
                    {isPassing ? 'Benchmarked' : `Target: ${benchmarkScore}%`}
                  </span>
                )}
              </div>
              <div className="progress progress-saas mb-2" style={{ height: '7px' }}>
                <div
                  className="progress-bar"
                  style={{
                    width: `${currentScore || 0}%`,
                    background: isPassing ? '#10b981' : '#f59e0b',
                  }}
                ></div>
              </div>
              <small className="text-light opacity-75">
                {latestAssessment
                  ? `Attempt #${latestAssessment.attemptNumber} (${latestAssessment.correctCount}/${latestAssessment.totalQuestions} questions)`
                  : 'Diagnostic assessment not yet logged'}
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

      {/* 4 Colorful KPI Metric Cards */}
      <div className="row g-3 mb-4">
        {/* Metric 1: Benchmark Score (Indigo) */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card-saas card-stat-indigo p-3 h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted small fw-semibold text-uppercase">Diagnostic Score</span>
              <div className="icon-bubble icon-bubble-indigo">
                <i className="bi bi-bullseye"></i>
              </div>
            </div>
            <div className="h3 fw-bold mb-1 text-dark">
              {currentScore !== null ? `${currentScore}%` : 'Not Taken'}
            </div>
            <p className="text-muted small mb-0">
              {latestAssessment
                ? `Benchmark: ${benchmarkScore}% (${isPassing ? 'Achieved' : 'Action plan needed'})`
                : 'Click to launch diagnostic'}
            </p>
          </div>
        </div>

        {/* Metric 2: Weak Skills Identified (Amber) */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card-saas card-stat-amber p-3 h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted small fw-semibold text-uppercase">Identified Gaps</span>
              <div className="icon-bubble icon-bubble-amber">
                <i className="bi bi-exclamation-triangle"></i>
              </div>
            </div>
            <div className="h3 fw-bold mb-1 text-dark">
              {weakestSkills.length} <span className="fs-6 fw-normal text-muted">topics</span>
            </div>
            <p className="text-muted small mb-0">
              {weakestSkills.length > 0
                ? `${weakestSkills.length} priorities assigned to 7-day plan`
                : 'Zero gaps detected'}
            </p>
          </div>
        </div>

        {/* Metric 3: Action Plan Tasks (Emerald) */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card-saas card-stat-emerald p-3 h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted small fw-semibold text-uppercase">Plan Completion</span>
              <div className="icon-bubble icon-bubble-emerald">
                <i className="bi bi-check2-circle"></i>
              </div>
            </div>
            <div className="h3 fw-bold mb-1 text-dark">
              {learningPlanProgress.completedTasks || 0} / {learningPlanProgress.totalTasks || 7}
            </div>
            <div className="progress progress-saas mt-2 mb-1" style={{ height: '6px' }}>
              <div
                className="progress-bar bg-success"
                style={{ width: `${learningPlanProgress.progressPercentage || 0}%` }}
              ></div>
            </div>
            <p className="text-muted small mb-0">
              {learningPlanProgress.progressPercentage || 0}% of 7-day action sprint done
            </p>
          </div>
        </div>

        {/* Metric 4: Retest Attempts & Growth (Purple) */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card-saas card-stat-purple p-3 h-100">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted small fw-semibold text-uppercase">Attempts & Retest</span>
              <div className="icon-bubble icon-bubble-purple">
                <i className="bi bi-graph-up-arrow"></i>
              </div>
            </div>
            <div className="h3 fw-bold mb-1 text-dark">{totalAttempts}</div>
            <p className="text-muted small mb-0">
              {totalAttempts >= 2
                ? 'Retest verified & score jump recorded'
                : 'Retest unlocked after completing tasks'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Tabs Header */}
      <div className="card-saas p-2 mb-4 bg-light border">
        <div className="d-flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('gaps')}
            className={`interactive-tab-btn ${activeTab === 'gaps' ? 'active' : ''}`}
          >
            <i className="bi bi-diagram-3-fill me-1 text-danger"></i>
            Skill Gap Breakdown ({weakestSkills.length})
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`interactive-tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          >
            <i className="bi bi-list-check me-1 text-success"></i>
            Today's Action Tasks ({planTasks.filter((t) => !t.completed).length} pending)
          </button>
          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`interactive-tab-btn ${activeTab === 'benchmarks' ? 'active' : ''}`}
          >
            <i className="bi bi-shield-check me-1 text-primary"></i>
            Career Role Benchmarks
          </button>
          <button
            onClick={() => setActiveTab('internship')}
            className={`interactive-tab-btn ${activeTab === 'internship' ? 'active' : ''}`}
          >
            <i className="bi bi-mortarboard-fill me-1 text-warning"></i>
            Internship Hub Spotlight
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: SKILL GAPS */}
      {activeTab === 'gaps' && (
        <div className="card-saas p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <div>
              <h2 className="h5 fw-bold mb-1">
                <i className="bi bi-exclamation-circle-fill text-danger me-2"></i>
                Identified Skill Gaps for {selectedRole}
              </h2>
              <p className="text-muted small mb-0">
                These topics directly caused lost points on your diagnostic assessment.
              </p>
            </div>
            {latestAssessment && (
              <Link to="/results" className="btn btn-outline-saas btn-sm">
                Full Results Review <i className="bi bi-arrow-right"></i>
              </Link>
            )}
          </div>

          {weakestSkills.length > 0 ? (
            <div className="row g-3">
              {weakestSkills.map((skill, idx) => (
                <div key={idx} className="col-12 col-md-6">
                  <div className="p-3 rounded-3 border bg-light h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <span className="badge bg-danger bg-opacity-10 text-danger fw-bold small">
                          Priority Gap #{idx + 1}
                        </span>
                        <span className="badge bg-secondary bg-opacity-10 text-secondary small">
                          Day {idx + 1} in Action Plan
                        </span>
                      </div>
                      <h3 className="h6 fw-bold text-dark mb-1">{skill}</h3>
                      <p className="text-muted small mb-3">
                        Targeted in your 7-day personalized micro-tasks with free official documentation and code drills.
                      </p>
                    </div>
                    <div className="d-flex gap-2">
                      <Link to="/plan" className="btn btn-primary-saas btn-sm py-1 px-3">
                        <i className="bi bi-play-circle"></i> Start Micro-Task
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="icon-bubble icon-bubble-emerald mx-auto mb-3">
                <i className="bi bi-check-lg fs-3"></i>
              </div>
              <h3 className="h5 fw-bold">No High Priority Skill Gaps Detected!</h3>
              <p className="text-muted small mb-3" style={{ maxWidth: '480px', margin: '0 auto' }}>
                You have passed all benchmark diagnostic questions for your role, or haven't taken the assessment yet.
              </p>
              <Link to="/assessment" className="btn btn-primary-saas">
                Launch Diagnostic Assessment <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 2: TODAY'S ACTION TASKS (Interactive in dashboard) */}
      {activeTab === 'tasks' && (
        <div className="card-saas p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <div>
              <h2 className="h5 fw-bold mb-1">
                <i className="bi bi-check2-all text-success me-2"></i>
                Interactive 7-Day Sprint Checklist
              </h2>
              <p className="text-muted small mb-0">
                You can mark micro-tasks complete directly from here without leaving the dashboard.
              </p>
            </div>
            <Link to="/plan" className="btn btn-outline-saas btn-sm">
              Full Plan View <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          {planTasks.length > 0 ? (
            <div className="d-flex flex-column gap-2">
              {planTasks.map((t) => (
                <div
                  key={t._id}
                  className={`p-3 rounded-3 border d-flex align-items-center justify-content-between ${
                    t.completed ? 'bg-light text-muted' : 'bg-white'
                  }`}
                  style={{
                    borderLeft: t.completed ? '4px solid #10b981' : '4px solid #4f46e5',
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <input
                      type="checkbox"
                      className="form-check-input mt-0"
                      checked={t.completed}
                      disabled={taskTogglingId === t._id}
                      onChange={() => handleToggleTaskInDashboard(t._id)}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-primary bg-opacity-10 text-primary small fw-semibold">
                          Day {t.dayNumber}
                        </span>
                        <strong className={`small ${t.completed ? 'text-decoration-line-through text-muted' : 'text-dark'}`}>
                          {t.title}
                        </strong>
                      </div>
                      <div className="text-muted small">
                        Skill: <strong>{t.skillName}</strong> &bull; Duration: {t.durationMinutes} mins
                      </div>
                    </div>
                  </div>

                  <div>
                    {t.resourceLink && (
                      <a
                        href={t.resourceLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-outline-secondary py-1 px-2"
                        title={t.resourceTitle}
                      >
                        <i className="bi bi-box-arrow-up-right me-1"></i> Docs
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-calendar-x fs-1 text-muted mb-2 d-block"></i>
              <h3 className="h6 fw-bold">No Active Action Plan</h3>
              <p className="text-muted small mb-3">
                Complete your diagnostic assessment to automatically generate your 7-day personalized micro-sprint.
              </p>
              <Link to="/assessment" className="btn btn-primary-saas">
                Take Diagnostic Now
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 3: CAREER ROLE BENCHMARKS */}
      {activeTab === 'benchmarks' && (
        <div className="card-saas p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <div>
              <h2 className="h5 fw-bold mb-1">
                <i className="bi bi-award-fill text-primary me-2"></i>
                Technical Benchmarks by Career Track
              </h2>
              <p className="text-muted small mb-0">
                Industry standards required to clear technical screenings.
              </p>
            </div>
            <Link to="/profile" className="btn btn-outline-saas btn-sm">
              Change Target Track <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="row g-3">
            {allRoles.map((role) => (
              <div key={role.id} className="col-12 col-md-6">
                <div
                  className={`p-3 rounded-3 border h-100 ${
                    role.title === selectedRole ? 'border-primary bg-primary bg-opacity-10' : 'bg-light'
                  }`}
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <i className={`bi ${role.icon} fs-4 text-primary`}></i>
                      <div>
                        <h3 className="h6 fw-bold text-dark mb-0">{role.title}</h3>
                        <span className="badge bg-secondary bg-opacity-10 text-secondary small">
                          {role.category || 'Career Track'}
                        </span>
                      </div>
                    </div>
                    <span className="badge bg-success small">
                      Benchmark: {role.benchmarkPassingScore}%
                    </span>
                  </div>
                  <p className="text-muted small mb-2">{role.description}</p>
                  <div className="d-flex flex-wrap gap-1">
                    {role.requiredSkills.slice(0, 4).map((s, i) => (
                      <span key={i} className="badge bg-white text-dark border small">
                        {s}
                      </span>
                    ))}
                    {role.requiredSkills.length > 4 && (
                      <span className="badge bg-white text-muted border small">
                        +{role.requiredSkills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: INTERNSHIP SPOTLIGHT */}
      {activeTab === 'internship' && (
        <div className="card-saas p-4 mb-4 bg-light border">
          <div className="row align-items-center">
            <div className="col-12 col-lg-8">
              <span className="badge bg-warning text-dark fw-bold mb-2 px-3 py-1 rounded-pill small">
                🎓 Dedicated Module Available
              </span>
              <h2 className="h4 fw-bold text-dark mb-2">
                Looking for College & Campus Placement Internships?
              </h2>
              <p className="text-muted small mb-3">
                We maintain an independent, dedicated <strong>Internship Module</strong> with campus-to-corporate readiness checklists, top screening round question drills, and interview preparation guides.
              </p>
              <div className="d-flex gap-2">
                <Link to="/internship" className="btn btn-primary-saas">
                  Launch Internship Module <i className="bi bi-arrow-right"></i>
                </Link>
                <Link to="/assessment?role=Frontend%20Developer%20Intern" className="btn btn-outline-saas">
                  Take Frontend Intern Diagnostic
                </Link>
              </div>
            </div>
            <div className="col-12 col-lg-4 mt-3 mt-lg-0 text-center">
              <div className="p-3 bg-white rounded-3 border d-inline-block shadow-sm">
                <i className="bi bi-mortarboard-fill text-warning fs-1 d-block mb-1"></i>
                <strong className="text-dark d-block">Campus Placement Ready</strong>
                <small className="text-muted">Over 25 high-frequency screening drills</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
