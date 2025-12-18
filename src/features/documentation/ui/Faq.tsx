/**
 * @file Faq.tsx
 * @description FAQ component with proper schema markup for SEO/AEO.
 * @module features/documentation/ui
 */

import React from 'react';

const faqData = [
    {
        question: "How accurate are the tax calculations?",
        answer: "The calculations are estimates based on 2025/2026 IRS tax brackets and standard deductions, including adjustments for age (65+) and blindness. While we strive for accuracy, this tool provides an approximation for planning purposes and does not account for every possible credit or deduction. Always consult a tax professional for official filing."
    },
    {
        question: "Does this tool calculate State Taxes?",
        answer: "Currently, the tool includes a specialized estimator for Missouri State Tax, complete with its unique standard deduction and bracket system. For other states, it primarily focuses on Federal tax liability."
    },
    {
        question: "What is 'Income Stacking'?",
        answer: "Income stacking is the strategy of withdrawing from different account types in a specific order. Ordinary income (like 401k withdrawals or wages) fills the standard deduction and lower tax brackets first. Long-term capital gains are 'stacked' on top. This order is crucial because Capital Gains often have a 0% tax rate up to a certain total income threshold (approx. $96,700 for married couples in 2025)."
    },
    {
        question: "How is Social Security taxed?",
        answer: "The tool estimates the taxable portion of your Social Security benefits using the 'Provisional Income' formula. Depending on your total combined income, up to 85% of your benefits may be taxable. The tool automatically performs this complex calculation for you."
    },
    {
        question: "Why compare 2025 and 2026?",
        answer: "The Tax Cuts and Jobs Act (TCJA) provisions are set to expire at the end of 2025. This means that in 2026, tax rates may revert to higher pre-2018 levels, and the standard deduction could be nearly halved. Comparing both years helps you decide if you should accelerate income (like Roth conversions) into 2025 to lock in lower rates."
    },
    {
        question: "What is the difference between Effective and Marginal Rate?",
        answer: "Your 'Marginal Rate' is the tax percentage paid on the very last dollar you earned (your highest bracket). Your 'Effective Rate' is the actual percentage of your total income that goes to the IRS. Because of the progressive tax system and the standard deduction (which is taxed at 0%), your Effective Rate is almost always significantly lower than your Marginal Rate."
    },
    {
        question: "Is my data stored?",
        answer: "No. All calculations are performed biologically in your browser. No personal data, income figures, or settings are ever sent to a server or stored in a database. Your financial privacy is absolute."
    }
];

/**
 * Faq Component
 * 
 * Displays frequently asked questions and injects JSON-LD schema for search engines.
 * 
 * @returns {JSX.Element} The rendered FAQ component
 */
export const Faq: React.FC = () => {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    };

    return (
        <section className="space-y-6" aria-labelledby="faq-title">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <h2 id="faq-title" className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Frequently Asked Questions
            </h2>

            <div className="grid gap-4">
                {faqData.map((item, index) => (
                    <details key={index} className="group bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 open:border-blue-500/50 dark:open:border-blue-500/50 transition-colors">
                        <summary className="flex justify-between items-center p-6 cursor-pointer font-medium text-zinc-900 dark:text-zinc-100 select-none">
                            {item.question}
                            <span className="transform transition-transform group-open:rotate-180 text-zinc-400">
                                ▼
                            </span>
                        </summary>
                        <div className="px-6 pb-6 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            {item.answer}
                        </div>
                    </details>
                ))}
            </div>
        </section>
    );
};
