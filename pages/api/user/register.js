import { db } from '@/config/firebaseConfig';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore/lite'; // Firestore functions

export default async function handler(req, res) {
  const { email, userName, password } = req.body;

  try {
    const usersRef = collection(db, 'users');
    const emailQuery = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(emailQuery);

    if (!querySnapshot.empty) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const userId = Math.random().toString(36).substr(2, 9);

    await setDoc(doc(db, 'users', userId), {
      email,
      userName,
      password, // Consider hashing this password for security
    });

    return res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ error: 'There was an issue registering the user' });
  }
}