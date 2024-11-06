import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Account = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Fetch user details from local storage
    const savedUsername = localStorage.getItem('username');
    const savedEmail = localStorage.getItem('email');

    if (savedUsername && savedEmail) {
      setUsername(savedUsername);
      setEmail(savedEmail);
    } else {
      toast.error('User details not found. Please log in again.');
    }
  }, []);

  const handleSave = async () => {
    const userId = localStorage.getItem('userId');

    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('User details updated successfully!');
      } else {
        toast.error(result.error || 'Failed to update user details.');
      }
    } catch (err) {
      console.error('Error updating user details:', err);
      toast.error('Error updating user details. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Account Details</h1>
      <div className="mb-4">
        <label className="block mb-1" htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-black dark:bg-gray-900 dark:text-white"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1" htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-black dark:bg-gray-900 dark:text-white"
        />
      </div>
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white p-3 rounded w-full hover:bg-blue-700 transition duration-200"
      >
        Save
      </button>
    </div>
  );
};

export default Account;