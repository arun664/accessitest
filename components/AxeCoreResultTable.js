import React, { useState,useEffect } from 'react';

const AxeCoreResultsTable = ({ results }) => {
  const { testEngine, testRunner, testEnvironment, timestamp, url, inapplicable, incomplete, passes, violations } = results;

  // State to manage the active tab
  const [activeTab, setActiveTab] = useState('violations'); // Set initial active tab to 'violations'
  const [violationsWithAdvice, setViolationsWithAdvice] = useState([]);

  useEffect(() => {
    const fetchAdvice = async () => {
      // const violationIds = violations.map(v => v.id);

      try {
        const response = await fetch('/api/advice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ violations })
        });

        const data = await response.json();
        
        setViolationsWithAdvice(data.mistralAdvice);
      } catch (error) {
        // console.error('Error fetching advice:', error);
      }
    };

    fetchAdvice();
  }, [violations]);

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
                <th className="border border-gray-300">Mistral Advice</th>
              </tr>
            </thead>
            <tbody>

              {violationsWithAdvice?.length > 0 ?(violations.map((violation) => (
                <tr key={violation.id}>
                  <td className="border border-gray-300">{violation.id}</td>
                  <td className="border border-gray-300">{violation.description}</td>
                  <td className="border border-gray-300">{violation.help}</td>
                  {/* Display the advice for the violation which is in the  violationsWithAdvice which is an array of objects which have violation id and advice as properties*/}
                  <td className="border border-gray-300">
                    {violationsWithAdvice.find((item) => item.violation_id === violation.id)?.advice}
                  </td>

                </tr>
              ))): <p>Loading advice...</p>}
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
      case 'inapplicable':
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
              {inapplicable.map((item) => (
                <tr key={item.id}>
                  <td className="border border-gray-300">{item.id}</td>
                  <td className="border border-gray-300">{item.description}</td>
                  <td className="border border-gray-300">{item.help}</td>
                </tr>
              ))}
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
          className={`px-4 py-2 mr-2 rounded ${activeTab === 'violations' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Violations
        </button>
        <button
          onClick={() => setActiveTab('incomplete')}
          className={`px-4 py-2 mr-2 rounded ${activeTab === 'incomplete' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Incomplete Results
        </button>
        <button
          onClick={() => setActiveTab('passing')}
          className={`px-4 py-2 rounded ${activeTab === 'passing' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Passing Results
        </button>
        <button
          onClick={() => setActiveTab('inapplicable')}
          className={`px-4 py-2 mr-2 rounded ${activeTab === 'inapplicable' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Inapplicable Results
        </button>
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 mr-2 rounded ${activeTab === 'general' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          General Information
        </button>
      </div>
      {renderTabContent()}
    </div>
  );
};

export default AxeCoreResultsTable;