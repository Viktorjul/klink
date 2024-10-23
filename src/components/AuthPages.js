// src/components/AuthPages.js
import React from 'react';
import { SignUp } from "@clerk/clerk-react";

export const appearance = {
  elements: {
    formButtonPrimary: "bg-purple-500 hover:bg-purple-600"
  }
};

function AuthPages() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 rounded-lg">
        <SignUp />
      </div>
    </div>
  );
}

export default AuthPages;