import React, { useState } from 'react';
import { db } from '@/config/firebaseConfig';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore/lite'; // Firestore functions

const RegistrationForm = () => {
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
    <div>
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
  );
};

export default RegistrationForm;
