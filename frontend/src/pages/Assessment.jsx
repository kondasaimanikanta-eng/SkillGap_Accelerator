import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { assessmentService, profileService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Assessment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if retest was requested via query param (e.g. /assessment?set=2)
  const queryParams = new URLSearchParams(location.search);
  const requestedSet = parseInt(queryParams.get('set')) || 1;

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(
    user?.preferredRole || 'Frontend Developer Intern'
  );
  const [setNumber, setSetNumber] = useState(requestedSet);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: selectedAnswer }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch roles and load questions for selected role
  useEffect(() => {
    const initAssessment = async () => {
      try {
        setLoading(true);
        setError('');

        // Get roles list
        const rolesData = await assessmentService.getRoles();
        if (rolesData.roles) {
          setRoles(rolesData.roles);
        }

        // Determine effective role
        let roleToLoad = selectedRole;
        if (!roleToLoad) {
          try {
            const prof = await profileService.getProfile();
            if (prof.profile?.preferredRole) {
              roleToLoad = prof.profile.preferredRole;
              setSelectedRole(roleToLoad);
            }
          } catch {
            roleToLoad = 'Frontend Developer Intern';
            setSelectedRole(roleToLoad);
          }
        }

        // Fetch questions for role
        const qData = await assessmentService.getQuestions(roleToLoad, setNumber);
        if (qData.questions) {
          setQuestions(qData.questions);
          // Reset answers when question bank reloads
          setAnswers({});
          setCurrentIdx(0);
        }
      } catch (err) {
        console.error('Error loading questions:', err);
        setError('Failed to load assessment questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initAssessment();
  }, [selectedRole, setNumber]);

  const handleSelectOption = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleRoleChange = (newRole) => {
    if (
      Object.keys(answers).length > 0 &&
      !window.confirm(
        'Switching roles will reset your current unsubmitted answers. Proceed?'
      )
    ) {
      return;
    }
    setSelectedRole(newRole);
  };

  const handleSubmit = async () => {
    const totalQuestions = questions.length;
    const answeredCount = Object.keys(answers).length;

    if (answeredCount < totalQuestions) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredCount} of ${totalQuestions} questions. Are you sure you want to submit now?`
      );
      if (!confirmSubmit) return;
    }

    try {
      setSubmitting(true);
      setError('');

      // Format answers for backend evaluation
      const payloadAnswers = questions.map((q) => ({
        questionId: q.id,
        selectedAnswer: answers[q.id] || '',
      }));

      const res = await assessmentService.submitAssessment({
        role: selectedRole,
        setNumber,
        answers: payloadAnswers,
      });

      if (res.attempt?._id) {
        navigate(`/results/${res.attempt._id}`, {
          state: { isNewSubmission: true },
        });
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(
        err.response?.data?.message ||
          'Failed to submit assessment. Please check your network connection.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-2">Loading assessment questions...</p>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round(
    ((currentIdx + 1) / (questions.length || 1)) * 100
  );

  return (
    <div className="container-fluid max-w-4xl px-0" style={{ maxWidth: '860px' }}>
      {/* Assessment Header */}
      <div className="card-saas p-4 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge badge-soft-primary">
                {setNumber === 1 ? 'Diagnostic Assessment (Set 1)' : 'Retest Assessment (Set 2)'}
              </span>
              <span className="text-muted small">
                &bull; Practical &amp; Code Questions
              </span>
            </div>
            <h1 className="h4 fw-bold mb-0">
              Technical Skill Gap Diagnostic Analyzer
            </h1>
          </div>

          {/* Role selector dropdown */}
          <div className="d-flex align-items-center gap-2">
            <label htmlFor="roleSelect" className="small text-muted fw-semibold text-nowrap">
              Role:
            </label>
            <select
              id="roleSelect"
              className="form-select form-select-sm"
              value={selectedRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              style={{ minWidth: '220px' }}
            >
              {roles.map((r) => (
                <option key={r.id} value={r.title}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="alert alert-light border small text-muted mt-3 mb-0 py-2 px-3 rounded-3 d-flex align-items-center gap-2">
          <i className="bi bi-shield-exclamation text-warning fs-5"></i>
          <div>
            <strong>Preliminary Diagnostic Assessment:</strong> Intended for identifying knowledge gaps to generate your 7-day action plan. Not an official industry certification.
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger rounded-3 small mb-4" role="alert">
          {error}
        </div>
      )}

      {/* Main Question Card */}
      {currentQ && (
        <div className="card-saas p-4 p-md-5 mb-4 shadow-sm position-relative">
          {/* Progress Bar & Question Counter */}
          <div className="d-flex justify-content-between align-items-center text-muted small fw-semibold mb-2">
            <span>
              Question {currentIdx + 1} of {questions.length}
            </span>
            <span className="badge badge-soft-primary">
              Topic: {currentQ.topic}
            </span>
          </div>

          <div className="progress progress-saas mb-4">
            <div
              className="progress-bar"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {/* Question Type Badge */}
          <div className="mb-2">
            <span
              className={`badge ${
                currentQ.type === 'debugging'
                  ? 'badge-soft-danger'
                  : currentQ.type === 'output_prediction'
                  ? 'badge-soft-warning'
                  : 'badge-soft-primary'
              } small`}
            >
              <i
                className={`bi ${
                  currentQ.type === 'debugging'
                    ? 'bi-bug-fill'
                    : currentQ.type === 'output_prediction'
                    ? 'bi-terminal'
                    : 'bi-check2-square'
                } me-1`}
              ></i>
              {currentQ.type === 'debugging'
                ? 'Debugging Challenge'
                : currentQ.type === 'output_prediction'
                ? 'Output Prediction'
                : 'Multiple Choice'}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="h5 fw-bold mb-3 lh-base">{currentQ.question}</h2>

          {/* Code Snippet Box (if applicable) */}
          {currentQ.codeSnippet && (
            <div className="code-box">
              <pre className="m-0 text-wrap font-monospace">
                <code>{currentQ.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Interactive Options List */}
          <div className="d-flex flex-column gap-2 mt-3 mb-4">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = answers[currentQ.id] === option;
              return (
                <div
                  key={optIdx}
                  className={`option-card d-flex align-items-center gap-3 ${
                    isSelected ? 'selected' : ''
                  }`}
                  onClick={() => handleSelectOption(currentQ.id, option)}
                >
                  <div
                    className={`d-flex align-items-center justify-content-center rounded-circle border ${
                      isSelected
                        ? 'bg-primary border-primary text-white'
                        : 'border-secondary text-muted'
                    }`}
                    style={{
                      width: '24px',
                      height: '24px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      flexShrink: 0,
                    }}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </div>
                  <div className="fw-medium text-dark">{option}</div>
                </div>
              );
            })}
          </div>

          {/* Question Navigation Controls */}
          <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
            >
              <i className="bi bi-chevron-left me-1"></i> Previous
            </button>

            <span className="text-muted small">
              Answered: <strong>{answeredCount}</strong> / {questions.length}
            </span>

            {currentIdx < questions.length - 1 ? (
              <button
                type="button"
                className="btn-primary-saas btn-sm px-3"
                onClick={() =>
                  setCurrentIdx((prev) =>
                    Math.min(questions.length - 1, prev + 1)
                  )
                }
              >
                Next <i className="bi bi-chevron-right ms-1"></i>
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                className="btn btn-success btn-sm px-3 fw-bold"
                onClick={handleSubmit}
              >
                {submitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Evaluating...
                  </>
                ) : (
                  <>
                    Submit Assessment <i className="bi bi-send-fill ms-1"></i>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quick Jump Question Grid Palette */}
      <div className="card-saas p-3 mb-4">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="small text-muted fw-semibold">Quick Question Palette</span>
          <span className="small text-muted">{answeredCount} of {questions.length} answered</span>
        </div>
        <div className="d-flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const isAnswered = !!answers[q.id];
            const isCurrent = idx === currentIdx;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`btn btn-sm ${
                  isCurrent
                    ? 'btn-primary'
                    : isAnswered
                    ? 'btn-outline-primary border-primary bg-primary bg-opacity-10'
                    : 'btn-outline-secondary'
                }`}
                style={{ width: '38px', height: '38px', fontWeight: 600 }}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Assessment;
