import React, { useContext, useState } from 'react';
import Link from 'next/link';
import AuthContext from '@/context/AuthContext';

const Header = () => {
  const { loggedIn, username, email, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link href="/">AccessiTest</Link>
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:underline">Home</Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">About</Link>
            </li>
            {!loggedIn && (
              <>
                <li>
                  <Link href="/register" className="hover:underline">Register</Link>
                </li>
                <li>
                  <Link href="/login" className="hover:underline">Login</Link>
                </li>
              </>
            )}
            {loggedIn && (
              <li className="relative">
                <button onClick={toggleDropdown} className="flex items-center">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
                    alt="Profile"
                    className="h-8 w-8 rounded-full bg-white p-1"
                  />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <ul className="py-1">
                      <li className="px-4 py-2 text-gray-800">
                        {username} ({email})
                      </li>
                      <li>
                        <Link href="/user/account" className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white">
                          Profile
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={logout}
                          className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;