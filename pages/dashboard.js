import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import AxeCoreResultTable from '@/components/AxeCoreResultTable'; // Adjust the import path based on your project structure
import AuthContext from '@/context/AuthContext'; // Adjust the import path based on your project structure

const Dashboard = () => {
  const router = useRouter();
  const { loggedIn } = useContext(AuthContext); // Get loggedIn state from AuthContext
  const results = router.query.results ? JSON.parse(router.query.results) : null;
  const url = router.query.url; // Extract URL from query

  const handleSaveResults = async () => {
    console.log('Saving results:', results, 'to URL:', url);

    if (!results || !url) return; // Ensure both results and URL are available

    try {
      const response = await fetch('/api/save-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, results }), // Send URL and results to the API
      });

      const data = await response.json();

      if (response.ok) {
        alert('Results saved successfully!');
      } else {
        alert(`Error saving results: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save results.');
    }
  };

  const handleLoginRedirect = () => {
    alert('Please log in to save results.'); // Notify user to log in
    router.push('/login'); // Redirect to the login page
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Accessibility Test Results</h1>
      {results ? (
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-bold">Accessibility Score: {results.violations.length === 0 ? 100 : 0}</h2>
          <h3 className="font-semibold">Violations: {results.violations.length}</h3>
          <AxeCoreResultTable results={results} /> {/* Integrating ResultsTable component */}

          {/* Show Save Results button only if user is logged in */}
          {loggedIn ? (
            <button
              onClick={handleSaveResults}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Save Results
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
