// components/Layout.js
import React from 'react';
import Header from '@/components/default/header'; // Assuming you have a Header component
import Footer from '@/components/default/footer'; // Assuming you have a Footer component

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;