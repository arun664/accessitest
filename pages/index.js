// pages/index.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';

const tools = [
  { value: 'axe-core', label: 'Axe-Core' },
  // Add more tools here when needed
];

export default function Home() {
  const [url, setUrl] = useState('');
  const [selectedTools, setSelectedTools] = useState([]);
  const router = useRouter();

  // pages/index.js
const handleSubmit = async (e) => {
  e.preventDefault();
  if (url.trim() && selectedTools.length > 0) {
    try {
      // Fetch HTML content from the provided URL
      const response = await fetch(`/api/fetch-page-content?url=${encodeURIComponent(url)}`);
      const htmlContent = await response.text();

      // Run selected tests (only axe-core is implemented here)
      const axeResults = await runAxeCore(url); // Pass the URL to runAxeCore

      // Navigate to results dashboard with axe results
      router.push({
        pathname: '/dashboard',
        query: { results: JSON.stringify(axeResults) },
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }
};

// Update runAxeCore to take a URL instead of HTML content
const runAxeCore = async (url) => {
  const response = await fetch('/api/axeCore', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }), // Send URL to the API
  });

  if (!response.ok) {
    throw new Error('Failed to run axe-core tests.');
  }

  return await response.json();
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6">Accessibility Testing Tool</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="url"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="px-4 py-2 border rounded mb-4 w-80"
          required
        />
        <select
          multiple
          value={selectedTools}
          onChange={(e) => {
            const options = Array.from(e.target.selectedOptions).map(option => option.value);
            setSelectedTools(options);
          }}
          className="px-4 py-2 border rounded mb-4 w-80"
        >
          {tools.map(tool => (
            <option key={tool.value} value={tool.value}>
              {tool.label}
            </option>
          ))}
        </select>
        <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
          Run Accessibility Test
        </button>
      </form>
    </div>
  );
}
