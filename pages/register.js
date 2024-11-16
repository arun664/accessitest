import React from 'react';
import RegistrationForm from '@/components/RegistrationForm';

const Registration = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-800 dark:text-blue-400">Register</h1>
        <RegistrationForm />
      </div>
    </div>
  );
};

export default Registration;
