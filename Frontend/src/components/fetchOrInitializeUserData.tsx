import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

interface Account {
  id: string;
  type: string;
  balance: number;
}

export const fetchOrInitializeUserData = async (uid: string): Promise<Account[]> => {
  try {
    const userRef = doc(db, 'users', uid); // Reference to the user's document
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // Fetch accounts subcollection
      const accountsRef = collection(db, `users/${uid}/accounts`);
      const accountsSnapshot = await getDocs(accountsRef);

      const accounts: Account[] = accountsSnapshot.docs.map(accountDoc => ({
        id: accountDoc.id,
        ...accountDoc.data(),
      })) as Account[];

      return accounts;
    } else {
      // Initialize user data if no document exists
      const defaultAccounts = [
        { id: 'checking', type: 'Checking Account', balance: 0 },
        { id: 'savings', type: 'Savings Account', balance: 0 },
        { id: 'credit', type: 'Credit Card Account', balance: 0 },
      ];

      // Create user document
      await setDoc(userRef, { createdAt: new Date().toISOString() });

      // Create accounts subcollection
      for (const account of defaultAccounts) {
        const accountRef = doc(db, `users/${uid}/accounts`, account.id);
        await setDoc(accountRef, { type: account.type, balance: account.balance });
      }

      return defaultAccounts;
    }
  } catch (error) {
    console.error('Error fetching or initializing user data:', error);
    throw new Error('Failed to fetch or initialize user data.');
  }
};
