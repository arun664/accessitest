import React, { useEffect, useState } from "react";
import Accordion from "@/components/Accordion";
import ExcelExport from "@/components/ExcelExport";
import HTMLExport from "@/components/HTMLExport";
import ChartDisplay from "@/components/ChartDisplay";

const HistoryPage = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  // Filter state
  const [urlFilter, setUrlFilter] = useState("");
  const [versionFilter, setVersionFilter] = useState("");
  const [timestampFilter, setTimestampFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/history", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch history");
        }

        const data = await response.json();
        setHistoryData(data);
        setFilteredData(data); // Initialize with full data

        // Automatically select the first item if data is available
        if (data.length > 0) {
          setSelectedItems([data[0]]);
        }
      } catch (err) {
        console.error("Error fetching history:", err);
        setError("Failed to fetch history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const toggleSelection = (item) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  // Filter logic
  const applyFilters = () => {
    const newFilteredData = historyData.filter((item) => {
      const matchesUrl = item.url
        .toLowerCase()
        .includes(urlFilter.toLowerCase());
      const matchesVersion = versionFilter
        ? item.version.toString().includes(versionFilter)
        : true;
      const matchesTimestamp = timestampFilter
        ? new Date(item.timestamp).toLocaleDateString() ===
          new Date(timestampFilter).toLocaleDateString()
        : true;

      return matchesUrl && matchesVersion && matchesTimestamp;
    });
    setFilteredData(newFilteredData);
    setSelectedItems([]); // Clear selected items on filter application
  };

  const clearFilters = () => {
    setUrlFilter("");
    setVersionFilter("");
    setTimestampFilter("");
    setFilteredData(historyData);
    setSelectedItems([]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  console.log("Selected Items:", selectedItems);

  return (
    <div className="p-4 flex h-screen">
      <div className="flex-1 mr-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-4">Accessibility History</h1>
        <div className="mb-4 flex flex-row space-x-4">
          
          <div className="w-2/4 flex flex-col space-y-2">
            <div className="mb-4">
              <ExcelExport selectedItems={selectedItems} />
              <HTMLExport selectedItems={selectedItems} />
            </div>

            <input
              type="text"
              placeholder="Filter by URL"
              value={urlFilter}
              onChange={(e) => setUrlFilter(e.target.value)}
              className="border p-2"
            />
            <input
              type="text"
              placeholder="Filter by Version"
              value={versionFilter}
              onChange={(e) => setVersionFilter(e.target.value)}
              className="border p-2"
            />
            <input
              type="date"
              placeholder="Filter by Timestamp"
              value={timestampFilter}
              onChange={(e) => setTimestampFilter(e.target.value)}
              className="border p-2"
            />
            <div className="flex space-x-2 mt-2">
              <button
                onClick={applyFilters}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="w-2/4 flex justify-center items-center">
            {selectedItems.length > 0 ? (
              <ChartDisplay selectedItems={selectedItems} />
            ) : (
              <div>No items selected.</div>
            )}
          </div>
        </div>

        {/* Table to display filtered history items */}
        <div className="flex-1 overflow-y-auto">
          {filteredData.length === 0 ? (
            <p>No history found.</p>
          ) : (
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Select</th>
                  <th className="border border-gray-300 p-2">URL</th>
                  <th className="border border-gray-300 p-2">Version</th>
                  <th className="border border-gray-300 p-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-2">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item)}
                        onChange={() => toggleSelection(item)}
                        className="mr-2"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Accordion title={item.url} details={item} />
                    </td>
                    <td className="border border-gray-300 p-2">
                      {item.version}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
