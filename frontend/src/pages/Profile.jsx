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
    preferredRole: 'Frontend Engineer',
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
              preferredRole: res.profile.preferredRole || 'Frontend Engineer',
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
        text: 'Please provide Name, College/Organization, and Branch/Specialization.',
      });
      return;
    }

    try {
      setSaving(true);
      await profileService.saveProfile(formData);
      await refreshUser();
      setMessage({
        type: 'success',
        text: isEditing
          ? 'Profile & track preferences updated successfully!'
          : 'Profile created! Ready to launch your skill gap diagnostic.',
      });

      setTimeout(() => {
        if (!isEditing) {
          navigate('/assessment');
        } else {
          navigate('/dashboard');
        }
      }, 900);
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
      <div className="container-xl text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-2">Loading profile details...</p>
      </div>
    );
  }

  return (
    <div className="container-xl py-2" style={{ maxWidth: '960px' }}>
      {/* Page Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">
            {isEditing ? 'Career Profile & Track Settings' : 'Initialize Your Career Profile'}
          </h1>
          <p className="text-muted small mb-0">
            Configure your technical focus track and daily study budget to calibrate your diagnostic tests and 7-day action plans.
          </p>
        </div>
        {isEditing && (
          <span className="badge badge-soft-primary align-self-start align-self-sm-center">
            <i className="bi bi-shield-check me-1"></i> Active Track: {formData.preferredRole}
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
          {/* Section 1: Academic & Professional Background */}
          <div className="mb-4">
            <h2 className="h6 fw-bold text-uppercase text-secondary mb-3 d-flex align-items-center gap-2" style={{ letterSpacing: '0.05em' }}>
              <i className="bi bi-person-lines-fill text-primary fs-5"></i> Academic & Professional Background
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
                  College / University / Organization
                </label>
                <input
                  type="text"
                  id="college"
                  name="college"
                  className="form-control"
                  placeholder="e.g. Stanford University / Tech Corp"
                  value={formData.college}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor="degree" className="form-label small fw-semibold text-secondary">
                  Degree / Professional Level
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
                  <option value="Self-Taught">Self-Taught Engineer</option>
                  <option value="Industry Pro">Working Professional</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor="branch" className="form-label small fw-semibold text-secondary">
                  Branch / Department / Specialization
                </label>
                <input
                  type="text"
                  id="branch"
                  name="branch"
                  className="form-control"
                  placeholder="e.g. Computer Science, Full Stack, Software Eng"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor="currentYear" className="form-label small fw-semibold text-secondary">
                  Academic / Career Stage
                </label>
                <select
                  id="currentYear"
                  name="currentYear"
                  className="form-select"
                  value={formData.currentYear}
                  onChange={handleChange}
                  required
                >
                  <option value="1st Year">1st Year Student</option>
                  <option value="2nd Year">2nd Year Student</option>
                  <option value="3rd Year">3rd Year Student</option>
                  <option value="4th Year">4th Year Finalist</option>
                  <option value="Postgraduate">Postgraduate / Master's</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="my-4 text-muted opacity-25" />

          {/* Section 2: Career Track Selection */}
          <div className="mb-4">
            <h2 className="h6 fw-bold text-uppercase text-secondary mb-3 d-flex align-items-center gap-2" style={{ letterSpacing: '0.05em' }}>
              <i className="bi bi-briefcase-fill text-primary fs-5"></i> Target Career Track & Role
            </h2>

            <div className="row g-3">
              <div className="col-12">
                <label className="form-label small fw-semibold text-secondary mb-2">
                  Choose Your Target Technical Track
                </label>
                <div className="row g-3">
                  {availableRoles.map((role) => (
                    <div key={role.id} className="col-12 col-md-4">
                      <div
                        className={`option-card h-100 position-relative ${
                          formData.preferredRole === role.title ? 'selected' : ''
                        }`}
                        style={{
                          borderLeft: `4px solid ${role.color || '#4f46e5'}`,
                        }}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            preferredRole: role.title,
                          }))
                        }
                      >
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <i className={`bi ${role.icon} fs-4`} style={{ color: role.color || '#4f46e5' }}></i>
                          <span className={`badge ${role.category === 'Internship Module' ? 'bg-warning text-dark' : 'bg-primary bg-opacity-10 text-primary'} small`}>
                            {role.badge || role.category}
                          </span>
                        </div>
                        <h3 className="h6 fw-bold mb-1 text-dark">{role.title}</h3>
                        <p className="text-muted small mb-0" style={{ fontSize: '0.78rem' }}>
                          {role.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-12 col-md-6 mt-4">
                <label htmlFor="dailyTimeMinutes" className="form-label small fw-semibold text-secondary">
                  Daily Micro-Learning Budget
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
                <div className="form-text small">
                  The rule-based plan generator scales task durations and reading links to this budget.
                </div>
              </div>

              <div className="col-12 col-md-6 mt-4">
                <label htmlFor="knownSkills" className="form-label small fw-semibold text-secondary">
                  Current Known Skills (Comma Separated)
                </label>
                <input
                  type="text"
                  id="knownSkills"
                  name="knownSkills"
                  className="form-control"
                  placeholder="e.g. JavaScript, React, Python, Git, Docker"
                  value={formData.knownSkills}
                  onChange={handleChange}
                />
                <div className="form-text small">
                  Helps identify baseline strengths and calibrate priority gaps.
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-top d-flex justify-content-end gap-2">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary-saas px-4 py-2"
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-check2-circle"></i>
                  <span>{isEditing ? 'Save Changes' : 'Complete Setup & Launch Diagnostic'}</span>
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
