/**
 * @file DepositPage.tsx
 * @brief Allows users to deposit money into their accounts.
 * @details This component fetches the user's accounts, allows them to select an account,
 * enter an amount, and deposit money into the selected account. It also provides navigation
 * back to the balance page.
 * @author Colin
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { fetchOrInitializeUserData } from './fetchOrInitializeUserData'; // Utility to fetch user accounts
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../../styles/depwith.css'; // Import the new CSS file

interface Account {
  id: string;
  type: string;
  balance: number;
}

/**
 * @class DepositPage
 * @brief React component for depositing money into user accounts.
 * @details This component fetches the user's accounts, allows them to select an account,
 * enter an amount, and deposit money into the selected account.
 */
const DepositPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate

  // Section: Fetch Accounts
  /**
   * @brief Fetches the user's accounts from the database.
   * @details This function fetches the user's accounts and sets the default selected account
   * to the first account in the list. If fetching fails, it sets an error message.
   * @author Colin
   */
  useEffect(() => {
    const fetchAccounts = async () => {
      if (!currentUser) return;

      try {
        const userAccounts = await fetchOrInitializeUserData(currentUser.uid, currentUser.email);
        setAccounts(userAccounts);
        if (userAccounts.length > 0) {
          setSelectedAccount(userAccounts[0].id); // Default to the first account
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
        setMessage('Failed to load accounts. Please try again later.');
      }
    };

    fetchAccounts();
  }, [currentUser]);

  // Section: Handle Deposit
  /**
   * @brief Handles the deposit action.
   * @details This function sends a POST request to the backend to deposit the specified amount
   * into the selected account. If the deposit is successful, it displays a success message.
   * Otherwise, it displays an error message.
   * @returns void
   */
  const handleDeposit = async () => {
    if (!selectedAccount || !amount || parseFloat(amount) <= 0) {
      setMessage('Please select an account and enter a valid amount.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/account/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: currentUser?.uid,
          accountId: selectedAccount,
          amount: parseFloat(amount),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to deposit money.');
      }

      setMessage('Deposit successful!');
    } catch (error) {
      console.error('Error during deposit:', error);
      setMessage('Error during deposit. Please try again.');
    }
  };

  // Section: Render Component
  return (
    <div className="deposit-page">
      <div className="content-box">
        <h1>Deposit Money</h1>
        <div className="form-group">
          <label htmlFor="account">Select Account:</label>
          <select
            id="account"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.type} (Balance: ${account.balance.toFixed(2)})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button onClick={handleDeposit}>Deposit</button>
        {message && <p className="message">{message}</p>}
        <button className="back-button" onClick={() => navigate('/balance')}>
          Back to Balance Page
        </button>
      </div>
    </div>
  );
};

export default DepositPage;