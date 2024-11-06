import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import AxeCoreResultTable from "@/components/AxeCoreResultTable";
import Pa11yResultTable from "@/components/Pa11yResultTable";
import AuthContext from "@/context/AuthContext";
import { toast } from "react-toastify";
import CustomMultiSelect from "@/components/CustomMultiSelect";

const tools = [
  { value: "axe-core", label: "Axe-Core" },
  { value: "pa11y", label: "Pa11y" },
];

const Dashboard = () => {
  const router = useRouter();
  const { loggedIn, storedToken } = useContext(AuthContext);
  const [url, setUrl] = useState("");

  // State for selected tools
  const [selectedTools, setSelectedTools] = useState(JSON.parse(localStorage.getItem("selectedtools")) || ["axe-core"]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});

  // Effect to load results from localStorage on mount
  useEffect(() => {
    if(localStorage.getItem("accessibilityResults")) {
      setResults(JSON.parse(localStorage.getItem("accessibilityResults")));
      setUrl(localStorage.getItem("url"));
    } else {
      router.push("/");
    }
  }, []);

  // Handle tool results display
  const displayResults = () => {
    const resultsToDisplay = {};
    if (selectedTools.includes("axe-core") && results["axe-core-results"]) {
      resultsToDisplay["axe-core"] = results["axe-core-results"];
    }
    if (selectedTools.includes("pa11y") && results["pa11y-results"]) {
      resultsToDisplay["pa11y"] = results["pa11y-results"];
    }
    return resultsToDisplay;
  };

  const currentResults = displayResults();
  const handleSaveResults = async () => {
    // Check if URL and results are available and valid
    if (!url) {
      toast.error("No URL found.");
      return;
    }
    if (!results || typeof results !== 'object' || Object.keys(results).length === 0) {
      toast.error("No results found to save.");
      return;
    }
  
    setLoading(true);
  
    try {
      for (const [tool, result] of Object.entries(currentResults)) {
        if (!result) {
          console.warn(`No result found for tool: ${tool}`);
          continue; 
        }

        const requestData = {
          url,
          tool,
          result,
        };
  
        const response = await fetch("/api/history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify(requestData),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.error || "Failed to save a result.");
        }
      }
  
      toast.success("All results saved successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to save results.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleLoginRedirect = () => {
    toast.info("Please log in to save results.");
    router.push("/login");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">
        Accessibility Test Results
      </h1>

      <div className="flex flex-row mb-4">
        <div>
          <h2 className="font-semibold">Select Tools:</h2>
          <CustomMultiSelect
            options={tools}
            selectedOptions={selectedTools}
            setSelectedOptions={setSelectedTools}
          />
        </div>
        <div className="ml-auto">
          {loggedIn ? (
            <button
              onClick={handleSaveResults}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Results"}
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
      </div>

      {Object.keys(currentResults).length > 0 ? (
        <div className="bg-white p-4 rounded shadow-md dark:bg-black">
          {Object.entries(currentResults).map(([tool, result]) => (
            <div key={tool} className="mb-4">
              <h2 className="text-xl font-bold">
                {tool.charAt(0).toUpperCase() + tool.slice(1)} Results:
              </h2>
              {tool === "axe-core" ? (
                <AxeCoreResultTable results={result} />
              ) : (
                <Pa11yResultTable results={result} />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No results available.</p>
      )}

      <div className="mt-6 p-4 bg-gray-100 rounded dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-2">Mistral AI Suggestions</h2>
        <p>Note: Mistral AI provides suggestions for Axe-Core results only.</p>
        <button
          onClick={async () => {
            localStorage.removeItem("mistralAdvice");
            router.push("/mistral-ai-results");
          }}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-700"
        >
          Request Mistral AI Suggestions
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
