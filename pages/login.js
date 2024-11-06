import React, { useContext } from 'react';
import LoginForm from '@/components/LoginForm';
import AuthContext from '@/context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);

  const handleLoginSuccess = (userData) => {
    login(userData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600 dark:text-blue-400">Login</h1>
        <LoginForm handleLoginSuccess={handleLoginSuccess} />
        <p className="text-center text-gray-500 dark:text-gray-300 mt-4">
          Don't have an account ?{' '}
          <a href="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
            Register here
          </a>
        </p>
        <p className="text-center text-gray-500 dark:text-gray-300 mt-4">
          Forgot password ?{' '}
          <a href="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:underline">
            Reset Password
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
