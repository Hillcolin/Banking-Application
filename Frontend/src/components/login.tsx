import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/login.css';
import { useAuth } from '../contexts/authContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { signInWithEmail, signInWithGoogle, createAccount } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    try {
      if (isCreatingAccount) {
        await createAccount(email, password); // Create an account
      } else {
        await signInWithEmail(email, password); // Sign in with email/password
      }
      navigate('/balance'); // Navigate to balance page upon successful login or account creation
    } catch (error: any) {
      console.error('Error during authentication:', error);
      if (error.code === 'auth/invalid-email') {
        setErrorMessage('Invalid email address. Please check your email.');
      } else if (error.code === 'auth/user-not-found') {
        setErrorMessage('No user found with this email. Please create an account.');
      } else if (error.code === 'auth/wrong-password') {
        setErrorMessage('Incorrect password. Please try again.');
      } else if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('This email is already in use. Please log in.');
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage('The password is too weak. Please choose a stronger password.');
      } else {
        setErrorMessage('An error occurred during authentication. Please try again.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle(); // Sign in with Google
      navigate('/balance'); // Navigate to balance page upon successful login
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setErrorMessage('An error occurred during Google sign-in. Please try again.');
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
        <button type="submit">{isCreatingAccount ? 'Create Account' : 'Login'}</button>
      </form>
      <button onClick={handleGoogleSignIn} className="google-signin-button">
        Sign in with Google
      </button>
      <button onClick={() => setIsCreatingAccount(!isCreatingAccount)} className="toggle-button">
        {isCreatingAccount ? 'Already have an account? Login' : 'Create an account'}
      </button>
    </div>
  );
};

export default Login;
