import React, { useState } from "react";
import { useRouter } from "next/router";
import LoadingSpinner from "@/components/LoadingSpinner";
import CustomMultiSelect from "@/components/CustomMultiSelect";

const tools = [
  { value: "axe-core", label: "Axe-Core" },
  { value: "pa11y", label: "Pa11y" },
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [selectedTools, setSelectedTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    localStorage.removeItem("accessibilityResults");
    localStorage.removeItem("mistralAdvice");
    e.preventDefault();
    if (url.trim() && selectedTools.length > 0) {
      setLoading(true);
      try {
        let results = {};

        if (selectedTools.includes("axe-core")) {
          let axcoreresults = await runAxeCore(url);
          //console.log("AxeCore Results",axcoreresults);
          results["axe-core-results"] = axcoreresults;
        }

        if (selectedTools.includes("pa11y")) {
          let pa11yresults = await runPa11y(url);
          //console.log("Pa11y Results",pa11yresults);
          results["pa11y-results"] = pa11yresults;
        }

        // Save results to sessionStorage
        localStorage.setItem("url", url);
        localStorage.setItem("accessibilityResults", JSON.stringify(results));

        // Navigate to results dashboard
        router.push("/dashboard");
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const runAxeCore = async (url) => {
    const response = await fetch("/api/axeCore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error("Failed to run axe-core tests.");
    }
    return await response.json();
  };

  const runPa11y = async (url) => {
    const response = await fetch("/api/pa11y", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error("Failed to run Pa11y tests.");
    }
    return await response.json();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-semibold mb-6">Accessibility Testing Tool</h1>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            type="url"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="px-4 py-2 border rounded mb-4 w-80 text-black dark:bg-gray-900 dark:text-white"
            required
          />
          <CustomMultiSelect
          className="text-black dark:bg-gray-900 dark:text-white"
            options={tools}
            selectedOptions={selectedTools}
            setSelectedOptions={setSelectedTools}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mt-4"
          >
            Run Accessibility Test
          </button>
        </form>
      )}
    </div>
  );
}