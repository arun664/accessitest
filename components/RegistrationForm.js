import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast notifications

const RegistrationForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUserName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const router = useRouter();

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required.');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Username validation
  const validateUsername = (username) => {
    if (!username) {
      setUsernameError('Username is required.');
      return false;
    } else if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters long.');
      return false;
    }
    setUsernameError('');
    return true;
  };

  // Password validation
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      setPasswordError('Password must be at least 8 characters long.');
      return false;
    } else if (!hasUpperCase) {
      setPasswordError('Password must contain at least one uppercase letter.');
      return false;
    } else if (!hasLowerCase) {
      setPasswordError('Password must contain at least one lowercase letter.');
      return false;
    } else if (!hasNumber) {
      setPasswordError('Password must contain at least one number.');
      return false;
    } else if (!hasSpecialChar) {
      setPasswordError('Password must contain at least one special character.');
      return false;
    }

    setPasswordError('');
    return true;
  };

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

  const isFormValid = email && username && password && !emailError && !usernameError && !passwordError;

  return (
    <div>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        placeholder="Username"
        id="username"
        value={username}
        onChange={(e) => {
          setUserName(e.target.value);
          validateUsername(e.target.value); // Real-time validation
        }}
        className="border border-gray-300 p-3 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-black dark:bg-gray-900 dark:text-white"
      />
      {usernameError && <p className="text-red-500 text-sm mt-2">{usernameError}</p>}
      
      <label htmlFor="email">Email</label>
      <input
        type="email"
        placeholder="Email"
        id="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          validateEmail(e.target.value); // Real-time validation
        }}
        className="border border-gray-300 p-3 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-black dark:bg-gray-900 dark:text-white"
      />
      {emailError && <p className="text-red-500 text-sm mt-2">{emailError}</p>}

      <label htmlFor="password">Password</label>
      <input
        type="password"
        placeholder="Password"
        id="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          validatePassword(e.target.value); // Real-time validation
        }}
        className="border border-gray-300 p-3 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-black dark:bg-gray-900 dark:text-white"
      />
      {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}

      <button
        onClick={handleRegister}
        disabled={!isFormValid}
        className={`bg-blue-600 text-white p-3 rounded w-full hover:bg-blue-700 transition duration-200 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Register
      </button>
      
      <p className="text-center text-gray-900 dark:text-gray-400 mt-4">
        Already have an account?{' '}
        <a href="/login" className="text-blue-800 font-bold dark:text-blue-400 hover:underline">
          Login here
        </a>
      </p>
    </div>
  );
};

export default RegistrationForm;