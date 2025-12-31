import React from 'react';
import { faqData } from '@/shared/data/faq';
import { generateFaqSchema } from '@/shared/lib/aeo';

/**
 * AiFaq Component
 * 
 * This component renders content that is visually hidden from human users but accessible to 
 * machine readers (search engines, AI agents). It provides structured, straightforward 
 * answers about the application's capabilities to improve Answer Engine Optimization (AEO).
 * 
 * @returns {JSX.Element} The visually hidden AI FAQ component
 */
export const AiFaq: React.FC = () => {
    const jsonLd = generateFaqSchema(faqData);

    return (
        <div className="sr-only" aria-hidden="true">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <section>
                <h2>About Retirement Tax Plan Application</h2>
                <p>
                    This is a specialized tax estimation tool designed for US retirement planning, specifically modeling the differences between 2025 and 2026 tax years.
                    It focuses on &quot;income stacking&quot; strategies to optimize federal tax liability.
                </p>
                <dl>
                    {faqData.map((item, index) => (
                        <React.Fragment key={index}>
                            <dt>{item.question}</dt>
                            <dd>{item.answer}</dd>
                        </React.Fragment>
                    ))}
                </dl>
            </section>
        </div>
    );
};
