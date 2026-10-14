import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const InternshipHub = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('tracks');
  const [selectedTrack, setSelectedTrack] = useState('Frontend Developer Intern');

  // Interactive Checklist State
  const [checklist, setChecklist] = useState({
    resumeProjects: true,
    gitProfile: true,
    dsaBasics: false,
    mockInterview: false,
    diagnosticTaken: false,
    starBehavioral: false,
  });

  const toggleChecklistItem = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const readinessPercent = Math.round((completedCount / Object.keys(checklist).length) * 100);

  const internshipTracks = [
    {
      role: 'Frontend Developer Intern',
      badge: 'High Campus Demand',
      icon: 'bi-code-slash',
      accent: '#0ea5e9',
      topics: ['HTML5 & Semantic Markup', 'CSS3 Flexbox/Grid', 'Modern JavaScript ES6+', 'React Hooks & State', 'Async API Integration'],
      screeningFocus: 'Component architecture, DOM manipulation, asynchronous state, CSS responsiveness.',
      avgStipend: '$800 - $2,500 / mo',
    },
    {
      role: 'Python Developer Intern',
      badge: 'Core Backend',
      icon: 'bi-filetype-py',
      accent: '#6366f1',
      topics: ['Python Data Types & Memory', 'OOP & Classes', 'REST APIs with FastAPI/Flask', 'SQL Queries & Joins', 'Exception Handling'],
      screeningFocus: 'Data structures (lists, dicts), mutable default argument bugs, OOP inheritance, SQL injection prevention.',
      avgStipend: '$900 - $2,800 / mo',
    },
    {
      role: 'Data Analyst Intern',
      badge: 'Analytics & Insights',
      icon: 'bi-bar-chart-line',
      accent: '#10b981',
      topics: ['SQL Aggregate Functions & Grouping', 'Pandas DataFrame Transformations', 'Data Cleaning & Imputation', 'Data Visualization', 'Business Metrics'],
      screeningFocus: 'Complex SQL queries, multi-table joins, exploratory data analysis, chart interpretation.',
      avgStipend: '$800 - $2,400 / mo',
    },
  ];

  const interviewPatterns = [
    {
      title: 'Array Reference Mutability Trap',
      category: 'Python / General',
      q: 'Why does passing default list arguments like `def append_to(item, target=[])` produce unexpected results in technical screening rounds?',
      answer:
        'Default argument expressions in Python are evaluated once at function definition time, not every call. Thus, all calls share the exact same list instance in memory. The fix is to use `target=None` and initialize inside the function.',
    },
    {
      title: 'Asynchronous State Timing in React',
      category: 'Frontend',
      q: 'Why doesn’t `setState` update component state immediately on the next line of code?',
      answer:
        'In React, state updates are batched and scheduled asynchronously to optimize render performance. If you need the updated value immediately, use the functional update updater pattern `setCount(prev => prev + 1)` or read it in a useEffect hook.',
    },
    {
      title: 'SQL WHERE vs HAVING Filtering',
      category: 'Databases / SQL',
      q: 'What is the precise operational difference between WHERE and HAVING in SQL internship queries?',
      answer:
        'WHERE filters individual rows before any grouping or aggregation takes place. HAVING filters aggregated group rows after the GROUP BY clause has evaluated (e.g. `HAVING COUNT(*) > 5`).',
    },
    {
      title: 'JavaScript Event Loop & Microtasks',
      category: 'Frontend & Full Stack',
      q: 'In what order do `console.log`, `setTimeout`, and `Promise.resolve().then` execute?',
      answer:
        'Synchronous execution runs first (`console.log`), followed by the Microtask queue (`Promise.then`), and lastly the Macrotask queue (`setTimeout(..., 0)`).',
    },
  ];

  return (
    <div className="container-xl py-2">
      {/* Hero Header */}
      <div className="card-saas p-4 p-md-5 mb-4 text-white position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="row align-items-center">
          <div className="col-12 col-lg-8">
            <span className="badge bg-warning text-dark fw-bold mb-3 px-3 py-1 rounded-pill small">
              <i className="bi bi-mortarboard-fill me-1"></i> Dedicated College Internship Hub
            </span>
            <h1 className="h2 fw-bold text-white mb-2">
              Internship Screening & Campus Placement Accelerator
            </h1>
            <p className="text-light opacity-75 mb-4" style={{ maxWidth: '650px' }}>
              A specialized track dedicated to college students and fresh graduates. Master coding round questions, verify baseline benchmarks, and fast-track your internship offers.
            </p>

            <div className="d-flex flex-wrap gap-2">
              <button
                onClick={() => navigate(`/assessment?role=${encodeURIComponent(selectedTrack)}&set=1`)}
                className="btn btn-primary-saas"
              >
                <i className="bi bi-play-circle-fill"></i> Take Internship Diagnostic
              </button>
              <button
                onClick={() => navigate('/plan')}
                className="btn btn-outline-light px-3 py-2 fw-semibold rounded-3"
              >
                <i className="bi bi-calendar-check me-1"></i> 7-Day Sprint Plan
              </button>
              <button
                onClick={() => navigate('/retest')}
                className="btn btn-outline-warning px-3 py-2 fw-semibold rounded-3"
              >
                <i className="bi bi-trophy-fill me-1"></i> Retest Verification
              </button>
            </div>
          </div>

          <div className="col-12 col-lg-4 mt-4 mt-lg-0 text-center text-lg-end">
            <div className="bg-white bg-opacity-10 p-4 rounded-4 border border-white border-opacity-15 d-inline-block text-start" style={{ minWidth: '240px' }}>
              <div className="text-white-50 small text-uppercase fw-semibold mb-1">
                Internship Readiness
              </div>
              <div className="d-flex align-items-baseline gap-2 mb-2">
                <span className="display-6 fw-bold text-white">{readinessPercent}%</span>
                <span className="badge bg-success small">{completedCount} of 6 ready</span>
              </div>
              <div className="progress progress-saas mb-2" style={{ height: '8px' }}>
                <div
                  className="progress-bar bg-warning"
                  style={{ width: `${readinessPercent}%` }}
                ></div>
              </div>
              <small className="text-light opacity-75">
                {readinessPercent >= 70 ? '🟢 Competitive Candidate' : '🟡 Complete checklist below'}
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="d-flex gap-2 mb-4 border-bottom pb-3 overflow-auto">
        <button
          onClick={() => setActiveTab('tracks')}
          className={`btn btn-sm px-3 rounded-pill fw-semibold ${
            activeTab === 'tracks' ? 'btn-primary' : 'btn-outline-secondary'
          }`}
        >
          <i className="bi bi-grid-fill me-1"></i> Internship Tracks ({internshipTracks.length})
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          className={`btn btn-sm px-3 rounded-pill fw-semibold ${
            activeTab === 'checklist' ? 'btn-primary' : 'btn-outline-secondary'
          }`}
        >
          <i className="bi bi-check2-all me-1"></i> Campus Readiness Checklist
        </button>
        <button
          onClick={() => setActiveTab('interview')}
          className={`btn btn-sm px-3 rounded-pill fw-semibold ${
            activeTab === 'interview' ? 'btn-primary' : 'btn-outline-secondary'
          }`}
        >
          <i className="bi bi-patch-question-fill me-1"></i> Screening Round Drills
        </button>
        <button
          onClick={() => setActiveTab('benchmarks')}
          className={`btn btn-sm px-3 rounded-pill fw-semibold ${
            activeTab === 'benchmarks' ? 'btn-primary' : 'btn-outline-secondary'
          }`}
        >
          <i className="bi bi-bar-chart-fill me-1"></i> Scoring Benchmarks
        </button>
      </div>

      {/* TAB 1: INTERNSHIP TRACKS */}
      {activeTab === 'tracks' && (
        <div className="row g-4 mb-4">
          {internshipTracks.map((track) => (
            <div key={track.role} className="col-12 col-md-4">
              <div
                className={`card-saas p-4 h-100 position-relative ${
                  selectedTrack === track.role ? 'border-primary shadow' : ''
                }`}
                style={{
                  borderTop: `4px solid ${track.accent}`,
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedTrack(track.role)}
              >
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div
                    className="p-3 rounded-3 text-white d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: track.accent, width: '48px', height: '48px' }}
                  >
                    <i className={`bi ${track.icon} fs-4`}></i>
                  </div>
                  <span className="badge bg-light text-dark border small fw-semibold">
                    {track.badge}
                  </span>
                </div>

                <h3 className="h5 fw-bold mb-1">{track.role}</h3>
                <p className="text-muted small mb-3">{track.screeningFocus}</p>

                <div className="mb-3">
                  <span className="text-muted small fw-semibold d-block mb-1">Tested Core Skills:</span>
                  <div className="d-flex flex-wrap gap-1">
                    {track.topics.map((t, idx) => (
                      <span key={idx} className="badge bg-light text-secondary border small">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-top mt-auto d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-muted small d-block">Typical Stipend</span>
                    <strong className="text-dark small">{track.avgStipend}</strong>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/assessment?role=${encodeURIComponent(track.role)}&set=1`);
                    }}
                    className="btn btn-sm btn-primary-saas"
                  >
                    Diagnose <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: CAMPUS READINESS CHECKLIST */}
      {activeTab === 'checklist' && (
        <div className="card-saas p-4 p-md-5 mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom gap-2">
            <div>
              <h2 className="h4 fw-bold mb-1">Campus-to-Corporate Internship Checklist</h2>
              <p className="text-muted small mb-0">
                Tick each milestone as you complete it. Aim for 100% readiness before university recruitment drives begin.
              </p>
            </div>
            <div className="text-md-end">
              <span className="badge bg-primary fs-6 px-3 py-2 rounded-pill">
                Score: {readinessPercent}%
              </span>
            </div>
          </div>

          <div className="row g-3">
            {[
              {
                id: 'resumeProjects',
                label: '2 Flagship Full-Stack or Python Projects on Resume',
                desc: 'Includes live deployment link, GitHub README with architecture diagram, and clean code comments.',
                icon: 'bi-file-earmark-code',
              },
              {
                id: 'gitProfile',
                label: 'Active GitHub Profile & Clean Commits',
                desc: 'Meaningful commit messages, pinned flagship repositories, and demonstrated version control usage.',
                icon: 'bi-github',
              },
              {
                id: 'dsaBasics',
                label: 'Core Data Structures Mastery (Lists, HashMaps, Sets, Strings)',
                desc: 'Comfortable solving easy to medium complexity algorithmic problems within 25 minutes.',
                icon: 'bi-braces',
              },
              {
                id: 'diagnosticTaken',
                label: 'SkillGap-to-Action Diagnostic Assessment Completed (≥70%)',
                desc: 'Identified exact weak modules and generated a tailored 7-day action sprint.',
                icon: 'bi-clipboard-check',
              },
              {
                id: 'starBehavioral',
                label: 'STAR Method Prepared for 5 Common Behavioral Questions',
                desc: 'Prepared Situation-Task-Action-Result narratives for teamwork, conflict, deadlines, and technical debugging.',
                icon: 'bi-chat-quote',
              },
              {
                id: 'mockInterview',
                label: 'At Least 1 Full Mock Technical Screening Done',
                desc: 'Practiced speaking out loud while writing code and explaining time/space complexities.',
                icon: 'bi-person-video',
              },
            ].map((item) => (
              <div key={item.id} className="col-12 col-md-6">
                <div
                  className={`p-3 rounded-3 border d-flex gap-3 align-items-start ${
                    checklist[item.id] ? 'bg-light border-success' : 'bg-white'
                  }`}
                  style={{ cursor: 'pointer', transition: 'none' }}
                  onClick={() => toggleChecklistItem(item.id)}
                >
                  <input
                    type="checkbox"
                    className="form-check-input mt-1 flex-shrink-0"
                    checked={checklist[item.id]}
                    onChange={() => toggleChecklistItem(item.id)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <div>
                    <div className="fw-semibold text-dark mb-1 d-flex align-items-center gap-2">
                      <i className={`bi ${item.icon} text-primary`}></i>
                      <span className={checklist[item.id] ? 'text-decoration-line-through text-muted' : ''}>
                        {item.label}
                      </span>
                    </div>
                    <p className="text-muted small mb-0">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SCREENING ROUND DRILLS */}
      {activeTab === 'interview' && (
        <div className="card-saas p-4 p-md-5 mb-4">
          <div className="mb-4 pb-3 border-bottom">
            <h2 className="h4 fw-bold mb-1">Top Screening Round Question Drills</h2>
            <p className="text-muted small mb-0">
              High-frequency questions asked by internship interviewers during campus placements and technical screening rounds.
            </p>
          </div>

          <div className="d-flex flex-column gap-3">
            {interviewPatterns.map((item, idx) => (
              <div key={idx} className="p-3 p-md-4 rounded-3 border bg-light">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold small">
                    {item.category}
                  </span>
                  <span className="text-muted small fw-bold">Drill #{idx + 1}</span>
                </div>
                <h4 className="h6 fw-bold text-dark mb-2">{item.title}</h4>
                <p className="fw-medium text-secondary mb-2 small">{item.q}</p>
                <div className="p-3 bg-white rounded-3 border small text-dark">
                  <strong className="text-success d-block mb-1">
                    <i className="bi bi-lightbulb-fill me-1"></i> Solution & Interview Key:
                  </strong>
                  {item.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: BENCHMARKS */}
      {activeTab === 'benchmarks' && (
        <div className="card-saas p-4 p-md-5 mb-4">
          <div className="mb-4 pb-3 border-bottom">
            <h2 className="h4 fw-bold mb-1">Internship Evaluation & Score Benchmarks</h2>
            <p className="text-muted small mb-0">
              Understanding how hiring managers and college placement cells assess student diagnostic scores.
            </p>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Score Tier</th>
                  <th>Evaluation Rating</th>
                  <th>Internship Screening Status</th>
                  <th>Recommended Immediate Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="badge bg-danger px-3 py-2">Below 50%</span></td>
                  <td><strong>Critical Skill Gaps</strong></td>
                  <td>High risk of elimination in Online Assessment (OA) rounds.</td>
                  <td>Execute full 7-Day Sprint Plan. Focus on core syntax, debugging, and memory models.</td>
                </tr>
                <tr>
                  <td><span className="badge bg-warning text-dark px-3 py-2">50% - 69%</span></td>
                  <td><strong>Moderate Foundations</strong></td>
                  <td>Borderline candidate; can pass resume screen but may struggle on edge cases.</td>
                  <td>Complete targeted drills on weak topics. Schedule Retest within 5 days.</td>
                </tr>
                <tr>
                  <td><span className="badge bg-primary px-3 py-2">70% - 84%</span></td>
                  <td><strong>Internship Ready (Benchmark)</strong></td>
                  <td>Meets standard campus selection threshold for leading tech internships.</td>
                  <td>Take Set 2 Retest to verify score jump. Build 1 advanced deployment feature.</td>
                </tr>
                <tr>
                  <td><span className="badge bg-success px-3 py-2">85% - 100%</span></td>
                  <td><strong>Top Tier / Advanced</strong></td>
                  <td>Top 10% candidate pool. Strong candidate for product engineering internships.</td>
                  <td>Focus on system design discussions, API optimization, and portfolio presentation.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipHub;
