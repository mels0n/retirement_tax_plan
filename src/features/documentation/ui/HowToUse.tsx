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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "HowTo",
                        "name": "How to Use Retirement Tax Plan Calculator",
                        "description": "Step-by-step guide on how to use the Retirement Tax Plan tool to optimize federal tax liability.",
                        "step": [
                            {
                                "@type": "HowToStep",
                                "name": "Select Tax Year & Status",
                                "text": "Start by choosing between 2025 (current laws) and 2026 (post-TCJA expiration). Then, enter your filing status (Single or Married Filing Jointly)."
                            },
                            {
                                "@type": "HowToStep",
                                "name": "Input Personal Details",
                                "text": "Specify if you or your spouse are 65 or older or blind. The tool automatically calculates your total deduction baseline."
                            },
                            {
                                "@type": "HowToStep",
                                "name": "Add Income Streams",
                                "text": "Add your income sources. Ordinary Income fills bottom brackets first, while Long-Term Capital Gains sit on top with preferential rates."
                            },
                            {
                                "@type": "HowToStep",
                                "name": "Analyze & Optimize",
                                "text": "Review the Tax Summary to see your Effective Tax Rate. Use Optimization Insights to find room for Roth conversions or capital gain harvesting."
                            }
                        ]
                    })
                }}
            />
            <h2 id="how-to-use-title" className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                How to Use
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">1</div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Select Tax Year & Status</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        Start by choosing between <strong>2025</strong> (current laws) and <strong>2026</strong> (post-TCJA expiration).
                        Then, enter your filing status (Single or Married Filing Jointly) to load the correct standard deduction and tax brackets.
                    </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">2</div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Input Personal Details</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        Specify if you or your spouse are <strong>65 or older</strong> or blind, as this increases your standard deduction.
                        The tool automatically calculates your total deduction baseline before any income is added.
                    </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">3</div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Add Income Streams</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        Add your income sources. The order matters for "stacking":
                        <ul className="list-disc pl-4 mt-2 space-y-1">
                            <li><strong>Ordinary Income</strong> (W2, Pensions, IRA withdrawals) fills the bottom brackets first.</li>
                            <li><strong>Long-Term Capital Gains</strong> sit on top of ordinary income and enjoy preferential rates (0%, 15%, 20%).</li>
                        </ul>
                    </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">4</div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Analyze & Optimize</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        Review the <strong>Tax Summary</strong> to see your Effective Tax Rate.
                        Use the "Optimization Insights" to see how much room is left in your current tax bracket potentially allowing for tax-free Roth conversions or capital gain harvesting.
                    </p>
                </div>
            </div>
        </section>
    );
};
