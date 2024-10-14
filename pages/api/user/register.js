import { db } from '../../firebaseConfig'; // Firebase configuration
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore/lite'; // Firestore functions

const registerUser = async ({ email, password, userName }) => {
  try {
    // Query Firestore to check if a user with the same email already exists
    const usersRef = collection(db, 'users'); // Reference to the 'users' collection
    const emailQuery = query(usersRef, where('email', '==', email)); // Create a query where email matches
    const querySnapshot = await getDocs(emailQuery);

    if (!querySnapshot.empty) {
      // If querySnapshot is not empty, return a custom error message
      return { error: 'User already exists' };
    }

    // Generate a custom ID for the user (or use another method)
    const userId = Math.random().toString(36).substr(2, 9); // Generate a custom ID

    // If email doesn't exist, add the user to Firestore
    await setDoc(doc(db, 'users', userId), {
      email,
      userName,
      password, // You may want to hash this password for security
    });

    return { message: 'User registered successfully' };

  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error('There was an issue registering the user');
  }
};

export default registerUser;
