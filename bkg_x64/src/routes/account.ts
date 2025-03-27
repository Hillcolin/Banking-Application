import { Router } from 'express';
import { depositToAccount, withdrawFromAccount } from '../services/userService';

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
    res.json({ message: 'Withdrawal successful' });
  } catch (error: any) {
    console.error('Error during withdrawal:', error.message);
    res.status(400).json({ message: error.message });
  }
});

export default router;