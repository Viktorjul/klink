// src/components/BudgetDashboard.js
import React, { useState } from 'react';
import BudgetCategories from './BudgetCategories';
import BudgetSummary from './BudgetSummary';

function BudgetDashboard() {
  const [totalBudget, setTotalBudget] = useState(0);

  const handleTotalBudgetChange = (newTotalBudget) => {
    setTotalBudget(newTotalBudget);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Budget Summary */}
      <BudgetSummary budget={totalBudget} transactions={[]} monthlySavings={110000} />

      {/* Budget Categories */}
      <BudgetCategories onTotalBudgetChange={handleTotalBudgetChange} />
    </div>
  );
}

export default BudgetDashboard;
