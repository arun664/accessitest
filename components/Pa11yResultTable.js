import React from "react";

const Pa11yResultTable = ({ results }) => {
  return (
    <div className="overflow-x-auto">
      <h3 className="font-semibold">
        Total Violations: {results.issues.length}
      </h3>
      <h2>Accessibility Test Results</h2>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Issue Code</th>
            <th className="border border-gray-300 px-4 py-2">Message</th>
            <th className="border border-gray-300 px-4 py-2">Context</th>
            <th className="border border-gray-300 px-4 py-2">Selector</th>
            <th className="border border-gray-300 px-4 py-2">Type</th>
          </tr>
        </thead>
        <tbody>
          {results.issues.length > 0 ? (
            results.issues.map((issue, index) => (
              <tr
                key={index}
                className={`border border-gray-300 `}
              >
                <td className="border border-gray-300 px-4 py-2">
                  {issue.code}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {issue.message}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {issue.context}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {issue.selector}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {issue.type}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                className="border border-gray-300 px-4 py-2 text-center"
              >
                No issues found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Pa11yResultTable;
