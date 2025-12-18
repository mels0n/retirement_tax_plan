'use client';

import React from 'react';

interface TooltipProps {
    content: string;
}

export const Tooltip = ({ content }: TooltipProps) => {
    return (
        <div className="relative inline-block group ml-2">
            <div className="cursor-help text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
            </div>
            {/* 
              Using absolute positioning with high z-index to avoid clipping.
              We rely on the parent having relative positioning but NOT overflow:hidden.
            */}

            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-56 p-3 bg-zinc-900/95 backdrop-blur-sm text-white text-xs rounded-lg shadow-xl z-[100] text-center border border-zinc-700">
                {content}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900/95"></div>
            </div>
        </div>
    );
};
