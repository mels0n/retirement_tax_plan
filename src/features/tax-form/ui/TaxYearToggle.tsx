'use client';

import { useTaxStore } from '@/entities/tax/model/store';
import { TaxYear } from '@/entities/tax/model/types';

export const TaxYearToggle = () => {
    const { year, setYear } = useTaxStore();

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setYear(e.target.value as TaxYear);
    };

    return (
        <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Tax Year</h2>
            <div className="flex items-center gap-4">
                <a
                    href={`/docs/${year}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                    Information
                </a>
                <select
                    aria-label="Select Tax Year"
                    value={year}
                    onChange={handleYearChange}
                    className="p-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                </select>
            </div>
        </div>
    );
};
