import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import AxeCoreResultTable from '@/components/AxeCoreResultTable';
import Pa11yResultTable from '@/components/Pa11yResultTable';
import AuthContext from '@/context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const router = useRouter();
  const { loggedIn, storedToken } = useContext(AuthContext);
  const allResults = router.query.results ? JSON.parse(router.query.results) : null;

  // State for selected tools
  const [selectedTools, setSelectedTools] = useState(['axe-core']);
  const url = router.query.url;
  const [loading, setLoading] = useState(false); // Add loading state

  // Determine which results to display based on selected tools
  const axeCoreResults = allResults ? allResults["axe-core-results"] : null;
  const pa11yResults = allResults ? allResults["pa11y-results"] : null;

  const displayResults = () => {
    const resultsToDisplay = {};
    
    if (selectedTools.includes('axe-core') && axeCoreResults) {
      resultsToDisplay['axe-core'] = axeCoreResults;
    }
    
    if (selectedTools.includes('pa11y') && pa11yResults) {
      resultsToDisplay['pa11y'] = pa11yResults;
    }
    
    return resultsToDisplay;
  };

  const results = displayResults();

  const handleSaveResults = async () => {
    if (Object.keys(results).length === 0 || !url) return;

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

  const handleToolChange = (event) => {
    const value = event.target.value;
    setSelectedTools(prev => 
      prev.includes(value) ? prev.filter(tool => tool !== value) : [...prev, value]
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Accessibility Test Results</h1>

      {/* Tool Selection UI */}
      <div className="mb-4">
        <h2 className="font-semibold">Select Tools:</h2>
        <label>
          <input
            type="checkbox"
            value="axe-core"
            checked={selectedTools.includes('axe-core')}
            onChange={handleToolChange}
          />
          Axe Core
        </label>
        <label className="ml-4">
          <input
            type="checkbox"
            value="pa11y"
            checked={selectedTools.includes('pa11y')}
            onChange={handleToolChange}
          />
          Pa11y
        </label>
      </div>

      {Object.keys(results).length > 0 ? (
        <div className="bg-white p-4 rounded shadow-md">
          {Object.entries(results).map(([tool, result]) => (
            <div key={tool} className="mb-4">
              <h2 className="text-xl font-bold">{tool.charAt(0).toUpperCase() + tool.slice(1)} Results:</h2>
              {tool === 'axe-core' ? (
                <AxeCoreResultTable results={result} />
              ) : (
                <Pa11yResultTable results={result} /> // Make sure to create this component to display Pa11y results
              )}
            </div>
          ))}

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