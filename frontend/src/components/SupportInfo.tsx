import React from 'react';
import { Coffee } from 'lucide-react';

const SupportInfo: React.FC = () => {
    return (
        <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg p-6 my-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Coffee className="mr-2 text-yellow-400" />
                Support Mechabellum Assistant
            </h2>
            <p className="text-gray-300 mb-4">
                Your support helps keep Mechabellum Assistant alive, continuously improving, and free to the community.
                Here's how your contributions make a difference:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Server Costs: Keeping the app online and responsive</li>
                <li>Data Updates: Ensuring unit information stays current with game changes</li>
                <li>New Features: Developing additional tools to enhance your gameplay</li>
                <li>Bug Fixes: Quickly addressing any issues that arise</li>
            </ul>
            <div className="mt-6">
                <a
                    href="https://www.buymeacoffee.com/pyguy12"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 transition duration-300"
                >
                    Buy me a coffee ☕
                </a>
            </div>
        </div>
    );
};

export default SupportInfo;
