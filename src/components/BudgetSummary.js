// src/components/BudgetSummary.js
import React, { useState, useEffect } from 'react';

function BudgetSummary({ transactions, budget, monthlySavings }) {
  // States for animated values
  const [animatedSpent, setAnimatedSpent] = useState(0);
  const [animatedLeft, setAnimatedLeft] = useState(0);
  const [animatedSavings, setAnimatedSavings] = useState(0);

  // Format numbers in Icelandic style: 1.000 kr
  const formatCurrency = (amount) => {
    const formattedNumber = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${formattedNumber} kr`;
  };

  // Calculate total spending excluding savings
  const spentThisMonth = transactions.reduce((total, transaction) => {
    if (transaction.category !== 'Savings') {
      return total + transaction.amount;
    }
    return total;
  }, 0);

  // Calculate remaining budget
  const leftOfBudget = budget - spentThisMonth;

  // Animation function
  useEffect(() => {
    const animationDuration = 1000; // 1 second
    const steps = 60; // 60 steps for smooth animation
    const interval = animationDuration / steps;

    // Calculate step sizes
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
        // Ensure final values are exact
        setAnimatedSpent(spentThisMonth);
        setAnimatedLeft(leftOfBudget);
        setAnimatedSavings(monthlySavings);
        clearInterval(timer);
      }
    }, interval);

    // Cleanup
    return () => clearInterval(timer);
  }, [spentThisMonth, leftOfBudget, monthlySavings]);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Budget Summary</h2>
      <div className="space-y-4">
        {/* Display total spending */}
        <div>
          <h3 className="text-lg font-semibold">Spent this month</h3>
          <p className="text-3xl font-bold text-red-500">
            {formatCurrency(Math.round(animatedSpent))}
          </p>
        </div>
        {/* Display remaining budget */}
        <div>
          <h3 className="text-lg font-semibold">Left of budget</h3>
          <p className="text-3xl font-bold text-purple-500">
            {formatCurrency(Math.round(animatedLeft))}
          </p>
        </div>
        {/* Display savings */}
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

export default BudgetSummary;
