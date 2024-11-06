import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Account = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    const savedEmail = localStorage.getItem('email');

    if (savedUsername && savedEmail) {
      setUsername(savedUsername);
      setEmail(savedEmail);
    } else {
      toast.error('User details not found. Please log in again.');
    }
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openPasswordModal = () => setIsPasswordModalOpen(true);
  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handlePasswordConfirm = async () => {
    const userId = localStorage.getItem('username');

    try {
      const response = await fetch(`/api/user/verifyPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userId, password: currentPassword }),
      });

      const result = await response.json();

      if (response.ok && result.isValid) {
        closeModal();
        handleSave();
      } else {
        toast.error('Incorrect password. Please try again.');
      }
    } catch (err) {
      console.error('Error verifying password:', err);
      toast.error('Error verifying password. Please try again.');
    }
  };

  const handleSave = async () => {
    const userId = localStorage.getItem('username');

    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('User details updated successfully!');
        localStorage.setItem('email', email);
      } else {
        toast.error(result.error || 'Failed to update user details.');
      }
    } catch (err) {
      console.error('Error updating user details:', err);
      toast.error('Error updating user details. Please try again.');
    }
  };

  const handlePasswordUpdate = async () => {
    const userId = localStorage.getItem('username');

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords don't match. Please try again.");
      return;
    }

    try {
      const response = await fetch(`/api/user/updatePassword`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userId, currentPassword, newPassword }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Password updated successfully!');
        closePasswordModal();
      } else {
        toast.error(result.error || 'Failed to update password.');
      }
    } catch (err) {
      console.error('Error updating password:', err);
      toast.error('Error updating password. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white dark:bg-gray-900 rounded shadow-lg">
      <h1 className="text-2xl font-semibold mb-4 dark:text-white">Account Details</h1>
      <div className="mb-4">
        <label className="block mb-1 dark:text-gray-300" htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          disabled
          className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-black dark:bg-gray-900 dark:text-white"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 dark:text-gray-300" htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-black dark:bg-gray-900 dark:text-white"
        />
      </div>
      <button
        onClick={openModal}
        className="bg-blue-600 text-white p-3 rounded w-full hover:bg-blue-700 transition duration-200"
      >
        Save
      </button>
      <button
        onClick={openPasswordModal}
        className="bg-green-600 text-white p-3 rounded w-full mt-4 hover:bg-green-700 transition duration-200"
      >
        Update Password
      </button>

      {/* Email Update Password Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 p-4 rounded shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-2 dark:text-white">Confirm Your Password</h2>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-black dark:bg-gray-900 dark:text-white"
            />
            <div className="flex justify-end mt-4">
              <button onClick={handlePasswordConfirm} className="bg-blue-600 text-white p-2 rounded mr-2 hover:bg-blue-700 transition duration-200">
                Confirm
              </button>
              <button onClick={closeModal} className="bg-gray-600 text-white p-2 rounded hover:bg-gray-700 transition duration-200">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-blue-100 bg-opacity-50">
          <div className="bg-white dark:bg-black p-4 rounded shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Update Password</h2>
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border border-gray-300 p-3 rounded w-full mb-3 dark:bg-gray-900 dark:text-white"
            />
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border border-gray-300 p-3 rounded w-full mb-3 dark:bg-gray-900 dark:text-white"
            />
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="border border-gray-300 p-3 rounded w-full mb-3 dark:bg-gray-900 dark:text-white"
            />
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                checked={isPasswordVisible}
                onChange={() => setIsPasswordVisible(!isPasswordVisible)}
                className="mr-2"
              />
              <label className="text-gray-600 dark:text-gray-300">Show Passwords</label>
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={handlePasswordUpdate} className="bg-green-600 text-white p-2 rounded mr-2 hover:bg-green-700 transition duration-200">
                Save Password
              </button>
              <button onClick={closePasswordModal} className="bg-gray-600 text-white p-2 rounded hover:bg-gray-700 transition duration-200">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;