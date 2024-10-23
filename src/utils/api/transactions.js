// src/utils/api/transactions.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export const transactionsApi = {
  async getAll(token) {
    try {
      const response = await axios.get(`${API_BASE_URL}/transactions`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  async create(token, transaction) {
    const response = await axios.post(
      `${API_BASE_URL}/transactions`, 
      transaction,
      {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  },

  async delete(token, id) {
    await axios.delete(
      `${API_BASE_URL}/transactions/${id}`,
      {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }
};