import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const BalancePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.balance !== undefined) {
              setBalance(userData.balance);
            } else {
              setError('Balance field is missing.');
            }
          } else {
            setError('User document not found.');
          }
        } catch (err) {
          console.error('Error fetching balance:', err);
          setError('Error fetching balance. Please try again later.');
        }
      }
      setLoading(false);
    };

    fetchBalance();
  }, [currentUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="balance-page">
      <h1>Your Balance</h1>
      {balance !== null ? (
        <p>Your current balance is: ${balance.toFixed(2)}</p>
      ) : (
        <p>Unable to fetch balance. Please try again later.</p>
      )}
    </div>
  );
};

export default BalancePage;