import { db } from '@/config/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore/lite';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Reference to the user's document
    const userDocRef = doc(db, 'users', req.body.username);
    console.log(req.body)
    const password = req.body.newPassword;

    // Update the document with new email
    await updateDoc(userDocRef, { password: password });

    return res.status(200).json({ message: 'User details updated successfully' });
  } catch (error) {
    console.error('Error updating user details:', error);
    return res.status(500).json({ error: 'Failed to update user details' });
  }
}