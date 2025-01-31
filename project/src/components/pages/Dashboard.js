import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Dashboard.css';

// Mock data for development
const mockSkills = [
  {
    id: 1,
    title: 'Web Development',
    description: 'Full-stack development with React and Node.js',
    category: 'Programming',
    experienceLevel: 'Advanced',
    user: {
      id: 'user123',
      name: 'John Doe',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe'
    }
  },
  {
    id: 2,
    title: 'UI/UX Design',
    description: 'Creating beautiful and intuitive user interfaces',
    category: 'Design',
    experienceLevel: 'Intermediate',
    user: {
      id: 'user456',
      name: 'Jane Smith',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith'
    }
  }
];

const mockNotifications = [
  {
    id: 1,
    type: 'exchange_request',
    message: 'Jane Smith wants to exchange skills with you',
    timestamp: '2024-01-30T10:30:00Z',
    read: false,
    user: {
      id: 'user456',
      name: 'Jane Smith',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith'
    }
  },
  {
    id: 2,
    type: 'message',
    message: 'New message from Mike Johnson',
    timestamp: '2024-01-30T09:15:00Z',
    read: true,
    user: {
      id: 'user789',
      name: 'Mike Johnson',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson'
    }
  }
];

const mockExchanges = [
  {
    id: 1,
    status: 'active',
    skill: 'Web Development',
    partner: {
      id: 'user456',
      name: 'Jane Smith',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith'
    },
    startDate: '2024-01-25T00:00:00Z'
  },
  {
    id: 2,
    status: 'pending',
    skill: 'UI/UX Design',
    partner: {
      id: 'user789',
      name: 'Mike Johnson',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson'
    },
    startDate: '2024-01-29T00:00:00Z'
  }
];

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [skills, setSkills] = useState(mockSkills);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [exchanges, setExchanges] = useState(mockExchanges);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In a real app, fetch data from API
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const markNotificationAsRead = (notificationId) => {
    setNotifications(notifications.map(notif =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const handleExchangeAction = (exchangeId, action) => {
    setExchanges(exchanges.map(exchange =>
      exchange.id === exchangeId
        ? { ...exchange, status: action === 'accept' ? 'active' : 'rejected' }
        : exchange
    ));
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name}!</h1>
        <Link to="/profile" className="btn btn-secondary">
          <span className="btn-icon">👤</span>
          Edit Profile
        </Link>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span className="tab-icon">📊</span>
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          <span className="tab-icon">🎯</span>
          My Skills
        </button>
        <button
          className={`tab-btn ${activeTab === 'exchanges' ? 'active' : ''}`}
          onClick={() => setActiveTab('exchanges')}
        >
          <span className="tab-icon">🔄</span>
          Exchanges
        </button>
        <button
          className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <span className="tab-icon">🔔</span>
          Notifications
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="notification-badge">
              {notifications.filter(n => !n.read).length}
            </span>
          )}
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>My Skills</h3>
                <p className="stat-number">{skills.length}</p>
                <Link to="/profile" className="stat-link">
                  Add more skills →
                </Link>
              </div>
              <div className="stat-card">
                <h3>Active Exchanges</h3>
                <p className="stat-number">
                  {exchanges.filter(e => e.status === 'active').length}
                </p>
                <Link to="/" className="stat-link">
                  Find new exchanges →
                </Link>
              </div>
              <div className="stat-card">
                <h3>Unread Notifications</h3>
                <p className="stat-number">
                  {notifications.filter(n => !n.read).length}
                </p>
                <button
                  className="stat-link"
                  onClick={() => setActiveTab('notifications')}
                >
                  View notifications →
                </button>
              </div>
            </div>

            <div className="recent-activity">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                {[...notifications].sort((a, b) => 
                  new Date(b.timestamp) - new Date(a.timestamp)
                ).slice(0, 3).map(notification => (
                  <div key={notification.id} className="activity-item">
                    <img
                      src={notification.user.avatar}
                      alt={notification.user.name}
                      className="activity-avatar"
                    />
                    <div className="activity-content">
                      <p>{notification.message}</p>
                      <span className="activity-time">
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="skills-section">
            <div className="section-header">
              <h2>My Skills</h2>
              <Link to="/profile" className="btn btn-primary">
                Add New Skill
              </Link>
            </div>
            <div className="skills-grid">
              {skills.map(skill => (
                <div key={skill.id} className="skill-card">
                  <div className="skill-header">
                    <h3>{skill.title}</h3>
                    <span className="category-tag">
                      {skill.category}
                    </span>
                  </div>
                  <p className="skill-description">{skill.description}</p>
                  <div className="skill-footer">
                    <span className="experience-level">
                      {skill.experienceLevel}
                    </span>
                    <div className="action-buttons">
                      <Link
                        to={`/profile`}
                        className="btn btn-secondary"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'exchanges' && (
          <div className="exchanges-section">
            <h2>Skill Exchanges</h2>
            <div className="exchanges-grid">
              {exchanges.map(exchange => (
                <div key={exchange.id} className="exchange-card">
                  <div className="exchange-header">
                    <img
                      src={exchange.partner.avatar}
                      alt={exchange.partner.name}
                      className="partner-avatar"
                    />
                    <div className="exchange-info">
                      <h3>{exchange.skill}</h3>
                      <p>with {exchange.partner.name}</p>
                    </div>
                    <span className={`status-badge ${exchange.status}`}>
                      {exchange.status}
                    </span>
                  </div>
                  <div className="exchange-details">
                    <p>Started: {new Date(exchange.startDate).toLocaleDateString()}</p>
                  </div>
                  <div className="exchange-actions">
                    <Link
                      to={`/messages/${exchange.partner.id}`}
                      className="btn btn-primary"
                    >
                      Message
                    </Link>
                    {exchange.status === 'pending' && (
                      <>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleExchangeAction(exchange.id, 'accept')}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleExchangeAction(exchange.id, 'reject')}
                        >
                          Decline
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="notifications-section">
            <h2>Notifications</h2>
            <div className="notifications-list">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <img
                    src={notification.user.avatar}
                    alt={notification.user.name}
                    className="notification-avatar"
                  />
                  <div className="notification-content">
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {new Date(notification.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  {!notification.read && (
                    <span className="unread-indicator"></span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
