import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast notifications

const RegistrationForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUserName] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    toast.dismiss(); // Dismiss any existing toasts
    try {
      const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          username,
          password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);

        // Clear form fields
        setEmail('');
        setPassword('');
        setUserName('');

        // Redirect to login page
        router.push('/login');

      } else {
        toast.error(result.error); // Show error message
      }
    } catch (err) {
      toast.error('There was an issue registering the user'); // Show general error
    }
  };

  return (
    <div>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        placeholder="Username"
        id="username"
        value={username}
        onChange={(e) => setUserName(e.target.value)}
        className="border border-gray-300 p-3 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-black dark:bg-gray-900 dark:text-white"
      />
      <label htmlFor="email">Email</label>
      <input
        type="email"
        placeholder="Email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-gray-300 p-3 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-black dark:bg-gray-900 dark:text-white"
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        placeholder="Password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-gray-300 p-3 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-black dark:bg-gray-900 dark:text-white"
      />
      <button
        onClick={handleRegister}
        className="bg-blue-600 text-white p-3 rounded w-full hover:bg-blue-700 transition duration-200"
      >
        Register
      </button>
      <p className="text-center text-gray-900 dark:text-gray-400  mt-4">
        Already have an account?{' '}
        <a href="/login" className="text-blue-800 font-bold dark:text-blue-400 hover:underline">
          Login here
        </a>
      </p>
    </div>
  );
};

export default RegistrationForm;