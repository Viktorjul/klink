import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { categories } from '../utils/categories';

function AddTransaction({ onTransactionAdded }) {
  // Initialize form state with empty values
  const initialFormState = {
    description: '',
    amount: '',
    category: '',
    date: new Date(),
  };

  const [formData, setFormData] = useState(initialFormState);
  // Separate state for formatted display of amount
  const [displayAmount, setDisplayAmount] = useState('');
  const inputStyles = "w-full p-3 border border-gray-300 rounded-lg";

  // Format number with Icelandic thousands separators
  const formatAmount = (value) => {
    const number = value.replace(/\D/g, ''); // Remove non-digits
    if (!number) return '';
    
    // Add thousands separators
    const formatted = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${formatted} kr`;
  };

  // Remove formatting to get raw number
  const unformatAmount = (value) => {
    return value.replace(/\D/g, '');
  };

  // Handle changes for text and select inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      // Store raw number in form data
      const rawValue = unformatAmount(value);
      setFormData(prevData => ({
        ...prevData,
        amount: rawValue
      }));
      // Update display with formatting
      setDisplayAmount(formatAmount(rawValue));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  // Handle amount input specifically
  const handleAmountChange = (e) => {
    const value = e.target.value;
    const rawValue = unformatAmount(value);
    
    // Only update if input is empty or a valid number
    if (!rawValue || /^\d+$/.test(rawValue)) {
      setFormData(prevData => ({
        ...prevData,
        amount: rawValue
      }));
      setDisplayAmount(formatAmount(rawValue));
    }
  };

  // Handle date picker changes
  const handleDateChange = (date) => {
    setFormData(prevData => ({
      ...prevData,
      date
    }));
  };

  // Submit the form data to the server
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formattedData = {
        ...formData,
        date: formData.date.toISOString().split('T')[0],
      };

      const response = await axios.post(
        'http://localhost:5000/transactions', 
        formattedData
      );

      onTransactionAdded(response.data);
      setFormData(initialFormState);
      setDisplayAmount('');
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Add Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Description input */}
        <input
          name="description"
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className={inputStyles}
        />

        {/* Amount input */}
        <input
          name="amount"
          type="text" // Changed to text to allow formatting
          placeholder="Amount"
          value={displayAmount}
          onChange={handleAmountChange}
          required
          className={inputStyles}
        />

        {/* Category selector */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className={`${inputStyles} appearance-none`}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Date picker */}
        <DatePicker
          selected={formData.date}
          onChange={handleDateChange}
          dateFormat="dd.MM.yyyy"
          className={inputStyles}
        />

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-purple-500 text-white p-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
}

export default AddTransaction;