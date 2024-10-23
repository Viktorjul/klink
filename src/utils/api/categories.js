// src/utils/api/categories.js
import axios from 'axios';
import { API_BASE_URL } from '../constants';

export const categoriesApi = {
  async getAll(token) {
    const response = await axios.get(`${API_BASE_URL}/budget-categories`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async create(token, category) {
    const response = await axios.post(
      `${API_BASE_URL}/budget-categories`,
      category,
      { headers: { Authorization: `Bearer ${token}` }}
    );
    return response.data;
  },

  async update(token, id, updates) {
    const response = await axios.put(
      `${API_BASE_URL}/budget-categories/${id}`,
      updates,
      { headers: { Authorization: `Bearer ${token}` }}
    );
    return response.data;
  },

  async delete(token, id) {
    await axios.delete(
      `${API_BASE_URL}/budget-categories/${id}`,
      { headers: { Authorization: `Bearer ${token}` }}
    );
  }
};