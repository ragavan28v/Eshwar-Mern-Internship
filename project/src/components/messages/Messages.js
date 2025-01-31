import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_ENDPOINTS, SOCKET_URL } from '../../config/api';
import axios from 'axios';
import io from 'socket.io-client';
import '../../styles/Messages.css';

const Messages = () => {
  const { recipientId } = useParams();
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef();

  // Initialize socket connection
  useEffect(() => {
    if (!token) return;

    console.log('Initializing socket connection...');
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      setError(null);
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setIsConnected(false);
      setError('Connection error. Trying to reconnect...');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketRef.current.on('message', (message) => {
      console.log('Received message:', message);
      if (message.sender._id === recipientId || message.recipient._id === recipientId) {
        setMessages(prev => [...prev, message]);
      }
    });

    socketRef.current.on('error', (error) => {
      console.error('Socket error:', error);
      setError('Connection error. Please try again later.');
    });

    return () => {
      if (socketRef.current) {
        console.log('Cleaning up socket connection...');
        socketRef.current.disconnect();
      }
    };
  }, [token, recipientId]);

  // Fetch messages and recipient data
  useEffect(() => {
    const fetchData = async () => {
      if (!token || !recipientId) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch recipient details
        const recipientResponse = await axios.get(
          API_ENDPOINTS.GET_USER_BY_ID(recipientId),
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setRecipient(recipientResponse.data);

        // Fetch messages
        const messagesResponse = await axios.get(
          API_ENDPOINTS.GET_MESSAGES(recipientId),
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setMessages(messagesResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to load messages. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [recipientId, token]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending || !isConnected) return;

    try {
      setSending(true);
      setError(null);

      console.log('Sending message:', {
        recipientId,
        content: newMessage.trim()
      });

      const response = await axios.post(
        API_ENDPOINTS.SEND_MESSAGE,
        {
          recipientId,
          content: newMessage.trim()
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('Message sent successfully:', response.data);
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="messages-loading">Loading messages...</div>;
  }

  if (!recipient) {
    return <div className="messages-error">User not found</div>;
  }

  return (
    <div className="messages-container">
      <div className="messages-header">
        <img
          src={recipient.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(recipient.name)}`}
          alt={recipient.name}
          className="recipient-avatar"
        />
        <div className="recipient-info">
          <h2>{recipient.name}</h2>
          <p className={`recipient-status ${isConnected ? 'online' : 'offline'}`}>
            {isConnected ? 'Connected' : 'Connecting...'}
          </p>
        </div>
      </div>

      {error && (
        <div className="messages-error">
          {error}
        </div>
      )}

      <div className="messages-list">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`message ${message.sender._id === user._id ? 'sent' : 'received'}`}
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

      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={isConnected ? "Type a message..." : "Connecting..."}
          className="message-input"
          disabled={!isConnected || sending}
        />
        <button 
          type="submit" 
          className="send-button" 
          disabled={!newMessage.trim() || !isConnected || sending}
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Messages;
