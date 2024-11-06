import { db } from '@/config/firebaseConfig';
import { collection, query, where, getDocs, addDoc, doc, deleteDoc } from 'firebase/firestore/lite';
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
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        return res.status(401).json({ error: 'Authorization header missing.' });
      }

      const token = authorizationHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Token missing in Authorization header.' });
      }

      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      const { id, username } = decodedToken;

      const { url, tool, result } = req.body;

      if (!url || !tool || !result) {
        return res.status(400).json({ error: 'URL, tool, and results are required.' });
      }

      const historyRef = collection(db, 'history');
      const existingHistoryQuery = query(
        historyRef,
        where('username', '==', username),
        where('url', '==', url),
        where('tool', '==', tool)
      );
      const existingDocs = await getDocs(existingHistoryQuery);

      let version = 1.0;
      if (!existingDocs.empty) {
        existingDocs.forEach((doc) => {
          const data = doc.data();
          if (data.version) {
            const currentVersion = parseFloat(data.version);
            if (!isNaN(currentVersion) && currentVersion >= version) {
              version = currentVersion + 0.1;
            } else {
              console.error("Invalid version number, defaulting to 0.1");
            }
          } else {
            console.error("Version property does not exist, defaulting to 0.1");
          }
        });
      }

      const historyData = {
        url,
        tool,
        result,
        timestamp: new Date().toISOString(),
        username,
        userId: id,
        version: version.toFixed(1),
      };

      await addDoc(historyRef, historyData);

      res.status(201).json({ message: 'Results saved successfully' });
    } catch (error) {
      console.error('Error in token verification or saving history:', error);
      res.status(500).json({ error: 'Error processing request.' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader && authorizationHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const username = decoded.username;

      // Delete history based on username
      const historyRef = collection(db, 'history');
      const userHistoryQuery = query(historyRef, where('username', '==', username));
      const querySnapshot = await getDocs(userHistoryQuery);

      // Deleting all history records for the user
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      res.status(200).json({ message: 'History deleted successfully.' });
    } catch (error) {
      console.error('Error deleting history:', error);
      res.status(500).json({ error: 'Failed to delete history.' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}