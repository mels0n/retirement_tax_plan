/**
 * @file Faq.tsx
 * @description FAQ component with proper schema markup for SEO/AEO.
 * @module features/documentation/ui
 */

import React from 'react';

import { faqData } from '../data/faqData';

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
