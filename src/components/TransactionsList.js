import React, { useMemo } from 'react';

function TransactionsList({ transactions, onDeleteTransaction, onEditTransaction }) {
  // Format date to display as "MMM DD, YYYY"
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format numbers in Icelandic style: 1.000 kr
  const formatCurrency = (amount) => {
    const formattedNumber = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${formattedNumber} kr`;
  };

  // Memoized sorting of transactions by date (newest first)
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions]);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Transaction list</h2>
      <div className="space-y-2 overflow-y-auto" style={{maxHeight: '300px'}}>
        {sortedTransactions.map(transaction => (
          <div key={transaction.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
            {/* Transaction details */}
            <div>
              <p className="font-semibold">{transaction.description}</p>
              <p className="text-sm text-gray-500">
                {transaction.category} • {formatDate(transaction.date)}
              </p>
            </div>
            {/* Amount and action buttons */}
            <div className="flex items-center space-x-2">
              <span className="font-semibold">
                {formatCurrency(transaction.amount)}
              </span>
              <button 
                onClick={() => onEditTransaction(transaction)} 
                className="text-blue-500"
                aria-label="Edit transaction"
              >
                ✎
              </button>
              <button 
                onClick={() => onDeleteTransaction(transaction.id)} 
                className="text-red-500"
                aria-label="Delete transaction"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionsList;