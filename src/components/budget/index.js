// src/components/budget/index.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from "@clerk/clerk-react";
import axios from 'axios';
import { categories as categoryOptions } from '../../utils/categories';
import { LoadingModal } from '../common/Modal';
import PropTypes from 'prop-types';

// Shared utilities
const formatCurrency = (amount) => {
  const formattedNumber = Math.round(amount || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formattedNumber} kr`;
};

export function BudgetOverview({ 
  transactions = [], 
  budget = 0, 
  monthlySavings = 0, 
  yearlySavingsGoal = 0 
}) {
  const currentYearlySavings = useMemo(() => {
    if (!Array.isArray(transactions)) return 0;
    return transactions
      .filter(t => t?.category === 'Savings')
      .reduce((sum, t) => sum + (t?.amount || 0), 0);
  }, [transactions]);

  return (
    <div className="space-y-6">
      <BudgetSummary 
        transactions={transactions}
        budget={budget}
        monthlySavings={monthlySavings}
      />
      <CategoryList transactions={transactions} />
      <SavingsProgress 
        currentYearlySavings={currentYearlySavings}
        yearlyGoal={yearlySavingsGoal}
      />
    </div>
  );
}

function BudgetSummary({ transactions = [], budget = 0, monthlySavings = 0 }) {
  const [animatedSpent, setAnimatedSpent] = useState(0);
  const [animatedLeft, setAnimatedLeft] = useState(0);
  const [animatedSavings, setAnimatedSavings] = useState(0);

  const spentThisMonth = useMemo(() => {
    if (!Array.isArray(transactions)) return 0;
    return transactions.reduce((total, transaction) => {
      if (transaction?.category !== 'Savings') {
        return total + (transaction?.amount || 0);
      }
      return total;
    }, 0);
  }, [transactions]);

  const leftOfBudget = Math.max(0, budget - spentThisMonth);

  useEffect(() => {
    const animationDuration = 1000;
    const steps = 60;
    const interval = animationDuration / steps;

    const spentStep = spentThisMonth / steps;
    const leftStep = leftOfBudget / steps;
    const savingsStep = monthlySavings / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setAnimatedSpent(prev => Math.min(spentThisMonth, prev + spentStep));
        setAnimatedLeft(prev => Math.min(leftOfBudget, prev + leftStep));
        setAnimatedSavings(prev => Math.min(monthlySavings, prev + savingsStep));
      } else {
        setAnimatedSpent(spentThisMonth);
        setAnimatedLeft(leftOfBudget);
        setAnimatedSavings(monthlySavings);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [spentThisMonth, leftOfBudget, monthlySavings]);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Budget Summary</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Spent this month</h3>
          <p className="text-3xl font-bold text-red-500">
            {formatCurrency(Math.round(animatedSpent))}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Left of budget</h3>
          <p className="text-3xl font-bold text-purple-500">
            {formatCurrency(Math.round(animatedLeft))}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Saved this month</h3>
          <p className="text-3xl font-bold text-green-500">
            {formatCurrency(Math.round(animatedSavings))}
          </p>
        </div>
      </div>
    </div>
  );
}

function CategoryList({ transactions = [] }) {
  const categoryTotals = useMemo(() => {
    if (!Array.isArray(transactions)) return {};
    return categoryOptions.reduce((acc, category) => {
      acc[category] = transactions
        .filter(t => t?.category === category)
        .reduce((sum, t) => sum + (t?.amount || 0), 0);
      return acc;
    }, {});
  }, [transactions]);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <div className="space-y-2 overflow-y-auto" style={{maxHeight: '300px'}}>
        {categoryOptions.map(category => (
          <div key={category} className="flex justify-between items-center">
            <span>{category}</span>
            <span className="font-semibold text-purple-600">
              {formatCurrency(categoryTotals[category])}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SavingsProgress({ 
  currentYearlySavings = 0, 
  yearlyGoal = 0 
}) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const finalPercentage = Math.min(
    Math.round((currentYearlySavings / (yearlyGoal || 1)) * 100), 
    100
  );

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  useEffect(() => {
    const animationDuration = 1000;
    const steps = 60;
    const interval = animationDuration / steps;
    const percentageStep = finalPercentage / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setAnimatedPercentage(prev => Math.min(finalPercentage, prev + percentageStep));
      } else {
        setAnimatedPercentage(finalPercentage);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [finalPercentage]);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Yearly Savings Goal</h2>
      <div className="flex justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle 
              cx="50" cy="50" r={radius}
              fill="none" stroke="#e5e7eb" strokeWidth="10"
            />
            <circle 
              cx="50" cy="50" r={radius}
              fill="none" stroke="#8b5cf6" strokeWidth="10"
              strokeLinecap="round" strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 50 50)"
              className="transition-all duration-100 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-bold">
              {Math.round(animatedPercentage)}%
            </span>
            <span className="text-sm text-gray-500">of goal</span>
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xl font-semibold mb-2">
          Goal: {formatCurrency(yearlyGoal)}
        </p>
        <p className="text-gray-500">
          Saved this year: {formatCurrency(currentYearlySavings)}
        </p>
      </div>
    </div>
  );
}

export function BudgetCategoryManager() {
  const { getToken } = useAuth();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', amount: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/budget-categories`,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setCategories(response.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load budget categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleUpdateCategory = async (id, newAmount) => {
    if (!id || !newAmount) return;
    
    try {
      const token = await getToken();
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/budget-categories/${id}`,
        { amount: parseFloat(newAmount) },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setCategories(cats => 
        cats.map(cat => 
          cat.id === id ? { ...cat, amount: parseFloat(newAmount) } : cat
        )
      );
      
      showSuccess('Budget updated successfully');
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
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/budget-categories`,
        { ...newCategory, amount: parseFloat(newCategory.amount) },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setCategories(prev => [...prev, response.data]);
      setNewCategory({ name: '', amount: '' });
      showSuccess('Category added successfully');
    } catch (err) {
      setError('Failed to add category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!id) return;

    try {
      const token = await getToken();
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/budget-categories/${id}`,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setCategories(cats => cats.filter(cat => cat.id !== id));
      showSuccess('Category deleted successfully');
    } catch (err) {
      setError('Failed to delete category');
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  if (loading) {
    return <LoadingModal isOpen={true} message="Loading budget categories..." />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
        <form onSubmit={handleAddCategory} className="flex gap-4">
          <select
            value={newCategory.name}
            onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select a category</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Amount"
            className="w-32 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-500"
            value={newCategory.amount}
            onChange={(e) => setNewCategory(prev => ({ ...prev, amount: e.target.value }))}
            min="0"
          />
          <button
            type="submit"
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Add
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{category.name}</h3>
            </div>
            <div className="flex gap-4 items-center">
              <input
                type="number"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
                value={category.amount}
                onChange={(e) => handleUpdateCategory(category.id, e.target.value)}
                min="0"
              />
              <span className="text-gray-600 font-medium">ISK</span>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

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