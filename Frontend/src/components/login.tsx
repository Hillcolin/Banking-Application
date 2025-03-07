import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/login.css';
import { useAuth } from '../contexts/authContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const { signInWithEmail, signInWithGoogle, createAccount } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (isCreatingAccount) {
        await createAccount(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      navigate('/');
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>{isCreatingAccount ? 'Create Account' : 'Login'}</h2>
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