// components/Accordion.js
import React, { useState } from 'react';

const Accordion = ({ title, details }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMoreViolations, setShowMoreViolations] = useState(false);
  const [showMorePasses, setShowMorePasses] = useState(false);
  const [showMoreIncomplete, setShowMoreIncomplete] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const MAX_LENGTH = 3; // Set a threshold for showing "Show More" button

  const renderDetails = (items, showMore) => {
    return (
      <table className="min-w-full border-collapse border border-gray-300 mt-2">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Description</th>
            <th className="border border-gray-300 p-2">Help</th>
            <th className="border border-gray-300 p-2">Help URL</th>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Impact</th>
            <th className="border border-gray-300 p-2">HTML</th>
            <th className="border border-gray-300 p-2">Target</th>
          </tr>
        </thead>
        <tbody>
          {(showMore ? items : items.slice(0, MAX_LENGTH)).map((item, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{item.description}</td>
              <td className="border border-gray-300 p-2">{item.help}</td>
              <td className="border border-gray-300 p-2">
                <a href={item.helpUrl} className="text-blue-500" target="_blank" rel="noopener noreferrer">
                  Help Link
                </a>
              </td>
              <td className="border border-gray-300 p-2">{item.id}</td>
              <td className="border border-gray-300 p-2">{item.impact || 'N/A'}</td>
              <td className="border border-gray-300 p-2">
                <pre className="whitespace-pre-wrap">{item.html}</pre>
              </td>
              <td className="border border-gray-300 p-2">{Array.isArray(item.target) ? item.target.join(', ') : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="border border-gray-300 rounded mb-2">
      <div
        className="flex justify-between items-center p-4 cursor-pointer bg-gray-200 hover:bg-gray-300 transition"
        onClick={toggleAccordion}
      >
        <h2 className="font-semibold">{title}</h2>
        <span>{isOpen ? '-' : '+'}</span>
      </div>
      {isOpen && (
        <div className="p-4">
          <p><strong>Timestamp:</strong> {new Date(details.timestamp).toLocaleString()}</p>
          <div className="mt-4">
            <h3 className="font-semibold">Violations ({details.violations.length})</h3>
            {renderDetails(details.violations, showMoreViolations)}
            {details.violations.length > MAX_LENGTH && (
              <button
                onClick={() => setShowMoreViolations(!showMoreViolations)}
                className="text-blue-500 mt-2"
              >
                {showMoreViolations ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>
          <div className="mt-4">
            <h3 className="font-semibold">Passes ({details.passes.length})</h3>
            {renderDetails(details.passes, showMorePasses)}
            {details.passes.length > MAX_LENGTH && (
              <button
                onClick={() => setShowMorePasses(!showMorePasses)}
                className="text-blue-500 mt-2"
              >
                {showMorePasses ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>
          <div className="mt-4">
            <h3 className="font-semibold">Incomplete ({details.incomplete.length})</h3>
            {renderDetails(details.incomplete, showMoreIncomplete)}
            {details.incomplete.length > MAX_LENGTH && (
              <button
                onClick={() => setShowMoreIncomplete(!showMoreIncomplete)}
                className="text-blue-500 mt-2"
              >
                {showMoreIncomplete ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Accordion;