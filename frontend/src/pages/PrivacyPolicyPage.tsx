import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Link to="/" className="text-blue-400 hover:text-blue-300 transition duration-300">
                    Back Home
                </Link>
                <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
                <p className="mb-4">Last updated: 10/11/2024</p>
                <p className="mb-4">
                    This Privacy Policy describes how Mechabellum Assistant ("we", "us", or "our") collects and uses
                    anonymous information when you use our website (the "Service").
                </p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
                <p className="mb-4">
                    We use Vercel Analytics to collect and process anonymous data about how users interact with our
                    website. This may include:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>Anonymized IP addresses</li>
                    <li>Device and browser information</li>
                    <li>Pages visited and interactions with page elements</li>
                    <li>Referring websites</li>
                </ul>
                <p className="mb-4">
                    Vercel Analytics is privacy-focused and GDPR compliant. It does not use cookies or collect personal
                    data. All data is anonymized, including IP addresses.
                </p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use This Information</h2>
                <p className="mb-4">We use the collected anonymous data for various purposes:</p>
                <ul className="list-disc list-inside mb-4">
                    <li>To analyze website usage and improve our Service</li>
                    <li>To detect and prevent technical issues</li>
                </ul>
                <h2 className="text-2xl font-semibold mt-8 mb-4">Data Sharing and Disclosure</h2>
                <p className="mb-4">
                    We do not collect or store personal data, and therefore do not share or sell any personal
                    information. The anonymous, aggregated data collected by Vercel Analytics may be used for analytical
                    purposes.
                </p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to This Privacy Policy</h2>
                <p className="mb-4">
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the
                    new Privacy Policy on this page.
                </p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
                <p className="mb-4">
                    If you have any questions about this Privacy Policy, please contact us at:
                    mechabellum.assistant@gmail.com
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
