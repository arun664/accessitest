import React from 'react';

const HTMLExport = ({ selectedItems }) => {
  const exportToHTML = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item to export.");
      return;
    }

    let htmlContent = `
      <html>
        <head><title>Accessibility History</title></head>
        <body>
          <h1>Accessibility History</h1>
          <table border="1">
            <tr>
              <th>URL</th>
              <th>Results</th>
            </tr>
    `;
    
    selectedItems.forEach((item) => {
      htmlContent += `
        <tr>
          <td>${item.url}</td>
          <td>${JSON.stringify(item.results)}</td>
        </tr>
      `;
    });

    htmlContent += `
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'history_data.html';
    link.click();
  };

  return (
    <button onClick={exportToHTML} className="px-4 py-2 bg-blue-500 text-white rounded">
      Export to HTML
    </button>
  );
};

export default HTMLExport;
