/**
 * @file fetchOrInitializeUserData.tsx
 * @brief Handles fetching and initializing user data and transactions.
 * @details This module provides functions to fetch or initialize user accounts and transactions.
 * It interacts with Firebase Firestore and contacts the C++ backend for email and transaction validation.
 */

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

/**
 * @brief Fetches or initializes user data.
 * @details This function checks if a user document exists in Firestore. If it exists, it fetches
 * the user's accounts and returns them. If it does not exist, it initializes the user document
 * with default accounts and transactions. It also contacts the C++ backend to validate
 * the user's email.
 * @param uid The unique identifier of the user.
 * @param email The email address of the user.
 * @returns A promise that resolves to an array of accounts.
 * @throws An error if fetching or initializing user data fails.
 */
export const fetchOrInitializeUserData = async (uid: string, email: string): Promise<Account[]> => {
  try {
    // Contact the C++ backend for email validation
    console.log(`Contacting C++ backend to validate email: ${email}`);
    await validateEmailWithCppBackend(email);

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

/**
 * @brief Fetches transactions for a specific account.
 * @details This function retrieves all transactions for a given account from Firestore.
 * It also contacts the C++ backend to validate the transactions.
 * @param uid The unique identifier of the user.
 * @param accountId The ID of the account for which transactions are being fetched.
 * @returns A promise that resolves to an array of transactions.
 * @throws An error if fetching transactions fails.
 */
export const fetchAccountTransactions = async (uid: string, accountId: string): Promise<Transaction[]> => {
  try {
    // Contact the C++ backend for transaction validation
    console.log(`Contacting C++ backend to validate transactions for account: ${accountId}`);
    await validateTransactionsWithCppBackend(accountId);

    const transactionsRef = collection(db, `users/${uid}/accounts/${accountId}/transactions`);
    const transactionsSnapshot = await getDocs(transactionsRef);

    const transactions: Transaction[] = transactionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Transaction[];

    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transactions.');
  }
};

/**
 * @brief Contacts the C++ backend for email validation.
 * @details Sends a POST request to the Crow API to validate the user's email.
 * @param email The email to validate.
 * @returns A promise that resolves to a success message or throws an error.
 */
const validateEmailWithCppBackend = async (email: string): Promise<void> => {
  try {
    const response = await fetch('http://localhost:18080/validate-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Failed to validate email with C++ backend.');
    }

    const data = await response.json();
    console.log('C++ Backend Response:', data.message);
  } catch (error) {
    console.error('Error validating email with C++ backend:', error);
    throw new Error('C++ backend email validation failed.');
  }
};

/**
 * @brief Contacts the C++ backend for transaction validation.
 * @details Sends a POST request to the Crow API to validate transactions for a specific account.
 * @param accountId The account ID to validate transactions for.
 * @returns A promise that resolves to a success message or throws an error.
 */
const validateTransactionsWithCppBackend = async (accountId: string): Promise<void> => {
  try {
    const response = await fetch('http://localhost:18080/validate-transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId }),
    });

    if (!response.ok) {
      throw new Error('Failed to validate transactions with C++ backend.');
    }

    const data = await response.json();
    console.log('C++ Backend Response:', data.message);
  } catch (error) {
    console.error('Error validating transactions with C++ backend:', error);
    throw new Error('C++ backend transaction validation failed.');
  }
};
