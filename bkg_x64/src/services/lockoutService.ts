import { db } from '../firebase';

const LOCKOUT_DURATION = 60 * 1000; // 1 minute
const MAX_FAILED_ATTEMPTS = 3;

export const checkLockout = async (email: string): Promise<boolean> => {
  const userRef = db.collection('users').doc(email);
  const userDoc = await userRef.get();

  if (!userDoc.exists) return false;

  const { lockoutEndTime } = userDoc.data() || {};
  if (lockoutEndTime && lockoutEndTime > Date.now()) {
    return true; // User is locked out
  }

  return false;
};

export const incrementFailedAttempts = async (email: string): Promise<void> => {
  const userRef = db.collection('users').doc(email);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    await userRef.set({ failedAttempts: 1 });
    return;
  }

  const { failedAttempts = 0 } = userDoc.data() || {};
  const newFailedAttempts = failedAttempts + 1;

  if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
    await userRef.set({
      failedAttempts: 0,
      lockoutEndTime: Date.now() + LOCKOUT_DURATION,
    });
  } else {
    await userRef.update({ failedAttempts: newFailedAttempts });
  }
};

export const resetFailedAttempts = async (email: string): Promise<void> => {
  const userRef = db.collection('users').doc(email);
  await userRef.update({ failedAttempts: 0 });
};