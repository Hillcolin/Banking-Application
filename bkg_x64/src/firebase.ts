import admin from 'firebase-admin';
import serviceAccount from '../firebase-service-account.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: 'https://banking-7c16e.firebaseio.com',
});

export const auth = admin.auth();
export const db = admin.firestore();