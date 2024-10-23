// src/utils/formatters.js
export const formatCurrency = (amount) => {
    const formattedNumber = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${formattedNumber} kr`;
  };
  
  export const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };