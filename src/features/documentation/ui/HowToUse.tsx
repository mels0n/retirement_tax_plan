/**
 * @file HowToUse.tsx
 * @description User guide component explaining how to use the Retirement Tax Plan application.
 * @module features/documentation/ui
 */

import React from 'react';

/**
 * HowToUse Component
 * 
 * Displays a step-by-step guide for users to understand the application workflow.
 * Follows FSD principles as a pure presentational component within the documentation slice.
 * 
 * @returns {JSX.Element} The rendered HowToUse component
 */
export const HowToUse: React.FC = () => {
    return (
        <section className="space-y-6" aria-labelledby="how-to-use-title">
            <h2 id="how-to-use-title" className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                How to Use
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">1</div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Select Tax Year</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Choose between 2025 and 2026 tax years to see how different regulations affect your liability.
                    </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">2</div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Enter Details</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Input your filing status, standard deductions, and personal information to set the baseline.
                    </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">3</div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Add Income</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Add various income streams (W2, Capital Gains, Pre-Tax, etc.) to visualize stacking order.
                    </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">4</div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Optimize</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Review the breakdown and use the optimization dashboard to minimize your effective tax rate.
                    </p>
                </div>
            </div>
        </section>
    );
};
