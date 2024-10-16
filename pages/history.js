// pages/history.js
import React, { useEffect, useState } from 'react';
import Accordion from '@/components/Accordion'; // Assuming you have an Accordion component

const HistoryPage = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage

      if (!token) {
        setError('No authentication token found.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/history', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }

        //console.log('History data:', response.body);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  console.log('History data:', historyData);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Accessibility History</h1>
      {historyData.length === 0 ? (
        <p>No history found.</p>
      ) : (
        historyData.map((item) => (
          <Accordion key={item.id} title={item.url} details={item} />
        ))
      )}
    </div>
  );
};

export default HistoryPage;