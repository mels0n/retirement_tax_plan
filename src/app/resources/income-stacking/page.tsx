import React from 'react';
import { Metadata } from 'next';
import { StackingVisualizer } from '@/features/education/ui/StackingVisualizer';

export const metadata: Metadata = {
    title: "Understanding The Tax Torpedo | Retirement Tax Plan",
    description: "Learn how Capital Gains and Ordinary Income interact with Social Security to create high marginal tax rates.",
};

export default function IncomeStackingPage() {
    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-black p-4 sm:p-8">
            <div className="max-w-4xl mx-auto py-12 space-y-12">

                {/* Header */}
                <section className="space-y-4">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                        Income Stacking & The "Tax Torpedo"
                    </h1>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
                        Retirement taxes work differently than specialized wage taxes. Your income sources "stack" on top of each other,
                        and adding one type of income can unexpectedly increase the taxes on another.
                    </p>
                </section>

                {/* The Visualization */}
                <section className="space-y-6">
                    <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
                        Visualizing the Effect
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        The chart below illustrates three scenarios. Notice how the <strong>Purple Bar (Taxable SS)</strong> acts like a
                        multiplier effect when you add other income.
                    </p>

                    <StackingVisualizer />

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-200">
                        <strong>Key Takeaway:</strong> Even if Capital Gains (Green) are taxed at 0%, adding them increases your total income.
                        This pushes your Social Security (Purple) across the "taxable threshold," effectively creating a tax where there was none before.
                    </div>
                </section>

                {/* Detailed Explanation */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                            1. The Stacking Order
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            The IRS considers your income in a specific order:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
                            <li><strong>Bottom Layer:</strong> Ordinary Income (Wages, Pensions, IRA withdrawals). This fills up your Standard Deduction first.</li>
                            <li><strong>Middle Layer:</strong> Taxable Social Security. This grows dynamically based on your total income.</li>
                            <li><strong>Top Layer:</strong> Long-Term Capital Gains. These sit on top tax-free (at 0%) until your total income crosses roughly $47k (Single) or $94k (Married).</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                            2. The "Tax Torpedo"
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            The "Torpedo" is the phenomenon where adding $1 of income causes more than $1 of taxable income.
                        </p>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            If you are in the <strong>Provisional Income Zone</strong> ($25k-$34k Single, $32k-$44k Married), every $1 you withdraw from an IRA
                            forces $0.85 of your Social Security to become taxable.
                        </p>
                        <p className="text-zinc-600 dark:text-zinc-400 font-medium">
                            Result: You pay tax on $1.85, creating a marginal tax rate that is 1.85x higher than your bracket!
                        </p>
                    </div>
                </section>

            </div>
        </main>
    );
}
