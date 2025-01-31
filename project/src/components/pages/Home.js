import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios, { CancelToken } from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_ENDPOINTS } from '../../config/api';
import '../../styles/Home.css';

// Custom hook for debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Home = () => {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use cancel token instead of AbortController
  const cancelTokenSourceRef = useRef(null);

  // Use the custom debounce hook
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Handle exchange request with improved validation
  const handleExchangeRequest = async (providerId, providerSkill) => {
    if (!currentUser) {
      alert('Please log in to send an exchange request.');
      return;
    }

    if (!currentUser.offeredSkills || currentUser.offeredSkills.length === 0) {
      alert('You need to add skills to your profile before requesting an exchange.');
      return;
    }

    try {
      const response = await axios.post(
        API_ENDPOINTS.EXCHANGES,
        {
          providerId,
          providerSkill,
          requesterSkill: currentUser.offeredSkills[0].title
        },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );
      
      // Detailed exchange request confirmation
      const exchangeDetails = `
        Exchange Request Details:
        - Requested from: ${response.data.recipient.user.name}
        - Your Skill: ${response.data.initiator.skill}
        - Their Skill: ${response.data.recipient.skill}
      `;
      
      alert(`Exchange request sent successfully!\n\n${exchangeDetails}`);
    } catch (err) {
      console.error('Error sending exchange request:', err);
      
      // Comprehensive error handling
      let errorMessage = 'Failed to send exchange request.';
      
      if (err.response) {
        errorMessage = err.response.data.message || 
          `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'No response from server. Check your internet connection.';
      } else {
        errorMessage = err.message || 'An unexpected error occurred.';
      }
      
      alert(errorMessage);
    }
  };

  // Fetch users with improved error handling
  const fetchUsers = useCallback(async () => {
    // Cancel previous request if exists
    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel('Operation canceled due to new request.');
    }

    // Create new cancel token
    cancelTokenSourceRef.current = CancelToken.source();

    try {
      setLoading(true);
      setError(null);

      // Construct URL based on search and category
      let url = `${API_ENDPOINTS.GET_USERS}/search/skills`;
      const params = {};

      if (debouncedQuery) {
        params.query = debouncedQuery;
      }

      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }

      // Make request with token and cancel token
      const response = await axios.get(url, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params, // Use axios params for query string
        cancelToken: cancelTokenSourceRef.current.token
      });

      // Filter and shuffle users
      const filteredUsers = response.data
        .filter(u => u._id !== currentUser?._id)
        .sort(() => Math.random() - 0.5);

      setUsers(filteredUsers);
      
      // Handle empty results
      if (filteredUsers.length === 0) {
        setError('No users found matching your search criteria.');
      }
    } catch (err) {
      // Specifically handle cancellation
      if (axios.isCancel(err)) {
        console.log('Request canceled', err.message);
        return;
      }

      console.error('Error fetching users:', err);

      const errorMessage = err.response?.data?.message || 
        'Failed to fetch users. Please check your connection.';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, currentUser?._id, debouncedQuery, selectedCategory]);

  // Fetch users on component mount and when dependencies change
  useEffect(() => {
    if (token) {
      fetchUsers();
    }

    // Cleanup function
    return () => {
      if (cancelTokenSourceRef.current) {
        cancelTokenSourceRef.current.cancel('Component unmounted');
      }
    };
  }, [fetchUsers, token]);

  // Handle search input changes
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const categories = ['All', 'Programming', 'Design', 'Marketing', 'Business', 'Music', 'Language', 'Other'];

  return (
    <div className="home-container">
      {/* Search and filter section */}
      <div className="search-section">
        <input 
          type="text" 
          placeholder="Search users by name, skill, or category..." 
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
        
        <div className="category-filter">
          {categories.map(category => (
            <button 
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Loading and error states */}
      {loading && <div className="loading-spinner">Loading users...</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Users grid */}
      <div className="users-grid">
        {!loading && !error && users.map(user => (
          <div key={user._id} className="user-card">
            <img 
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} 
              alt={user.name} 
              className="user-avatar" 
            />
            <h3>{user.name}</h3>
            <p className="user-bio">{user.bio || 'No bio provided'}</p>

            <div className="skills-section">
              <div className="offered-skills">
                <h4>Offered Skills</h4>
                <ul>
                  {user.offeredSkills.map((skill, index) => (
                    <li key={index}>
                      <span className="skill-title">{skill.title}</span>
                      <span className="skill-level">{skill.experienceLevel}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="required-skills">
                <h4>Looking For</h4>
                <ul>
                  {user.requiredSkills.map((skill, index) => (
                    <li key={index}>{skill.title}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="user-card-footer">
              <div className="rating">
                {user.averageRating?.toFixed(1) || 'No ratings'}
              </div>
              <div className="action-buttons">
                <Link 
                  to={`/messages/${user._id}`} 
                  className="message-btn"
                >
                  Message
                </Link>
                <button 
                  onClick={() => handleExchangeRequest(user._id, user.offeredSkills[0]?.title)}
                  className="exchange-btn"
                >
                  Request Exchange
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;