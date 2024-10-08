// Function to export XPaths and labels as a JSON file
export const exportXpaths = (xpathList) => {
    const dataStr = JSON.stringify(xpathList, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'xpaths.json';
    a.click();
    window.URL.revokeObjectURL(url);
  };
  