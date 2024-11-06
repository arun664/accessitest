import { db } from '@/config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore/lite';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  try {
    const userDocRef = doc(db, 'users', username);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    const isValid = userData.password === password; // Verify password (consider hashing in a real application)

    return res.status(200).json({ isValid });
  } catch (error) {
    console.error('Error verifying password:', error);
    return res.status(500).json({ error: 'Error verifying password' });
  }
}