import { Firestore, FieldValue } from 'firebase-admin/firestore';
import { db } from '../firebase'; // Ensure this points to your Firebase Admin SDK initialization

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
 * Fetches or initializes user data.
 * If the user does not exist, default accounts are created.
 */
export const fetchOrInitializeUserData = async (uid: string): Promise<Account[]> => {
  try {
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const accountsRef = db.collection(`users/${uid}/accounts`);
      const accountsSnapshot = await accountsRef.get();

      const accounts: Account[] = accountsSnapshot.docs.map(accountDoc => ({
        id: accountDoc.id,
        ...accountDoc.data(),
      })) as Account[];

      return accounts;
    } else {
      const defaultAccounts = [
        { id: 'checking', type: 'Checking Account', balance: 0 },
        { id: 'savings', type: 'Savings Account', balance: 0 },
        { id: 'credit', type: 'Credit Card Account', balance: 0 },
      ];

      // Create user document
      await userRef.set({ createdAt: new Date().toISOString() });

      // Create default accounts and transactions
      for (const account of defaultAccounts) {
        const accountRef = db.collection(`users/${uid}/accounts`).doc(account.id);
        await accountRef.set({ type: account.type, balance: account.balance });

        const transactionsRef = db.collection(`users/${uid}/accounts/${account.id}/transactions`);
        const defaultTransaction = {
          date: new Date().toISOString().split('T')[0],
          description: 'Account opened',
          amount: 0,
        };
        await transactionsRef.add(defaultTransaction);
      }

      return defaultAccounts;
    }
  } catch (error) {
    console.error('Error fetching or initializing user data:', error);
    throw new Error('Failed to fetch or initialize user data.');
  }
};

/**
 * Deposits an amount into a user's account.
 */
export const depositToAccount = async (uid: string, accountId: string, amount: number): Promise<void> => {
  if (amount <= 0) throw new Error('Deposit amount must be greater than zero.');

  const accountRef = db.collection(`users/${uid}/accounts`).doc(accountId);
  const transactionRef = db.collection(`users/${uid}/accounts/${accountId}/transactions`);

  await accountRef.update({ balance: FieldValue.increment(amount) });
  await transactionRef.add({
    date: new Date().toISOString().split('T')[0],
    description: 'Deposit',
    amount,
  });
};

/**
 * Withdraws an amount from a user's account.
 */
export const withdrawFromAccount = async (uid: string, accountId: string, amount: number): Promise<void> => {
  if (amount <= 0) throw new Error('Withdrawal amount must be greater than zero.');

  const accountRef = db.collection(`users/${uid}/accounts`).doc(accountId);
  const accountDoc = await accountRef.get();

  if (!accountDoc.exists) throw new Error('Account not found.');

  const { balance } = accountDoc.data() as Account;
  if (balance < amount) throw new Error('Insufficient funds.');

  const transactionRef = db.collection(`users/${uid}/accounts/${accountId}/transactions`);

  await accountRef.update({ balance: FieldValue.increment(-amount) });
  await transactionRef.add({
    date: new Date().toISOString().split('T')[0],
    description: 'Withdrawal',
    amount: -amount,
  });
};