import React from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx"; // Ensure you have 'xlsx' installed

const ExcelExport = ({ selectedItems }) => {
  const sanitize = (input) => {
    // We will keep the source code intact by skipping sanitization
    if (typeof input !== "string") return input; // Only sanitize strings
    return input; // Don't sanitize HTML symbols, leave them intact
  };

  const exportToExcel = async () => {
    if (!selectedItems || selectedItems.length === 0) {
      toast.info("Please select at least one item to export.");
      return;
    }

    const dataForExcel = [];
    selectedItems.forEach((item) => {
      // Define common data structure for each violation
      const commonData = {
        Tool: sanitize(item.tool),
        URL: sanitize(item.url),
        Timestamp: sanitize(item.timestamp),
        Version: sanitize(item.version),
      };

      // Handle axe-core results
      if (item.tool === "axe-core") {
        const violations = item.result.violations;
        violations.forEach((violation) => {
          // Extract nodes for impacted code and target (axe-core)
          const impactedCode = violation.nodes
            ? violation.nodes
                .map((node) => node.html) // Join targets inside nodes[]
                .join(" | ") // Join targets from all nodes
            : "";
            // Extract nodes for impacted code and target (axe-core)
            const target = violation.nodes
              ? violation.nodes
                  .map((node) => node.target.join(", ")) // Join targets inside nodes[]
                  .join(" | ") // Join targets from all nodes
              : "";

          const violationData = {
            ...commonData, // Copy the common fields for each violation
            ViolationDescription: sanitize(violation.description),
            Severity: sanitize(violation.impact), // Severity based on axe-core
            ImpactedCode: sanitize(impactedCode), // Get impacted code from nodes
            Target: sanitize(target),
          };

          dataForExcel.push(violationData); // Add the row for this violation
        });
      }

      // Handle Pa11y results
      if (item.tool === "pa11y") {
        const issues = item.result.issues;
        issues.forEach((issue) => {
          const issueData = {
            ...commonData, // Copy the common fields for each issue
            ViolationDescription: sanitize(issue.message),
            Severity: sanitize(issue.type), // Severity based on pa11y
            ImpactedCode: sanitize(issue.context),
            Target: sanitize(issue.selector), // Pa11y selector as target
          };
          dataForExcel.push(issueData); // Add the row for this issue
        });
      }
    });

    // Export data to Excel
    const ws = XLSX.utils.json_to_sheet(dataForExcel); // Convert the data to a worksheet
    const wb = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, "Accessibility Report"); // Append the sheet
    XLSX.writeFile(wb, "accessibility_report.xlsx"); // Write the file to Excel
  };

  return (
    <button onClick={exportToExcel} className="px-4 py-2 bg-green-800 text-white rounded mr-2">
      Export to Excel
    </button>
  );
};

export default ExcelExport;