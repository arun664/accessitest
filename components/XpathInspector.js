import React, { useState, useEffect } from 'react';

export default function XpathInspector() {
  const [isInspecting, setIsInspecting] = useState(false);
  const [xpath, setXpath] = useState('');
  const [xpathList, setXpathList] = useState([]);

  // Toggle the inspection mode
  const toggleInspection = () => {
    setIsInspecting((prev) => !prev);
  };

  useEffect(() => {
    if (isInspecting) {
      document.body.addEventListener('click', handleElementClick, true);
    } else {
      document.body.removeEventListener('click', handleElementClick, true);
    }

    return () => {
      document.body.removeEventListener('click', handleElementClick, true);
    };
  }, [isInspecting]);

  // Highlight on inspecting element
  const highlightElement = (element) => {
    element.style.outline = '2px solid red';
  };

  const unHighlightElement = (element) => {
    element.style.outline = '';
  };

  const handleMouseOver = (e) => {
    highlightElement(e.target);
  };

  const handleMouseOut = (e) => {
    unHighlightElement(e.target);
  };

  useEffect(() => {
    if (isInspecting) {
      document.body.addEventListener('mouseover', handleMouseOver);
      document.body.addEventListener('mouseout', handleMouseOut);
    } else {
      document.body.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseout', handleMouseOut);
    }

    return () => {
      document.body.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isInspecting]);

  // Handle element click to get XPath
  const handleElementClick = (e) => {
    if (e.target.classList.contains('inspect-button')) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const path = getXPath(e.target);
    setXpath(path);
  };

  // Function to generate XPath for an element
  const getXPath = (element) => {
    if (element.id) return `//*[@id="${element.id}"]`;
    if (element === document.body) return '/html/body';

    const ix = Array.from(element.parentNode.children).indexOf(element) + 1;
    const tagName = element.tagName.toLowerCase();

    return `${getXPath(element.parentNode)}/${tagName}[${ix}]`;
  };

  // Add the current XPath to the table
  const addXpathToTable = () => {
    if (xpath && !xpathList.includes(xpath)) {
      setXpathList([...xpathList, xpath]);
    }
  };

  // Remove an XPath from the table
  const removeXpathFromTable = (index) => {
    const updatedList = xpathList.filter((_, i) => i !== index);
    setXpathList(updatedList);
  };

  return (
    <div className="relative p-4 bg-white border rounded shadow-lg">
      <button className="inspect-button px-4 py-2 mb-2 text-white bg-blue-500 hover:bg-blue-700 rounded" onClick={toggleInspection}>
        {isInspecting ? 'Stop Inspecting' : 'Start Inspecting'}
      </button>
      
      {xpath && (
        <div className="mb-4">
          <p className="font-medium">XPath: <span className="font-normal">{xpath}</span></p>
          <button className="inspect-button px-4 py-2 mt-2 text-white bg-green-500 hover:bg-green-700 rounded" onClick={addXpathToTable}>Add to Table</button>
        </div>
      )}

      {xpathList.length > 0 && (
        <div>
          <h3 className="mb-2 text-lg font-semibold">Inspected XPaths</h3>
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">#</th>
                <th className="border border-gray-300 p-2">XPath</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {xpathList.map((xpath, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">{xpath}</td>
                  <td className="border border-gray-300 p-2">
                    <button className="text-red-500 hover:text-red-700" onClick={() => removeXpathFromTable(index)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
