import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="logo">
          <span className="logo-icon">🔄</span>
          SkillSwap
        </Link>
      </div>

      <div className="navbar-menu">
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">
              <span className="nav-icon">📊</span>
              Dashboard
            </Link>
            <Link to="/messages" className="nav-link">
              <span className="nav-icon">💬</span>
              Messages
            </Link>
            <div className="nav-profile">
              <img
                src={user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)}
                alt={user.name}
                className="nav-avatar"
              />
              <div className="nav-dropdown">
                <Link to="/profile" className="dropdown-item">
                  <span className="item-icon">👤</span>
                  Profile
                </Link>
                <button onClick={handleLogout} className="dropdown-item logout-btn">
                  <span className="item-icon">🚪</span>
                  Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="nav-button login-btn">
              Login
            </Link>
            <Link to="/register" className="nav-button register-btn">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
