import { GoogleGenerativeAI } from '@google/generative-ai';
import {storage} from "@/lib/storage.ts";

interface ChatResponse {
    content: string;
    error?: string;
}

export class ChatService {
    private static instance: ChatService;
    private model: string = '';
    private apiKey: string = '';

    private constructor() {}

    static async getInstance() {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService();
            await this.updateInstance();
        }
        return ChatService.instance;
    }

    private setConfig(model: string, apiKey: string) {
        this.model = model;
        this.apiKey = apiKey;
    }

    static async updateInstance() {
        const settings = await storage.getSettings();
        ChatService.instance.setConfig(settings.model, settings.apiKey);
    }

    async sendMessage(message: string, context: string): Promise<ChatResponse> {
        try {
            switch (this.model) {
                case 'gemini-pro': return await this.sendGeminiMessage(message, context);
                case 'gpt-3.5-turbo': return await this.sendOpenAIMessage(message, context);
                default: throw new Error('Unsupported model');
            }
        } catch (error) {
            return { content: '', error: 'Failed to send message' };
        }
    }

    private async sendGeminiMessage(message: string, context: string): Promise<ChatResponse> {
        const genAI = new GoogleGenerativeAI(this.apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(`Context: ${context}\nUser: ${message}`);
        return { content: result.response.text() };
    }

    private async sendOpenAIMessage(message: string, context: string): Promise<ChatResponse> {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: `Context: ${context}` },
                    { role: 'user', content: message }
                ]
            })
        });
        const data = await response.json();
        return { content: data.choices[0].message.content };
    }
}
