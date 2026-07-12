import api from './api';

/**
 * Authentication API interactions handler
 * 
 * TODO:
 * - Implement login(credentials) -> POST /api/auth/login.
 * - Implement register(details) -> POST /api/auth/register.
 * - Implement getProfile() -> GET /api/auth/me.
 */
const authService = {
  login: async (email, password) => {
    // TODO: POST /auth/login
    return null;
  },

  register: async (name, email, password) => {
    // TODO: POST /auth/register
    return null;
  },

  getCurrentUser: async () => {
    // TODO: GET /auth/me
    return null;
  },
};

export default authService;
