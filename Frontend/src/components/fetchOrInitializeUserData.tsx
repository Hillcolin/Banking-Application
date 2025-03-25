import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase"; // Your Firebase config file

const fetchOrInitializeUserData = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid); // Reference to the user's document
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // If user data exists, return it
      return userDoc.data();
    } else {
      // If no user data exists, initialize with default values
      const defaultData = {
        accounts: [
          { id: "checking", type: "Checking Account", balance: 0 },
          { id: "savings", type: "Savings Account", balance: 0 },
          { id: "credit", type: "Credit Account", balance: 0 },
        ],
        createdAt: new Date().toISOString(),
      };

      await setDoc(userRef, defaultData); // Create a new document with default data
      return defaultData; // Return the initialized data
    }
  } catch (error) {
    console.error("Error fetching or initializing user data:", error);
    throw new Error("Failed to fetch or initialize user data.");
  }
};
