import React, { useState, useEffect, useRef } from 'react';

const CustomMultiSelect = ({ options, selectedOptions, setSelectedOptions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const ref = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleOutsideClick = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative w-80" ref={ref}>
      <div
        className="border rounded p-2 cursor-pointer flex justify-between items-center bg-gray-200 dark:bg-gray-800"
        onClick={toggleDropdown}
      >
        <span className="text-black">{selectedOptions.length > 0 ? selectedOptions.join(', ') : 'Select tools'}</span>
        <span className="text-gray-500">{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-auto shadow-lg dark:bg-gray-900">
          <input
            type="text"
            placeholder="Search..."
            className="p-2 border-b w-full text-black dark:bg-gray-900"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className={`p-2 cursor-pointer ${
                selectedOptions.includes(option.value) ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:bg-blue-950 '
              }`}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomMultiSelect;