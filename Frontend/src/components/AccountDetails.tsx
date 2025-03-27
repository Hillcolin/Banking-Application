import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAccountTransactions } from './fetchOrInitializeUserData'; // Import the function for fetching transactions
import '../../styles/accountDetails.css'; // Add a CSS file for styling
import { useAuth } from '../contexts/authContext'; // Import the useAuth hook

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
}

const AccountDetails: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>(); // Get the accountId from the URL
  const { currentUser } = useAuth(); // Get the current user from your authentication context
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!accountId) {
        setError('Invalid account ID.');
        setLoading(false);
        return;
      }

      try {
        const fetchedTransactions = await fetchAccountTransactions(currentUser.uid, accountId); // Fetch transactions
        setTransactions(fetchedTransactions);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to fetch transactions. Please try again later.');
      }

      setLoading(false);
    };

    fetchTransactions();
  }, [accountId, currentUser.uid]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="account-details">
      <h1>Account Details</h1>
      <p>Viewing details for account: <strong>{accountId}</strong></p>
      <p>Current Balance: <strong>${balance.toFixed(2)}</strong></p>

      {/* Transaction History */}
      <div className="transaction-history">
        <h2>Transaction History</h2>
        {transactions.length > 0 ? (
          <ul>
            {transactions.map(transaction => (
              <li key={transaction.id} className="transaction-item">
                <p><strong>Date:</strong> {transaction.date}</p>
                <p><strong>Description:</strong> {transaction.description}</p>
                <p><strong>Amount:</strong> ${transaction.amount.toFixed(2)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No transactions found for this account.</p>
        )}
      </div>
    </div>
  );
};

export default AccountDetails;