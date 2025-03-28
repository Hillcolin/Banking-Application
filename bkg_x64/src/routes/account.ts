import { Router } from 'express';
import { depositToAccount, withdrawFromAccount } from '../services/userService';
import { db } from '../firebase'; // Ensure Firestore is initialized
import { FieldValue } from 'firebase-admin/firestore'; // Use FieldValue for increment

const router = Router();

/**
 * Deposit money into an account.
 */
router.post('/deposit', async (req, res) => {
  const { uid, accountId, amount } = req.body;

  try {
    // Validate input
    if (!uid || !accountId || typeof amount !== 'number' || amount <= 0) {
      throw new Error('Invalid input. Please provide a valid uid, accountId, and a positive amount.');
    }

    // Call the deposit function from userService
    await depositToAccount(uid, accountId, amount);

    // Log the transaction
    const transactionRef = db.collection(`users/${uid}/accounts/${accountId}/transactions`);
    await transactionRef.add({
      date: new Date().toISOString(),
      description: 'Deposit',
      amount: amount,
    });

    res.json({ message: 'Deposit successful' });
  } catch (error: any) {
    console.error('Error during deposit:', error.message);
    res.status(400).json({ message: error.message });
  }
});

/**
 * Withdraw money from an account.
 */
router.post('/withdraw', async (req, res) => {
  const { uid, accountId, amount } = req.body;

  try {
    // Validate input
    if (!uid || !accountId || typeof amount !== 'number' || amount <= 0) {
      throw new Error('Invalid input. Please provide a valid uid, accountId, and a positive amount.');
    }

    // Call the withdraw function from userService
    await withdrawFromAccount(uid, accountId, amount);

    // Log the transaction
    const transactionRef = db.collection(`users/${uid}/accounts/${accountId}/transactions`);
    await transactionRef.add({
      date: new Date().toISOString(),
      description: 'Withdrawal',
      amount: -amount,
    });

    res.json({ message: 'Withdrawal successful' });
  } catch (error: any) {
    console.error('Error during withdrawal:', error.message);
    res.status(400).json({ message: error.message });
  }
});

/**
 * Transfer funds between users.
 */
router.post('/transfer', async (req, res) => {
  const { senderUid, senderAccountId, recipientEmail, amount } = req.body;

  try {
    // Validate input
    if (!senderUid || !senderAccountId || !recipientEmail || typeof amount !== 'number' || amount <= 0) {
      throw new Error('Invalid input. Please provide all required fields.');
    }

    // Normalize email to lowercase
    const normalizedEmail = recipientEmail.trim().toLowerCase();

    // Get recipient's user document by email
    const recipientQuery = await db.collection('users').where('email', '==', normalizedEmail).get();

    if (recipientQuery.empty) {
      throw new Error('Recipient not found.');
    }

    const recipientDoc = recipientQuery.docs[0];
    const recipientUid = recipientDoc.id;

    // Get sender's account
    const senderAccountRef = db.collection(`users/${senderUid}/accounts`).doc(senderAccountId);
    const senderAccountDoc = await senderAccountRef.get();

    if (!senderAccountDoc.exists) {
      throw new Error('Sender account not found.');
    }

    const senderAccount = senderAccountDoc.data();
    if (!senderAccount || senderAccount.balance < amount) {
      throw new Error('Insufficient funds.');
    }

    // Deduct amount from sender's account
    await senderAccountRef.update({ balance: FieldValue.increment(-amount) });

    // Add amount to recipient's default account (e.g., Checking Account)
    const recipientAccountRef = db.collection(`users/${recipientUid}/accounts`).doc('checking');
    const recipientAccountDoc = await recipientAccountRef.get();

    if (!recipientAccountDoc.exists) {
      throw new Error('Recipient account not found.');
    }

    await recipientAccountRef.update({ balance: FieldValue.increment(amount) });

    // Log transactions for both sender and recipient
    const senderTransactionRef = db.collection(`users/${senderUid}/accounts/${senderAccountId}/transactions`);
    await senderTransactionRef.add({
      date: new Date().toISOString(),
      description: `Transfer to ${recipientEmail}`,
      amount: -amount,
    });

    const recipientTransactionRef = db.collection(`users/${recipientUid}/accounts/checking/transactions`);
    await recipientTransactionRef.add({
      date: new Date().toISOString(),
      description: `Transfer from ${senderUid}`,
      amount,
    });

    res.json({ message: 'Transfer successful!' });
  } catch (error: any) {
    console.error('Error during transfer:', error.message);
    res.status(400).json({ message: error.message });
  }
});

/**
 * Get user by email.
 */
router.post('/user/email', async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      throw new Error('Email is required.');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const userQuery = await db.collection('users').where('email', '==', normalizedEmail).get();

    if (userQuery.empty) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const userDoc = userQuery.docs[0];
    const userData = { uid: userDoc.id, ...userDoc.data() };

    res.json(userData);
  } catch (error: any) {
    console.error('Error fetching user by email:', error.message);
    res.status(400).json({ message: error.message });
  }
});

export default router;