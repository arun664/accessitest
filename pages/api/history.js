import { db } from '@/config/firebaseConfig';
import { collection, query, where, getDocs, addDoc, updateDoc } from 'firebase/firestore/lite';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader && authorizationHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const username = decoded.username;

      const historyRef = collection(db, 'history');
      const userHistoryQuery = query(historyRef, where('username', '==', username));
      const querySnapshot = await getDocs(userHistoryQuery);

      const historyList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      res.status(200).json(historyList);
    } catch (error) {
      console.error('Error fetching history:', error);
      res.status(500).json({ error: 'Failed to fetch history.' });
    }
  } else if (req.method === 'POST') {
    try {
      // Check Authorization header
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        return res.status(401).json({ error: 'Authorization header missing.' });
      }
  
      const token = authorizationHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Token missing in Authorization header.' });
      }
  
      // Verify JWT token
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      const { id, username } = decodedToken;
  
      if (req.method === 'POST') {
        const { url, results } = req.body;
  
        // Validate request body content
        if (!url || !results) {
          return res.status(400).json({ error: 'Both URL and results are required.' });
        }
  
        // Prepare reference to Firestore 'history' collection
        const historyRef = collection(db, 'history');
        const existingHistoryQuery = query(historyRef, where('username', '==', username), where('url', '==', url));
        const existingDocs = await getDocs(existingHistoryQuery);
  
        let version = 1.0;
  
        if (!existingDocs.empty) {
          version = parseFloat(existingData.version || 0.9) + 0.1;
        }
  
        // Create new entry with initial version if no existing document is found
        const historyData = {
          url,
          timestamp: new Date().toISOString(),
          violations: results.violations || [],
          passes: results.passes || [],
          incomplete: results.incomplete || [],
          username,
          userId: id,
          version: version.toFixed(1),
        };
  
        await addDoc(historyRef, historyData);
  
        res.status(201).json({ message: 'Results saved successfully' });
      } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
      }
    } catch (error) {
      console.error('Error in token verification or saving history:', error);
      res.status(500).json({ error: 'Error processing request.' });
    }
} else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
