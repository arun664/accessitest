import React, { useState, useEffect } from 'react';
import { db } from '@/config/firebaseConfig';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore/lite'; // Firestore functions

const RegistrationForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const registerUser = async () => {
    try {
      const usersRef = collection(db, 'users');
      const emailQuery = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(emailQuery);

      if (!querySnapshot.empty) {
        setError('User already exists');
        setMessage('');
        setShowToast(true); // Show toast on error
        return;
      }

      const userId = Math.random().toString(36).substr(2, 9);

      await setDoc(doc(db, 'users', userId), {
        email,
        userName,
        password, // Consider hashing this password for security
      });

      setMessage('User registered successfully');
      setError('');
      setShowToast(true); // Show toast on success

      // Clear the form after successful registration
      setEmail('');
      setPassword('');
      setUserName('');
    } catch (error) {
      console.error('Error registering user:', error);
      setError('There was an issue registering the user');
      setMessage('');
      setShowToast(true); // Show toast on error
    }
  };

  // Hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6">Register</h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
        
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="border border-gray-300 p-3 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 p-3 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 p-3 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          required
        />
        <button
          onClick={registerUser}
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

      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-5 right-5 ${error ? 'bg-red-500' : 'bg-green-500'} text-white px-4 py-2 rounded shadow-lg animate-fade-in-out`}>
          {error || message}
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;
