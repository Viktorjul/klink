// src/components/BudgetCategories.js
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@clerk/clerk-react";
import axios from 'axios';
import { categories as categoryOptions } from '../utils/categories';

function BudgetCategories({ onTotalBudgetChange = () => {} }) {
  const { getToken } = useAuth();
  const [categories, setCategories] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [newCategory, setNewCategory] = useState({ name: '', amount: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/budget-categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.length > 0) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load budget categories');
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleUpdateCategory = async (id, newAmount) => {
    try {
      const token = await getToken();
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/budget-categories/${id}`, 
        { amount: newAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setCategories(cats => 
        cats.map(cat => 
          cat.id === id ? { ...cat, amount: parseFloat(newAmount) } : cat
        )
      );
      
      setSuccessMessage('Budget updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to update budget category');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.amount) {
      setError('Please fill in both name and amount');
      return;
    }

    try {
      const token = await getToken();
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/budget-categories`,
        newCategory,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setCategories([...categories, response.data]);
      setNewCategory({ name: '', amount: '' });
      setSuccessMessage('Category added successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to add category');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const token = await getToken();
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/budget-categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCategories(cats => cats.filter(cat => cat.id !== id));
      setSuccessMessage('Category deleted successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to delete category');
    }
  };

  useEffect(() => {
    const total = categories.reduce((sum, cat) => sum + parseFloat(cat.amount || 0), 0);
    setTotalBudget(total);
    if (typeof onTotalBudgetChange === 'function') {
      onTotalBudgetChange(total);
    }
  }, [categories, onTotalBudgetChange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Budget Categories</h2>
        <div className="text-lg font-semibold text-gray-600">
          Total Budget: {totalBudget.toLocaleString('is-IS', { style: 'currency', currency: 'ISK' })}
        </div>
      </div>

      {/* Add New Category Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
        <form onSubmit={handleAddCategory} className="flex gap-4">
          <select
            value={newCategory.name}
            onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Select a category</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Amount"
            className="w-32 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={newCategory.amount}
            onChange={(e) => setNewCategory(prev => ({ ...prev, amount: e.target.value }))}
          />
          <button
            type="submit"
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Add
          </button>
        </form>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
              <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
            </div>
            <div className="flex gap-4 items-center">
              <input
                type="number"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={category.amount}
                onChange={(e) => handleUpdateCategory(category.id, e.target.value)}
              />
              <span className="text-gray-600 font-medium">ISK</span>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Messages */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}
    </div>
  );
}

export default BudgetCategories;
