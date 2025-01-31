const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Authentication endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  GET_USER: `${API_BASE_URL}/auth/user`,

  // User-related endpoints
  GET_USERS: `${API_BASE_URL}/users`,
  UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
  GET_USER_BY_ID: (userId) => `${API_BASE_URL}/users/${userId}`,

  // Exchanges endpoints
  EXCHANGES: `${API_BASE_URL}/exchanges`,
  MY_EXCHANGES: `${API_BASE_URL}/exchanges/my-requests`,

  // Skill-related endpoints
  ADD_SKILL: `${API_BASE_URL}/skills`,
  GET_SKILLS: `${API_BASE_URL}/skills`,

  // Messaging endpoints
  GET_CONVERSATIONS: `${API_BASE_URL}/messages/conversations`,
  GET_MESSAGES: (conversationId) => `${API_BASE_URL}/messages/${conversationId}`,
  SEND_MESSAGE: `${API_BASE_URL}/messages`,
};

export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
