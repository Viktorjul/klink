// src/pages/DashboardPage.js
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from "@clerk/clerk-react";
import { TransactionForm, TransactionList } from '../components/transactions';
import { BudgetOverview } from '../components/budget';
import { LoadingModal } from '../components/common/Modal';
import { useMessage } from '../utils/hooks/useMessage';
import { transactionsApi } from '../utils/api/transactions';
import { DEFAULT_BUDGET, DEFAULT_YEARLY_SAVINGS_GOAL } from '../utils/constants';

function DashboardPage() {
  const { getToken } = useAuth();
  const { showError } = useMessage();
  const [budget] = useState(DEFAULT_BUDGET);
  const [yearlySavingsGoal] = useState(DEFAULT_YEARLY_SAVINGS_GOAL);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await transactionsApi.getAll(token);
      setTransactions(response || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      showError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Used by TransactionForm
  const handleTransactionAdded = async () => {
    await fetchTransactions();
  };

  // Used by TransactionList
  const onDeleteTransaction = async (id) => {
    try {
      const token = await getToken();
      await transactionsApi.delete(token, id);
      // Immediately update local state
      setTransactions(current => current.filter(t => t.id !== id));
      return true; // Return success for the modal handling
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error; // Throw error for the modal handling
    }
  };

  const monthlySavings = useMemo(() => {
    if (!Array.isArray(transactions)) return 0;
    
    const now = new Date();
    return transactions
      .filter(transaction => {
        if (!transaction?.date) return false;
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === now.getMonth() &&
               transactionDate.getFullYear() === now.getFullYear() &&
               transaction.category === 'Savings';
      })
      .reduce((sum, transaction) => sum + (transaction?.amount || 0), 0);
  }, [transactions]);

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TransactionForm 
          onTransactionAdded={handleTransactionAdded}
          disabled={loading}
        />
        <BudgetOverview
          transactions={transactions}
          budget={budget}
          monthlySavings={monthlySavings}
          yearlySavingsGoal={yearlySavingsGoal}
        />
        <TransactionList
          transactions={transactions}
          onDeleteTransaction={onDeleteTransaction}
          disabled={loading}
        />
      </div>

      <LoadingModal isOpen={loading && !transactions.length} message="Loading transactions..." />
    </div>
  );
}

export default DashboardPage;