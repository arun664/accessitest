import React, { useState } from "react";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { toast } from "react-toastify";

Chart.register(...registerables);
Chart.register(ChartDataLabels);

const HTMLExport = ({ selectedItems }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const getDataCounts = () => {
    const counts = { violations: 0, incomplete: 0, passes: 0 };
    selectedItems.forEach((item) => {
      counts.violations += item.violations ? item.violations.length : 0;
      counts.incomplete += item.incomplete ? item.incomplete.length : 0;
      counts.passes += item.passes ? item.passes.length : 0;
    });
    return counts;
  };

  const generateChartImage = () => {
    return new Promise((resolve) => {
      const dataCounts = getDataCounts();
      const totalIssues =
        dataCounts.violations + dataCounts.incomplete + dataCounts.passes || 1;

      const chartData = [
        (dataCounts.violations / totalIssues) * 100,
        (dataCounts.incomplete / totalIssues) * 100,
        (dataCounts.passes / totalIssues) * 100,
      ];

      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext("2d");

      const chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Violations", "Incomplete", "Passed Checks"],
          datasets: [
            {
              label: "Issue Counts",
              data: chartData,
              backgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
              hoverBackgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
            },
          ],
          hoverOffset: 4,
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: "top" },
            datalabels: {
              color: "#fff",
              formatter: (value) => `${value.toFixed(1)}%`,
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
          <title>Accessibility History Report</title>
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
          </style>
        </head>
        <body>
          <h1>Accessibility History Report</h1>
          <div>
            <img src="${chartImage}" alt="Issue Counts Chart" style="width: 400px; height: 400px; margin-bottom: 20px;">
          </div>
    `;

    const item = selectedItems[0];
    htmlContent += `<h2>URL: <a href="${item.url}" target="_blank">${item.url}</a></h2>`;

    const renderTable = (title, data) => {
      if (!data || data.length === 0) return "";
      return `
        <div class="accordion-item">
          <div class="accordion-header" onclick="document.getElementById('body-${title}').classList.toggle('show');">
            ${title}
            <span class="toggle-icon">+</span>
          </div>
          <div class="accordion-body" id="body-${title}">
            <table>
              <tr>
                <th>HTML Element</th>
                <th>Failure Summary</th>
                <th>Impact</th>
                <th>Target</th>
                <th>Message</th>
                <th>Details</th>
              </tr>
              ${data
                .flatMap((issue) =>
                  issue.nodes
                    .map(
                      (node) => `
                  <tr>
                    <td>${node.html || "N/A"}</td>
                    <td>${node.failureSummary || "N/A"}</td>
                    <td>${node.impact || "None"}</td>
                    <td>${node.target ? node.target.join(", ") : "N/A"}</td>
                    <td>${
                      node.any && node.any.length > 0
                        ? node.any[0].message
                        : "No issues"
                    }</td>
                    <td>${
                      node.any && node.any.length > 0
                        ? JSON.stringify(node.any[0].data || {})
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

    htmlContent += renderTable("Incomplete Issues", item.incomplete);
    htmlContent += renderTable("Passed Checks", item.passes);
    htmlContent += renderTable("Violations", item.violations);

    htmlContent += `
        <script>
          document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', function() {
              const body = this.nextElementSibling;
              body.classList.toggle('show');
              const icon = this.querySelector('.toggle-icon');
              icon.textContent = body.classList.contains('show') ? '-' : '+';
            });
          });
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
        onClick={exportToHTML}
        className="px-4 py-2 bg-black hover:bg-gray-500 text-white rounded"
      >
        Download HTML Report
      </button>
    </div>
  );
};

export default HTMLExport;
