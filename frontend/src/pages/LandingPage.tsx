import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Zap, Target, Info } from 'lucide-react';
import SupportInfo from '../components/SupportInfo';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 text-white overflow-hidden">
            <header className="relative z-10 bg-opacity-50 bg-gray-800 backdrop-filter backdrop-blur-lg">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <motion.h1
                            className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4 sm:mb-0"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Mechabellum Assistant
                        </motion.h1>
                        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    to="/app"
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto text-center"
                                >
                                    Launch App
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <a
                                    href="https://buymeacoffee.com/pyguy12"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 transition duration-300 text-sm sm:text-base"
                                >
                                    Buy me a coffee ☕
                                </a>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </header>
            <main className="relative z-10">
                <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h2 className="text-6xl font-extrabold tracking-tight sm:text-7xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                                Master Your Mechabellum Counters
                            </h2>
                            <p className="mt-4 text-xl text-gray-300">
                                Elevate your gameplay with our advanced unit counter system. Make informed decisions and
                                dominate the battlefield.
                            </p>
                            <motion.div className="mt-8" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    to="/app"
                                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl"
                                >
                                    Get Started
                                    <svg
                                        className="ml-2 -mr-1 w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </Link>
                            </motion.div>
                        </motion.div>
                        <motion.div
                            className="mt-10 lg:mt-0"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <div className="perspective-1000">
                                <img
                                    src="/images/landing/app-ui.jpg"
                                    alt="Mechabellum Assistant App UI"
                                    className="rounded-lg shadow-2xl"
                                />
                            </div>
                        </motion.div>
                    </div>
                </section>

                <section className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.h2
                            className="text-4xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 py-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Key Features
                        </motion.h2>
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            <Feature
                                icon={<Shield className="h-12 w-12 text-blue-400" />}
                                title="Unit Counters"
                                description="Quickly identify the best units to counter your opponent's army composition."
                            />
                            <Feature
                                icon={<Zap className="h-12 w-12 text-yellow-400" />}
                                title="Real-time Updates"
                                description="Adjust your strategy on the fly with instant updates as you select enemy units."
                            />
                            <Feature
                                icon={<Target className="h-12 w-12 text-red-400" />}
                                title="Precision Insights"
                                description="Get detailed information on unit effectiveness and vulnerabilities."
                            />
                        </div>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <SupportInfo />
                    </motion.div>
                </section>
            </main>

            <footer className="relative z-10 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-400">© 2024 Mechabellum Assistant. All rights reserved.</p>
                    <p className="text-gray-400">Contact me by emailing mechabellum.assistant@gmail.com</p>
                    <p className="text-gray-400 mt-2">
                        Unit information sourced from{' '}
                        <a
                            href="https://mechamonarch.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition duration-300"
                        >
                            Mechamonarch.com
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
};

const Feature: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
    icon,
    title,
    description,
}) => (
    <motion.div
        className="flex flex-col items-center text-center bg-gray-700 bg-opacity-50 rounded-lg p-6 backdrop-filter backdrop-blur-lg transition-all duration-300 hover:shadow-xl"
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-500 bg-opacity-10 mb-4">
            {icon}
        </div>
        <h3 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            {title}
        </h3>
        <p className="text-gray-300">{description}</p>
    </motion.div>
);

export default LandingPage;
