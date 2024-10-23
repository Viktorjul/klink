// src/components/Sidebar.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-full bg-white shadow-lg">
      <nav className="p-4 space-y-2">
        <button 
          onClick={() => navigate('/dashboard')} 
          className={`w-full text-left px-4 py-2 rounded-lg ${
            isActive('/dashboard') 
              ? 'bg-purple-500 text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => navigate('/transactions')} 
          className={`w-full text-left px-4 py-2 rounded-lg ${
            isActive('/transactions') 
              ? 'bg-purple-500 text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Transactions
        </button>
        <button 
          onClick={() => navigate('/budget-categories')} 
          className={`w-full text-left px-4 py-2 rounded-lg ${
            isActive('/budget-categories') 
              ? 'bg-purple-500 text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Budget Categories
        </button>
        <button 
          onClick={() => navigate('/savings')} 
          className={`w-full text-left px-4 py-2 rounded-lg ${
            isActive('/savings') 
              ? 'bg-purple-500 text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Savings
        </button>
        <button 
          onClick={() => navigate('/investments')} 
          className={`w-full text-left px-4 py-2 rounded-lg ${
            isActive('/investments') 
              ? 'bg-purple-500 text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Investments
        </button>
        <button 
          onClick={() => navigate('/reports')} 
          className={`w-full text-left px-4 py-2 rounded-lg ${
            isActive('/reports') 
              ? 'bg-purple-500 text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Reports
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;