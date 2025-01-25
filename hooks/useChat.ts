// hooks/useChat.ts
import { useState, useEffect } from 'react';
import { Message } from '@/lib/types';
import { ChatService } from '@/lib/chat';
import { storage } from '@/lib/storage';

export const useChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pageContent, setPageContent] = useState<any>(null);
    const chatService = ChatService.getInstance();

    useEffect(() => {
        // Get page content
        chrome.runtime.sendMessage({ type: 'GET_CONTENT' }, (content) => {
            setPageContent(content);
        });

        // Get settings
        storage.getSettings().then(settings => {
            chatService.setConfig(settings.model, settings.apiKey);
        });
    }, []);

    const sendMessage = async (content: string) => {
        const userMessage: Message = { id: Date.now().toString(), content, isBot: false };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const context = pageContent ?
                `Title: ${pageContent.title}\nURL: ${pageContent.url}\nDescription: ${pageContent.description}\nContent: ${pageContent.text}` :
                "No webpage content available";

            const response = await chatService.sendMessage(content, context);

            if (response.error) throw new Error(response.error);

            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    content: response.content,
                    isBot: true
                }
            ]);
        } catch (error) {
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now().toString(),
                    content: "Sorry, something went wrong. Please try again.",
                    isBot: true
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return { messages, isLoading, sendMessage };
};
