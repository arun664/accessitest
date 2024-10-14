// pages/index.js
import React from 'react';
import XpathInspector from '@/components/XpathInspector';

import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [url, setUrl] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      // Navigate to the XPath Inspector with the provided URL as a query parameter
      router.push(`/inspector?url=${encodeURIComponent(url)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6">XPath Inspector Tool</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="url"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="px-4 py-2 border rounded mb-4 w-80"
          required
        />
        <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
          Inspect URL
        </button>
      </form>
    </div>
  );
}