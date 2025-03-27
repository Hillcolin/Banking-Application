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

const WithdrawPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!currentUser) return;

      try {
        const userAccounts = await fetchOrInitializeUserData(currentUser.uid);
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

  const handleWithdraw = async () => {
    if (!selectedAccount || !amount || parseFloat(amount) <= 0) {
      setMessage('Please select an account and enter a valid amount.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/account/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: currentUser?.uid,
          accountId: selectedAccount,
          amount: parseFloat(amount),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to withdraw money.');
      }

      setMessage('Withdrawal successful!');
    } catch (error) {
      console.error('Error during withdrawal:', error);
      setMessage('Error during withdrawal. Please try again.');
    }
  };

  return (
    <div className="withdraw-page">
      <div className="content-box">
        <h1>Withdraw Money</h1>
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
        <button onClick={handleWithdraw}>Withdraw</button>
        {message && <p className="message">{message}</p>}
        <button className="back-button" onClick={() => navigate('/balance')}>
          Back to Balance Page
        </button>
      </div>
    </div>
  );
};

export default WithdrawPage;