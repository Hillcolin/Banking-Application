import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/terms.css'; // Import the CSS file for styling

const Terms: React.FC = () => {
  return (
    <div className="landing-page">
      <main>
        <section id="terms" className="terms">
          <h2>Terms of Service</h2>
          <p>
            Welcome to BankApp! These Terms of Service ("Terms") govern your access to and use of BankApp’s website, mobile application, and online banking services (collectively, the "Services"). By accessing or using the Services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Services.
          </p>

          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms, as well as our Privacy Policy, which is incorporated herein by reference. If you are using the Services on behalf of an organization, you are agreeing to these Terms for that organization and promising that you have the authority to bind that organization to these Terms. In that case, "you" and "your" will refer to that organization.
          </p>

          <h3>2. Eligibility</h3>
          <p>
            You must be at least 18 years of age to use our Services. By using our Services, you represent and warrant that you are 18 years of age or older and have the legal capacity to enter into these Terms. Our services are intended for use by residents of [insert applicable jurisdictions], and we make no representation that the Services are appropriate or available for use in other locations.
          </p>

          <h3>3. Account Registration</h3>
          <p>
            To use certain features of the Services, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your account credentials and for all activities that occur under your account. BankApp is not liable for any loss or damage arising from your failure to protect your account credentials. You agree to notify BankApp immediately of any unauthorized access to or use of your account. BankApp reserves the right to suspend or terminate your account at any time for any reason, including but not limited to a violation of these Terms.
          </p>

          <h3>4. Use of Services</h3>
          <p>You agree to use the Services only for lawful purposes and in accordance with these Terms. You agree not to use the Services:</p>
          <ul>
            <li>In any way that violates any applicable federal, state, local, or international law or regulation.</li>
            <li>To engage in any activity that is fraudulent, deceptive, or misleading.</li>
            <li>To transmit any advertising or promotional material without our prior written consent.</li>
            <li>To impersonate or attempt to impersonate BankApp employees or other users.</li>
            <li>To engage in conduct that restricts others' enjoyment of the Services.</li>
            <li>To introduce viruses or other harmful material.</li>
            <li>To attempt unauthorized access to our systems.</li>
          </ul>

          <h3>5. Financial Transactions</h3>
          <p>
            BankApp facilitates financial transactions such as fund transfers and bill payments. You are solely responsible for ensuring the accuracy and legality of all transactions initiated through the Services.
          </p>

          <h3>6. Disclaimer of Warranties</h3>
          <p>
            THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. BANKAPP DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED.
          </p>

          {/* Back Button */}
          <Link to="/" className="back-link">Back to Home</Link>
        </section>
      </main>
    </div>
  );
};

export default Terms;
