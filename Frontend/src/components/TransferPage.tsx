import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { fetchOrInitializeUserData } from './fetchOrInitializeUserData';
import { useNavigate } from 'react-router-dom';
import '../../styles/depwith.css';

interface Account {
  id: string;
  type: string;
  balance: number;
}

const TransferPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!currentUser) return;

      try {
        const userAccounts = await fetchOrInitializeUserData(currentUser.uid, currentUser.email);
        setAccounts(userAccounts);
        if (userAccounts.length > 0) {
          setSelectedAccount(userAccounts[0].id);
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
        setMessage('Failed to load accounts. Please try again later.');
      } finally {
        setIsLoadingAccounts(false);
      }
    };

    fetchAccounts();
  }, [currentUser]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleTransfer = async () => {
    if (!selectedAccount || !recipientEmail || !amount || parseFloat(amount) <= 0) {
      setMessage('Please fill in all fields with valid values.');
      return;
    }

    if (!isValidEmail(recipientEmail)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Fetch recipient data by email
      const recipientResponse = await fetch(`http://localhost:5000/account/user/by-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recipientEmail }),
      });

      if (!recipientResponse.ok) {
        const errorText = await recipientResponse.text();
        throw new Error(`Error: ${recipientResponse.status} - ${errorText}`);
      }

      const recipientData = await recipientResponse.json();

      // Proceed with the transfer
      const transferResponse = await fetch('http://localhost:5000/account/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderUid: currentUser?.uid,
          senderAccountId: selectedAccount,
          recipientUid: recipientData.uid,
          recipientAccountId: 'checking',
          amount: parseFloat(amount),
        }),
      });

      if (!transferResponse.ok) {
        const errorData = await transferResponse.json();
        throw new Error(errorData.message || 'Failed to transfer funds.');
      }

      setMessage('Transfer successful!');
    } catch (error: any) {
      console.error('Error during transfer:', error);
      setMessage(error.message || 'Error during transfer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingAccounts) {
    return <div>Loading accounts...</div>;
  }

  return (
    <div className="transfer-page">
      <div className="content-box">
        <h1>Transfer Funds</h1>
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
          <label htmlFor="recipientEmail">Recipient Email:</label>
          <input
            type="email"
            id="recipientEmail"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
          />
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
        <button onClick={handleTransfer} disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : 'Transfer'}
        </button>
        {message && <p className="message">{message}</p>}
        <button className="back-button" onClick={() => navigate('/balance')}>
          Back to Balance Page
        </button>
      </div>
    </div>
  );
};

export default TransferPage;