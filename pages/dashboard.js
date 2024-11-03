import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import AxeCoreResultTable from '@/components/AxeCoreResultTable'; // Adjust the import path based on your project structure
import AuthContext from '@/context/AuthContext'; // Adjust the import path based on your project structure
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const router = useRouter();
  const { loggedIn, storedToken } = useContext(AuthContext);
  const results = router.query.results ? JSON.parse(router.query.results) : null;
  const url = router.query.url;
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSaveResults = async () => {
    if (!results || !url) return;

    //console.log('Stored Token:', storedToken);
    setLoading(true); // Start loading

    try {
      const response = await fetch('/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ url, results }),
      });

      const data = await response.json();
      setLoading(false); // Stop loading

      if (!response.ok) {
        throw new Error(data.error);
      }

      toast.success('Results saved successfully!');
    } catch (error) {
      setLoading(false); // Stop loading on error
      console.error('Error:', error);
      toast.error('Failed to save results.');
    }
  };

  const handleLoginRedirect = () => {
    toast.info('Please log in to save results.');
    router.push('/login');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Accessibility Test Results</h1>
      {results ? (
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-bold">Accessibility Score: {results.violations.length === 0 ? 100 : 0}</h2>
          <h3 className="font-semibold">Violations: {results.violations.length}</h3>
          <AxeCoreResultTable results={results} />

          {loggedIn ? (
            <button
              onClick={handleSaveResults}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              disabled={loading} // Disable button while loading
            >
              {loading ? 'Saving...' : 'Save Results'} {/* Show loading text if loading */}
            </button>
          ) : (
            <button
              onClick={handleLoginRedirect}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Login to Save Results
            </button>
          )}
        </div>
      ) : (
        <p>No results available.</p>
      )}
    </div>
  );
};

export default Dashboard;