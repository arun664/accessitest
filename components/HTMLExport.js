import React from "react";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { toast } from "react-toastify";

Chart.register(...registerables);
Chart.register(ChartDataLabels);

const HTMLExport = ({ selectedItems }) => {
  const generateChartImage = () => {
    return new Promise((resolve) => {
      const dataCounts = getDataCounts();
      const totalIssues =
        (dataCounts.violations || 0) +
        (dataCounts.incomplete || 0) +
        (dataCounts.passes || 0);

      const dynamicLabels = [];
      const chartData = [];
      const chartColors = [];

      if (dataCounts.violations > 0) {
        dynamicLabels.push(`Violations: ${dataCounts.violations}`);
        chartData.push(dataCounts.violations);
        chartColors.push("#ff6384");
      }
      if (dataCounts.incomplete > 0) {
        dynamicLabels.push(`Incomplete: ${dataCounts.incomplete}`);
        chartData.push(dataCounts.incomplete);
        chartColors.push("#ffce56");
      }
      if (dataCounts.passes > 0) {
        dynamicLabels.push(`Passed Checks: ${dataCounts.passes}`);
        chartData.push(dataCounts.passes);
        chartColors.push("#4bc0c0");
      }

      // Handle the case where there are no issues to display
      if (dynamicLabels.length === 0) {
        dynamicLabels.push("No Issues");
        chartData.push(100);
      }

      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext("2d");

      const chart = new Chart(ctx, {
        type: "bar", // Change chart type to bar
        data: {
          labels: dynamicLabels,
          datasets: [
            {
              label: "Issue Counts",
              data: chartData,
              backgroundColor: chartColors, // Set the specific colors
              hoverBackgroundColor: chartColors,
            },
          ],
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: "top" },
            datalabels: {
              color: "#fff",
              formatter: (value) => `${value}`,
            },
          },
        },
      });

      setTimeout(() => {
        resolve(canvas.toDataURL("image/png"));
        chart.destroy();
      }, 500);
    });
  };

  const getDataCounts = () => {
    const counts = { violations: 0, incomplete: 0, passes: 0 };
    selectedItems.forEach((item) => {
      counts.violations += item.violations ? item.violations.length : 0;
      counts.incomplete += item.incomplete ? item.incomplete.length : 0;
      counts.passes += item.passes ? item.passes.length : 0;
    });
    return counts;
  };

  const sanitize = (input) => {
    if (typeof input !== "string") return input; // Only sanitize strings
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;"); // Escape single quotes
  };

  const exportToHTML = async () => {
    if (!selectedItems || selectedItems.length === 0) {
      toast.info("Please select at least one item to export.");
      return;
    } else if (selectedItems.length > 1) {
      toast.error("Please select only one item to export.");
      return;
    }

    const chartImage = await generateChartImage();
    let htmlContent = `
      <html>
        <head>
          <title>Accessibility Test Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1, h2 { color: #4CAF50; }
            .accordion { margin-bottom: 20px; }
            .accordion-item { border: 1px solid #ddd; margin-bottom: 5px; }
            .accordion-header { cursor: pointer; background-color: #f2f2f2; padding: 10px; display: flex; align-items: center; }
            .accordion-body { display: none; padding: 10px; max-height: 300px; overflow-y: auto; }
            .accordion-body.show { display: block; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .toggle-icon { margin-left: auto; }
            img {
              display: block; /* Ensure no inline spacing issues */
              margin: 0; /* Removes any default margins */
              padding: 0; /* Removes any default padding */
            }
          </style>
        </head>
        <body>
        <h1>Accessibility History Report</h1>
        <div style="display: flex; justify-content: center;">
          <img src="${chartImage}" alt="Issue Counts Chart" style="width: 400px; height: 400px; margin: 0; padding: 0;">
        </div>
    `;

    const item = selectedItems[0];
    htmlContent += `<h2>URL: <a href="${sanitize(item.url)}" target="_blank">${sanitize(item.url)}</a></h2>`;

    // Ensure that the accordion functionality works properly in the exported HTML
    const renderTable = (title, data, isViolation = false) => {
      if (!data || data.length === 0) return "";
      return `
      <div class="accordion-item">
        <div class="accordion-header" onclick="toggleAccordion('${sanitize(title)}')">
          ${sanitize(title)}
          <span class="toggle-icon">+</span>
        </div>
        <div class="accordion-body" id="body-${sanitize(title)}">
          <table>
            <tr>
              ${
                isViolation
                  ? `
              <th>HTML Element</th>
              <th>Failure Summary</th>
              <th>Impact</th>
              <th>Target</th>
              <th>Message</th>
              <th>Details</th>
            `
                  : `
              <th>HTML Element</th>
              <th>Impact</th>
              <th>Target</th>
              <th>Message</th>
              <th>Details</th>
            `
              }
            </tr>
            ${data
              .map((issue) =>
                issue.nodes
                  .map(
                    (node) => `
                <tr>
                  <td>${sanitize(node.html.toString() || "N/A")}</td>
                  ${
                    isViolation
                      ? `
                  <td>${sanitize(node.failureSummary.toString() || "N/A")}</td>
                  <td>${sanitize(node.impact || "None")}</td>
                `
                      : `
                  <td>${sanitize(node.impact || "None")}</td>
                `
                  }
                  <td>${sanitize(node.target ? node.target.join(", ") : "N/A")}</td>
                  <td>${
                    node.any && node.any.length > 0
                      ? sanitize(node.any[0].message)
                      : "No issues"
                  }</td>
                  <td>${
                    node.any && node.any.length > 0
                      ? sanitize(JSON.stringify(node.any[0].data || {}))
                      : "N/A"
                  }</td>
                </tr>
              `
                  )
                  .join("")
              )
              .join("")}
          </table>
        </div>
      </div>
    `;
    };

    // Render all data tables
    htmlContent += renderTable("Violations", item.violations || [], true);
    htmlContent += renderTable(
      "Incomplete Issues",
      item.incomplete || [],
      false
    );
    htmlContent += renderTable("Passed Checks", item.passes || [], false);

    htmlContent += `
        <script>
          function toggleAccordion(title) {
            const body = document.getElementById('body-' + title);
            body.classList.toggle('show');
            const icon = body.previousElementSibling.querySelector('.toggle-icon');
            icon.textContent = body.classList.contains('show') ? '-' : '+';
          }
        </script>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "accessibility_history_report.html";
    link.click();
  };

  return (
    <div>
      <p className="mb-4 font-bold">
        Please select only one item to download HTML report:
      </p>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded"
        onClick={exportToHTML}
      >
        Export to HTML
      </button>
    </div>
  );
};

export default HTMLExport;