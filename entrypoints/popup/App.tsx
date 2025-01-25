import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { ChatMessage } from '@/components/ChatMessage';
import { SettingsPanel } from '@/components/SettingsPanel';
import { LoadingState } from '@/components/LoadingState';
import { useChat } from '@/hooks/useChat';
import {storage} from "@/lib/storage.ts";
import {WelcomeScreen} from "@/components/WelcomeScreen.tsx";

const App = () => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isLoadingContent, setIsLoadingContent] = useState(true);
    const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
    const { messages, isLoading, sendMessage, initializeChat } = useChat();
    const [input, setInput] = useState('');

    const handleSettingsSave = () => {
        setIsSettingsOpen(false);
        setHasApiKey(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        sendMessage(input);
        setInput('');
    };

    useEffect(() => {
        const loadContent = async () => {
            try {
                // Get active tab
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

                // Extract content from page
                const content = await chrome.tabs.sendMessage(tab.id!, { type: 'EXTRACT_CONTENT' });

                // Initialize chat with content
                await initializeChat(content);
            } catch (error) {
                console.error('Error loading content:', error);
            } finally {
                setIsLoadingContent(false);
            }
        };

        loadContent();
    }, []);

    useEffect(() => {
        storage.getSettings().then(settings => {
            setHasApiKey(!!settings.apiKey);
        });
    }, []);

    const appContent = () => {
        if (hasApiKey === null) {
            return <LoadingState message="Loading..." />;
        }

        if (!hasApiKey) {
            return <WelcomeScreen onSetupClick={() => setIsSettingsOpen(true)} />;
        }

        if (isLoadingContent) {
            return <LoadingState />;
        }

        return (
            <>
                <header className="bg-purple-600 text-white px-4 py-3 flex items-center justify-between">
                    <h1 className="font-bold text-lg">AISurf</h1>
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-1.5 hover:bg-purple-500 rounded-full transition-colors"
                    >
                        <Settings size={20}/>
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map(message => (
                        <ChatMessage
                            key={message.id}
                            content={message.content}
                            isBot={message.isBot}
                        />
                    ))}
                    {isLoading && <LoadingDots/>}
                </main>

                <footer className="p-4 border-t border-gray-200 bg-white">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything about this website..."
                            className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                        >
                            Send
                        </button>
                    </form>
                </footer>
            </>
        );
    };

    return (
        <div className="w-96 h-[600px] flex flex-col bg-white text-gray-800 relative">
            <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}
                           onSave={handleSettingsSave}/>
            {appContent()}
        </div>
    );
};

export default App;
