import { doc, getDoc, setDoc, collection, getDocs, Firestore } from "firebase/firestore";
import { db } from "../../config/firebaseConfig"; // Your Firebase config file

const fetchOrInitializeUserData = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid); // Reference to the user's document
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // If user data exists, fetch subcollections (e.g., accounts)
      const accountsRef = collection(db, `users/${uid}/accounts`);
      const accountsSnapshot = await getDocs(accountsRef);

      const accounts = accountsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        ...userDoc.data(),
        accounts,
      };
    } else {
      // If no user data exists, initialize with default values
      const defaultData = {
        createdAt: new Date().toISOString(),
      };

      const defaultAccounts = [
        { id: "checking", type: "Checking Account", balance: 0 },
        { id: "savings", type: "Savings Account", balance: 0 },
        { id: "credit", type: "Credit Account", balance: 0 },
      ];

      // Create the user document
      await setDoc(userRef, defaultData);

      // Create subcollection for accounts
      const accountsRef = collection(db, `users/${uid}/accounts`);
      for (const account of defaultAccounts) {
        const accountRef = doc(accountsRef, account.id);
        await setDoc(accountRef, account);
      }

      return {
        ...defaultData,
        accounts: defaultAccounts,
      };
    }
  } catch (error) {
    console.error("Error fetching or initializing user data:", error);
    throw new Error("Failed to fetch or initialize user data.");
  }
};

export default fetchOrInitializeUserData;
