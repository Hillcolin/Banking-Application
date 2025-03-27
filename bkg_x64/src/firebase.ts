import admin from 'firebase-admin';
import serviceAccount from '../firebase-service-account.json';
import { getFirestore } from 'firebase/firestore';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: 'https://banking-7c16e.firebaseio.com',
});

export const auth = admin.auth();
export const db = admin.firestore();