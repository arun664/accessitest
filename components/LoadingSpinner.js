// components/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      <span className="ml-4 text-xl">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
