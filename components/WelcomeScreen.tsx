import React from 'react';
import { Key } from 'lucide-react';

interface WelcomeScreenProps {
    onSetupClick: () => void;
}

export const WelcomeScreen = ({ onSetupClick }: WelcomeScreenProps) => (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-white">
        <div className="bg-purple-100 p-4 rounded-full mb-6">
            <Key size={32} className="text-purple-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Welcome to AISurf</h2>
        <p className="text-gray-600 mb-6">Set up your API key to start chatting with websites</p>
        <button
            onClick={onSetupClick}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
            Setup API Key
        </button>
    </div>
);
