import { auth } from '../firebase';

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