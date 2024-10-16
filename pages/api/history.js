// /pages/api/history.js

import { db } from '@/config/firebaseConfig';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const historyCollection = 'history';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'POST') {
    // Saving results to Firestore
    const { url, results, userId } = req.body;

    try {
      const docRef = await addDoc(collection(db, historyCollection), {
        url,
        results,
        userId,
        timestamp: new Date(),
      });
      res.status(200).json({ id: docRef.id });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save results' });
    }
  } else if (method === 'GET') {
    // Retrieving results from Firestore for the current user
    const { userId } = req.query;

    try {
      const q = query(collection(db, historyCollection), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const history = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(history);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve history' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}