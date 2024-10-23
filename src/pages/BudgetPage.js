// src/pages/BudgetPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from "@clerk/clerk-react";
import { BudgetCategoryManager } from '../components/budget';
import { LoadingModal } from '../components/common/Modal';
import { useAsync } from '../utils/hooks/useAsync';
import { useMessage } from '../utils/hooks/useMessage';
import { categoriesApi } from '../utils/api/categories';

function BudgetPage() {
  const { getToken } = useAuth();
  const { message, error, showMessage, showError } = useMessage();
  
  const { 
    loading, 
    data: categories = [], 
    execute: fetchCategories 
  } = useAsync(async () => {
    const token = await getToken();
    return categoriesApi.getAll(token);
  });

  useEffect(() => {
    fetchCategories().catch(error => {
      showError('Failed to load budget categories');
      console.error('Error fetching categories:', error);
    });
  }, [fetchCategories, showError]);

  return (
    <div className="p-6">
      {message && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {message}
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <BudgetCategoryManager categories={categories} />
      <LoadingModal isOpen={loading} message="Loading budget categories..." />
    </div>
  );
}

export default BudgetPage;