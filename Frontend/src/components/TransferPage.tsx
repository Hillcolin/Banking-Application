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
  const [selectedAccount, setSelectedAccount] = useState<string>(''); // Sender account
  const [recipientAccount, setRecipientAccount] = useState<string>(''); // Recipient account (for internal transfer)
  const [recipientEmail, setRecipientEmail] = useState(''); // Recipient email (for external transfer)
  const [amount, setAmount] = useState('');
  const [isInternalTransfer, setIsInternalTransfer] = useState(true); // Toggle between internal and external transfer
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
          setRecipientAccount(userAccounts[0].id);
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
  useEffect(() => {
	// Reset recipient account when sender account changes
	const validRecipientAccounts = accounts.filter((account) => account.id !== selectedAccount);
	if (validRecipientAccounts.length > 0) {
	  setRecipientAccount(validRecipientAccounts[0].id); // Set to the first valid recipient account
	} else {
	  setRecipientAccount(''); // Clear recipient account if no valid accounts exist
	}
  }, [selectedAccount, accounts]); // Run this effect when sender account or accounts list changes
  const handleTransfer = async () => {
    if (!selectedAccount || !amount || parseFloat(amount) <= 0) {
      setMessage('Please fill in all fields with valid values.');
      return;
    }

    if (isInternalTransfer) {
      // Internal transfer validation
      if (!recipientAccount) {
        setMessage('Please select a recipient account.');
        return;
      }

      if (selectedAccount === recipientAccount) {
        setMessage('Sender and recipient accounts cannot be the same.');
        return;
      }
    } else {
      // External transfer validation
      if (!recipientEmail || !isValidEmail(recipientEmail)) {
        setMessage('Please enter a valid recipient email.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      let transferPayload;

      if (isInternalTransfer) {
        // Internal transfer payload
        transferPayload = {
          senderUid: currentUser?.uid,
          senderAccountId: selectedAccount,
          recipientUid: currentUser?.uid, // Same user for internal transfer
          recipientAccountId: recipientAccount,
          amount: parseFloat(amount),
          isInternalTransfer: true,
        };
      } else {
        // External transfer payload
        const recipientResponse = await fetch(`http://localhost:5000/account/user/email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: recipientEmail }),
        });

        if (!recipientResponse.ok) {
          if (recipientResponse.status === 404) {
            setMessage('There is no user with that email address.');
          } else {
            const errorText = await recipientResponse.text();
            throw new Error(`Error: ${recipientResponse.status} - ${errorText}`);
          }
          return;
        }

        const recipientData = await recipientResponse.json();

        transferPayload = {
          senderUid: currentUser?.uid,
          senderAccountId: selectedAccount,
          recipientUid: recipientData.uid,
          recipientAccountId: 'checking', // Default recipient account
          amount: parseFloat(amount),
          isInternalTransfer: false,
        };
      }

      console.log('Transfer Payload:', transferPayload);

      const transferResponse = await fetch('http://localhost:5000/account/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transferPayload),
      });

      if (!transferResponse.ok) {
        const errorData = await transferResponse.json();
        throw new Error(errorData.message || 'Failed to transfer funds.');
      }

      setMessage('Transfer successful!');

      // Refresh account data after a successful transfer
      const userAccounts = await fetchOrInitializeUserData(currentUser?.uid, currentUser?.email);
      setAccounts(userAccounts); // Update the accounts state with the refreshed data
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
        <div className="toggle-buttons">
          <button
            className={`toggle-button ${isInternalTransfer ? 'active' : ''}`}
            onClick={() => setIsInternalTransfer(true)}
          >
            Transfer Between My Accounts
          </button>
          <button
            className={`toggle-button ${!isInternalTransfer ? 'active' : ''}`}
            onClick={() => setIsInternalTransfer(false)}
          >
            Send Money to Another User
          </button>
        </div>
        <div className="card">
          <h2>Sender</h2>
          <p>Available Balance: ${accounts.find((acc) => acc.id === selectedAccount)?.balance.toFixed(2)}</p>
          <select
            id="account"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.type}
              </option>
            ))}
          </select>
        </div>
        {isInternalTransfer ? (
			<div className="card">
				<h2>Recipient</h2>
				<select
					id="recipientAccount"
					value={recipientAccount}
					onChange={(e) => setRecipientAccount(e.target.value)} // Update recipient account on selection
				>
				{accounts
					.filter((account) => account.id !== selectedAccount) // Exclude the selected sender account
					.map((account) => (
					<option key={account.id} value={account.id}>
						{account.type}
					</option>
					))}
				</select>
				{/* Show recipient's balance dynamically based on the selected recipient account */}
				{recipientAccount && (
				<p>
					Recipient Balance: $
					{accounts.find((acc) => acc.id === recipientAccount)?.balance.toFixed(2)}
				</p>
				)}
			</div>
			) : (
			<div className="card">
				<h2>Recipient</h2>
				<input
				type="email"
				id="recipientEmail"
				placeholder="Recipient Email"
				value={recipientEmail}
				onChange={(e) => setRecipientEmail(e.target.value)}
				/>
			</div>
			)}
        <div className="card">
          <h2>Amount</h2>
          <input
            type="number"
            id="amount"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal" // Ensures numeric keypad on mobile
          />
        </div>
        <button className="transfer-button" onClick={handleTransfer} disabled={isSubmitting}>
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

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}