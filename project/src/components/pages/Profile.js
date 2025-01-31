import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_ENDPOINTS } from '../../config/api';
import axios from 'axios';
import '../../styles/Profile.css';

const Profile = () => {
  const { user, token, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    offeredSkills: user?.offeredSkills || [],
    requiredSkills: user?.requiredSkills || []
  });

  const [newOfferedSkill, setNewOfferedSkill] = useState({
    category: '',
    title: '',
    description: '',
    experienceLevel: 'Intermediate'
  });

  const [newRequiredSkill, setNewRequiredSkill] = useState({
    category: '',
    title: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddOfferedSkill = () => {
    if (!newOfferedSkill.category || !newOfferedSkill.title) {
      setError('Please fill in both category and title for the offered skill');
      return;
    }

    setFormData(prev => ({
      ...prev,
      offeredSkills: [...prev.offeredSkills, { ...newOfferedSkill }]
    }));

    setNewOfferedSkill({
      category: '',
      title: '',
      description: '',
      experienceLevel: 'Intermediate'
    });
    setError(null);
  };

  const handleAddRequiredSkill = () => {
    if (!newRequiredSkill.category || !newRequiredSkill.title) {
      setError('Please fill in both category and title for the required skill');
      return;
    }

    setFormData(prev => ({
      ...prev,
      requiredSkills: [...prev.requiredSkills, { ...newRequiredSkill }]
    }));

    setNewRequiredSkill({
      category: '',
      title: '',
      description: ''
    });
    setError(null);
  };

  const handleRemoveOfferedSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      offeredSkills: prev.offeredSkills.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveRequiredSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.put(
        API_ENDPOINTS.UPDATE_PROFILE,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      await updateProfile(response.data);
      setSuccess(true);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Programming',
    'Design',
    'Marketing',
    'Business',
    'Music',
    'Language',
    'Other'
  ];

  const experienceLevels = ['Beginner', 'Intermediate', 'Advanced'];

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
          alt={user.name}
          className="profile-avatar"
        />
        <h1>{user.name}</h1>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="edit-btn">
            Edit Profile
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Profile updated successfully!</div>}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="4"
            />
          </div>

          <div className="skills-section">
            <h3>Offered Skills</h3>
            <div className="add-skill-form">
              <select
                value={newOfferedSkill.category}
                onChange={(e) => setNewOfferedSkill(prev => ({
                  ...prev,
                  category: e.target.value
                }))}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Skill Title"
                value={newOfferedSkill.title}
                onChange={(e) => setNewOfferedSkill(prev => ({
                  ...prev,
                  title: e.target.value
                }))}
              />

              <select
                value={newOfferedSkill.experienceLevel}
                onChange={(e) => setNewOfferedSkill(prev => ({
                  ...prev,
                  experienceLevel: e.target.value
                }))}
              >
                {experienceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>

              <button type="button" onClick={handleAddOfferedSkill}>
                Add Skill
              </button>
            </div>

            <div className="skills-list">
              {formData.offeredSkills.map((skill, index) => (
                <div key={index} className="skill-item">
                  <span>{skill.category} - {skill.title} ({skill.experienceLevel})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveOfferedSkill(index)}
                    className="remove-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="skills-section">
            <h3>Required Skills</h3>
            <div className="add-skill-form">
              <select
                value={newRequiredSkill.category}
                onChange={(e) => setNewRequiredSkill(prev => ({
                  ...prev,
                  category: e.target.value
                }))}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Skill Title"
                value={newRequiredSkill.title}
                onChange={(e) => setNewRequiredSkill(prev => ({
                  ...prev,
                  title: e.target.value
                }))}
              />

              <button type="button" onClick={handleAddRequiredSkill}>
                Add Skill
              </button>
            </div>

            <div className="skills-list">
              {formData.requiredSkills.map((skill, index) => (
                <div key={index} className="skill-item">
                  <span>{skill.category} - {skill.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRequiredSkill(index)}
                    className="remove-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="save-btn">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  name: user.name,
                  bio: user.bio,
                  offeredSkills: user.offeredSkills,
                  requiredSkills: user.requiredSkills
                });
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-details">
          <div className="bio-section">
            <h3>Bio</h3>
            <p>{user.bio || 'No bio provided'}</p>
          </div>

          <div className="skills-display">
            <div className="offered-skills">
              <h3>Offered Skills</h3>
              {user.offeredSkills?.length > 0 ? (
                <ul>
                  {user.offeredSkills.map((skill, index) => (
                    <li key={index}>
                      <strong>{skill.category}</strong> - {skill.title}
                      <span className="skill-level">({skill.experienceLevel})</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No offered skills added yet</p>
              )}
            </div>

            <div className="required-skills">
              <h3>Required Skills</h3>
              {user.requiredSkills?.length > 0 ? (
                <ul>
                  {user.requiredSkills.map((skill, index) => (
                    <li key={index}>
                      <strong>{skill.category}</strong> - {skill.title}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No required skills added yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
