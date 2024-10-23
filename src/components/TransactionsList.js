import React, { useState, useMemo } from 'react';
import { useAuth } from "@clerk/clerk-react";
import ConfirmModal from './ConfirmModal';

function TransactionsList({ transactions, onDeleteTransaction }) {
  const { getToken } = useAuth();
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatCurrency = (amount) => {
    const formattedNumber = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${formattedNumber} kr`;
  };

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions]);

  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!transactionToDelete) return;

    setDeletingId(transactionToDelete.id);
    setError(null);

    try {
      await onDeleteTransaction(transactionToDelete.id);
      setModalOpen(false);
      setTransactionToDelete(null);
    } catch (error) {
      console.error('Error in handleDelete:', error);
      setError('Failed to delete transaction. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-3xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Transaction List</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-2 font-bold"
            >
              ×
            </button>
          </div>
        )}
        
        <div className="space-y-2 overflow-y-auto" style={{maxHeight: '300px'}}>
          {sortedTransactions.length > 0 ? (
            sortedTransactions.map(transaction => (
              <div 
                key={`transaction-${transaction.id}`} 
                className={`flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-opacity duration-200 ${
                  deletingId === transaction.id ? 'opacity-50' : 'opacity-100'
                }`}
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
                    disabled={deletingId === transaction.id}
                    className={`text-red-500 hover:text-red-700 transition-colors ${
                      deletingId === transaction.id ? 'cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    aria-label="Delete transaction"
                  >
                    {deletingId === transaction.id ? (
                      <span className="animate-spin">↻</span>
                    ) : (
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
                    )}
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
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
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
    </>
  );
}

export default TransactionsList;