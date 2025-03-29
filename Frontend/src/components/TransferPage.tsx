/**
 * @file TransferPage.tsx
 * @brief Transfer Funds page for the ACE Banks application.
 * @details This component allows users to transfer funds between their accounts and other users' accounts. It fetches the user's accounts, validates the recipient's email, and processes the transfer through the backend API. Users can navigate back to the balance page after completing the transfer or canceling the operation. Error messages are displayed for invalid inputs or failed transfers.
 */

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

/**
 * @class TransferPage
 * @brief React component for transferring funds in the ACE Banks application.
 * @details This component provides a form for users to select an account, enter a recipient's email, and specify the transfer amount. It validates the input fields and interacts with the backend API to process the transfer.
 */
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

  /**
   * @brief Fetches the user's accounts from Firestore.
   * @details This function retrieves the user's accounts and sets the default selected account. If an error occurs, it displays an error message.
   */
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

  /**
   * @brief Validates the recipient's email address.
   * @details This function checks if the provided email address matches a valid email format.
   * @param email The email address to validate.
   * @returns True if the email is valid, false otherwise.
   */
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * @brief Handles the fund transfer process.
   * @details This function validates the input fields, fetches the recipient's data from the backend, and processes the transfer. It displays success or error messages based on the result.
   */
  const handleTransfer = async () => {
    if (!selectedAccount || !recipientEmail || !amount || parseFloat(amount) <= 0) {
      setMessage('Please fill in all fields with valid values.');
      return;
    }

    try {
      const transferResponse = await fetch('http://localhost:5000/account/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderUid: currentUser?.uid, // Ensure this is not null or undefined
          senderAccountId: selectedAccount, // Ensure this is selected
          recipientEmail: recipientEmail.trim().toLowerCase(), // Normalize email
          amount: parseFloat(amount), // Ensure this is a valid number
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