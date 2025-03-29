/**
 * @file login.tsx
 * @brief Login and account creation page for the ACE Banks application.
 * @details This component allows users to log in to their accounts or create a new account. It integrates with Firebase Authentication for user authentication and communicates with the backend to handle lockout logic. Error messages are displayed for failed authentication attempts or unexpected errors during the process.
 * @author Colin
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import '../../styles/login.css';

/**
 * @class Login
 * @brief React component for user login and account creation.
 * @details This component provides a form for users to log in or create an account. It uses Firebase Authentication to handle user authentication and navigates to the balance page upon success. Lockout logic is implemented by communicating with the backend.
 */
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  /**
   * @brief Handles form submission for login or account creation.
   * @details This function determines whether the user is logging in or creating an account based on the `isCreatingAccount` state. It uses Firebase Authentication to perform the action and navigates to the balance page upon success. If an error occurs, it sets an error message to be displayed. Lockout logic is checked before attempting login.
   * @param event The form submission event.
   * @returns void
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');

    try {
      // Check if the user is locked out
      const lockoutResponse = await fetch('http://localhost:5000/auth/check-lockout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const lockoutStatus = await lockoutResponse.json();

      if (lockoutStatus.isLockedOut) {
        const lockoutEndTime = new Date(lockoutStatus.lockoutEndTime).toLocaleTimeString();
        setErrorMessage(`You are temporarily locked out. Please try again after ${lockoutEndTime}.`);
        return;
      }

      if (isCreatingAccount) {
        // Create a new account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Signup successful:', userCredential.user);

        // Reset failed attempts on successful account creation
        await fetch('http://localhost:5000/auth/reset-failed-attempts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
      } else {
        // Log in an existing user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Login successful:', userCredential.user);

        // Reset failed attempts on successful login
        await fetch('http://localhost:5000/auth/reset-failed-attempts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
      }

      navigate('/balance'); // Navigate to the balance page
    } catch (error: any) {
      console.error('Error during authentication:', error);

      // Handle specific Firebase errors
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        setErrorMessage('Invalid email or password.');

        // Increment failed attempts on authentication failure
        await fetch('http://localhost:5000/auth/increment-failed-attempts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
      } else if (error.code === 'auth/too-many-requests') {
        setErrorMessage('Too many failed attempts. Please try again later.');
      } else {
        setErrorMessage(error.message || 'An unexpected error occurred during authentication.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>{isCreatingAccount ? 'Create Account' : 'Login'}</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">
          {isCreatingAccount ? 'Create Account' : 'Login'}
        </button>
      </form>
      <button onClick={() => setIsCreatingAccount(!isCreatingAccount)} className="toggle-button">
        {isCreatingAccount ? 'Already have an account? Login' : 'Create an account'}
      </button>
    </div>
  );
};

export default Login;
