'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { NumberInput } from '@/shared/ui/NumberInput';
import { Tooltip as InfoTooltip } from '@/shared/ui/Tooltip';

export const SSOptimization = () => {
    const [fraBenefit, setFraBenefit] = useState(2000); // Monthly benefit at FRA (67)
    const [reinvest, setReinvest] = useState(false);
    const [rateOfReturn, setRateOfReturn] = useState(5); // Annual %

    // Assumptions:
    // FRA = 67
    // Age 62 = 70% of FRA
    // Age 70 = 124% of FRA

    const benefit62 = fraBenefit * 0.70;
    const benefit67 = fraBenefit;
    const benefit70 = fraBenefit * 1.24;

    const data = [];
    let cumulative62 = 0;
    let cumulative67 = 0;
    let cumulative70 = 0;

    // Monthly rate for reinvestment
    const monthlyRate = rateOfReturn / 100 / 12;

    for (let age = 62; age <= 90; age++) {
        // We iterate by year, but for reinvestment, monthly compounding is more accurate.
        // Nested loop for months.

        for (let m = 0; m < 12; m++) {
            // Age 62 claimer
            if (age * 12 + m >= 62 * 12) { // Check if current month is past claim age
                cumulative62 += benefit62;
                if (reinvest) cumulative62 *= (1 + monthlyRate);
            }

            // Age 67 claimer
            if (age * 12 + m >= 67 * 12) {
                cumulative67 += benefit67;
                if (reinvest) cumulative67 *= (1 + monthlyRate);
            }

            // Age 70 claimer
            if (age * 12 + m >= 70 * 12) {
                cumulative70 += benefit70;
                if (reinvest) cumulative70 *= (1 + monthlyRate);
            }
        }

        data.push({
            age,
            'Claim at 62': Math.round(cumulative62),
            'Claim at 67': Math.round(cumulative67),
            'Claim at 70': Math.round(cumulative70),
        });
    }

    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 space-y-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Social Security Optimization</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <NumberInput
                    label="Estimated Monthly Benefit at FRA (Age 67)"
                    value={fraBenefit}
                    onChange={setFraBenefit}
                    prefix="$"
                    tooltip="Your estimated monthly benefit amount at Full Retirement Age (typically 67)."
                />

                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="reinvest"
                            checked={reinvest}
                            onChange={(e) => setReinvest(e.target.checked)}
                            className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="reinvest" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Reinvest Benefits?
                        </label>
                        <InfoTooltip content="Simulate investing your Social Security benefits instead of spending them. Useful if you have other income sources." />
                    </div>

                    {reinvest && (
                        <NumberInput
                            label="Annual Rate of Return (%)"
                            value={rateOfReturn}
                            onChange={setRateOfReturn}
                            prefix="%"
                            tooltip="Expected annual investment return."
                        />
                    )}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                    <h3 className="text-sm font-medium text-zinc-500">Age 62</h3>
                    <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">${Math.round(benefit62)}/mo</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                    <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400">Age 67 (FRA)</h3>
                    <p className="text-lg font-bold text-blue-700 dark:text-blue-300">${Math.round(benefit67)}/mo</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                    <h3 className="text-sm font-medium text-green-600 dark:text-green-400">Age 70</h3>
                    <p className="text-lg font-bold text-green-700 dark:text-green-300">${Math.round(benefit70)}/mo</p>
                </div>
            </div>

            <div className="h-[300px]">
                <h3 className="text-sm font-medium text-zinc-500 mb-2">
                    {reinvest ? 'Cumulative Value (Invested)' : 'Cumulative Benefits Received'}
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="age" label={{ value: 'Age', position: 'insideBottomRight', offset: -10 }} />
                        <YAxis tickFormatter={(val) => `$${val / 1000}k`} />
                        <Tooltip formatter={(val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)} />
                        <Legend />
                        <Line type="monotone" dataKey="Claim at 62" stroke="#ef4444" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="Claim at 67" stroke="#3b82f6" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="Claim at 70" stroke="#22c55e" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
