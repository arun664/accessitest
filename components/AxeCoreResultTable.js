import React, { useState } from 'react';

const AxeCoreResultsTable = ({ results }) => {
  const { testEngine, testRunner, testEnvironment, timestamp, url, incomplete, passes, violations } = results;

  // State to manage the active tab
  const [activeTab, setActiveTab] = useState('violations'); // Set initial active tab to 'violations'

  // Function to render the content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'violations':
        return (
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300">ID</th>
                <th className="border border-gray-300">Description</th>
                <th className="border border-gray-300">Help</th>
              </tr>
            </thead>
            <tbody>
              {violations.map((violation) => (
                <tr key={violation.id}>
                  <td className="border border-gray-300">{violation.id}</td>
                  <td className="border border-gray-300">{violation.description}</td>
                  <td className="border border-gray-300">{violation.help}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'general':
        return (
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300">Field</th>
                <th className="border border-gray-300">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300">Test Engine</td>
                <td className="border border-gray-300">{JSON.stringify(testEngine)}</td>
              </tr>
              <tr>
                <td className="border border-gray-300">Test Runner</td>
                <td className="border border-gray-300">{JSON.stringify(testRunner)}</td>
              </tr>
              <tr>
                <td className="border border-gray-300">Test Environment</td>
                <td className="border border-gray-300">{JSON.stringify(testEnvironment)}</td>
              </tr>
              <tr>
                <td className="border border-gray-300">Timestamp</td>
                <td className="border border-gray-300">{new Date(timestamp).toLocaleString()}</td>
              </tr>
              <tr>
                <td className="border border-gray-300">URL</td>
                <td className="border border-gray-300">
                  <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                </td>
              </tr>
            </tbody>
          </table>
        );
      case 'incomplete':
        return (
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300">ID</th>
                <th className="border border-gray-300">Description</th>
                <th className="border border-gray-300">Help</th>
              </tr>
            </thead>
            <tbody>
              {incomplete.map((item) => (
                <tr key={item.id}>
                  <td className="border border-gray-300">{item.id}</td>
                  <td className="border border-gray-300">{item.description}</td>
                  <td className="border border-gray-300">{item.help}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'passing':
        return (
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300">ID</th>
                <th className="border border-gray-300">Description</th>
                <th className="border border-gray-300">Help</th>
              </tr>
            </thead>
            <tbody>
              {passes.map((item) => (
                <tr key={item.id}>
                  <td className="border border-gray-300">{item.id}</td>
                  <td className="border border-gray-300">{item.description}</td>
                  <td className="border border-gray-300">{item.help}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h3 className="font-semibold">Total Violations: {results.violations.length}</h3>
      <h2>Accessibility Test Results</h2>
      <div className="mb-4">
        <button
          onClick={() => setActiveTab('violations')}
          className={`px-4 py-2 mr-2 rounded ${activeTab === 'violations' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-800'}`}
        >
          Violations
        </button>
        <button
          onClick={() => setActiveTab('incomplete')}
          className={`px-4 py-2 mr-2 rounded ${activeTab === 'incomplete' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-800'}`}
        >
          Incomplete Results
        </button>
        <button
          onClick={() => setActiveTab('passing')}
          className={`px-4 py-2 rounded ${activeTab === 'passing' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-800'}`}
        >
          Passing Results
        </button>
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 mr-2 rounded ${activeTab === 'general' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-800'}`}
        >
          General Information
        </button>
      </div>
      {renderTabContent()}
    </div>
  );
};

export default AxeCoreResultsTable;