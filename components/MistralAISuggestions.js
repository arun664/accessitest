import React, { useEffect, useState, useRef } from "react";

const MistralAISuggestions = ({ results }) => {
  const [adviceData, setAdviceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTools, setSelectedTools] = useState(["Axe-Core"]);
  const [expandedCells, setExpandedCells] = useState({});
  const [violations, setViolations] = useState([]);
  const [filters, setFilters] = useState({
    tool: "",
    violation: "",
    impactedCode: "",
    suggestedFix: "",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleExpandCell = (cellKey) => {
    setExpandedCells((prev) => ({
      ...prev,
      [cellKey]: !prev[cellKey],
    }));
  };

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

  const filteredAdvice = adviceData.filter((item) => {
    return (
      (selectedTools.length === 0 || selectedTools.includes(item.type)) &&
      (filters.violation === "" ||
        item.description.toLowerCase().includes(filters.violation.toLowerCase())) &&
      (filters.impactedCode === "" ||
        (item.html && item.html.toLowerCase().includes(filters.impactedCode.toLowerCase()))) &&
      (filters.suggestedFix === "" ||
        item.advice.toLowerCase().includes(filters.suggestedFix.toLowerCase()))
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
        <div className="overflow-x-auto pt-10 pb-10">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Tool Name</th>
                <th className="border border-gray-300 px-4 py-2">Violation</th>
                <th className="border border-gray-300 px-4 py-2">Impacted Code</th>
                <th className="border border-gray-300 px-4 py-2">Suggested Fix</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdvice.length > 0 ? (
                filteredAdvice.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{item.type}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {expandedCells[`violation-${item.id}`] || item.description.length <= 100
                        ? item.description
                        : `${item.description.slice(0, 200)}...`}
                      {item.description.length > 200 && (
                        <button
                          className="text-blue-500 ml-2"
                          onClick={() => toggleExpandCell(`violation-${item.id}`)}
                        >
                          {expandedCells[`violation-${item.id}`] ? "Show less" : "Show more"}
                        </button>
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {expandedCells[`html-${item.id}`] || item.html.length <= 200
                        ? item.html
                        : `${item.html.slice(0, 200)}...`}
                      {item.html.length > 200 && (
                        <button
                          className="text-blue-500 ml-2"
                          onClick={() => toggleExpandCell(`html-${item.id}`)}
                        >
                          {expandedCells[`html-${item.id}`] ? "Show less" : "Show more"}
                        </button>
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {expandedCells[`advice-${item.id}`] || item.advice.length <= 200
                        ? item.advice
                        : `${item.advice.slice(0, 200)}...`}
                      {item.advice.length > 200 && (
                        <button
                          className="text-blue-500 ml-2"
                          onClick={() => toggleExpandCell(`advice-${item.id}`)}
                        >
                          {expandedCells[`advice-${item.id}`] ? "Show less" : "Show more"}
                        </button>
                      )}
                    </td>
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