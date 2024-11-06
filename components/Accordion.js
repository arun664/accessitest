import React, { useState } from "react";

const Accordion = ({ title, details, tool }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMoreViolations, setShowMoreViolations] = useState(false);
  const [showMorePasses, setShowMorePasses] = useState(false);
  const [showMoreIncomplete, setShowMoreIncomplete] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const MAX_LENGTH = 3;

  // Determine if response is from Pa11y by checking if 'issues' exists
  let isPa11yResponse = null;
  if (tool === "pa11y") {
    isPa11yResponse = true;
  }

  const renderDetails = (items, showMore) => {
    return (
      <table className="min-w-full border-collapse border border-gray-300 dark:bg-gray-900 mt-2">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-900 ">
            <th className="border border-gray-300 dark:bg-gray-900 p-2">Description</th>
            <th className="border border-gray-300 dark:bg-gray-900 p-2">Help</th>
            <th className="border border-gray-300 dark:bg-gray-900 p-2">ID</th>
            <th className="border border-gray-300 dark:bg-gray-900 p-2">Impact</th>
            <th className="border border-gray-300 dark:bg-gray-900 p-2">HTML</th>
            <th className="border border-gray-300 dark:bg-gray-900 p-2">Target</th>
          </tr>
        </thead>
        <tbody>
          {(showMore ? items : items.slice(0, MAX_LENGTH)).map(
            (item, index) => (
              <tr key={index + item.tool}>
                <td className="border border-gray-300 dark:bg-gray-900 p-2">
                  {item.description || item.message || "N/A"}
                </td>
                <td className="border border-gray-300 dark:bg-gray-900 p-2">
                  {item?.help ? (
                    <a
                      href={item.help}
                      className="text-blue-500"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Help Link
                    </a>
                  ) : (
                    <span>N/A</span>
                  )}
                </td>
                <td className="border border-gray-300 dark:bg-gray-900 p-2">
                  {item.id || item.code || "N/A"}
                </td>
                <td className="border border-gray-300 dark:bg-gray-900 p-2">
                  {item.impact || item?.type || "N/A"}
                </td>
                <td className="border border-gray-300 dark:bg-gray-900 p-2">
                  <pre className="whitespace-pre-wrap">
                    {item.nodes
                      ? Array.isArray(item.nodes)
                        ? item.nodes.map((node, index) => (
                            <span key={index}>{node.html || "N/A"}</span>
                          ))
                        : "N/A"
                      : item.html || item.context || "N/A"}
                  </pre>
                </td>
                <td className="border border-gray-300 dark:bg-gray-900 p-2">
                  {item?.selector
                    ? item.selector
                    : Array.isArray(item.nodes)
                    ? item.nodes
                        .map((node, index) => node.target || "N/A")
                        .join(", ")
                    : "N/A"}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    );
  };

  return (
    <div className="border border-gray-300 rounded mb-2">
      <div
        className={`flex justify-between items-center p-4 cursor-pointer transition  ${
          isOpen ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-200 dark:bg-gray-700"
        } hover:bg-gray-300`}
        onClick={toggleAccordion}
      >
        <h2 className="font-semibold">{title}</h2>
        <span>{isOpen ? "-" : "+"}</span>
      </div>
      {isOpen && (
        <div className="p-4">
          <div className="mt-4">
            <h3 className="font-semibold">
              Violations (
              {isPa11yResponse
                ? details.result.issues.length
                : details.result.violations.length}
              )
            </h3>
            {renderDetails(
              isPa11yResponse
                ? details.result.issues
                : details.result.violations,
              showMoreViolations
            )}
            {(isPa11yResponse
              ? details.result.issues.length
              : details.result.violations.length) > MAX_LENGTH && (
              <button
                onClick={() => setShowMoreViolations(!showMoreViolations)}
                className="text-blue-500 mt-2"
              >
                {showMoreViolations ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
          {!isPa11yResponse && (
            <>
              <div className="mt-4">
                <h3 className="font-semibold">
                  Passes ({details.result.passes.length})
                </h3>
                {renderDetails(details.result.passes, showMorePasses)}
                {details.result.passes.length > MAX_LENGTH && (
                  <button
                    onClick={() => setShowMorePasses(!showMorePasses)}
                    className="text-blue-500 mt-2"
                  >
                    {showMorePasses ? "Show Less" : "Show More"}
                  </button>
                )}
              </div>
              <div className="mt-4">
                <h3 className="font-semibold">
                  Incomplete ({details.result.incomplete.length})
                </h3>
                {renderDetails(details.result.incomplete, showMoreIncomplete)}
                {details.result.incomplete.length > MAX_LENGTH && (
                  <button
                    onClick={() => setShowMoreIncomplete(!showMoreIncomplete)}
                    className="text-blue-500 mt-2"
                  >
                    {showMoreIncomplete ? "Show Less" : "Show More"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Accordion;
