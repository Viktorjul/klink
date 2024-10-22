import React from 'react';
import { categories } from '../utils/categories';

function Categories({ transactions }) {
  // Format numbers in Icelandic style: 1.000 kr
  const formatCurrency = (amount) => {
    const formattedNumber = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${formattedNumber} kr`;
  };

  // Calculate total amount spent in each category
  const categoryTotals = categories.reduce((acc, category) => {
    acc[category] = transactions
      .filter(t => t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
    return acc;
  }, {});

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <div className="space-y-2 overflow-y-auto" style={{maxHeight: '300px'}}>
        {categories.map(category => (
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

export default Categories;