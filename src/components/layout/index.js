// src/components/layout/index.js
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { UserButton, useUser } from "@clerk/clerk-react";

// Navigation items for the sidebar
const navigationItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/budget-categories', label: 'Budget Categories' },
  { path: '/savings', label: 'Savings' },
  { path: '/investments', label: 'Investments' },
  { path: '/reports', label: 'Reports' }
];

function Header() {
  const { user } = useUser();
  
  return (
    <header className="bg-white shadow z-10">
      <div className="px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">Klink</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.firstName}</span>
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="h-full bg-white shadow-lg">
      <nav className="p-4 space-y-2">
        {navigationItems.map(({ path, label }) => (
          <button 
            key={path}
            onClick={() => navigate(path)} 
            className={`w-full text-left px-4 py-2 rounded-lg ${
              location.pathname === path
                ? 'bg-purple-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 flex-shrink-0">
          <Sidebar />
        </aside>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;