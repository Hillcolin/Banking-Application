import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/login.css';
import { useAuth } from '../contexts/authContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState<number | null>(null);
  const { signInWithEmail, signInWithGoogle, createAccount } = useAuth();
  const navigate = useNavigate();

  // Load lockout state from localStorage on component mount
  useEffect(() => {
    const storedLockTimer = localStorage.getItem('lockTimer');
    const storedFailedAttempts = localStorage.getItem('failedAttempts');
    const lockEndTime = localStorage.getItem('lockEndTime');

    if (storedLockTimer && lockEndTime) {
      const remainingTime = Math.max(
        Math.floor((parseInt(lockEndTime) - Date.now()) / 1000),
        0
      );

      if (remainingTime > 0) {
        setIsLocked(true);
        setLockTimer(remainingTime);
      } else {
        localStorage.removeItem('lockTimer');
        localStorage.removeItem('lockEndTime');
        localStorage.removeItem('failedAttempts');
      }
    }

    if (storedFailedAttempts) {
      setFailedAttempts(parseInt(storedFailedAttempts));
    }
  }, []);

  // Timer to handle lockout countdown
  useEffect(() => {
    if (lockTimer !== null) {
      const timer = setInterval(() => {
        setLockTimer((prev) => {
          if (prev !== null && prev > 0) {
            const newTime = prev - 1;
            localStorage.setItem('lockTimer', newTime.toString());
            return newTime;
          } else {
            clearInterval(timer);
            setIsLocked(false);
            setFailedAttempts(0); // Reset failed attempts after lockout
            localStorage.removeItem('lockTimer');
            localStorage.removeItem('lockEndTime');
            localStorage.removeItem('failedAttempts');
            return null;
          }
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [lockTimer]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');

    if (isLocked) {
      setErrorMessage('Too many failed attempts. Please try again later.');
      return;
    }

    try {
      if (isCreatingAccount) {
        // Create account
        await createAccount(email, password);
        navigate('/balance'); // Navigate to balance page upon successful sign-up
      } else {
        await signInWithEmail(email, password); // Sign in with email/password
        navigate('/balance'); // Navigate to balance page upon successful login
      }
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

      // Increment failed attempts
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      localStorage.setItem('failedAttempts', newFailedAttempts.toString());

      // Lock the account after 3 failed attempts
      if (newFailedAttempts >= 3) {
        setIsLocked(true);
        setLockTimer(60); // Lock for 60 seconds
        const lockEndTime = Date.now() + 60000; // 1 minute from now
        localStorage.setItem('lockTimer', '60');
        localStorage.setItem('lockEndTime', lockEndTime.toString());
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
      {isLocked && <p className="lock-message">Account locked. Try again in {lockTimer} seconds.</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLocked}
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
            disabled={isLocked}
          />
        </div>
        <button type="submit" disabled={isLocked}>
          {isCreatingAccount ? 'Create Account' : 'Login'}
        </button>
      </form>
      <button onClick={handleGoogleSignIn} className="google-signin-button" disabled={isLocked}>
        Sign in with Google
      </button>
      <button onClick={() => setIsCreatingAccount(!isCreatingAccount)} className="toggle-button">
        {isCreatingAccount ? 'Already have an account? Login' : 'Create an account'}
      </button>
    </div>
  );
};

export default Login;
