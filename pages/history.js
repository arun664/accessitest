import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Accordion from "@/components/Accordion";
import ExcelExport from "@/components/ExcelExport";
import HTMLExport from "@/components/HTMLExport";
import JSONExport from "@/components/JSONExport";
import ChartDisplay from "@/components/ChartDisplay";
import AuthContext from "@/context/AuthContext";

const HistoryPage = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const { logout } = useContext(AuthContext);

  // Filter state
  const [urlFilter, setUrlFilter] = useState("");
  const [versionFilter, setVersionFilter] = useState("");
  const [timestampFilter, setTimestampFilter] = useState("");
  const [toolFilter, setToolFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const router = useRouter();

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
        setFilteredData(data);
      } catch (err) {
        console.error("Error fetching history:", err);
        logout();
        toast.warning("Session expired. Please log in again.");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  const toggleSelection = (item) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredData);
    }
    setIsAllSelected(!isAllSelected);
  };

  const applyFilters = () => {
    const newFilteredData = historyData.filter((item) => {
      const matchesUrl = item.url
        .toLowerCase()
        .includes(urlFilter.toLowerCase());
      const matchesVersion = versionFilter
        ? item.version.toString().includes(versionFilter)
        : true;
      const matchesTimestamp = timestampFilter
        ? new Date(item.timestamp).toISOString().slice(0, 10) ===
          new Date(timestampFilter).toISOString().slice(0, 10)
        : true;
      const matchesTool = toolFilter
        ? item.tool?.toLowerCase().includes(toolFilter.toLowerCase())
        : true;

      return matchesUrl && matchesVersion && matchesTimestamp && matchesTool;
    });
    setFilteredData(newFilteredData);
    setSelectedItems([]);
    setIsAllSelected(false);
  };

  const clearFilters = () => {
    setUrlFilter("");
    setVersionFilter("");
    setTimestampFilter("");
    setToolFilter("");
    setFilteredData(historyData);
    setSelectedItems([]);
    setIsAllSelected(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4 min-h-screen flex px-4 sm:px-6 lg:px-8 pb-4">
      <div className="flex-1 mr-4 flex flex-col">
        <div className="mb-4 flex flex-row space-x-4">
          <div className="w-2/4 flex flex-col space-y-2 mb-6">
            <h1 className="text-2xl font-bold mb-4">Accessibility History</h1>
            <div className="mb-4">
              <p className="mb-2">
                Please select one or more to download below reports:
              </p>
              <ExcelExport selectedItems={selectedItems} />
              <JSONExport selectedItems={selectedItems} />
            </div>
            <div className="mb-4 pt-4 pb-4">
              <HTMLExport selectedItems={selectedItems} />
            </div>

            <label htmlFor="urlFilter">URL Filter</label>
            <input
              type="text"
              placeholder="Filter by URL"
              value={urlFilter}
              id="urlFilter"
              onChange={(e) => setUrlFilter(e.target.value)}
              className="border p-2 dark:bg-gray-900 dark:text-white"
            />
            <label htmlFor="versionFilter">Version Filter</label>
            <input
              type="text"
              placeholder="Filter by Version"
              id="versionFilter"
              value={versionFilter}
              onChange={(e) => setVersionFilter(e.target.value)}
              className="border p-2 dark:bg-gray-900 dark:text-white"
            />
            <label htmlFor="timestampFilter">Timestamp Filter</label>
            <input
              type="date"
              placeholder="Filter by Timestamp"
              id="timestampFilter"
              value={timestampFilter}
              onChange={(e) => setTimestampFilter(e.target.value)}
              className="border p-2 dark:bg-gray-900 dark:text-white"
            />
            <label htmlFor="toolFilter">Tool Filter</label>
            <input
              type="text"
              placeholder="Filter by Tool"
              id="toolFilter"
              value={toolFilter}
              onChange={(e) => setToolFilter(e.target.value)}
              className="border dark:bg-gray-900 p-2"
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
            <div className="w-full">
              <h1 className="font-bold text-center">
                Chart Display For Selected Items
              </h1>
              {selectedItems.length > 0 ? (
                <ChartDisplay
                  selectedItems={selectedItems.map((item) => item.result)}
                />
              ) : (
                <div className="text-center">No items selected.</div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredData.length === 0 ? (
            <p>No history found.</p>
          ) : (
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 dark:bg-gray-900 p-2">
                    <label htmlFor="selectAll">Select All</label>
                    <input
                      type="checkbox"
                      id="selectAll"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="mr-2"
                    />
                  </th>
                  <th className="border border-gray-300 dark:bg-gray-900 p-2">
                    URL
                  </th>
                  <th className="border border-gray-300 dark:bg-gray-900 p-2">
                    Version
                  </th>
                  <th className="border border-gray-300 dark:bg-gray-900 p-2">
                    Timestamp
                  </th>
                  <th className="border border-gray-300 dark:bg-gray-900 p-2">
                    Tool
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 dark:bg-gray-900 p-2 text-center">
                      <label htmlFor={`item-${item.id}`}>Select</label>
                      <input
                        type="checkbox"
                        id={`item-${item.id}`}
                        checked={selectedItems.includes(item)}
                        onChange={() => toggleSelection(item)}
                        className="mr-2"
                      />
                    </td>
                    <td className="border border-gray-300 dark:bg-gray-900 p-2">
                      <Accordion
                        title={item.url}
                        details={item}
                        tool={item.tool}
                      />
                    </td>
                    <td className="border border-gray-300 dark:bg-gray-900 p-2 text-center">
                      {item.version}
                    </td>
                    <td className="border border-gray-300 dark:bg-gray-900 p-2 text-center">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 dark:bg-gray-900 p-2 text-center">
                      {item.tool || "N/A"}
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
