// src/utils/hooks/useMessage.js
import { useState, useCallback } from 'react';

export function useMessage(duration = 3000) {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const showMessage = useCallback((text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), duration);
  }, [duration]);

  const showError = useCallback((text) => {
    setError(text);
    setTimeout(() => setError(null), duration);
  }, [duration]);

  return {
    message,
    error,
    showMessage,
    showError,
    clearMessage: () => setMessage(null),
    clearError: () => setError(null)
  };
}