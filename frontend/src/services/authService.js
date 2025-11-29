import api from './api';

export const authService = {
  register: async (formData) => {
    return await api.post('/api/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  login: async (emailOrPhone, password) => {
    return await api.post('/api/auth/login', {
      emailOrPhone,
      password
    });
  },

  refreshToken: async (refreshToken) => {
    return await api.post('/api/auth/refresh-token', {
      refreshToken
    });
  }
};

