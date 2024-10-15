import { collection, query, where, getDocs } from 'firebase/firestore/lite';
import { db } from '@/config/firebaseConfig';

export default async function handler(req, res) {
  const { email, password } = req.body;

  try {
    const usersRef = collection(db, 'users');
    const emailQuery = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(emailQuery);

    if (querySnapshot.empty) {
      return res.status(400).json({ error: 'No user found with this email' });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    if (userData.password === password) {
      return res.status(200).json({ success: true, userName: userData.userName });
    } else {
      return res.status(401).json({ error: 'Invalid password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ error: 'There was an issue logging in. Please try again later.' });
  }
}
