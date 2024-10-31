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
    labels: ['Total Violations', 'Total Incomplete', 'Total Passed'],
    datasets: [
      {
        label: 'Counts',
        data: [0, 0, 0],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],    
  });

  useEffect(() => {
    // Ensure selectedItems is an array before processing
    if (Array.isArray(selectedItems) && selectedItems.length > 0) {
      // Calculate totals based on selected items
      const totalViolations = selectedItems.reduce(
        (total, item) => total + item.violations.length,
        0
      );
      const totalIncomplete = selectedItems.reduce(
        (total, item) => total + item.incomplete.length,
        0
      );
      const totalPassed = selectedItems.reduce(
        (total, item) => total + item.passes.length,
        0
      );

      setChartData({
        labels: ['Total Violations', 'Total Incomplete', 'Total Passed'],
        datasets: [
          {
            label: 'Counts',
            data: [totalViolations, totalIncomplete, totalPassed],
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)', // Red for Total Violations
              'rgba(255, 206, 86, 0.6)', // Yellow for Total Incomplete
              'rgba(75, 192, 192, 0.6)', // Teal for Total Passed
            ],
          },
        ],
      });
    } else {
      // Reset chart data when there are no selected items
      setChartData({
        labels: ['Total Violations', 'Total Incomplete', 'Total Passed'],
        datasets: [
          {
            label: 'Counts',
            data: [0, 0, 0], 
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(255, 206, 86, 0.6)', 
              'rgba(75, 192, 192, 0.6)',
            ],
          },
        ],
      });
    }
  }, [selectedItems]); 

  return (
    <div className='w-full'>
      <h1 className='font-bold text-center'>Chart Display For Selected Items</h1>
      <Bar data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default ChartDisplay;