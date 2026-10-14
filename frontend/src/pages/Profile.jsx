import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileService, assessmentService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: '',
    degree: 'B.Tech',
    branch: '',
    currentYear: '3rd Year',
    knownSkills: '',
    preferredRole: 'Frontend Developer Intern',
    dailyTimeMinutes: 60,
  });

  const [availableRoles, setAvailableRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch roles
        const rolesData = await assessmentService.getRoles();
        if (rolesData.roles) {
          setAvailableRoles(rolesData.roles);
        }

        // Fetch profile
        try {
          const res = await profileService.getProfile();
          if (res.hasProfile && res.profile) {
            setFormData({
              name: res.profile.name || user?.name || '',
              college: res.profile.college || '',
              degree: res.profile.degree || 'B.Tech',
              branch: res.profile.branch || '',
              currentYear: res.profile.currentYear || '3rd Year',
              knownSkills: Array.isArray(res.profile.knownSkills)
                ? res.profile.knownSkills.join(', ')
                : res.profile.knownSkills || '',
              preferredRole: res.profile.preferredRole || 'Frontend Developer Intern',
              dailyTimeMinutes: res.profile.dailyTimeMinutes || 60,
            });
            setIsEditing(true);
          }
        } catch {
          // If no profile exists yet, user is in onboarding mode
          setIsEditing(false);
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (
      !formData.name.trim() ||
      !formData.college.trim() ||
      !formData.branch.trim()
    ) {
      setMessage({
        type: 'danger',
        text: 'Please provide Name, College, and Branch/Specialization.',
      });
      return;
    }

    try {
      setSaving(true);
      const res = await profileService.saveProfile(formData);
      await refreshUser();
      setMessage({
        type: 'success',
        text: isEditing
          ? 'Profile updated successfully!'
          : 'Profile created! Ready to analyze your internship skills.',
      });

      // Brief delay before redirecting to assessment or dashboard
      setTimeout(() => {
        if (!isEditing) {
          navigate('/assessment');
        } else {
          navigate('/dashboard');
        }
      }, 1000);
    } catch (err) {
      setMessage({
        type: 'danger',
        text:
          err.response?.data?.message ||
          'Failed to save profile. Please check your inputs.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-2">Loading profile details...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid max-w-4xl px-0" style={{ maxWidth: '860px' }}>
      {/* Page Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">
            {isEditing ? 'Student Profile & Preferences' : 'Complete Your Profile'}
          </h1>
          <p className="text-muted small mb-0">
            {isEditing
              ? 'Keep your educational background and internship target current.'
              : 'Tell us your academic track and target internship role to personalize your diagnostic assessment.'}
          </p>
        </div>
        {isEditing && (
          <span className="badge badge-soft-primary align-self-start align-self-sm-center">
            <i className="bi bi-shield-check me-1"></i> Verified Profile
          </span>
        )}
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
                : 'bi-exclamation-triangle-fill'
            } me-2`}
          ></i>
          {message.text}
        </div>
      )}

      {/* Main Profile Form Card */}
      <div className="card-saas p-4 p-md-5 mb-4">
        <form onSubmit={handleSubmit}>
          {/* Section 1: Academic Information */}
          <div className="mb-4">
            <h2 className="h6 fw-bold text-uppercase text-secondary mb-3 d-flex align-items-center gap-2" style={{ letterSpacing: '0.05em' }}>
              <i className="bi bi-mortarboard text-primary fs-5"></i> Academic Details
            </h2>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label htmlFor="name" className="form-label small fw-semibold text-secondary">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  placeholder="e.g. Alex Johnson"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="college" className="form-label small fw-semibold text-secondary">
                  College / University
                </label>
                <input
                  type="text"
                  id="college"
                  name="college"
                  className="form-control"
                  placeholder="e.g. Stanford University / IIT Delhi"
                  value={formData.college}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor="degree" className="form-label small fw-semibold text-secondary">
                  Degree
                </label>
                <select
                  id="degree"
                  name="degree"
                  className="form-select"
                  value={formData.degree}
                  onChange={handleChange}
                  required
                >
                  <option value="B.Tech">B.Tech / B.E.</option>
                  <option value="B.Sc">B.Sc Computer Science</option>
                  <option value="BCA">BCA</option>
                  <option value="MCA">MCA</option>
                  <option value="M.Tech">M.Tech / M.S.</option>
                  <option value="Other">Other Degree</option>
                </select>
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor="branch" className="form-label small fw-semibold text-secondary">
                  Branch / Department
                </label>
                <input
                  type="text"
                  id="branch"
                  name="branch"
                  className="form-control"
                  placeholder="e.g. Computer Science, IT, ECE"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor="currentYear" className="form-label small fw-semibold text-secondary">
                  Current Year of Study
                </label>
                <select
                  id="currentYear"
                  name="currentYear"
                  className="form-select"
                  value={formData.currentYear}
                  onChange={handleChange}
                  required
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="my-4 text-muted opacity-25" />

          {/* Section 2: Career Goal & Internship Role */}
          <div className="mb-4">
            <h2 className="h6 fw-bold text-uppercase text-secondary mb-3 d-flex align-items-center gap-2" style={{ letterSpacing: '0.05em' }}>
              <i className="bi bi-briefcase text-primary fs-5"></i> Internship Preferences
            </h2>

            <div className="row g-3">
              <div className="col-12">
                <label className="form-label small fw-semibold text-secondary mb-2">
                  Select Target Internship Role (Diagnostic Assessment Target)
                </label>
                <div className="row g-3">
                  {[
                    {
                      title: 'Python Developer Intern',
                      desc: 'Backend APIs, OOP, Data Structures, DBs',
                      icon: 'bi-filetype-py',
                    },
                    {
                      title: 'Frontend Developer Intern',
                      desc: 'React, Modern JavaScript, CSS/Flexbox, DOM',
                      icon: 'bi-code-slash',
                    },
                    {
                      title: 'Data Analyst Intern',
                      desc: 'SQL Joins, Pandas, Statistics, Visuals',
                      icon: 'bi-bar-chart-line',
                    },
                  ].map((role) => (
                    <div key={role.title} className="col-12 col-md-4">
                      <div
                        className={`option-card h-100 ${
                          formData.preferredRole === role.title ? 'selected' : ''
                        }`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            preferredRole: role.title,
                          }))
                        }
                      >
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <i className={`bi ${role.icon} text-primary fs-4`}></i>
                          <h3 className="h6 fw-bold mb-0">{role.title}</h3>
                        </div>
                        <p className="text-muted small mb-0">{role.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-12 col-md-6 mt-4">
                <label htmlFor="dailyTimeMinutes" className="form-label small fw-semibold text-secondary">
                  Available Learning Time Per Day
                </label>
                <select
                  id="dailyTimeMinutes"
                  name="dailyTimeMinutes"
                  className="form-select"
                  value={formData.dailyTimeMinutes}
                  onChange={handleChange}
                >
                  <option value="30">30 minutes / day (Quick sprint)</option>
                  <option value="45">45 minutes / day</option>
                  <option value="60">60 minutes / day (Recommended)</option>
                  <option value="90">90 minutes / day (Accelerated)</option>
                  <option value="120">120 minutes / day (Intensive)</option>
                </select>
                <small className="text-muted d-block mt-1">
                  Your 7-day personalized plan will tailor task durations to this budget.
                </small>
              </div>

              <div className="col-12 col-md-6 mt-4">
                <label htmlFor="knownSkills" className="form-label small fw-semibold text-secondary">
                  Known Technical Skills (comma separated)
                </label>
                <input
                  type="text"
                  id="knownSkills"
                  name="knownSkills"
                  className="form-control"
                  placeholder="e.g. C++, Java, Git, HTML, SQL"
                  value={formData.knownSkills}
                  onChange={handleChange}
                />
                <small className="text-muted d-block mt-1">
                  Helps identify background knowledge and context.
                </small>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary-saas px-4 py-2"
            >
              {saving ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Saving Profile...
                </>
              ) : isEditing ? (
                <>
                  <i className="bi bi-check-lg"></i> Update Profile
                </>
              ) : (
                <>
                  Save & Take Assessment <i className="bi bi-arrow-right"></i>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
