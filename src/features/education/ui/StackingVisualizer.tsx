/**
 * @file StackingVisualizer.tsx
 * @module features/education/ui
 * @description
 * Visualizes the "Income Stacking" concept and "Tax Torpedo" effect using stacked bar charts.
 * 
 * Architectural Note:
 * This component uses *static, pre-calculated scenarios* rather than dynamic user data.
 * Reason: The goal is to teach the *concept* of the Torpedo (0% -> 50% -> 85% taxable SS inclusion)
 * in a controlled environment where the "cause and effect" is unambiguous. 
 * Dynamic data often contains noise (e.g., weird deductions) that obscures the core lesson.
 */

'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

/**
 * Data Model for the Visualization
 * Represents three distinct tax situations to illustrate the progression.
 */
const data = [
    {
        name: 'Scenario A: Safe Zone',
        wages: 15000,
        taxableSS: 0,
        ltcg: 0,
        // Hidden fields for tooltip context
        totalSS: 30000,
        explanation: "Income is low. Provisional Income is below the threshold. $0 of SS is taxed."
    },
    {
        name: 'Scenario B: The Torpedo',
        wages: 35000,
        taxableSS: 4250, // Approx 85% of the last chunk
        ltcg: 0,
        totalSS: 30000,
        explanation: "Wages increased. This pushed you over the threshold. Suddenly, $4,250 of SS is added to your taxable income pile (The Purple Bar)."
    },
    {
        name: 'Scenario C: Stacked Gains',
        wages: 35000,
        taxableSS: 8000, // More SS taxable due to LTCG calculation
        ltcg: 20000,
        totalSS: 30000,
        explanation: "Added Capital Gains. Note how the Green Bar sits ON TOP. It pushes Total Income up, which drags even MORE SS (Purple Bar) into the taxable zone."
    },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const dataPoint = payload[0].payload;
        return (
            <div className="bg-white dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-700 rounded shadow-lg max-w-xs">
                <p className="font-bold text-sm mb-2 text-zinc-900 dark:text-zinc-100">{label}</p>
                <div className="space-y-1 text-xs">
                    <p className="text-blue-600">Wages/IRA: ${dataPoint.wages.toLocaleString()}</p>
                    <p className="text-purple-600 font-bold">Taxable SS: ${dataPoint.taxableSS.toLocaleString()}</p>
                    <p className="text-green-600">Capital Gains: ${dataPoint.ltcg.toLocaleString()}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                    <p className="text-xs italic text-zinc-600 dark:text-zinc-400">
                        {dataPoint.explanation}
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export const StackingVisualizer = () => {
    return (
        <div className="w-full h-[500px] bg-white dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(val) => `$${val / 1000}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />

                    {/* 
                       Stacking Order:
                       1. Wages (Ordinary) - The Foundation
                       2. Taxable SS (Ordinary) - The Variable Element (The Torpedo)
                       3. LTCG - The Cap (Stacked on top)
                    */}
                    <Bar dataKey="wages" stackId="a" name="Wages / IRA" fill="#3b82f6" />
                    <Bar dataKey="taxableSS" stackId="a" name="Taxable SS" fill="#9333ea" />
                    <Bar dataKey="ltcg" stackId="a" name="Capital Gains" fill="#22c55e" />

                    {/* 
                       Visual Reference: Standard Deduction (Approx $15k for Single 2025)
                       This helps users see what portion is actually taxed (above the line).
                    */}
                    <ReferenceLine y={15000} label="Std Deduction (0% Tax)" stroke="#ef4444" strokeDasharray="3 3" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
