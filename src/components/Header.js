// src/Header.js
import React from 'react';

function Header() {
  return (
    <header className="bg-white px-6 py-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] z-50 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Klink</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { 
              month: 'long',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;