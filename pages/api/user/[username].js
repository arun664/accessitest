import { db } from '@/config/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore/lite';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userDocRef = doc(db, 'users', req.body.username);
    const { newPassword, email } = req.body;

    if (newPassword) {
      // Update the document with new password
      await updateDoc(userDocRef, { password: newPassword });
      return res.status(200).json({ message: 'Password updated successfully' });
    } else if (email) {
      // Update the document with new email
      await updateDoc(userDocRef, { email: email });
      return res.status(200).json({ message: 'Email updated successfully' });
    } else {
      return res.status(400).json({ error: 'Invalid request data' });
    }
  } catch (error) {
    console.error('Error updating user details:', error);
    return res.status(500).json({ error: 'Failed to update user details' });
  }
}
