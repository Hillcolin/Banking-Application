import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

interface Account {
  id: string;
  type: string;
  balance: number;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
}

export const fetchOrInitializeUserData = async (uid: string, email: string): Promise<Account[]> => {
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

      // Create user document with email
      await setDoc(userRef, { email, createdAt: new Date().toISOString() });

      // Create accounts subcollection and initialize transactions
      for (const account of defaultAccounts) {
        const accountRef = doc(db, `users/${uid}/accounts`, account.id);
        await setDoc(accountRef, { type: account.type, balance: account.balance });

        // Initialize transactions subcollection with a default transaction
        const transactionsRef = collection(db, `users/${uid}/accounts/${account.id}/transactions`);
        const defaultTransaction = {
          date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
          description: 'Account opened',
          amount: 0,
        };
        const defaultTransactionRef = doc(transactionsRef, 'initial-transaction'); // Use a fixed ID for the default transaction
        await setDoc(defaultTransactionRef, defaultTransaction);
      }

      return defaultAccounts;
    }
  } catch (error) {
    console.error('Error fetching or initializing user data:', error);
    throw new Error('Failed to fetch or initialize user data.');
  }
};

export const fetchAccountTransactions = async (uid: string, accountId: string): Promise<Transaction[]> => {
  try {
    const transactionsRef = collection(db, `users/${uid}/accounts/${accountId}/transactions`);
    const transactionsSnapshot = await getDocs(transactionsRef);

    const transactions: Transaction[] = transactionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Transaction[];

    // Simply return the transactions without adding the default transaction again
    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transactions.');
  }
};
