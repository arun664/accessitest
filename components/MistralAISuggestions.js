import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [sending, setSending] = useState(false);

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
        item.description
          .toLowerCase()
          .includes(filters.violation.toLowerCase())) &&
      (filters.impactedCode === "" ||
        (item.html &&
          item.html
            .toLowerCase()
            .includes(filters.impactedCode.toLowerCase()))) &&
      (filters.suggestedFix === "" ||
        item.advice.toLowerCase().includes(filters.suggestedFix.toLowerCase()))
    );
  });

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setEmail("");
    setEmailError("");
  };

  const handleEmailSend = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setSending(true);
    try {
      const response = await fetch("/api/sendResults", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          text: JSON.stringify(filteredAdvice, null, 2),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error("Failed to send email. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setSending(false);
      closeModal();
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4 pt-10 text-center">
        Mistral AI Accessibility Advice
      </h1>
      <button
        onClick={openModal}
        className="mb-6 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
      >
        Send Results to Email
      </button>
      {loading ? (
        <p className="text-center pt-10">Loading Mistral AI advice...</p>
      ) : (
        <div className="overflow-x-auto pt-10 pb-10">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-800">
                <th className="border border-gray-300 px-4 py-2">Tool Name</th>
                <th className="border border-gray-300 px-4 py-2">Violation</th>
                <th className="border border-gray-300 px-4 py-2">
                  Impacted Code
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Suggested Fix
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAdvice.length > 0 ? (
                filteredAdvice.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-100 dark:hover:bg-gray-900"
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {item.type}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {expandedCells[`violation-${item.id}`] ||
                      item.description.length <= 100
                        ? item.description
                        : `${item.description.slice(0, 200)}...`}
                      {item.description.length > 200 && (
                        <button
                          className="text-blue-500 ml-2"
                          onClick={() =>
                            toggleExpandCell(`violation-${item.id}`)
                          }
                        >
                          {expandedCells[`violation-${item.id}`]
                            ? "Show less"
                            : "Show more"}
                        </button>
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {expandedCells[`html-${item.id}`] ||
                      item.html.length <= 200
                        ? item.html
                        : `${item.html.slice(0, 200)}...`}
                      {item.html.length > 200 && (
                        <button
                          className="text-blue-500 ml-2"
                          onClick={() => toggleExpandCell(`html-${item.id}`)}
                        >
                          {expandedCells[`html-${item.id}`]
                            ? "Show less"
                            : "Show more"}
                        </button>
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {expandedCells[`advice-${item.id}`] ||
                      item.advice.length <= 200
                        ? item.advice
                        : `${item.advice.slice(0, 200)}...`}
                      {item.advice.length > 200 && (
                        <button
                          className="text-blue-500 ml-2"
                          onClick={() => toggleExpandCell(`advice-${item.id}`)}
                        >
                          {expandedCells[`advice-${item.id}`]
                            ? "Show less"
                            : "Show more"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="border border-gray-300 px-4 py-2 text-center"
                  >
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
              <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full dark:bg-black">
                <h2 className="text-xl font-semibold mb-4">Enter your email</h2>
                <input
                  type="email"
                  className="w-full p-2 border rounded-md mb-4 bg-white text-black dark:bg-gray-900 dark:text-white"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                />
                {emailError && (
                  <p className="text-red-500 mb-2">{emailError}</p>
                )}
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 mr-2 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none dark:bg-gray-800"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    className={`px-4 py-2 ${
                      sending ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                    } text-white rounded-md focus:outline-none`}
                    onClick={handleEmailSend}
                    disabled={sending}
                  >
                    {sending ? "Sending..." : "Send"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MistralAISuggestions;
