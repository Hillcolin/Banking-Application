import { db } from '../firebase';

const LOCKOUT_DURATION = 60 * 1000; // 1 minute
const MAX_FAILED_ATTEMPTS = 3;

/**
 * Checks if the user is currently locked out.
 * @param email - The email of the user.
 * @returns A boolean indicating whether the user is locked out.
 */
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

/**
 * Increments the failed login attempts for a user.
 * If the user exceeds the maximum allowed attempts, they are locked out.
 * @param email - The email of the user.
 */
export const incrementFailedAttempts = async (email: string): Promise<void> => {
  const userRef = db.collection('users').doc(email);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    // Initialize failed attempts if the user doesn't exist
    await userRef.set({ failedAttempts: 1, lockoutEndTime: null });
    return;
  }

  const { failedAttempts = 0, lockoutEndTime = null } = userDoc.data() || {};
  console.log('Failed Attempts:', failedAttempts);
  console.log('Lockout End Time:', lockoutEndTime);
  const newFailedAttempts = failedAttempts + 1;

  if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
    // Lock the user out
    await userRef.set({
      failedAttempts: 0, // Reset failed attempts
      lockoutEndTime: Date.now() + LOCKOUT_DURATION, // Set lockout duration
    });
  } else {
    // Increment failed attempts
    await userRef.update({ failedAttempts: newFailedAttempts });
  }
};

/**
 * Resets the failed login attempts for a user.
 * @param email - The email of the user.
 */
export const resetFailedAttempts = async (email: string): Promise<void> => {
  const userRef = db.collection('users').doc(email);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    await userRef.update({ failedAttempts: 0, lockoutEndTime: null });
  }
};