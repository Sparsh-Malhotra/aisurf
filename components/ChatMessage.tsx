import React, { memo } from 'react';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
    content: string;
    isBot?: boolean;
}

export const ChatMessage = memo(({ content, isBot = false }: ChatMessageProps) => {
    return (
        <div className={`flex gap-3 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                isBot ? 'bg-purple-100' : 'bg-gray-100'
            }`}>
                {isBot ?
                    <Bot size={16} className="text-purple-600" /> :
                    <User size={16} className="text-gray-600" />
                }
            </div>
            <div className={`py-2.5 px-3 rounded-2xl max-w-[80%] ${
                isBot
                    ? 'bg-white border border-gray-200 text-gray-700'
                    : 'bg-purple-600 text-white'
            }`}>
                {content}
            </div>
        </div>
    );
});
