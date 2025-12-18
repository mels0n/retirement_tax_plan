'use client';

import { useTaxStore } from '@/entities/tax/model/store';
import { getTaxBrackets } from '@/entities/tax/lib/taxEngine';
import { Tooltip } from '@/shared/ui/Tooltip';

export const TaxSummary = () => {
    const { federalResult, inputs, year } = useTaxStore();

    if (!federalResult) {
        return (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                <p className="text-zinc-500 dark:text-zinc-400 text-center">
                    Enter your details to see the tax breakdown.
                </p>
            </div>
        );
    }

    const totalTax = federalResult.totalFederalTax;
    const grossIncome = federalResult.grossIncome;
    const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;
    const netIncome = grossIncome - totalTax;

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    const formatPercent = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(val / 100);

    const Card = ({ title, value, subtext, highlight = false, tooltip }: { title: string; value: string; subtext?: string; highlight?: boolean; tooltip?: string }) => (
        <div className={`p-4 rounded-lg border ${highlight ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : 'bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700'}`}>
            <div className="flex items-center">
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</h3>
                {tooltip && <Tooltip content={tooltip} />}
            </div>
            <p className={`text-2xl font-bold mt-1 ${highlight ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                {value}
            </p>
            {subtext && <p className="text-xs text-zinc-500 mt-1">{subtext}</p>}
        </div>
    );

    // Calculate Marginal Bracket Info
    // @ts-ignore
    const brackets = getTaxBrackets(year, inputs.filingStatus);
    // Use Ordinary Taxable Income for the bracket calculation
    const ordinaryTaxable = Math.max(0, (federalResult.adjustedGrossIncome - inputs.income.ltcg) - federalResult.standardDeduction);

    let currentBracket = brackets[0];
    let filledInBracket = 0;
    let spaceRemaining = 0;

    for (const bracket of brackets) {
        if (ordinaryTaxable > bracket.min) {
            currentBracket = bracket;
            if (bracket.max === null) {
                filledInBracket = ordinaryTaxable - bracket.min;
                spaceRemaining = Infinity;
            } else if (ordinaryTaxable < bracket.max) {
                filledInBracket = ordinaryTaxable - bracket.min;
                spaceRemaining = bracket.max - ordinaryTaxable;
                break;
            } else {
                // We are above this bracket, continue
            }
        } else {
            // We are below this bracket (shouldn't happen if we start at 0 and go up, unless 0)
            break;
        }
    }

    if (ordinaryTaxable === 0) {
        currentBracket = brackets[0];
        filledInBracket = 0;
        spaceRemaining = brackets[0].max! - brackets[0].min;
    }

    const percentFilled = spaceRemaining === Infinity ? 100 : (filledInBracket / (filledInBracket + spaceRemaining)) * 100;

    return (
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Tax Summary</h2>

            <div className="grid grid-cols-1 gap-3">
                <Card
                    title="Net Spendable"
                    value={formatCurrency(netIncome)}
                    subtext={`Gross: ${formatCurrency(grossIncome)}`}
                    highlight
                    tooltip="Total income minus Federal and State taxes."
                />

                <div className="grid grid-cols-2 gap-3">
                    <Card
                        title="Total Tax"
                        value={formatCurrency(totalTax)}
                        tooltip="Federal tax liability."
                    />
                    <Card
                        title="Effective Rate"
                        value={formatPercent(effectiveRate)}
                        tooltip="Total Tax divided by Gross Income."
                    />
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-700 pt-3 space-y-1">
                    <div className="flex justify-between text-xs">
                        <span className="text-zinc-600 dark:text-zinc-400">Federal Tax</span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{formatCurrency(federalResult.totalFederalTax)}</span>
                    </div>
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-700 pt-3">
                    <div className="flex items-center mb-1">
                        <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Marginal Tax Bracket</h3>
                        <Tooltip content="The tax rate applied to your last dollar of Ordinary Income. Does not include Capital Gains rates." />
                    </div>
                    <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                        {(currentBracket?.rate || 0) * 100}%
                    </p>
                    <div className="mt-1 text-[10px] text-zinc-500 space-y-1">
                        <div className="flex justify-between">
                            <span>Filled:</span>
                            <span className="font-medium">{formatCurrency(filledInBracket)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Space Left:</span>
                            <span className="font-medium">{spaceRemaining === Infinity ? '∞' : formatCurrency(spaceRemaining)}</span>
                        </div>
                        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full mt-1 overflow-hidden">
                            <div
                                className="bg-orange-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${percentFilled}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
