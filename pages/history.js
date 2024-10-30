import React, { useEffect, useState } from 'react';
import Accordion from '@/components/Accordion';
import ExcelExport from '@/components/ExcelExport';
import HTMLExport from '@/components/HTMLExport';

const HistoryPage = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No authentication token found.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/history', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }

        const data = await response.json();
        setHistoryData(data);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError('Failed to fetch history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const toggleSelection = (item) => {
    setSelectedItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Accessibility History</h1>

      <div className="mb-4">
        <ExcelExport selectedItems={selectedItems} />
        <HTMLExport selectedItems={selectedItems} />
      </div>

      {historyData.length === 0 ? (
        <p>No history found.</p>
      ) : (
        historyData.map((item) => (
          <div key={item.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectedItems.includes(item)}
              onChange={() => toggleSelection(item)}
              className="mr-2"
            />
            <Accordion title={item.url} details={item} />
          </div>
        ))
      )}
    </div>
  );
};

export default HistoryPage;