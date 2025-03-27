import { auth } from '../firebase';

export const signInUser = async (email: string, password: string): Promise<string> => {
  try {
    // Use Firebase Authentication to sign in the user
    const userCredential = await auth.verifyIdToken(
      await auth.createCustomToken(email)
    );
    return userCredential.uid;
  } catch (error) {
    throw new Error('Invalid password');
  }
};

export const createUser = async (email: string, password: string): Promise<string> => {
  const user = await auth.createUser({ email, password });
  return user.uid;
};