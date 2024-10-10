import React from 'react';
import { motion } from 'framer-motion';

const Header: React.FC = () => (
    <header className="bg-gray-800 shadow">
        <div className="max-w-screen-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Mechabellum Assistant</h1>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a
                    href="https://buymeacoffee.com/pyguy12"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition duration-300"
                >
                    Buy me a coffee ☕
                </a>
            </motion.div>
        </div>
    </header>
);

export default Header;
