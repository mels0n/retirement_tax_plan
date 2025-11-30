'use client';

import { useTaxStore } from '../store/useTaxStore';
import { FilingStatus } from '../utils/taxEngine';
import { NumberInput } from './ui/NumberInput';

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
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Filing Status
                    </label>
                    <select
                        value={inputs.filingStatus}
                        onChange={handleFilingStatusChange}
                        className="w-full p-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="single">Single</option>
                        <option value="mfj">Married Filing Jointly</option>
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
        </div>
    );
};
