import React, { useState } from 'react';
import { db } from '@/config/firebaseConfig';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore/lite'; // Firestore functions

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const registerUser = async () => {
    try {
      const usersRef = collection(db, 'users');
      const emailQuery = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(emailQuery);

      if (!querySnapshot.empty) {
        setError('User already exists');
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
    } catch (error) {
      console.error('Error registering user:', error);
      setError('There was an issue registering the user');
      setMessage('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">Create Account</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
        <input
          type="text"
          placeholder="Username"
          value={userName}
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
    </div>
  );
};

export default Register;
