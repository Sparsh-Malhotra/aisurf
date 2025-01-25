import { useState } from 'react';
import { Message, PageContent, ChatResponse } from '@/lib/types';
import { ChatService } from '@/lib/chat';

export const useChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pageContent, setPageContent] = useState<PageContent | null>(null);
    const [chatService, setChatService] = useState<ChatService | null>(null);

    useEffect(() => {
        ChatService.getInstance().then(setChatService);
    }, []);

    const initializeChat = async (content: PageContent) => {
        setPageContent(content);
        setMessages([{
            id: Date.now().toString(),
            content: "Hi! I've analyzed this webpage. What would you like to know?",
            isBot: true
        }]);
    };

    const sendMessage = async (content: string): Promise<void> => {
        const userMessage: Message = {
            id: Date.now().toString(),
            content,
            isBot: false
        };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const context = pageContent ?
                `Title: ${pageContent.title}\nURL: ${pageContent.url}\nDescription: ${pageContent.description}\nContent: ${pageContent.text}` :
                "No webpage content available";

            const response: ChatResponse = await chatService!.sendMessage(content, context);
            if (response.error) throw new Error(response.error);

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: response.content,
                isBot: true
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.log(error);
            const errorMessage: Message = {
                id: Date.now().toString(),
                content: `Sorry, something went wrong. Please try again.`,
                isBot: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return { messages, isLoading, sendMessage, initializeChat };
};
