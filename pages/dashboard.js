// pages/dashboard.js
import React from 'react';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const router = useRouter();
  const results = router.query.results ? JSON.parse(router.query.results) : null;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Accessibility Test Results</h1>
      {results ? (
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-bold">Accessibility Score: {results.violations.length === 0 ? 100 : 0}</h2>
          <h3 className="font-semibold">Violations: {results.violations.length}</h3>
          {results.violations.map((violation, index) => (
            <div key={index} className="mb-2">
              <p><strong>{violation.description}</strong>: {violation.help}</p>
              <p>Nodes affected:</p>
              <ul className="list-disc ml-4">
                {violation.nodes.map((node, idx) => (
                  <li key={idx}>{node.html}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>No results available.</p>
      )}
    </div>
  );
};

export default Dashboard;
