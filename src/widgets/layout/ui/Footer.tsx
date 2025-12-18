import Link from 'next/link';
import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 mt-auto">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-8 md:py-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Retirement Tax Plan</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                            Optimize your withdrawal strategy.
                        </p>
                    </div>

                    <nav className="flex items-center gap-6">
                        <Link
                            href="/"
                            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                        >
                            Calculator
                        </Link>
                        <Link
                            href="/how-to-use"
                            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                        >
                            How to Use
                        </Link>
                        <Link
                            href="/faq"
                            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                        >
                            FAQ
                        </Link>
                    </nav>
                </div>

                <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-900 flex flex-col items-center gap-2">
                    <a
                        href="https://financial-independence.melson.us/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    >
                        Not retired yet? Start with reaching financial independence
                    </a>
                    <p className="text-xs text-zinc-400">
                        &copy; {new Date().getFullYear()} Christopher Melson. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};
