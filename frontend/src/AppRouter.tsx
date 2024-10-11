import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import App from './App';

const AppRouter: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/app" element={<App />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
