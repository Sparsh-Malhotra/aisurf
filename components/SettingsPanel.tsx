import React, { useState, useEffect, memo } from 'react';
import { X } from 'lucide-react';
import { storage } from '@/lib/storage';
import {ChatService} from "@/lib/chat.ts";

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

interface ModelOption {
    id: string;
    name: string;
    provider: string;
}

const MODEL_OPTIONS: ModelOption[] = [
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'google' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5', provider: 'openai' },
];

export const SettingsPanel = memo(({ isOpen, onClose, onSave }: SettingsPanelProps) => {
    const [settings, setSettings] = useState<{ apiKey: string; model: string }>({
        apiKey: '',
        model: 'gemini-pro'
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            storage.getSettings().then(setSettings);
        }
    }, [isOpen]);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await storage.saveSettings(settings);
            await ChatService.updateInstance();
            onSave();
        } catch (error) {
            console.error('Failed to save settings:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 bg-white z-50">
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
                        {MODEL_OPTIONS.map(option => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
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
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </div>
    );
});
