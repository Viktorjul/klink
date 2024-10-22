// src/components/Sidebar.js
import React from 'react';

function Sidebar() {
  return (
    <div className="bg-white w-64 h-full p-4 shadow-lg">
      <nav className="space-y-2">
        <button className="w-full text-left px-4 py-2 rounded-lg bg-purple-500 text-white">
          Dashboard
        </button>
        <button className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
          Transactions
        </button>
        <button className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
          Budget
        </button>
        <button className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
          Savings
        </button>
        <button className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
          Investments
        </button>
        <button className="w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
          Reports
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;