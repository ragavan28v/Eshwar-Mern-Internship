import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Messages.css';

const Messages = () => {
  const { userId } = useParams();
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipientUser, setRecipientUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    fetchRecipientUser();
    const interval = setInterval(fetchMessages, 5000); // Poll for new messages
    return () => clearInterval(interval);
  }, [userId, token]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
      setLoading(false);
      scrollToBottom();
    } catch (err) {
      console.error('Error fetching messages:', err);
      setLoading(false);
    }
  };

  const fetchRecipientUser = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecipientUser(res.data);
    } catch (err) {
      console.error('Error fetching recipient user:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post(
        'http://localhost:5000/api/messages',
        {
          recipientId: userId,
          content: newMessage
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="messages-container">
      <div className="messages-header">
        {recipientUser && (
          <div className="recipient-info">
            <img
              src={recipientUser.avatar || 'https://via.placeholder.com/40'}
              alt={recipientUser.name}
              className="user-avatar"
            />
            <div className="user-details">
              <h2>{recipientUser.name}</h2>
              <span className="user-status">
                {recipientUser.online ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="messages-content">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`message ${
              message.senderId === user._id ? 'sent' : 'received'
            }`}
          >
            <div className="message-content">
              <p>{message.content}</p>
              <span className="message-time">
                {new Date(message.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </form>
    </div>
  );
};

export default Messages;
