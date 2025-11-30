'use client';

import { useTaxStore } from '../store/useTaxStore';
import { PersonalDetailsForm } from './PersonalDetailsForm';
import { IncomeForm } from './IncomeForm';
import { TaxYear } from '../utils/taxEngine';

export const ControlPanel = () => {
    const { year, setYear } = useTaxStore();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Tax Year</h2>
                <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                    {(['2025', '2026'] as TaxYear[]).map((y) => (
                        <button
                            key={y}
                            onClick={() => setYear(y)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${year === y
                                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                                }`}
                        >
                            {y}
                        </button>
                    ))}
                </div>
            </div>

            <PersonalDetailsForm />
            <IncomeForm />
        </div>
    );
};
