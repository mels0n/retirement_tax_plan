import { create } from 'zustand';
import { TaxInputs, TaxYear, FederalTaxResult, MissouriTaxResult, calculateFederalTax, calculateMissouriTax } from '../utils/taxEngine';

interface TaxState {
    inputs: TaxInputs;
    year: TaxYear;
    federalResult: FederalTaxResult | null;
    missouriResult: MissouriTaxResult | null;

    setYear: (year: TaxYear) => void;
    updateInputs: (updates: Partial<TaxInputs> | Partial<TaxInputs['income']>) => void;
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
    missouriResult: null,

    setYear: (year) => {
        set({ year });
        get().calculate();
    },

    updateInputs: (updates) => {
        set((state) => {
            // Handle nested income updates
            const newInputs = { ...state.inputs };

            // Check if updates contains income keys or top-level keys
            // This is a bit loose, but we can check specific keys
            if ('wages' in updates || 'socialSecurity' in updates || 'ltcg' in updates) {
                // It's likely an income update
                newInputs.income = { ...newInputs.income, ...(updates as Partial<TaxInputs['income']>) };
            } else {
                // It's a top level update (filingStatus, age, etc)
                // But wait, what if we pass { filingStatus: 'mfj', income: { ... } }?
                // Let's be more robust.

                const incomeUpdates: Partial<TaxInputs['income']> = {};
                const topLevelUpdates: Partial<TaxInputs> = {};

                Object.entries(updates).forEach(([key, value]) => {
                    if (key in initialInputs.income) {
                        // It's an income field (if passed flat)
                        // But our interface says updateInputs takes Partial<TaxInputs> OR Partial<TaxInputs['income']>
                        // If we pass flat income fields, we need to handle them.
                        // But TaxInputs has 'income' object.
                        // Let's assume the caller passes properly structured data or we flatten/unflatten.
                        // Actually, let's simplify the signature to just Partial<TaxInputs> and helper for income.
                    }
                });

                // Let's just merge carefully.
                // If 'income' is in updates, merge it.
                if ('income' in updates && updates.income) {
                    newInputs.income = { ...newInputs.income, ...updates.income };
                    // Remove income from updates to avoid overwriting with partial
                    const { income, ...rest } = updates as TaxInputs;
                    Object.assign(newInputs, rest);
                } else {
                    // If updates has keys that belong to income but are flat?
                    // No, let's enforce structure in the caller or here.
                    // Let's assume the caller uses `updateInputs({ income: { ... } })` or `updateInputs({ filingStatus: ... })`.
                    Object.assign(newInputs, updates);
                }
            }

            return { inputs: newInputs };
        });
        get().calculate();
    },

    calculate: () => {
        const { inputs, year } = get();
        const federalResult = calculateFederalTax(inputs, year);
        const missouriResult = calculateMissouriTax(inputs, federalResult.adjustedGrossIncome, year);

        set({ federalResult, missouriResult });
    }
}));
