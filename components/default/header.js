import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { FaSun, FaMoon } from "react-icons/fa";
import AuthContext from "@/context/AuthContext";

const Header = () => {
  const { loggedIn, username, email, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  // Load theme preference on component mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setIsDarkMode(storedTheme === "dark");
    } else {
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  // Apply dark mode class to the document root
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <header className="bg-blue-600 dark:bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link href="/">AccessiTest</Link>
        </h1>
        <nav className="flex items-center space-x-4">
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
            {!loggedIn && (
              <>
                <li>
                  <Link href="/register" className="hover:underline">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:underline">
                    Login
                  </Link>
                </li>
              </>
            )}
            {loggedIn && (
              <>
                <li>
                  <Link href="/history" className="hover:underline">
                    History
                  </Link>
                </li>
                <li className="relative">
                  <button onClick={toggleDropdown} className="flex items-center">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
                      alt="Profile"
                      className="h-8 w-8 rounded-full bg-white p-1"
                    />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10">
                      <ul className="py-1">
                        <li className="px-4 py-2 text-gray-800 dark:text-gray-200">
                          {username} ({email})
                        </li>
                        <li>
                          <Link
                            href="/user/account"
                            className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-blue-500 dark:hover:bg-blue-600 hover:text-white"
                          >
                            Profile
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              logout();
                              setDropdownOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-blue-500 dark:hover:bg-blue-600 hover:text-white"
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              </>
            )}
          </ul>
          {/* Dark Mode Toggle Icon */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 text-black dark:text-white"
          >
            {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
