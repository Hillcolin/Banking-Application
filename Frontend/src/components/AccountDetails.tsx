/**
 * @file AccountDetails.tsx
 * @brief Displays account details and transaction history.
 * @details This component fetches and displays the transaction history for a specific account.
 * It also allows users to sort transactions by date, amount, or description.
 * @author Colin
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAccountTransactions } from './fetchOrInitializeUserData';
import '../../styles/accountDetails.css';
import { useAuth } from '../contexts/authContext';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
}

/**
 * @class AccountDetails
 * @brief React component for displaying account details and transaction history.
 * @details This component fetches transactions for a specific account, calculates the balance,
 * and provides sorting options for the transaction history.
 */
const AccountDetails: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sortedTransactions, setSortedTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'description'>('date');

  /**
   * @brief Fetches transactions for the current account.
   * @details This function fetches the transaction history for the specified account ID,
   * sorts the transactions by date (newest to oldest), and calculates the account balance.
   * @author Colin
   */
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!accountId) {
        setError('Invalid account ID.');
        setLoading(false);
        return;
      }

      try {
        const fetchedTransactions = await fetchAccountTransactions(currentUser.uid, accountId);

        const sortedByDate = fetchedTransactions.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setTransactions(sortedByDate);
        setSortedTransactions(sortedByDate);

        const totalBalance = fetchedTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
        setBalance(totalBalance);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to fetch transactions. Please try again later.');
      }

      setLoading(false);
    };

    fetchTransactions();
  }, [accountId, currentUser.uid]);

  /**
   * @brief Handles sorting of transactions.
   * @details Sorts the transactions based on the selected criteria (date, amount, or description).
   * @param criteria The criteria to sort by ('date', 'amount', or 'description').
   * @returns void
   */
  const handleSort = (criteria: 'date' | 'amount' | 'description') => {
    setSortBy(criteria);

    const sorted = [...transactions].sort((a, b) => {
      if (criteria === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (criteria === 'amount') {
        return b.amount - a.amount;
      } else if (criteria === 'description') {
        return a.description.localeCompare(b.description);
      }
      return 0;
    });

    setSortedTransactions(sorted);
  };

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

      <div className="sorting-options">
        <label htmlFor="sort">Sort By:</label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => handleSort(e.target.value as 'date' | 'amount' | 'description')}
        >
          <option value="date">Date</option>
          <option value="amount">Amount</option>
          <option value="description">Description</option>
        </select>
      </div>

      <div className="transaction-history">
        <h2>Transaction History</h2>
        {sortedTransactions.length > 0 ? (
          <ul>
            {sortedTransactions.map(transaction => (
              <li key={transaction.id} className="transaction-item">
                <p><strong>Date:</strong> {new Date(transaction.date).toLocaleString()}</p>
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