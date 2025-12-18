'use client';

import { useTaxStore } from '@/entities/tax/model/store';
import { FilingStatus } from '@/entities/tax/model/types';
import { NumberInput } from '@/shared/ui/NumberInput';

export const PersonalDetailsForm = () => {
    const { inputs, updateInputs } = useTaxStore();

    const handleFilingStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateInputs({ filingStatus: e.target.value as FilingStatus });
    };

    const handleAgeChange = (field: 'ageApplicant' | 'ageSpouse', value: number) => {
        updateInputs({ [field]: value });
    };

    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Personal Details</h2>

            <div className="space-y-4">
                <div>
                    <label htmlFor="filingStatus" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Filing Status
                    </label>
                    <select
                        id="filingStatus"
                        value={inputs.filingStatus}
                        onChange={handleFilingStatusChange}
                        className="w-full p-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="single">Single</option>
                        <option value="mfj">Married Filing Jointly</option>
                        <option value="mfs">Married Filing Separately</option>
                        <option value="hoh">Head of Household</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                        label="Your Age"
                        value={inputs.ageApplicant}
                        onChange={(val) => handleAgeChange('ageApplicant', val)}
                        tooltip="Age as of Dec 31st of the tax year. Determines Standard Deduction bonus."
                    />

                    {inputs.filingStatus === 'mfj' && (
                        <NumberInput
                            label="Spouse Age"
                            value={inputs.ageSpouse || 0}
                            onChange={(val) => handleAgeChange('ageSpouse', val)}
                            tooltip="Spouse's age. Both spouses over 65 get an additional deduction."
                        />
                    )}
                </div>
            </div>

            {/* Medicare Eligibility Indicator */}
            {(inputs.ageApplicant >= 65 || (inputs.filingStatus === 'mfj' && inputs.ageSpouse && inputs.ageSpouse >= 65)) && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 flex items-start gap-2">
                    <div className="text-blue-500 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Medicare Eligible</p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                            {inputs.ageApplicant >= 65 ? "You" : ""}{inputs.ageApplicant >= 65 && inputs.filingStatus === 'mfj' && inputs.ageSpouse && inputs.ageSpouse >= 65 ? " and " : ""}{inputs.filingStatus === 'mfj' && inputs.ageSpouse && inputs.ageSpouse >= 65 ? "Spouse" : ""} are eligible for Medicare.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
