// pages/api/history.js
import { db } from '@/config/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore/lite';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const username = decoded.username; // Get user ID from the token

      const historyRef = collection(db, 'history');
      const userHistoryQuery = query(historyRef, where('username', '==', username));
      const querySnapshot = await getDocs(userHistoryQuery);

      const historyList = querySnapshot.docs.map(doc => ({
        id: doc.id, // Use Firestore document ID
        ...doc.data(),
      }));

      res.status(200).json(historyList);
    } catch (error) {
      console.error('Error fetching history:', error);
      res.status(500).json({ error: 'Failed to fetch history.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}