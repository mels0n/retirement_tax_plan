import { create } from 'zustand';
import { calculateFederalTax } from '../lib/taxEngine';
import { TaxInputs, TaxYear, FederalTaxResult } from './types';
import { TaxInputs as TypesTaxInputs } from './types'; // To be clean, actually taxEngine re-exports them so line 2 is fine if taxEngine re-exports.
// Wait, I updated taxEngine to re-export * from '../model/types'. So imports from taxEngine should work IF the re-export is correct.
// Let's verify taxEngine.ts content again if needed, but I wrote it to re-export.
// The error was "Module not found: Can't resolve '@/entities/tax/config/tax_config.json'" in TaxSummary.
// And store.ts might be fine if taxEngine re-exports.
// However, it is cleaner to import types from model/types.


/**
 * Global state management for Tax Calculation.
 * Holds the current inputs, selected tax year, and the computed federal tax results.
 */
interface TaxState {
    /** The current set of user inputs for the calculation. */
    inputs: TaxInputs;

    /** The selected tax year (e.g., '2025', '2026'). */
    year: TaxYear;

    /** The calculated results. Null if no calculation has been performed yet. */
    federalResult: FederalTaxResult | null;

    /**
     * Updates the tax year and triggers a recalculation.
     * @param year - The new tax year to set.
     */
    setYear: (year: TaxYear) => void;

    /**
     * Updates part of the tax inputs and triggers a recalculation.
     * Accepts either a partial `TaxInputs` object or a partial `TaxInputs.income` object.
     * Automatically detects nested income updates.
     * 
     * @param updates - Partial updates for general inputs or specific income streams.
     */
    updateInputs: (updates: Partial<TaxInputs> | Partial<TaxInputs['income']>) => void;

    /**
     * Triggers the tax calculation engine based on current state.
     * Updates `federalResult` with the new calculation.
     */
    calculate: () => void;
}

const initialInputs: TaxInputs = {
    filingStatus: 'single',
    ageApplicant: 65,
    ageSpouse: 65,
    income: {
        wages: 0,
        socialSecurity: 0,
        socialSecurityDisability: 0,
        pensionPublic: 0,
        pensionMilitary: 0,
        pensionPrivate: 0,
        iraWithdrawals: 0,
        ltcg: 0,
        stcg: 0
    }
};

export const useTaxStore = create<TaxState>((set, get) => ({
    inputs: initialInputs,
    year: '2025',
    federalResult: null,

    setYear: (year) => {
        set({ year });
        get().calculate();
    },

    updateInputs: (updates) => {
        set((state) => {
            const newInputs = { ...state.inputs };

            // Heuristic detection: If the update contains keys known to be income streams,
            // treat it as a nested income update.
            const incomeKeys = Object.keys(initialInputs.income);
            const isIncomeUpdate = Object.keys(updates).some(k => incomeKeys.includes(k));

            if (isIncomeUpdate) {
                // Merge into the income object
                newInputs.income = {
                    ...newInputs.income,
                    ...(updates as Partial<TaxInputs['income']>)
                };
            } else {
                // Determine if 'income' was passed explicitly in a top-level update
                if ('income' in updates && (updates as Partial<TaxInputs>).income) {
                    newInputs.income = {
                        ...newInputs.income,
                        ...(updates as Partial<TaxInputs>).income
                    };
                }

                // Merge other top-level fields (e.g., filingStatus, ageApplicant)
                const { income, ...topLevelUpdates } = updates as Partial<TaxInputs>;
                Object.assign(newInputs, topLevelUpdates);
            }

            return { inputs: newInputs };
        });

        // Trigger calculation after state update
        get().calculate();
    },

    calculate: () => {
        const { inputs, year } = get();
        const federalResult = calculateFederalTax(inputs, year);

        set({ federalResult });
    }
}));

