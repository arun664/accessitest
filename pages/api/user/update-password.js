import { db } from '@/config/firebaseConfig'; // Import your Firebase config
import { doc, updateDoc } from 'firebase/firestore/lite';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Token and password are required' });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Reference to the user's document in Firestore using the decoded userId (or username, depending on your setup)
    const userDocRef = doc(db, 'users', decoded.username); // Ensure your JWT contains the correct userId or username

    // Update the password in Firestore
    await updateDoc(userDocRef, {
      password: password, // Update with the new password (make sure to hash it if necessary)
    });

    return res.status(200).json({ message: 'Password successfully updated' });
  } catch (err) {
    console.error('Error updating password:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}