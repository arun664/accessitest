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
    <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: '1000', padding: '10px' }}>
      <button className="inspect-button" onClick={toggleInspection}>
        {isInspecting ? 'Stop Inspecting' : 'Start Inspecting'}
      </button>
      
      {xpath && (
        <div>
          <p>XPath: {xpath}</p>
          <button className="inspect-button" onClick={addXpathToTable}>Add to Table</button>
        </div>
      )}

      {xpathList.length > 0 && (
        <div>
          <h3>Inspected XPaths</h3>
          <table style={{ border: '1px solid black', width: '100%' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>XPath</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {xpathList.map((xpath, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{xpath}</td>
                  <td>
                    <button onClick={() => removeXpathFromTable(index)}>Remove</button>
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
