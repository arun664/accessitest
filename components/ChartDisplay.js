import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import 'chartjs-plugin-datalabels';

// Register ChartJS components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const ChartDisplay = ({ selectedItems }) => {
  const [chartData, setChartData] = useState({
    labels: ['Total Axe-Core Violations', 'Total Pa11y Issues'],
    datasets: [
      {
        label: 'Axe-Core',
        data: [0, 0],  // Axe-Core Violations, Pa11y Issues
        backgroundColor: 'rgba(255, 99, 132, 0.6)', // Red for Axe-Core Violations
      },
      {
        label: 'Pa11y',
        data: [0, 0],  // Pa11y Violations
        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue for Pa11y Issues
      },
    ],    
  });

  useEffect(() => {
    if (Array.isArray(selectedItems) && selectedItems.length > 0) {
      let axeViolations = 0;
      let pa11yIssues = 0;

      selectedItems.forEach((item) => {
        // Handle Axe-Core violations, Pa11y issues
        const violations = item.violations || [];
        const issues = item.issues || [];

        // Count Axe-Core Violations and Pa11y Issues separately
        axeViolations += violations.length;
        pa11yIssues += issues.length;
      });

      setChartData({
        labels: ['Total Axe-Core Violations', 'Total Pa11y Issues'],
        datasets: [
          {
            label: 'Axe-Core',
            data: [axeViolations, 0],  // Only Axe-Core Violations for this dataset
            backgroundColor: 'rgba(255, 99, 132, 0.6)', // Red for Axe-Core Violations
          },
          {
            label: 'Pa11y',
            data: [0, pa11yIssues], // Only Pa11y Issues for this dataset
            backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue for Pa11y Issues
          },
        ],
      });
    } else {
      // Reset chart data if no items are selected
      setChartData({
        labels: ['Total Axe-Core Violations', 'Total Pa11y Issues'],
        datasets: [
          {
            label: 'Axe-Core',
            data: [0, 0],
            backgroundColor: 'rgba(255, 99, 132, 0.6)', // Red
          },
          {
            label: 'Pa11y',
            data: [0, 0],
            backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue
          },
        ],
      });
    }
  }, [selectedItems]);

  const options = {
    responsive: true,
    plugins: {
      datalabels: {
        display: true,
        color: 'black',  // Color of the label
        align: 'center', // Align the label in the center of the bar
        anchor: 'center', // Anchor the label at the center of the bar
        formatter: (value) => value, // Display the count value
        font: {
          weight: 'bold',
        },
      },
    },
    scales: {
      x: {
        beginAtZero: false,  // Remove unnecessary zero from X-axis
      },
      y: {
        beginAtZero: true,  // Ensure Y-axis starts at zero
      },
    },
  };

  return (
    <>
      <h2>Violations Breakdown</h2>
      <Bar data={chartData} options={options} />
    </>
  );
};

export default ChartDisplay;