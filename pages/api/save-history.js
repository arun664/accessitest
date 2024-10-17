import { db } from '@/config/firebaseConfig'; // Firebase configuration
import { collection, addDoc } from 'firebase/firestore/lite';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    //console.log('req.body:', req.body);
    //console.log('req.headers:', req.headers);

  // Extract token from the Authorization header
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(401).json({ error: 'No Authorization header found.' });
  }

  const token = authorizationHeader.split(' ')[1]; // Extract the token after 'Bearer'
  if (!token) {
    return res.status(401).json({ error: 'No token found in Authorization header.' });
  }

  //console.log('Token:', token);

  try {
    // Verify the token
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY); // Ensure SECRET_KEY is defined
    const { id, username } = decodedToken; // Extract user info from token

    //console.log('Decoded token:', decodedToken);

    if (req.method === 'POST') {
      const { url, results } = req.body;

      // Validate request body
      if (!url || !results) {
        return res.status(400).json({ error: 'URL and results are required.' });
      }

      // Prepare data to be saved
      const historyData = {
        url,
        timestamp: new Date().toISOString(),
        violations: results.violations,
        passes: results.passes,
        incomplete: results.incomplete,
        username,
        id,   // Use userId from token
      };

      // Save the data to Firestore in 'history' collection
      await addDoc(collection(db, 'history'), historyData);

      res.status(201).json({ message: 'Results saved successfully!' });
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error verifying token or saving history:', error);
    res.status(500).json({ error: 'Failed to verify token or save results.' });
  }
}
