import api from './api';

export const userService = {
  getAllUsers: async (params = {}) => {
    return await api.get('/api/users', { params });
  },

  getUserById: async (id) => {
    return await api.get(`/api/users/${id}`);
  },

  updateUser: async (id, formData) => {
    return await api.put(`/api/users/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  deleteUser: async (id) => {
    return await api.delete(`/api/users/${id}`);
  }
};

