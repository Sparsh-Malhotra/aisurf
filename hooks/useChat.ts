import { useState } from 'react';
import { Message } from '@/lib/types';

export const useChat = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', content: "Hi! How can I help you with this website?", isBot: true }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async (content: string) => {
        // Add user message
        const userMessage: Message = { id: Date.now().toString(), content, isBot: false };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // TODO: Add actual API call
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: "I'll help you with that!",
                isBot: true
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return { messages, isLoading, sendMessage };
};
