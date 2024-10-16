// pages/api/save-history.js
import { db } from '@/config/firebaseConfig'; // Ensure you import your Firebase configuration
import { getAuth } from 'firebase/auth'; // Import Firebase Auth

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { url, results } = req.body;

    if (!url || !results) {
      return res.status(400).json({ error: 'URL and results are required.' });
    }

    try {
      // Get the current user's authentication state
      const auth = getAuth();
      const user = auth.currentUser; // Get the currently logged-in user

      // Check if user is authenticated
      if (!user) {
        return res.status(401).json({ error: 'User is not authenticated.' });
      }

      // Prepare the data to be saved
      const historyData = {
        url,
        timestamp: new Date().toISOString(),
        violations: results.violations,
        passes: results.passes,
        incomplete: results.incomplete,
        username: user.displayName || user.email, // Use displayName or email as the username reference
        userId: user.uid, // Optionally include user ID for reference
      };

      // Save the data to Firestore
      await db.collection('history').add(historyData);
      res.status(201).json({ message: 'Results saved successfully!' });
    } catch (error) {
      console.error('Error saving history:', error);
      res.status(500).json({ error: 'Failed to save results.' });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}