'use client';

import { useTaxStore } from '@/entities/tax/model/store';
import { getTaxBrackets, getLtcgBrackets } from '@/entities/tax/lib/taxEngine';
import { Tooltip } from '@/shared/ui/Tooltip';

export const OptimizationInsights = () => {
    const { federalResult, inputs, year } = useTaxStore();

    if (!federalResult) return null;

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    // --- Ordinary Income Optimization ---
    const ordinaryIncome = federalResult.adjustedGrossIncome - inputs.income.ltcg;
    const stdDed = federalResult.standardDeduction;
    const ordinaryTaxable = Math.max(0, ordinaryIncome - stdDed);

    // @ts-ignore
    const brackets = getTaxBrackets(year, inputs.filingStatus);
    let currentOrdBracket = brackets[0];
    let nextOrdBracket = null;

    for (let i = 0; i < brackets.length; i++) {
        const b = brackets[i];
        if (ordinaryTaxable >= b.min && (b.max === null || ordinaryTaxable < b.max)) {
            currentOrdBracket = b;
            nextOrdBracket = brackets[i + 1];
            break;
        }
    }

    const ordinarySpaceLeft = currentOrdBracket.max ? currentOrdBracket.max - ordinaryTaxable : Infinity;
    const nextOrdRate = nextOrdBracket ? nextOrdBracket.rate : currentOrdBracket.rate;

    // --- LTCG Optimization ---
    const totalTaxable = federalResult.taxableIncome;
    // @ts-ignore
    const ltcgBrackets = getLtcgBrackets(year, inputs.filingStatus);
    let currentLtcgBracket = ltcgBrackets[0];

    for (const b of ltcgBrackets) {
        if (totalTaxable >= b.min && (b.max === null || totalTaxable < b.max)) {
            currentLtcgBracket = b;
            break;
        }
    }

    let ltcgSpaceLeft = 0;
    let nextLtcgRate = 0;
    let currentLtcgRate = currentLtcgBracket.rate;

    if (currentLtcgBracket.max !== null) {
        ltcgSpaceLeft = currentLtcgBracket.max - totalTaxable;
        const idx = ltcgBrackets.indexOf(currentLtcgBracket);
        if (idx < ltcgBrackets.length - 1) {
            nextLtcgRate = ltcgBrackets[idx + 1].rate;
        }
    } else {
        ltcgSpaceLeft = Infinity;
    }

    return (
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Tax Optimization Insights</h2>

            <div className="grid grid-cols-1 gap-3">
                {/* Standard Deduction (0% Bracket) */}
                <div className="relative p-3 rounded-lg bg-zinc-50 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700">
                    <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                        <div className="absolute -right-4 -bottom-4 text-zinc-100 dark:text-zinc-700/30">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-4.28 9.22a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V8.25a.75.75 0 00-1.5 0v5.94l-1.72-1.72z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center mb-1">
                            <h3 className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Standard Deduction (0% Tax)</h3>
                            <Tooltip content="The Standard Deduction is the amount of income you can earn tax-free before you start paying federal income tax." />
                        </div>
                        {ordinaryIncome < stdDed ? (
                            <>
                                <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-200 mb-0.5">
                                    {formatCurrency(stdDed - ordinaryIncome)}
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    remaining tax-free space.
                                </p>
                            </>
                        ) : (
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                Fully utilized. You have surpassed the tax-free threshold of <strong>{formatCurrency(stdDed)}</strong>.
                            </p>
                        )}
                    </div>
                </div>
                {/* Ordinary Income Opportunity */}
                <div className="relative p-3 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                    {/* Decorative Icon Container - Clipped */}
                    <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                        <div className="absolute -right-4 -bottom-4 text-blue-100 dark:text-blue-900/30">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
                                <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                                <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" />
                                <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
                            </svg>
                        </div>
                    </div>

                    {/* Content - Not Clipped */}
                    <div className="relative z-10">
                        <div className="flex items-center mb-1">
                            <h3 className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">Ordinary Income Room</h3>
                            <Tooltip content="The amount of additional Ordinary Income (e.g., IRA withdrawals, Wages) you can take before jumping to the next higher tax bracket." />
                        </div>

                        {ordinarySpaceLeft === Infinity ? (
                            <p className="text-zinc-700 dark:text-zinc-300 text-sm">You are in the highest tax bracket.</p>
                        ) : (
                            <>
                                <p className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-0.5">
                                    {formatCurrency(ordinarySpaceLeft)}
                                </p>
                                <p className="text-xs text-blue-600 dark:text-blue-400">
                                    remaining in the <strong>{(currentOrdBracket.rate * 100).toFixed(0)}%</strong> bracket.
                                </p>
                                <p className="text-[10px] text-blue-500 dark:text-blue-400 mt-1">
                                    Next dollar taxed at <strong>{(nextOrdRate * 100).toFixed(0)}%</strong>.
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* LTCG Opportunity */}
                <div className="relative p-3 rounded-lg bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                    {/* Decorative Icon Container - Clipped */}
                    <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                        <div className="absolute -right-4 -bottom-4 text-green-100 dark:text-green-900/30">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm.75 15.75l-4.5-4.5a.75.75 0 011.06-1.06l3.22 3.22 6.22-6.22a.75.75 0 111.06 1.06l-6.75 6.75a.75.75 0 01-1.06 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    {/* Content - Not Clipped */}
                    <div className="relative z-10">
                        <div className="flex items-center mb-1">
                            <h3 className="text-xs font-bold text-green-700 dark:text-green-300 uppercase tracking-wide">Capital Gains Room</h3>
                            <Tooltip content="The amount of additional Long-Term Capital Gains you can realize while staying in your current preferential tax rate bucket (0% or 15%)." />
                        </div>

                        {ltcgSpaceLeft === Infinity ? (
                            <p className="text-zinc-700 dark:text-zinc-300 text-sm">You are in the highest capital gains bracket (20%).</p>
                        ) : (
                            <>
                                <p className="text-2xl font-bold text-green-800 dark:text-green-200 mb-0.5">
                                    {formatCurrency(ltcgSpaceLeft)}
                                </p>
                                <p className="text-xs text-green-600 dark:text-green-400">
                                    remaining in the <strong>{(currentLtcgRate * 100).toFixed(0)}%</strong> bracket.
                                </p>
                                <p className="text-[10px] text-green-500 dark:text-green-400 mt-1">
                                    Next dollar taxed at <strong>{(nextLtcgRate * 100).toFixed(0)}%</strong>.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Social Security Taxability */}
            <div className="relative p-3 rounded-lg bg-purple-50 border border-purple-200 dark:bg-purple-900/20 dark:border-purple-800">
                <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                    <div className="absolute -right-4 -bottom-4 text-purple-100 dark:text-purple-900/30">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
                            <path fillRule="evenodd" d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-3.873 8.703a4.126 4.126 0 017.746 0 .75.75 0 01-.351.92 7.47 7.47 0 01-3.522.877 7.47 7.47 0 01-3.522-.877.75.75 0 01-.351-.92zM15 8.25a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5h-3.75a.75.75 0 01-.75-.75zM15 12a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5h-3.75a.75.75 0 01-.75-.75zM15 15.75a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5h-3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div className="relative z-10">
                    <div className="flex items-center mb-1">
                        <h3 className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide">SS Taxability</h3>
                        <Tooltip content="Social Security becomes taxable based on your 'Provisional Income' (AGI + 50% of SS benefits)." />
                    </div>
                    {(() => {
                        const totalSS = inputs.income.socialSecurity + inputs.income.socialSecurityDisability;
                        if (totalSS === 0) return <p className="text-sm text-zinc-500">No Social Security income.</p>;

                        const otherIncome = federalResult.adjustedGrossIncome - federalResult.taxableSS;
                        const provisionalIncome = otherIncome + (0.5 * totalSS);
                        const percentTaxable = totalSS > 0 ? (federalResult.taxableSS / totalSS) * 100 : 0;

                        return (
                            <>
                                <p className="text-sm text-purple-900 dark:text-purple-100 mb-1">
                                    <strong>{percentTaxable.toFixed(1)}%</strong> of your benefits are taxable.
                                </p>
                                <p className="text-xs text-purple-700 dark:text-purple-300">
                                    Provisional Income: <strong>{formatCurrency(provisionalIncome)}</strong>
                                </p>
                            </>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
};
