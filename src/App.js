// src/App.js
import React from 'react';
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import BudgetPage from './pages/BudgetPage';
import AuthPages from './pages/AuthPages';
import AppLayout from './components/layout';

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

const clerkAppearance = {
  elements: {
    formButtonPrimary: "bg-purple-500 hover:bg-purple-600",
    formFieldInput: "rounded-lg",
    card: "rounded-xl shadow-lg"
  }
};

function App() {
  return (
    <ClerkProvider 
      publishableKey={process.env.REACT_APP_CLERK_PUBLISHABLE_KEY}
      appearance={clerkAppearance}
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
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/budget" element={<BudgetPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </SignedIn>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;