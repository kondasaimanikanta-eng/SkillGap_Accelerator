import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { assessmentService, planService } from '../services/api';

const Results = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [error, setError] = useState('');
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError('');

        if (attemptId) {
          const res = await assessmentService.getAttemptById(attemptId);
          setAttempt(res.attempt);
        } else {
          // Fetch latest from history
          const hist = await assessmentService.getHistory();
          if (hist.attempts && hist.attempts.length > 0) {
            const latestId = hist.attempts[0]._id;
            const res = await assessmentService.getAttemptById(latestId);
            setAttempt(res.attempt);
          } else {
            setAttempt(null);
          }
        }
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Could not retrieve assessment results.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [attemptId]);

  const handleGeneratePlan = async () => {
    if (!attempt) return;
    try {
      setGeneratingPlan(true);
      await planService.generatePlan(attempt._id);
      navigate('/plan');
    } catch (err) {
      console.error('Plan generation error:', err);
      setError(
        err.response?.data?.message ||
          'Failed to generate 7-day plan. Please try again.'
      );
    } finally {
      setGeneratingPlan(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-2">Evaluating assessment results...</p>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="container-fluid max-w-4xl px-0 text-center py-5" style={{ maxWidth: '720px' }}>
        <div className="card-saas p-5">
          <i className="bi bi-clipboard-x text-muted display-4 mb-3"></i>
          <h1 className="h4 fw-bold">No Assessment Found</h1>
          <p className="text-muted small mb-4">
            You have not completed an assessment yet. Take our diagnostic quiz to uncover your skill gaps and generate your tailored 7-day plan.
          </p>
          <Link to="/assessment" className="btn-primary-saas mx-auto">
            Take Assessment Now <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    );
  }

  const {
    role,
    attemptNumber,
    setNumber,
    scorePercentage,
    correctCount,
    totalQuestions,
    strongTopics = [],
    weakTopics = [],
    topicBreakdown = [],
    recommendedImprovements = [],
    prioritySkills = [],
    answers = [],
    createdAt,
  } = attempt;

  const isPassing = scorePercentage >= 70;

  return (
    <div className="container-fluid max-w-5xl px-0" style={{ maxWidth: '960px' }}>
      {/* Disclaimer Banner */}
      <div className="alert alert-light border small text-muted mb-4 py-2 px-3 rounded-3 d-flex align-items-center gap-2">
        <i className="bi bi-info-circle text-primary fs-5"></i>
        <div>
          <strong>Preliminary Diagnostic Assessment:</strong> Scores indicate current readiness against typical internship screening benchmarks. Not an official certification.
        </div>
      </div>

      {error && (
        <div className="alert alert-danger rounded-3 small mb-4" role="alert">
          {error}
        </div>
      )}

      {/* Main Score Hero Card */}
      <div className="card-saas p-4 p-md-5 mb-4 shadow-sm border-0 position-relative overflow-hidden">
        <div className="row align-items-center">
          <div className="col-12 col-md-7">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge badge-soft-primary">
                Attempt #{attemptNumber} {setNumber === 2 ? '(Retest)' : ''}
              </span>
              <span className="text-muted small">
                {new Date(createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            <h1 className="h3 fw-bold mb-2">{role} Assessment Results</h1>
            <p className="text-muted small mb-3">
              {isPassing
                ? 'Strong foundation shown! You demonstrated solid competencies in multiple core topics. Bridge the remaining gaps below.'
                : 'Key skill gaps were identified. With targeted daily practice over the next 7 days, you can significantly boost your internship readiness.'}
            </p>

            <div className="d-flex flex-wrap gap-2">
              <button
                onClick={handleGeneratePlan}
                disabled={generatingPlan}
                className="btn-primary-saas"
              >
                {generatingPlan ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Generating 7-Day Plan...
                  </>
                ) : (
                  <>
                    <i className="bi bi-calendar2-check-fill"></i> Generate 7-Day Action Plan
                  </>
                )}
              </button>

              <Link to="/assessment" className="btn-outline-saas">
                <i className="bi bi-arrow-repeat"></i> Retake Test
              </Link>
            </div>
          </div>

          <div className="col-12 col-md-5 text-center mt-4 mt-md-0">
            <div
              className="d-inline-flex flex-column align-items-center justify-content-center p-4 rounded-circle border shadow-sm"
              style={{
                width: '180px',
                height: '180px',
                backgroundColor: isPassing ? '#ecfdf5' : '#fffbeb',
                borderColor: isPassing ? '#10b981' : '#f59e0b',
              }}
            >
              <span
                className={`display-5 fw-bold ${
                  isPassing ? 'text-success' : 'text-warning'
                }`}
              >
                {scorePercentage}%
              </span>
              <span className="small fw-semibold text-muted">
                {correctCount} / {totalQuestions} Correct
              </span>
              <span
                className={`badge mt-1 ${
                  isPassing ? 'bg-success' : 'bg-warning text-dark'
                }`}
                style={{ fontSize: '0.72rem' }}
              >
                {isPassing ? 'Internship Ready' : 'Skill Gaps Found'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Topics Analysis: Strong vs Weak Topics Grid */}
      <div className="row g-4 mb-4">
        {/* Strong Topics */}
        <div className="col-12 col-md-6">
          <div className="card-saas p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="p-2 rounded-3 bg-success bg-opacity-10 text-success">
                <i className="bi bi-check-circle-fill fs-5"></i>
              </div>
              <h2 className="h5 fw-bold mb-0">Strong Topics ({strongTopics.length})</h2>
            </div>

            {strongTopics.length > 0 ? (
              <ul className="list-group list-group-flush small">
                {strongTopics.map((topic, idx) => (
                  <li
                    key={idx}
                    className="list-group-item d-flex align-items-center justify-content-between px-0 py-2 border-light"
                  >
                    <span className="fw-medium text-dark">
                      <i className="bi bi-check2 text-success me-2"></i>
                      {topic}
                    </span>
                    <span className="badge badge-soft-success">Proficient</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted small mb-0">
                No topics met the strong benchmark yet. Complete the 7-day plan to solidify your fundamentals.
              </p>
            )}
          </div>
        </div>

        {/* Weak Topics */}
        <div className="col-12 col-md-6">
          <div className="card-saas p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="p-2 rounded-3 bg-danger bg-opacity-10 text-danger">
                <i className="bi bi-exclamation-triangle-fill fs-5"></i>
              </div>
              <h2 className="h5 fw-bold mb-0">Weak Topics ({weakTopics.length})</h2>
            </div>

            {weakTopics.length > 0 ? (
              <ul className="list-group list-group-flush small">
                {weakTopics.map((topic, idx) => (
                  <li
                    key={idx}
                    className="list-group-item d-flex align-items-center justify-content-between px-0 py-2 border-light"
                  >
                    <span className="fw-medium text-dark">
                      <i className="bi bi-x-circle text-danger me-2"></i>
                      {topic}
                    </span>
                    <span className="badge badge-soft-danger">Needs Focus</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted small mb-0">
                Zero weak topics! You scored well on all evaluated domains.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Priority Skills to Practice First & Recommendations */}
      <div className="card-saas p-4 p-md-5 mb-4">
        <h2 className="h5 fw-bold mb-3 d-flex align-items-center gap-2">
          <i className="bi bi-lightning-charge-fill text-warning"></i>
          Skills to Practice First (Prioritized)
        </h2>

        {prioritySkills.length > 0 ? (
          <div className="row g-3 mb-4">
            {prioritySkills.map((skill, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-md-4">
                <div className="p-3 bg-light rounded-3 border h-100">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="badge bg-secondary text-white" style={{ fontSize: '0.7rem' }}>
                      Priority #{idx + 1}
                    </span>
                    <i className="bi bi-arrow-right text-muted"></i>
                  </div>
                  <div className="fw-bold text-dark mt-2" style={{ fontSize: '0.9rem' }}>
                    {skill}
                  </div>
                  <small className="text-muted">Will be scheduled on Day {idx + 1}</small>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted small mb-3">
            All skills met the benchmark. We recommend reviewing advanced architecture and hands-on portfolio projects.
          </p>
        )}

        <hr className="my-4 text-muted opacity-25" />

        <h3 className="h6 fw-bold text-uppercase text-secondary mb-3">
          Recommended Improvements
        </h3>
        <div className="d-flex flex-column gap-2 mb-0">
          {recommendedImprovements.map((rec, idx) => (
            <div key={idx} className="d-flex align-items-start gap-2 small">
              <i className="bi bi-arrow-right-circle-fill text-primary mt-1"></i>
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Question Review Accordion */}
      <div className="card-saas p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="h5 fw-bold mb-1">Question-by-Question Diagnostic Review</h2>
            <p className="text-muted small mb-0">
              Inspect answer keys and detailed explanations to understand why answers were correct.
            </p>
          </div>
          <button
            onClick={() => setShowAllQuestions(!showAllQuestions)}
            className="btn btn-outline-secondary btn-sm"
          >
            {showAllQuestions ? 'Collapse Review' : 'Expand All Explanations'}
          </button>
        </div>

        {showAllQuestions && (
          <div className="d-flex flex-column gap-3 mt-3">
            {answers.map((ans, idx) => (
              <div
                key={ans.questionId || idx}
                className={`p-3 rounded-3 border ${
                  ans.isCorrect ? 'border-success bg-white' : 'border-danger bg-white'
                }`}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold small">
                    Q{idx + 1}. {ans.questionText}
                  </span>
                  <span
                    className={`badge ${
                      ans.isCorrect ? 'badge-soft-success' : 'badge-soft-danger'
                    }`}
                  >
                    {ans.isCorrect ? 'Correct (+1)' : 'Incorrect (0)'}
                  </span>
                </div>

                <div className="row g-2 small mb-2">
                  <div className="col-12 col-md-6">
                    <span className="text-muted">Your Answer: </span>
                    <strong className={ans.isCorrect ? 'text-success' : 'text-danger'}>
                      {ans.selectedAnswer || '(Unanswered)'}
                    </strong>
                  </div>
                  <div className="col-12 col-md-6">
                    <span className="text-muted">Correct Answer: </span>
                    <strong className="text-dark">{ans.correctAnswer}</strong>
                  </div>
                </div>

                {ans.explanation && (
                  <div className="p-2 rounded bg-light border text-muted small mt-2">
                    <i className="bi bi-lightbulb-fill text-warning me-1"></i>
                    <strong>Explanation: </strong> {ans.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA to plan */}
      <div className="text-center py-3">
        <button
          onClick={handleGeneratePlan}
          disabled={generatingPlan}
          className="btn-primary-saas px-4 py-2"
        >
          <i className="bi bi-calendar-check-fill me-2"></i>
          Proceed to 7-Day Personalized Action Plan
        </button>
      </div>
    </div>
  );
};

export default Results;
