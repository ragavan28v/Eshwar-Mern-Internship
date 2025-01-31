import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import '../../styles/Conversations.css';

const Conversations = () => {
  const { token } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/messages/conversations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConversations(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load conversations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchConversations();
    }
  }, [token]);

  if (loading) {
    return <div className="conversations-loading">Loading conversations...</div>;
  }

  if (error) {
    return <div className="conversations-error">{error}</div>;
  }

  if (conversations.length === 0) {
    return (
      <div className="conversations-empty">
        <p>No conversations yet</p>
        <Link to="/" className="start-conversation-btn">
          Find Users to Chat With
        </Link>
      </div>
    );
  }

  return (
    <div className="conversations-container">
      <h2>Your Conversations</h2>
      <div className="conversations-list">
        {conversations.map((conversation) => (
          <Link
            key={conversation._id}
            to={`/messages/${conversation.user._id}`}
            className="conversation-item"
          >
            <img
              src={conversation.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.user.name)}`}
              alt={conversation.user.name}
              className="conversation-avatar"
            />
            <div className="conversation-details">
              <div className="conversation-header">
                <h3>{conversation.user.name}</h3>
                <span className="conversation-time">
                  {new Date(conversation.lastMessage.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="conversation-last-message">
                {conversation.lastMessage.content}
              </p>
              {conversation.unreadCount > 0 && (
                <span className="unread-badge">{conversation.unreadCount}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Conversations;
