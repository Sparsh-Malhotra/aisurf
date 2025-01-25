import React, { useState, useEffect } from 'react';
import {X} from 'lucide-react';
import {storage} from '@/lib/storage';
import {Settings as SettingsType} from '@/lib/types.ts'

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
    const [settings, setSettings] = useState<SettingsType>({
        apiKey: '',
        model: 'gpt-3.5-turbo'
    });

    useEffect(() => {
        if (isOpen) {
            storage.getSettings().then(setSettings);
        }
    }, [isOpen]);

    return (
        <div className={`absolute inset-0 bg-white z-50 ${isOpen ? 'block' : 'hidden'}`}>
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Settings</h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1.5 transition-colors"
                >
                    <X size={18} strokeWidth={2.5} />
                </button>
            </div>

            <div className="p-4 space-y-4">
                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">Model</label>
                    <select
                        value={settings.model}
                        onChange={(e) => setSettings(prev => ({ ...prev, model: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        <option value="gemini-pro">Gemini Pro</option>
                        <option value="claude-3">Claude 3</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">API Key</label>
                    <input
                        type="password"
                        value={settings.apiKey}
                        onChange={(e) => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your API key"
                    />
                </div>

                <button
                    onClick={async () => {
                        await storage.saveSettings(settings);
                        onClose();
                    }}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                    Save Settings
                </button>
            </div>
        </div>
    );
};
