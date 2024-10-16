import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in (e.g., using localStorage)
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');
    
    if (token) {
      setLoggedIn(true);
      setUsername(storedUsername);
      setEmail(storedEmail);
    }
  }, []);

  const login = (userData) => {
    setLoggedIn(true);
    setUsername(userData.username);
    setEmail(userData.email);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('username', userData.username);
    localStorage.setItem('email', userData.email);
    router.push('/'); // Redirect to homepage on login
  };

  const logout = () => {
    setLoggedIn(false);
    setUsername('');
    setEmail('');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    router.push('/login'); // Redirect to login page on logout
  };

  return (
    <AuthContext.Provider value={{ loggedIn, username, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;