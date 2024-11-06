import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify"; // Import toast

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [storedToken, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");

    if (token) {
      setToken(token);
      setUsername(storedUsername);
      setEmail(storedEmail);
      setLoggedIn(true);
    }
  }, []);

  const login = (userData) => {
    setLoggedIn(true);
    setUsername(userData.username);
    setEmail(userData.email);
    setToken(userData.token);

    localStorage.setItem("token", userData.token);
    localStorage.setItem("username", userData.username);
    localStorage.setItem("email", userData.email);

    // Check sessionStorage for accessibility results and redirect accordingly
    if (!sessionStorage.getItem("results")) {
      router.push("/");
    } else {
      router.push("/dashboard");
    }
  };

  const logout = () => {
    setLoggedIn(false);
    setUsername("");
    setEmail("");
    setToken(null);

    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("accessibilityResults");
    localStorage.removeItem("mistralAdvice");
    localStorage.removeItem("url");
    localStorage.removeItem("selectedtools");

    toast.info("You have logged out successfully."); // Toast notification on successful logout
    router.push("/login"); // Redirect to login page on logout
  };

  return (
    <AuthContext.Provider
      value={{ loggedIn, username, email, storedToken, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
