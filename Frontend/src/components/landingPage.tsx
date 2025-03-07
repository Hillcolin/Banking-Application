import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/landingPage.css';

const landingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Welcome to Our Banking Application</h1>
        <p>Your trusted partner in financial management.</p>
        <Link to="/login" className="btn-primary">Get Started</Link>
      </header>
      <section className="features">
        <h2>Features</h2>
        <ul>
          <li>Secure Online Banking</li>
          <li>Easy Money Transfers</li>
          <li>24/7 Customer Support</li>
        </ul>
      </section>
      <footer className="landing-footer">
        <p>&copy; 2025 Banking Application. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default landingPage;