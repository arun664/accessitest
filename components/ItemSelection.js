import React from 'react';

const ItemSelection = ({ historyData, selectedItems, setSelectedItems }) => {
  const toggleSelection = (item) => {
    setSelectedItems(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold">Select Items to Export</h2>
      {historyData.map(item => (
        <div key={item.id} className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={selectedItems.includes(item)}
            onChange={() => toggleSelection(item)}
            className="mr-2"
          />
          <label>{item.url}</label>
        </div>
      ))}
    </div>
  );
};

export default ItemSelection;