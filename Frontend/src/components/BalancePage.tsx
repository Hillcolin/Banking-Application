/**
 * @file BalancePage.tsx
 * @brief Displays the user's account balances and provides navigation for account actions.
 * @details This component fetches and displays the user's accounts, their balances, and provides
 * options for depositing, withdrawing, transferring funds, and logging out.
 * @author Colin
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/authContext';
import { fetchOrInitializeUserData } from './fetchOrInitializeUserData';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/balance.css';

interface Account {
  id: string;
  type: string;
  balance: number;
}

/**
 * @class BalancePage
 * @brief React component for displaying account balances and navigation options.
 * @details This component fetches the user's accounts, calculates the total balance, and provides
 * navigation for account-related actions such as deposits, withdrawals, and transfers.
 */
const BalancePage: React.FC = () => {
  const { currentUser, logOut } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  /**
   * @brief Fetches the user's accounts and initializes them if necessary.
   * @details This function fetches the user's accounts from the database. If the user is not logged in,
   * it sets an error. If accounts are fetched successfully, they are sorted by type.
   * @author Colin
   */
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        setError('User is not logged in.');
        setLoading(false);
        return;
      }

      try {
        const userAccounts = await fetchOrInitializeUserData(currentUser.uid, currentUser.email);

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

  /**
   * @brief Logs the user out and redirects to the landing page.
   * @details This function calls the `logOut` function from the authentication context and navigates
   * the user to the landing page upon successful logout.
   * @returns void
   */
  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
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

      <section className="account-summary">
        <h2>Account Summary</h2>
        <div className="accounts-container">
          {accounts.map(account => (
            <Link
              key={account.id}
              to={`/account/${account.id}`}
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
