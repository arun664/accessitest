import React, { useEffect, useState, useRef } from "react";

const MistralAISuggestions = ({ results }) => {
  const [adviceData, setAdviceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTools, setSelectedTools] = useState(["Axe-Core"]);
  const [violations, setViolations] = useState([]);
  const [filters, setFilters] = useState({
    tool: "",
    violation: "",
    impactedCode: "",
    suggestedFix: "",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref to manage dropdown

  const fetchAdvice = async (violations) => {
    try {
      const response = await fetch("/api/advice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ violations }),
      });

      const data = await response.json();
      
      const combinedData = violations.map((violation) => {
        const adviceEntry = data.mistralAdvice.find((advice) => {
          if (violation.type === "Axe-Core") {
            return advice.violation_id === violation.id;
          } else if (violation.type === "Pa11y") {
            return advice.violation_id === violation.id;
          }
          return false;
        });

        return {
          ...violation,
          advice: adviceEntry ? adviceEntry.advice : "No advice available",
        };
      });

      setAdviceData(combinedData);
      localStorage.setItem("mistralAdvice", JSON.stringify(combinedData));
    } catch (error) {
      console.error("Error fetching advice:", error);
    } finally {
      setLoading(false);
    }
  };

  const extractViolations = () => {
    const extractedViolations = [];

    if (results) {
      const axeCoreResults = results["axe-core-results"];
      if (axeCoreResults?.violations) {
        axeCoreResults.violations.forEach((violation) => {
          extractedViolations.push({
            id: violation.id,
            description: violation.description,
            type: "Axe-Core",
            html: violation.nodes.map((node) => node.html).join(" "),
          });
        });
      }

      const pa11yResults = results["pa11y-results"];
      if (pa11yResults?.issues) {
        pa11yResults.issues.forEach((issue) => {
          extractedViolations.push({
            id: issue.code,
            description: issue.message,
            type: "Pa11y",
            html: issue.html || "",
          });
        });
      }
    }

    return extractedViolations;
  };

  useEffect(() => {
    const storedAdvice = JSON.parse(localStorage.getItem("mistralAdvice"));
    if (storedAdvice) {
      setAdviceData(storedAdvice);
      setLoading(false);
    } else {
      const extractedViolations = extractViolations();
      setViolations(extractedViolations);
      if (extractedViolations.length > 0) {
        fetchAdvice(extractedViolations);
      } else {
        setLoading(false);
      }
    }
  }, [results]);

  const toolOptions = [
    { value: "Axe-Core", label: "Axe-Core" },
    { value: "Pa11y", label: "Pa11y" },
    // Add more tools as needed
  ];

  const handleToolSelection = (value) => {
    const updatedTools = selectedTools.includes(value)
      ? selectedTools.filter(tool => tool !== value)
      : [...selectedTools, value];
    setSelectedTools(updatedTools);
  };

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredAdvice = adviceData.filter((item) => {
    return (
      (selectedTools.length === 0 || selectedTools.includes(item.type)) &&
      (filters.violation === "" || item.description.toLowerCase().includes(filters.violation.toLowerCase())) &&
      (filters.impactedCode === "" || (item.html && item.html.toLowerCase().includes(filters.impactedCode.toLowerCase()))) &&
      (filters.suggestedFix === "" || item.advice.toLowerCase().includes(filters.suggestedFix.toLowerCase()))
    );
  });

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4 pt-10 text-center">
        Mistral AI Accessibility Advice
      </h1>

      {loading ? (
        <p className="text-center pt-10">Loading Mistral AI advice...</p>
      ) : (
        <div className="overflow-x-auto pt-10">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">
                  Tool Name
                  <div className="relative inline-block text-left" ref={dropdownRef}>
                    <div>
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="mt-1 w-full inline-flex justify-between rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        {selectedTools.join(", ") || "Select Tools"}
                        <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {isDropdownOpen && (
                      <div className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                          {toolOptions.map((option) => (
                            <label key={option.value} className="flex items-center p-2 hover:bg-gray-100">
                              <input
                                type="checkbox"
                                checked={selectedTools.includes(option.value)}
                                onChange={() => handleToolSelection(option.value)}
                                className="mr-2"
                              />
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Violation
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded p-1"
                    placeholder="Filter"
                    value={filters.violation}
                    onChange={(e) => setFilters({ ...filters, violation: e.target.value })}
                  />
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Impacted Code
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded p-1"
                    placeholder="Filter"
                    value={filters.impactedCode}
                    onChange={(e) => setFilters({ ...filters, impactedCode: e.target.value })}
                  />
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Suggested Fix
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded p-1"
                    placeholder="Filter"
                    value={filters.suggestedFix}
                    onChange={(e) => setFilters({ ...filters, suggestedFix: e.target.value })}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAdvice.length > 0 ? (
                filteredAdvice.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{item.type}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <pre className="p-2 border rounded bg-gray-100">
                        {item.html ? item.html : 'N/A'}
                      </pre>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{item.advice}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border border-gray-300 px-4 py-2 text-center">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MistralAISuggestions;