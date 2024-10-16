import React, { useContext } from 'react';
import LoginForm from '@/components/LoginForm';
import AuthContext from '@/context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);

  const handleLoginSuccess = (userData) => {
    login(userData); // Pass the login data to the context
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Login</h1>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
        <p className="text-center text-gray-500 mt-4">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
