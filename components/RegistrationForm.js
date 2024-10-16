import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast notifications

const RegistrationForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUserName] = useState('');

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
        toast.success(result.message); // Show success message
      } else {
        toast.error(result.error); // Show error message
      }
    } catch (err) {
      toast.error('There was an issue registering the user'); // Show general error
    }
  };

  return (
    <div>
      <ToastContainer /> {/* Include the ToastContainer to render the notifications */}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUserName(e.target.value)}
        className="border border-gray-300 p-3 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-gray-300 p-3 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-gray-300 p-3 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      />
      <button
        onClick={handleRegister}
        className="bg-blue-600 text-white p-3 rounded w-full hover:bg-blue-700 transition duration-200"
      >
        Register
      </button>
      <p className="text-center text-gray-500 mt-4">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:underline">
          Login here
        </a>
      </p>
    </div>
  );
};

export default RegistrationForm;