import React, { useState, useEffect } from 'react';

export default function XpathInspector() {
  const [isInspecting, setIsInspecting] = useState(false);
  const [xpath, setXpath] = useState('');
  const [label, setLabel] = useState('');
  const [xpathList, setXpathList] = useState([]);

  // Toggle the inspection mode
  const toggleInspection = () => {
    setIsInspecting((prev) => {
      if (prev) {
        removeHighlightFromAll();
      }
      return !prev;
    });
  };

  useEffect(() => {
    if (isInspecting) {
      document.body.addEventListener('click', handleElementClick, true);
      document.body.addEventListener('mouseover', handleMouseOver);
      document.body.addEventListener('mouseout', handleMouseOut);
    } else {
      document.body.removeEventListener('click', handleElementClick, true);
      document.body.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseout', handleMouseOut);
    }

    return () => {
      document.body.removeEventListener('click', handleElementClick, true);
      document.body.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseout', handleMouseOut);
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

  // Remove highlights from all elements when stopping inspection
  const removeHighlightFromAll = () => {
    document.querySelectorAll('*').forEach((el) => {
      el.style.outline = '';
    });
  };

  // Handle element click to get XPath
  const handleElementClick = (e) => {
    if (e.target.classList.contains('inspect-button')) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const path = getImprovedXPath(e.target);
    if (isUniqueXPath(path)) {
      setXpath(path);
    } else {
      console.log('Generated XPath is not unique. Refining...');
    }
  };

  // Check if XPath is unique
  const isUniqueXPath = (xpath) => {
    const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    return result.snapshotLength === 1;
  };

  // Improved function to generate an accurate XPath
  const getImprovedXPath = (element) => {
    if (element.id) {
      return `//*[@id="${element.id}"]`; // If the element has an ID, use it (unique)
    }
    if (element.name) {
      return `//*[@name="${element.name}"]`; // If the element has a name attribute, use it
    }

    // Generate XPath by traversing from parent to child
    const path = [];
    while (element && element.nodeType === Node.ELEMENT_NODE) {
      const tagName = element.tagName.toLowerCase();
      
      // Check for unique class-based partial match
      if (element.classList.length > 0) {
        const partialClassName = element.classList[0]; // Consider only the first class as a partial match
        const classBasedXPath = `${tagName}[contains(@class, "${partialClassName}")]`;

        if (isUniqueXPath(classBasedXPath)) {
          path.unshift(classBasedXPath);
          break;
        }
      }

      // Check if element has siblings of the same type
      const siblings = Array.from(element.parentNode.children).filter(
        (sibling) => sibling.tagName === element.tagName
      );

      if (siblings.length > 1) {
        // Add index only if there are multiple siblings with the same tag name
        const index = siblings.indexOf(element) + 1;
        path.unshift(`${tagName}[${index}]`);
      } else {
        path.unshift(tagName); // No index needed if it’s unique among siblings
      }

      element = element.parentNode;
    }

    return `/${path.join('/')}`;
  };

  // Add the current XPath and label to the table
  const addXpathToTable = () => {
    if (xpath && !xpathList.some((item) => item.xpath === xpath)) {
      setXpathList([...xpathList, { xpath, label }]);
      setLabel('');  // Clear the label input after adding
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
          <input
            type="text"
            className="px-2 py-1 border rounded mt-2"
            placeholder="Add label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <button className="inspect-button px-4 py-2 mt-2 ml-2 text-white bg-green-500 hover:bg-green-700 rounded" onClick={addXpathToTable}>
            Add to Table
          </button>
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
                <th className="border border-gray-300 p-2">Label</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {xpathList.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">{item.xpath}</td>
                  <td className="border border-gray-300 p-2">{item.label}</td>
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
