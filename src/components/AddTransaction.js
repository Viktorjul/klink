import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { categories } from '../utils/categories';
import { useAuth } from "@clerk/clerk-react";
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AddTransaction({ onTransactionAdded }) {
  const { getToken } = useAuth();
  
  const initialFormState = {
    description: '',
    amount: '',
    category: '',
    date: new Date(),
  };

  const [formData, setFormData] = useState(initialFormState);
  const [displayAmount, setDisplayAmount] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputStyles = "w-full p-3 border border-gray-300 rounded-lg";

  const formatAmount = (value) => {
    const number = value.replace(/\D/g, '');
    if (!number) return '';
    const formatted = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${formatted} kr`;
  };

  const unformatAmount = (value) => {
    return value.replace(/\D/g, '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(null);
    
    if (name === 'amount') {
      const rawValue = unformatAmount(value);
      setFormData(prevData => ({
        ...prevData,
        amount: rawValue
      }));
      setDisplayAmount(formatAmount(rawValue));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleDateChange = (date) => {
    setFormData(prevData => ({
      ...prevData,
      date
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.description.trim()) {
      setError('Please enter a description');
      return false;
    }
    if (!formData.amount) {
      setError('Please enter an amount');
      return false;
    }
    if (!formData.category) {
      setError('Please select a category');
      return false;
    }
    if (!formData.date) {
      setError('Please select a date');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setDisplayAmount('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Prevent double submission
    if (isSubmitting) {
      return;
    }
  
    // Validate form
    if (!validateForm()) {
      return;
    }
  
    setError(null);
    setIsSubmitting(true);
    
    try {
      const formattedData = {
        description: formData.description,
        amount: parseInt(formData.amount, 10),
        category: formData.category,
        date: formData.date.toISOString()
      };
  
      const token = await getToken();
      await axios.post(`${API_BASE_URL}/transactions`, formattedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      resetForm();
      onTransactionAdded(true);
      
    } catch (error) {
      console.error('Error submitting transaction:', error);
      let errorMessage = 'An error occurred while adding the transaction';
      
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = 'This appears to be a duplicate transaction. Please wait a moment before trying again.';
        } else {
          errorMessage = error.response.data?.message || 'Failed to add transaction';
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Add Transaction</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            name="description"
            type="text"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            disabled={isSubmitting}
            className={inputStyles}
          />
        </div>

        <div>
          <input
            name="amount"
            type="text"
            placeholder="Amount"
            value={displayAmount}
            onChange={handleChange}
            disabled={isSubmitting}
            className={inputStyles}
          />
        </div>

        <div>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`${inputStyles} appearance-none`}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <DatePicker
            selected={formData.date}
            onChange={handleDateChange}
            dateFormat="dd.MM.yyyy"
            disabled={isSubmitting}
            className={inputStyles}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full ${
            isSubmitting ? 'bg-purple-300 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600'
          } text-white p-3 rounded-lg font-semibold transition-colors`}
        >
          {isSubmitting ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
}

export default AddTransaction;
