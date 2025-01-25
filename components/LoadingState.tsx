import React, { memo } from 'react';

interface LoadingStateProps {
    message?: string;
}

export const LoadingState = memo(({ message = 'Analyzing webpage content...' }: LoadingStateProps) => (
    <div className="flex flex-col items-center justify-center h-full space-y-4 text-gray-500">
        <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-sm font-medium">{message}</p>
    </div>
));
