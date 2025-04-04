/**
 * @file landingPage.tsx
 * @brief Landing page for the ACE Banks application.
 * @details This component serves as the landing page for the ACE Banks application. It includes navigation, a header, feature highlights, an about section, and a contact form. The contact form uses EmailJS to send messages to the support team.
 * @author Colin
 */

import { Link } from 'react-router-dom';
import React, { useState, FormEvent, ChangeEvent } from 'react';
import emailjs from 'emailjs-com';
import '../../styles/landingPage.css';

interface ContactFormData {
  email: string;
  message: string;
}

/**
 * @class LandingPage
 * @brief React component for the landing page of the ACE Banks application.
 * @details This component includes navigation, a header, feature highlights, an about section, and a contact form. The contact form integrates with EmailJS to send messages to the support team.
 */
const LandingPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  /**
   * @brief Handles changes to the contact form inputs.
   * @details Updates the state of the contact form as the user types into the email or message fields.
   * @param e The change event triggered by the input or textarea.
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  /**
   * @brief Handles the submission of the contact form.
   * @details Sends the contact form data to the EmailJS service. Displays a success or error message based on the result.
   * @param e The form submission event.
   * @returns void
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const result = await emailjs.send(
        'service_iteep7j',
        'template_fkpt0yf',
        {
          from_email: formData.email,
          message: formData.message,
          to_email: 'chill232@uwo.ca'
        },
        'DyfgL_5h3OUWI6rLR'
      );
      if (result.status === 200) {
        setSubmitMessage('Message sent successfully!');
        setFormData({ email: '', message: '' });
      } else {
        setSubmitMessage('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('EmailJS error:', error);
      setSubmitMessage('Failed to send message. Please try again.');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="logo">ACE Banks</div>
        <ul>
          <li><a href="#features">Features</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <header className="landing-header">
        <h1>Welcome to ACE Banks</h1>
        <p>Your one-stop solution for all your banking needs.</p>
        <Link to="/login" className="btn-primary" role="button">Get Started</Link>
      </header>

  
        {/* Main Content Section */}
      <main>
        <section id="features" className="features">
          <div className="feature-grid">
            <div className="feature-item">
              <i className="icon-secure"></i>
              <h3>Secure Online Banking</h3>
              <p>Bank with confidence using our state-of-the-art security measures.</p>
            </div>
            <div className="feature-item">
              <i className="icon-transfer"></i>
              <h3>Easy Money Transfers</h3>
              <p>Send and receive money quickly and securely, anytime, anywhere.</p>
            </div>
            <div className="feature-item">
              <i className="icon-support"></i>
              <h3>24/7 Customer Support</h3>
              <p>Our dedicated team is always ready to assist you with any queries.</p>
            </div>
            <div className="feature-item">
              <i className="icon-mobile"></i>
              <h3>Mobile Banking</h3>
              <p>Manage your accounts on-the-go with our intuitive mobile app, available for both iOS and Android.</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about">
          <h2>About Us</h2>
          <p>We're committed to providing innovative financial solutions to meet your needs. With years of experience and a customer-first approach, we're here to help you achieve your financial goals.</p>
        </section>

        <section id="contact" className="contact">
          <h2>Contact Us</h2>
          <form onSubmit={handleSubmit}>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email" 
              aria-label="Your Email" 
              required 
            />
            <textarea 
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message" 
              aria-label="Your Message" 
              required
            ></textarea>
            <button type="submit" className="btn-secondary" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
          {submitMessage && <p className={submitMessage.includes('successfully') ? 'success' : 'error'}>{submitMessage}</p>}
        </section>
      </main>

       {/* Footer Section */}
      <footer className="landing-footer">
        <div className="footer-links">
          <Link to="/terms" className="tos-button" role="button">Terms of Service</Link>
          <Link to="/privacyPolicy" className="tos-button" role="button">Privacy Policy</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} ACE Banks. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
