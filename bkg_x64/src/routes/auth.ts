import express, { Request, Response } from 'express';
import { signInUser, createUser } from '../services/authService';
import { checkLockout, incrementFailedAttempts, resetFailedAttempts } from '../services/lockoutService';

const router = express.Router();

// Signup Endpoint
router.post('/signup', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const uid = await createUser(email, password);
    res.json({ message: 'Account created successfully', uid });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Login Endpoint
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Check if the user is locked out
    const isLockedOut = await checkLockout(email);
    if (isLockedOut) {
      res.status(403).json({ message: 'Account is locked. Please try again later.' });
      return;
      
    }

    // Attempt to log in the user
    const uid = await signInUser(email, password); // Replace with your Firebase login logic
    await resetFailedAttempts(email); // Reset failed attempts on successful login
    res.json({ message: 'Login successful', uid });
  } catch (error: any) {
    // Increment failed attempts on login failure
    await incrementFailedAttempts(email);
    res.status(401).json({ message: error.message || 'Unauthorized' });
  }
});

// Endpoint to check lockout and increment failed attempts
router.post('/check-lockout', async (req: Request, res: Response) => {
  const { email, failed } = req.body;

  try {
    const isLockedOut = await checkLockout(email);

    if (isLockedOut) {
      return res.status(403).json({ message: 'Account is locked. Please try again later.' });
    }

    if (failed) {
      await incrementFailedAttempts(email);
    } else {
      await resetFailedAttempts(email);
    }

    res.status(200).json({ message: 'Lockout status updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;