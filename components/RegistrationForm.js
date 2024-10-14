import React, { useState } from 'react';
import registerUser from '@/pages/api/user/register';

const RegistrationForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser({email, password, userName});

      // Check if there's a custom error like 'User already exists'
      if (response.error) {
        setError(response.error);  // Set the error to be displayed in the UI
        alert(response.error);  // Show an alert with the error message
      } else {
        setError(null);  // Clear any previous errors
        console.log(response.message);  // Success message
      }

    } catch (error) {
      alert(error.message);
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <br />
      <label>
        User Name:
        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
      </label>
      <br />
      <button type="submit">Register</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default RegistrationForm;
