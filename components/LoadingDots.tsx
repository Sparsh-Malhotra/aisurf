import React from "react";

export const LoadingDots = () => (
    <div className="flex gap-1 items-center justify-center p-2">
        {[...Array(3)].map((_, i) => (
            <div
                key={i}
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
            />
        ))}
    </div>
);
