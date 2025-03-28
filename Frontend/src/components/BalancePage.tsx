import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/authContext'; // Import useAuth for logout functionality
import { fetchOrInitializeUserData } from './fetchOrInitializeUserData';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/balance.css';

interface Account {
  id: string;
  type: string;
  balance: number;
}

const BalancePage: React.FC = () => {
  const { currentUser, logOut } = useAuth(); // Access logOut function from useAuth
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        setError('User is not logged in.');
        setLoading(false);
        return;
      }

      try {
        // Pass both uid and email to fetchOrInitializeUserData
        const userAccounts = await fetchOrInitializeUserData(currentUser.uid, currentUser.email);

        // Sort accounts in the desired order: Checking, Savings, Credit Card
        const sortedAccounts = userAccounts.sort((a, b) => {
          const order = ['Checking Account', 'Savings Account', 'Credit Card Account'];
          return order.indexOf(a.type) - order.indexOf(b.type);
        });

        setAccounts(sortedAccounts);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Error fetching user data. Please try again later.');
      }

      setLoading(false);
    };

    fetchData();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logOut(); // Call the logOut function from useAuth
      navigate('/'); // Redirect to the landing page
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

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
        <p className="spacer">Total Balance: ${totalBalance.toFixed(2)}</p>
      </section>

      {/* Quick Actions Section */}
      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-button" onClick={() => navigate('/deposit')}>Deposit</button>
          <button className="action-button" onClick={() => navigate('/withdraw')}>Withdraw</button>
          <button className="action-button" onClick={() => navigate('/transfer')}>Transfer Funds</button>
        </div>
      </section>

      {/* Logout Button */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default BalancePage;
