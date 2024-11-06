import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} AccessiTest. All rights reserved.</p>
        <p>
          <a href="/privacy" className="text-gray-300 dark:text-gray-400 hover:text-white hover:underline">
            Privacy Policy
          </a>{' '}
          |{' '}
          <a href="/terms" className="text-gray-300 dark:text-gray-400 hover:text-white hover:underline">
            Terms of Service
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
