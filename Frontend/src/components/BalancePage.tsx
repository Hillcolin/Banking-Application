import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { fetchOrInitializeUserData } from './fetchOrInitializeUserData'; // Import the utility function
import { Link } from 'react-router-dom'; // Import Link from React Router
import '../../styles/balance.css';

interface Account {
  id: string;
  type: string;
  balance: number;
}

const BalancePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        setError('User is not logged in.');
        setLoading(false);
        return;
      }

      try {
        const userAccounts = await fetchOrInitializeUserData(currentUser.uid); // Call the utility function
        setAccounts(userAccounts);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Error fetching user data. Please try again later.');
      }

      setLoading(false);
    };

    fetchData();
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
        <div className="accounts-container">
          {accounts.map(account => (
            <Link
              key={account.id}
              to={`/account/${account.id}`} // Dynamic route for each account
              className="account-box"
            >
              <h3>{account.type}</h3>
              <p>Balance: ${account.balance.toFixed(2)}</p>
            </Link>
          ))}
        </div>
        <p className='spacer'>Total Balance: ${totalBalance.toFixed(2)}</p>
      </section>

      {/* Quick Actions Section */}
      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-button">Transfer Money</button>
          <button className="action-button">Pay Bills</button>
          <button className="action-button">Mobile Deposit</button>
          <button className="action-button">Customer Support</button>
        </div>
      </section>
    </div>
  );
};

export default BalancePage;
