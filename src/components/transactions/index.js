// src/components/transactions/index.js
import React, { useState, useMemo } from 'react';
import { useAuth } from "@clerk/clerk-react";
import DatePicker from 'react-datepicker';
import { categories } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { transactionsApi } from '../../utils/api/transactions';
import { LoadingModal, AlertModal, ConfirmModal } from '../common/Modal';
import "react-datepicker/dist/react-datepicker.css";

export function TransactionForm({ onTransactionAdded }) {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const initialFormState = {
    description: '',
    amount: '',
    category: '',
    date: new Date(),
  };

  const [formData, setFormData] = useState(initialFormState);
  const [displayAmount, setDisplayAmount] = useState('');
  const inputStyles = "w-full p-3 border border-gray-300 rounded-lg";

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      const rawValue = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        amount: rawValue
      }));
      setDisplayAmount(rawValue ? formatCurrency(rawValue) : '');
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, date }));
  };

  const validateForm = () => {
    if (!formData.description.trim()) return 'Please enter a description';
    if (!formData.amount) return 'Please enter an amount';
    if (!formData.category) return 'Please select a category';
    if (!formData.date) return 'Please select a date';
    return null;
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setDisplayAmount('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      setShowErrorModal(true);
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();
      await transactionsApi.create(token, {
        description: formData.description,
        amount: parseInt(formData.amount, 10),
        category: formData.category,
        date: formData.date.toISOString()
      });
      
      await onTransactionAdded();
      resetForm();
      setShowSuccessModal(true);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to add transaction');
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg h-[405px] flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Add Transaction</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="description"
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          disabled={loading}
          className={inputStyles}
        />

        <input
          name="amount"
          type="text"
          placeholder="Amount"
          value={displayAmount}
          onChange={handleChange}
          disabled={loading}
          className={inputStyles}
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={loading}
          className={`${inputStyles} appearance-none`}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <DatePicker
          selected={formData.date}
          onChange={handleDateChange}
          dateFormat="dd.MM.yyyy"
          disabled={loading}
          className={inputStyles}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? 'bg-purple-300 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600'
          } text-white p-3 rounded-lg font-semibold transition-colors`}
        >
          {loading ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>

      {/* Modals */}
      <LoadingModal isOpen={loading} message="Adding transaction..." />
      
      <AlertModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success"
        message="Transaction added successfully"
      />

      <AlertModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error"
        message={errorMessage}
      />
    </div>
  );
}

export function TransactionList({ transactions = [], onDeleteTransaction, disabled }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions]);

  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!transactionToDelete) return;

    try {
      setLoading(true);
      await onDeleteTransaction(transactionToDelete.id);
      setShowDeleteModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      setShowErrorModal(true);
    } finally {
      setLoading(false);
      setTransactionToDelete(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg h-[740px] flex flex-col">    
      <h2 className="text-2xl font-bold mb-4">Transaction List</h2>
      <div className="space-y-2 overflow-y-auto" style={{maxHeight: 'vh'}}>
        {sortedTransactions.length > 0 ? (
          sortedTransactions.map(transaction => (
            <div 
              key={transaction.id} 
              className="flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100"
            >
              <div>
                <p className="font-semibold">{transaction.description}</p>
                <p className="text-sm text-gray-500">
                  {transaction.category} • {formatDate(transaction.date)}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-semibold">
                  {formatCurrency(transaction.amount)}
                </span>
                <button 
                  onClick={() => handleDeleteClick(transaction)}
                  disabled={disabled || loading}
                  className="text-red-500 hover:text-red-700 disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" 
                       className="h-5 w-5" 
                       fill="none" 
                       viewBox="0 0 24 24" 
                       stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            No transactions found
          </div>
        )}
      </div>

      {/* Modals */}
      <LoadingModal isOpen={loading} message="Deleting transaction..." />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setTransactionToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Transaction"
        message={
          transactionToDelete
            ? `Are you sure you want to delete "${transactionToDelete.description}" for ${formatCurrency(transactionToDelete.amount)}?`
            : "Are you sure you want to delete this transaction?"
        }
      />

      <AlertModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success"
        message="Transaction deleted successfully"
      />

      <AlertModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error"
        message="Failed to delete transaction"
      />
    </div>
  );
}