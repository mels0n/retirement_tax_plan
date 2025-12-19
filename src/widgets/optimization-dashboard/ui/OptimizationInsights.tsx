'use client';

import { useTaxStore } from '@/entities/tax/model/store';
import { getTaxBrackets, getLtcgBrackets } from '@/entities/tax/lib/taxEngine';
import { Tooltip } from '@/shared/ui/Tooltip';
import Link from 'next/link';

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
                {/* 
                  Feature-Sliced Design: Ordinary Income Progression 
                  Architecture: We treat the Standard Deduction as the "0th Bracket".
                  This simplifies the UI by presenting a single "Ordinary Income" bucket progression.
                */}
                {(() => {
                    // Logic: Determine current "Virtual Bracket" (0% vs Taxable)
                    const isWithinStdDed = ordinaryIncome < stdDed;

                    // Unified Variables
                    let displayRate = 0;
                    let displaySpaceLeft = 0;
                    let nextDollarRate = 0;
                    let bucketLabel = "";
                    let isHighestBracket = false;

                    if (isWithinStdDed) {
                        // CASE 1: 0% Bracket (Standard Deduction)
                        displayRate = 0;
                        displaySpaceLeft = stdDed - ordinaryIncome;
                        nextDollarRate = 0.10; // Moves to 10% bracket next
                        bucketLabel = "Standard Deduction (0% Bracket)";
                    } else {
                        // CASE 2: Taxable Brackets
                        // Re-use pre-calculated scope variables
                        displayRate = currentOrdBracket.rate;
                        displaySpaceLeft = ordinarySpaceLeft;
                        nextDollarRate = nextOrdRate;
                        bucketLabel = `${(displayRate * 100).toFixed(0)}% Tax Bracket`;
                        if (ordinarySpaceLeft === Infinity) isHighestBracket = true;
                    }

                    // Warning Logic (Torpedo Check)
                    const totalSS = inputs.income.socialSecurity + inputs.income.socialSecurityDisability;
                    const otherIncome = federalResult.adjustedGrossIncome - federalResult.taxableSS;
                    const provisionalIncome = otherIncome + (0.5 * totalSS);
                    // Thresholds for 50% kick-in
                    let t1 = 25000;
                    if (inputs.filingStatus === 'mfj') t1 = 32000;

                    const isTorpedoZone = totalSS > 0 && provisionalIncome > t1 && federalResult.taxableSS < (0.85 * totalSS);

                    return (
                        <div className={`relative p-3 rounded-lg border ${displayRate === 0 ? 'bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700' : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'}`}>
                            {/* Decorative Icon Container - Clipped */}
                            <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                                <div className={`absolute -right-4 -bottom-4 ${displayRate === 0 ? 'text-zinc-100 dark:text-zinc-700/30' : 'text-blue-100 dark:text-blue-900/30'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16">
                                        {displayRate === 0 ? (
                                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-4.28 9.22a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V8.25a.75.75 0 00-1.5 0v5.94l-1.72-1.72z" clipRule="evenodd" />
                                        ) : (
                                            <>
                                                <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                                                <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" />
                                                <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
                                            </>
                                        )}
                                    </svg>
                                </div>
                            </div>

                            {/* Content - Not Clipped */}
                            <div className="relative z-10">
                                <div className="flex items-center mb-1">
                                    <h3 className={`text-xs font-bold uppercase tracking-wide ${displayRate === 0 ? 'text-zinc-600 dark:text-zinc-400' : 'text-blue-700 dark:text-blue-300'}`}>Ordinary Income Room</h3>
                                    <Tooltip content="The amount of additional Ordinary Income (e.g., IRA withdrawals, Wages) you can take before jumping to the next higher tax bracket." />
                                </div>

                                {isHighestBracket ? (
                                    <p className="text-zinc-700 dark:text-zinc-300 text-sm">You are in the highest tax bracket.</p>
                                ) : (
                                    <>
                                        <p className={`text-2xl font-bold mb-0.5 ${displayRate === 0 ? 'text-zinc-800 dark:text-zinc-200' : 'text-blue-800 dark:text-blue-200'}`}>
                                            {formatCurrency(displaySpaceLeft)}
                                        </p>
                                        <p className={`text-xs ${displayRate === 0 ? 'text-zinc-500 dark:text-zinc-400' : 'text-blue-600 dark:text-blue-400'}`}>
                                            remaining in the <strong>{bucketLabel}</strong>.
                                        </p>
                                        <p className={`text-[10px] mt-1 ${displayRate === 0 ? 'text-zinc-400 dark:text-zinc-500' : 'text-blue-500 dark:text-blue-400'}`}>
                                            Next dollar taxed at <strong>{(nextDollarRate * 100).toFixed(0)}%</strong>.
                                        </p>
                                    </>
                                )}

                                {/* Interaction Warning: The Tax Torpedo */}
                                {isTorpedoZone && (
                                    <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-[11px] leading-tight text-yellow-800 dark:text-yellow-200">
                                        <strong>⚠️ Tax Interaction Alert:</strong><br />
                                        Adding Ordinary Income here also increases your Provisional Income, causing more Social Security to become taxable.
                                        <div className="mt-1">
                                            <Link href="/resources/income-stacking" className="underline hover:text-yellow-900 dark:hover:text-yellow-100 font-medium">
                                                Visualize how this works &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })()}

                {/* LTCG Opportunity */}
                {(() => {
                    // Logic to detect "Tax Torpedo" Interaction
                    // If adding LTCG increases Provisional Income AND we haven't maxed out SS taxability,
                    // then LTCG effectively has a "shadow tax" caused by SS.
                    const totalSS = inputs.income.socialSecurity + inputs.income.socialSecurityDisability;
                    const otherIncome = federalResult.adjustedGrossIncome - federalResult.taxableSS;
                    const provisionalIncome = otherIncome + (0.5 * totalSS);

                    // Thresholds for 50% kick-in
                    let t1 = 25000;
                    if (inputs.filingStatus === 'mfj') t1 = 32000;

                    const isTorpedoZone = totalSS > 0 && provisionalIncome > t1 && federalResult.taxableSS < (0.85 * totalSS);

                    return (
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

                                {/* Interaction Warning: The Tax Torpedo */}
                                {isTorpedoZone && (
                                    <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-[11px] leading-tight text-yellow-800 dark:text-yellow-200">
                                        <strong>⚠️ Tax Interaction Alert:</strong><br />
                                        Adding Capital Gains in this zone increases your Provisional Income, causing more of your Social Security to become taxable (The &quot;Tax Torpedo&quot;).
                                        <div className="mt-1">
                                            <Link href="/resources/income-stacking" className="underline hover:text-yellow-900 dark:hover:text-yellow-100 font-medium">
                                                Visualize how this works &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })()}
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

                        // Thresholds
                        let t1 = 25000;
                        let t2 = 34000;
                        if (inputs.filingStatus === 'mfj') {
                            t1 = 32000;
                            t2 = 44000;
                        }

                        const otherIncome = federalResult.adjustedGrossIncome - federalResult.taxableSS;
                        const provisionalIncome = otherIncome + (0.5 * totalSS);
                        const percentTaxable = totalSS > 0 ? (federalResult.taxableSS / totalSS) * 100 : 0;

                        // Check if we are in the Torpedo Zone (active phase-in)
                        const isTorpedoZone = totalSS > 0 && provisionalIncome > t1 && federalResult.taxableSS < (0.85 * totalSS);

                        // Determine "Zone" (Standard Logic)
                        let zoneLabel = "";
                        let spaceLeft = 0;
                        let nextZoneLabel = "";
                        let isMaxed = false;

                        if (provisionalIncome < t1) {
                            zoneLabel = "Tax-Free Zone";
                            spaceLeft = t1 - provisionalIncome;
                            nextZoneLabel = "until 50% become taxable";
                        } else if (provisionalIncome < t2) {
                            zoneLabel = "50% Taxability Zone";
                            spaceLeft = t2 - provisionalIncome;
                            nextZoneLabel = "until 85% become taxable";
                        } else {
                            zoneLabel = "Max Taxability Zone (85%)";
                            isMaxed = true;
                        }

                        return (
                            <>
                                <p className="text-sm text-purple-900 dark:text-purple-100 mb-2">
                                    <strong>{percentTaxable.toFixed(1)}%</strong> of your benefits are taxable.
                                </p>

                                {!isMaxed ? (
                                    <>
                                        {/* Standard Display */}
                                        <div className={`mt-2 p-2 rounded border ${isTorpedoZone ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' : 'bg-white/50 border-purple-100 dark:bg-black/20 dark:border-purple-800/50'}`}>
                                            <p className={`text-xl font-bold ${isTorpedoZone ? 'text-yellow-800 dark:text-yellow-200' : 'text-purple-800 dark:text-purple-200'}`}>
                                                {formatCurrency(spaceLeft)}
                                            </p>
                                            <p className={`text-xs uppercase tracking-wide font-medium ${isTorpedoZone ? 'text-yellow-700 dark:text-yellow-300' : 'text-purple-600 dark:text-purple-300'}`}>
                                                {isTorpedoZone ? "Being taxed at a higher marginal rate (Torpedo Zone)" : `Room ${nextZoneLabel}`}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                                        You are in the <strong>85% Taxability Zone</strong>.
                                    </p>
                                )}

                                <div className="mt-2 flex justify-between text-[10px] text-purple-500/80">
                                    <span>Provisional Income:</span>
                                    <span className="font-mono">{formatCurrency(provisionalIncome)}</span>
                                </div>
                            </>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
};
