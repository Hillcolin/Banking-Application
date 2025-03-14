import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { doc, getDoc, collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Link } from 'react-router-dom';
import '../../styles/balance.css';

interface Account {
  id: string;
  type: string;
  balance: number;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
}

const BalancePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        setError('User is not logged in.');
        setLoading(false);
        return;
      }

      try {
        // Fetch user data
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();

          // Set accounts
          if (userData.accounts && Array.isArray(userData.accounts)) {
            setAccounts(userData.accounts);
          } else {
            setAccounts([]);
          }

          // Fetch recent transactions
          const transactionsRef = collection(db, 'users', currentUser.uid, 'transactions');
          const recentTransactionsQuery = query(transactionsRef, limit(5));
          const transactionSnapshot = await getDocs(recentTransactionsQuery);
          const transactions = transactionSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Transaction[];
          setRecentTransactions(transactions);
        } else {
          setError('User data not found.');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Error fetching user data. Please try again later.');
      }

      setLoading(false);
    };

    fetchUserData();
  }, [currentUser]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="dashboard">
      <h1>Welcome, {currentUser?.displayName || 'User'}!</h1>

      {/* Account Summary Section */}
      <section className="account-summary">
        <h2>Account Summary</h2>
        <p>Total Balance: ${totalBalance.toFixed(2)}</p>
        {accounts.length > 0 ? (
          <ul>
            {accounts.map(account => (
              <li key={account.id}>
                {account.type}: ${account.balance.toFixed(2)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No accounts found.</p>
        )}
        <Link to="/accounts">View All Accounts</Link>
      </section>

      {/* Recent Transactions Section */}
      <section className="recent-transactions">
        <h2>Recent Transactions</h2>
        {recentTransactions.length > 0 ? (
          <ul>
            {recentTransactions.map(transaction => (
              <li key={transaction.id}>
                {transaction.date} - {transaction.description}: ${transaction.amount.toFixed(2)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent transactions found.</p>
        )}
        <Link to="/transactions">View All Transactions</Link>
      </section>

      {/* Quick Actions Section */}
      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/transfer" className="action-button">Transfer Money</Link>
          <Link to="/pay-bills" className="action-button">Pay Bills</Link>
          <Link to="/deposit" className="action-button">Mobile Deposit</Link>
          <Link to="/support" className="action-button">Customer Support</Link>
        </div>
      </section>
    </div>
  );
};

export default BalancePage;
