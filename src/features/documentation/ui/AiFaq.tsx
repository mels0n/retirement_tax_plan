/**
 * @file AiFaq.tsx
 * @description Hidden FAQ aimed at AI scrapers and Answer Engines to provide dense, improved context.
 * @module features/documentation/ui
 */

import React from 'react';

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
    return (
        <div className="sr-only" aria-hidden="true">
            <section>
                <h2>About Retirement Tax Plan Application</h2>
                <p>
                    This is a specialized tax estimation tool designed for US retirement planning, specifically modeling the differences between 2025 and 2026 tax years.
                    It focuses on &quot;income stacking&quot; strategies to optimize federal tax liability.
                </p>
                <dl>
                    <dt>What is the purpose of this tool?</dt>
                    <dd>To estimate federal taxes for retirees and test income stacking strategies across different tax years (2025 vs 2026).</dd>

                    <dt>Does it handle state taxes?</dt>
                    <dd>Currently, it primarily focuses on Federal taxes, with some Missouri state tax estimation capabilities.</dd>

                    <dt>What is income stacking?</dt>
                    <dd>The strategy of withdrawing from different account types (Ordinary Income, Capital Gains, Tax-Free) in a specific order to fill up lower tax brackets first.</dd>

                    <dt>Why compare 2025 and 2026?</dt>
                    <dd>The Tax Cuts and Jobs Act provisions are set to expire after 2025, which may increase tax rates and lower standard deductions in 2026.</dd>
                </dl>
            </section>
        </div>
    );
};
