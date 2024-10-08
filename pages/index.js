// pages/index.js
import React from 'react';
import XpathInspector from '@/components/XpathInspector';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-4">XPath Inspector Tool</h1>
      <XpathInspector />
    </div>
  );
};

export default HomePage;
