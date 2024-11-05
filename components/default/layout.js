// components/Layout.js
import React from "react";
import Header from "@/components/default/header";
import Footer from "@/components/default/footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {children}
        <ToastContainer
          position="top-right"
          className="toast-position"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          pauseOnFocusLoss
        />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
