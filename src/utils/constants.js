// src/utils/constants.js
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export const categories = [
  'Housing',
  'Transportation',
  'Food',
  'Utilities',
  'Insurance',
  'Healthcare',
  'Savings',
  'Personal',
  'Entertainment',
  'Other'
];

export const DEFAULT_BUDGET = 350000;
export const DEFAULT_YEARLY_SAVINGS_GOAL = 600000;