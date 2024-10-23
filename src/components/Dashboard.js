// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "@clerk/clerk-react";
import AddTransaction from './AddTransaction';
import TransactionsList from './TransactionsList';
import BudgetSummary from './BudgetSummary';
import Categories from './Categories';
import SavingsGoal from './SavingsGoal';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function Dashboard() {
  const { getToken } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [budget, setBudget] = useState(350000);
  const [yearlySavingsGoal, setYearlySavingsGoal] = useState(600000);

  const handleBudgetChange = (newBudget) => {
    setBudget(newBudget);
  };

  const handleYearlyGoalChange = (newYearlyGoal) => {
    setYearlySavingsGoal(newYearlyGoal);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const token = await getToken();

        if (!token) {
          throw new Error("Token not available");
        }

        const response = await axios.get(`${API_BASE_URL}/transactions`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setTransactions(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [getToken]);

  // Calculate monthly savings
  const monthlySavings = transactions
    .filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const now = new Date();
      return transactionDate.getMonth() === now.getMonth() &&
             transactionDate.getFullYear() === now.getFullYear() &&
             transaction.category === 'Savings';
    })
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  // Calculate yearly savings
  const yearSavings = transactions
    .filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getFullYear() === new Date().getFullYear() &&
             transaction.category === 'Savings';
    })
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const handleTransactionAdded = async (transaction) => {
    try {
      const token = await getToken();
      const response = await axios.post(`${API_BASE_URL}/transactions`, transaction, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setTransactions(prev => [response.data, ...prev]);
      setSuccessMessage('Transaction added successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
      return true;
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError(err.response?.data?.message || 'Failed to add transaction');
      return false;
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      const token = await getToken();

      await axios.delete(`${API_BASE_URL}/transactions/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setTransactions(currentTransactions =>
        currentTransactions.filter(t => t.id !== id)
      );

      setSuccessMessage('Transaction deleted successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Failed to delete transaction');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <AddTransaction onTransactionAdded={handleTransactionAdded} />
        </div>
        <div>
          <BudgetSummary
            transactions={transactions}
            budget={budget}
            monthlySavings={monthlySavings}
            onBudgetChange={handleBudgetChange}
            yearlySavingsGoal={yearlySavingsGoal}
            onYearlyGoalChange={handleYearlyGoalChange}
          />
        </div>
        <div>
          <TransactionsList
            transactions={transactions}
            onDeleteTransaction={handleDeleteTransaction}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Categories transactions={transactions} />
        <SavingsGoal
          currentYearlySavings={yearSavings}
          yearlyGoal={yearlySavingsGoal}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 right-0 px-4 py-3"
          >
            <span className="sr-only">Close</span>
            <span className="text-xl">&times;</span>
          </button>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
