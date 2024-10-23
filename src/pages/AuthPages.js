// src/pages/AuthPages.js
import React from 'react';
import { SignUp, SignIn } from "@clerk/clerk-react";
import { useLocation, Navigate } from 'react-router-dom';

function AuthPages() {
  const location = useLocation();
  const isSignUp = location.pathname === '/sign-up';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        {isSignUp ? <SignUp /> : <SignIn />}
        <div className="mt-4 text-center text-sm text-gray-600">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <a href="/sign-in" className="text-purple-600 hover:text-purple-700">
                Sign in
              </a>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <a href="/sign-up" className="text-purple-600 hover:text-purple-700">
                Sign up
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPages;