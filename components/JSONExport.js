// components/JSONExport.js
import React from "react";
import { toast } from "react-toastify";

const JSONExport = ({ selectedItems }) => {
  const exportToJSON = () => {
    if (selectedItems.length === 0) {
      toast.info("Please select at least one item to export.");
      return;
    }

    const jsonString = JSON.stringify(selectedItems, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "selected_items.json"; // Specify the name for the downloaded file
    link.click();
  };

  return (
      <button
        onClick={exportToJSON}
        className="px-4 py-2 bg-orange-800 text-white rounded"
      >
        Export JSON
      </button>
  );
};

export default JSONExport;