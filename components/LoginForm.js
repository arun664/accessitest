import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from '@/context/AuthContext'; // Import AuthContext

const LoginForm = ({ handleLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext); // Access login function from AuthContext
  const router = useRouter();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success('Login successful!');
        handleLoginSuccess(result);
      } else {
        toast.error(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Error logging in. Please try again.');
    }
  };

  return (
    <div>
      <label htmlFor="email">Email</label>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-gray-300 p-3 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-black dark:bg-gray-900 dark:text-white"
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-gray-300 p-3 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-black dark:bg-gray-900 dark:text-white"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white p-3 rounded w-full hover:bg-blue-700 transition duration-200"
      >
        Login
      </button>
    </div>
  );
};

export default LoginForm;