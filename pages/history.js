// pages/history.js
import { useEffect, useState } from 'react';
import { db } from '@/config/firebaseConfig'; // Import your Firebase config

const History = () => {
  const [historyResults, setHistoryResults] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const snapshot = await db.collection('history').get();
        const historyData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHistoryResults(historyData);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">History of Accessibility Results</h1>
      {historyResults.length > 0 ? (
        <ul className="list-disc ml-6">
          {historyResults.map(result => (
            <li key={result.id} className="mb-4 p-4 border rounded shadow">
              <p><strong>URL:</strong> {result.url}</p>
              <p><strong>Timestamp:</strong> {new Date(result.timestamp).toLocaleString()}</p>
              <p><strong>Violations:</strong> {result.violations.length}</p>
              {/* Display more relevant data as needed */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No history found.</p>
      )}
    </div>
  );
};

export default History;