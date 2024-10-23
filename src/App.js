// src/App.js
import React from 'react';
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPages, { appearance } from './components/AuthPages';
import Dashboard from './components/Dashboard';
import BudgetCategories from './components/BudgetCategories';
import DashboardLayout from './components/DashboardLayout';
import './index.css';

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

function App() {
  return (
    <ClerkProvider 
      publishableKey={process.env.REACT_APP_CLERK_PUBLISHABLE_KEY}
      appearance={appearance}
    >
      <BrowserRouter>
        <SignedOut>
          <Routes>
            <Route path="/sign-up" element={<AuthPages />} />
            <Route path="/sign-in" element={<AuthPages />} />
            <Route path="*" element={<Navigate to="/sign-in" replace />} />
          </Routes>
        </SignedOut>
        
        <SignedIn>
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/budget-categories" element={<BudgetCategories />} />
              {/* Add other routes as needed */}
            </Route>
          </Routes>
        </SignedIn>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;