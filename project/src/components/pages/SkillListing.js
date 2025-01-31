import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import '../../styles/SkillListing.css';

const SkillListing = () => {
  const { token } = useAuth();
  const [skills, setSkills] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    experienceLevel: '',
    searchTerm: ''
  });

  const categories = [
    'Programming',
    'Design',
    'Languages',
    'Music',
    'Business',
    'Fitness',
    'Other'
  ];

  const experienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  useEffect(() => {
    fetchSkills();
  }, [filters]);

  const fetchSkills = async () => {
    try {
      let url = 'http://localhost:5000/api/skills';
      if (filters.category) {
        url += `/category/${filters.category}`;
      }
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let filteredSkills = res.data;
      
      if (filters.experienceLevel) {
        filteredSkills = filteredSkills.filter(
          skill => skill.experienceLevel === filters.experienceLevel
        );
      }
      
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredSkills = filteredSkills.filter(
          skill =>
            skill.title.toLowerCase().includes(searchLower) ||
            skill.description.toLowerCase().includes(searchLower) ||
            skill.category.toLowerCase().includes(searchLower)
        );
      }
      
      setSkills(filteredSkills);
    } catch (err) {
      console.error('Error fetching skills:', err);
    }
  };

  const handleInitiateExchange = async (skillId) => {
    try {
      await axios.post(
        'http://localhost:5000/api/exchanges',
        { recipientId: skillId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Exchange request sent successfully!');
    } catch (err) {
      console.error('Error initiating exchange:', err);
      alert('Failed to send exchange request');
    }
  };

  return (
    <div className="skill-listing-container">
      <div className="filters-section">
        <h2>Find Skills</h2>
        <div className="filters">
          <div className="filter-group">
            <label>Category:</label>
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Experience Level:</label>
            <select
              value={filters.experienceLevel}
              onChange={(e) =>
                setFilters({ ...filters, experienceLevel: e.target.value })
              }
            >
              <option value="">All Levels</option>
              {experienceLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Search:</label>
            <input
              type="text"
              value={filters.searchTerm}
              onChange={(e) =>
                setFilters({ ...filters, searchTerm: e.target.value })
              }
              placeholder="Search skills..."
              className="search-input"
            />
          </div>
        </div>
      </div>

      <div className="skills-grid">
        {skills.map((skill) => (
          <div key={skill._id} className="skill-card">
            <div className="skill-header">
              <h3>{skill.title}</h3>
              <span className="category-tag">{skill.category}</span>
            </div>
            <p className="skill-description">{skill.description}</p>
            <div className="skill-footer">
              <span className="experience-level">
                Level: {skill.experienceLevel}
              </span>
              <button
                className="btn btn-primary"
                onClick={() => handleInitiateExchange(skill.userId)}
              >
                Request Exchange
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillListing;
