/**
 * @file Faq.tsx
 * @description FAQ component with proper schema markup for SEO/AEO.
 * @module features/documentation/ui
 */

import React from 'react';

const faqData = [
    {
        question: "How accurate are the tax calculations?",
        answer: "The calculations are estimates based on 2025/2026 IRS tax brackets and standard deductions. While we strive for accuracy, this tool is for planning purposes only and should not replace professional tax advice."
    },
    {
        question: "What is 'Income Stacking'?",
        answer: "Income stacking is the method of ordering different income types (Ordinary, Capital Gains, etc.) to optimize how they fill the progressive tax brackets, potentially lowering your overall effective tax rate."
    },
    {
        question: "Why can I select 2026 tax year?",
        answer: "The 2026 tax year option allows you to plan for the potential expiration of the Tax Cuts and Jobs Act provisions, which may significantly change tax brackets and standard deductions."
    },
    {
        question: "Is my data stored?",
        answer: "No. All calculations are performed locally in your browser. No personal data is sent to any server or stored permanently."
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
