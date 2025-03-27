import { auth } from '../firebase';
import express from 'express';
import { signInUser, createUser } from '../services/authService';
import { checkLockout, incrementFailedAttempts, resetFailedAttempts } from '../services/lockoutService';

const router = express.Router();

import { Request, Response } from 'express';

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const isLockedOut = await checkLockout(email);
    if (isLockedOut) {
      return res.status(403).json({ message: 'Account is locked. Please try again later.' });
    }

    const uid = await signInUser(email, password);
    await resetFailedAttempts(email);
    res.json({ message: 'Login successful', uid });
  } catch (error: any) {
    await incrementFailedAttempts(email);
    res.status(401).json({ message: error.message });
  }
});

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const uid = await createUser(email, password);
    res.json({ message: 'Account created successfully', uid });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export default router;

export const signInUser = async (email: string, password: string): Promise<string> => {
  const user = await auth.getUserByEmail(email);
  if (!user) throw new Error('User not found');

  // Simulate password verification (use a real password hash comparison in production)
  if (password !== 'password123') throw new Error('Invalid password');

  return user.uid;
};

export const createUser = async (email: string, password: string): Promise<string> => {
  const user = await auth.createUser({ email, password });
  return user.uid;
};