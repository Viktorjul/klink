// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AddTransaction from './components/AddTransaction';
import TransactionsList from './components/TransactionsList';
import BudgetSummary from './components/BudgetSummary';
import Categories from './components/Categories';
import SavingsGoal from './components/SavingsGoal';
import './index.css';

function App() {
  // State management for core app data
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(350000); // Monthly budget in cents
  const [yearlySavingsGoal, setYearlySavingsGoal] = useState(600000); // Yearly goal in cents

  // Fetch initial transactions data
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/transactions');
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    
    fetchTransactions();
  }, []);

  // Transaction management handlers
  const handleTransactionAdded = (newTransaction) => {
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
  };

  const handleTransactionUpdated = (updatedTransaction) => {
    setTransactions(prevTransactions => 
      prevTransactions.map(transaction => 
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
      )
    );
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(prevTransactions => 
      prevTransactions.filter(transaction => transaction.id !== id)
    );
  };

  // Calculate current month's savings
  const currentMonthSavings = transactions
    .filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const now = new Date();
      return transactionDate.getMonth() === now.getMonth() && 
             transactionDate.getFullYear() === now.getFullYear() && 
             transaction.category === "Savings";
    })
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  // Calculate total savings for current year
  const currentYearlySavings = transactions
    .filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getFullYear() === new Date().getFullYear() && 
             transaction.category === "Savings";
    })
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <div className="h-screen bg-gray-100 overflow-hidden flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-auto p-6">
          {/* Top row: Main functionality components */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <AddTransaction onTransactionAdded={handleTransactionAdded} />
            <BudgetSummary 
              transactions={transactions} 
              budget={budget} 
              monthlySavings={currentMonthSavings} 
            />
            <TransactionsList
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
              onEditTransaction={handleTransactionUpdated}
            />
          </div>
          {/* Bottom row: Analytics components */}
          <div className="grid grid-cols-2 gap-6">
            <Categories transactions={transactions} />
            <SavingsGoal 
              currentYearlySavings={currentYearlySavings} 
              yearlyGoal={yearlySavingsGoal} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;