import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleResetRequest = async (e) => {
    e.preventDefault();
  
    if (!email) {
      setError('Please enter your email');
      return;
    }
  
    try {
      // API call to request password reset (backend handles token generation and sending email)
      const response = await fetch('/api/user/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
  
      toast.success(data?.message);
      
    } catch (error) {
      toast.error('Network error. Please try again later.');
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600 dark:text-blue-400">Reset Password</h1>
        <form onSubmit={handleResetRequest}>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 dark:bg-gray-900 dark:text-white"
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 mt-4"
          >
            Send Reset Link
          </button>
        </form>
        <p className="text-center text-gray-500 dark:text-gray-300 mt-4">
          Remembered your password?{' '}
          <a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;