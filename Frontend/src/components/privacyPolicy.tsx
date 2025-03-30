import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/terms.css';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="landing-page">
            <main>
                <section id="terms" className="terms">
                    <h2>Privacy Policy</h2>
                    <p>
                        Welcome to ACE Banks! This Privacy Policy ("Policy") describes how BankApp collects, uses, and shares your personal information when you use our website, mobile application, and online banking services (collectively, the "Services"). By using the Services, you agree to the terms of this Policy. If you do not agree to this Policy, you may not access or use the Services.
                    </p>
                    <p>
                        This Policy applies to all users of the Services, including visitors to our website and users of our mobile application. By using the Services, you consent to the collection, use, and sharing of your information as described in this Policy.
                    </p>
                    <h3>1. Information We Collect</h3>
                    <p>
                        ACE Banks collects information that you provide to us when you use the Services. This information may include your name, email address, phone number, and financial information. We may also collect information about your device and how you interact with the Services.
                    </p>

                    <h3>2. How We Use Your Information</h3>
                    <p>
                        ACE BANKS uses your information to provide and improve the Services. We may also use your information to communicate with you, to prevent fraud, and to comply with legal requirements.
                    </p>

                    <h3>3. How We Share Your Information</h3>
                    <p>
                        ACE BANKS may share your information with third parties that provide services on our behalf. We may also share your information with law enforcement or other third parties when required by law or to prevent fraud.
                    </p>

                    <h3>4. Security</h3>
                    <p>
                        ACE Banks takes reasonable measures to protect your information from unauthorized access or disclosure. However, no method of transmission over the internet or electronic storage is 100% secure.
                    </p>

                    <h3>5. Changes to this Policy</h3>
                    <p>
                        ACE Banks may update this Policy from time to time. If we make material changes, we will notify you by email or by posting a notice on the Services. Your continued use of the Services after the effective date of the revised Policy constitutes your acceptance of the terms.
                    </p>

                    <h3>6. Contact Us</h3>
                    <p>
                        If you have any questions about this Policy, please contact us at 1800-123-4567 or email us at ACEBanks@google.ca
                    </p>
                    
                    {/* Back Button */}
                    <Link to="/" className="back-link">Back to Home</Link>
                </section>
            </main>
        </div>
    );
};

export default PrivacyPolicy;