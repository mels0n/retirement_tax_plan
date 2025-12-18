'use client';

import { useTaxStore } from '@/entities/tax/model/store';
import { NumberInput } from '@/shared/ui/NumberInput';

export const IncomeForm = () => {
    const { inputs, updateInputs } = useTaxStore();

    const handleIncomeChange = (field: keyof typeof inputs.income, value: number) => {
        updateInputs({
            income: {
                ...inputs.income,
                [field]: value
            }
        });
    };

    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Income Streams (Annual)</h2>

            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <NumberInput
                        label="Wages / Earned Income"
                        value={inputs.income.wages}
                        onChange={(v) => handleIncomeChange('wages', v)}
                        prefix="$"
                        tooltip="Gross wages from W-2 employment or net earnings from self-employment."
                    />
                    <NumberInput
                        label="Social Security Benefits"
                        value={inputs.income.socialSecurity}
                        onChange={(v) => handleIncomeChange('socialSecurity', v)}
                        prefix="$"
                        tooltip="Total annual Social Security benefits received (Box 5 of SSA-1099)."
                    />
                    <NumberInput
                        label="SS Disability (SSDI)"
                        value={inputs.income.socialSecurityDisability}
                        onChange={(v) => handleIncomeChange('socialSecurityDisability', v)}
                        prefix="$"
                        tooltip="Social Security Disability Insurance benefits. Taxed similarly to regular SS federally."
                    />
                    <NumberInput
                        label="Public Pension"
                        value={inputs.income.pensionPublic}
                        onChange={(v) => handleIncomeChange('pensionPublic', v)}
                        prefix="$"
                        tooltip="Pension from federal, state, or local government employment."
                    />
                    <NumberInput
                        label="Military Pension"
                        value={inputs.income.pensionMilitary}
                        onChange={(v) => handleIncomeChange('pensionMilitary', v)}
                        prefix="$"
                        tooltip="Pension from military service."
                    />
                    <NumberInput
                        label="Private Pension"
                        value={inputs.income.pensionPrivate}
                        onChange={(v) => handleIncomeChange('pensionPrivate', v)}
                        prefix="$"
                        tooltip="Pension from private employers."
                    />
                    <NumberInput
                        label="Traditional IRA / 401k"
                        value={inputs.income.iraWithdrawals}
                        onChange={(v) => handleIncomeChange('iraWithdrawals', v)}
                        prefix="$"
                        tooltip="Taxable distributions from Traditional IRAs, 401(k)s, or 403(b)s. Taxed as Ordinary Income."
                    />
                    <NumberInput
                        label="Long-Term Capital Gains"
                        value={inputs.income.ltcg}
                        onChange={(v) => handleIncomeChange('ltcg', v)}
                        prefix="$"
                        tooltip="Gains from assets held > 1 year. Taxed at preferential rates (0%, 15%, 20%)."
                    />
                    <NumberInput
                        label="Short-Term Capital Gains"
                        value={inputs.income.stcg}
                        onChange={(v) => handleIncomeChange('stcg', v)}
                        prefix="$"
                        tooltip="Gains from assets held <= 1 year. Taxed as Ordinary Income."
                    />
                </div>
            </div>
        </div>
    );
};
