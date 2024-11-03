import React from 'react';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';

const ExcelExport = ({ selectedItems }) => {
  const exportToExcel = () => {
    if (selectedItems.length === 0) {
      toast.info("Please select at least one item to export.");
      return;
    }

    const formatNodes = (nodes) => {
      return nodes.map(node => ({
        'HTML Element': node.html,
        'Failure Summary': node.failureSummary || '',
        'Impact': node.impact || 'None',
        'Target': node.target.join(', '),
        'Message': node.any.length > 0 ? node.any[0].message : 'No issues',
        'Details': node.any.length > 0 ? JSON.stringify(node.any[0].data || {}) : 'N/A',
      }));
    };

    const createWorksheet = (title, data) => {
      const formattedData = data.flatMap(issue =>
        formatNodes(issue.nodes).map(node => ({
          'Issue ID': issue.id,
          'Help': issue.help,
          'Description': issue.description,
          'Impact': issue.impact,
          'Help URL': issue.helpUrl,
          ...node,
        }))
      );
      return XLSX.utils.json_to_sheet(formattedData, { header: Object.keys(formattedData[0] || {}) });
    };

    const workbook = XLSX.utils.book_new();

    // Create an index array to keep track of URLs and corresponding sheet names
    const indexData = [];

    // First, collect data for the index sheet
    selectedItems.forEach((item, index) => {
      const sheetIndex = index + 1; // To generate unique index

      if (item.incomplete) {
        const sheetName = `Result ${sheetIndex} - Incomplete`;
        indexData.push({ url: item.url, sheetName });
      }

      if (item.passes) {
        const sheetName = `Result ${sheetIndex} - Passes`;
        indexData.push({ url: item.url, sheetName });
      }

      if (item.violations) {
        const sheetName = `Result ${sheetIndex} - Violations`;
        indexData.push({ url: item.url, sheetName });
      }
    });

    // Create the index sheet
    const indexSheetData = indexData.map(item => ({
      'URL': item.url,
      'Sheet Name': item.sheetName,
    }));

    const indexSheet = XLSX.utils.json_to_sheet(indexSheetData);
    XLSX.utils.book_append_sheet(workbook, indexSheet, 'Index');

    // Then, append the other sheets to the workbook
    selectedItems.forEach((item, index) => {
      const sheetIndex = index + 1; // To generate unique index

      if (item.incomplete) {
        const incompleteSheet = createWorksheet('Incomplete Issues', item.incomplete);
        const sheetName = `Result ${sheetIndex} - Incomplete`;
        XLSX.utils.book_append_sheet(workbook, incompleteSheet, sheetName);
      }

      if (item.passes) {
        const passesSheet = createWorksheet('Passed Checks', item.passes);
        const sheetName = `Result ${sheetIndex} - Passes`;
        XLSX.utils.book_append_sheet(workbook, passesSheet, sheetName);
      }

      if (item.violations) {
        const violationsSheet = createWorksheet('Violations', item.violations);
        const sheetName = `Result ${sheetIndex} - Violations`;
        XLSX.utils.book_append_sheet(workbook, violationsSheet, sheetName);
      }
    });

    // Write the workbook to an Excel file
    XLSX.writeFile(workbook, 'history_data.xlsx');
  };

  return (
    <button onClick={exportToExcel} className="px-4 py-2 bg-green-500 text-white rounded mr-2">
      Export to Excel
    </button>
  );
};

export default ExcelExport;
