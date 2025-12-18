import { TaxInputs, FederalTaxResult, TaxYear, FilingStatus } from '../model/types';
import { calculateFederalTax2025 } from './engines/TaxEngine2025';
import { calculateFederalTax2026 } from './engines/TaxEngine2026';

// Helper to get brackets for UI visualization
import taxConfig2025 from '../config/tax_config_2025.json';
import taxConfig2026 from '../config/tax_config_2026.json';

export const getTaxBrackets = (year: TaxYear, status: FilingStatus) => {
    const config = year === '2026' ? taxConfig2026 : taxConfig2025;
    // @ts-ignore
    return config.federal.brackets[status];
};

export const getLtcgBrackets = (year: TaxYear, status: FilingStatus) => {
    const config = year === '2026' ? taxConfig2026 : taxConfig2025;
    // @ts-ignore
    return config.federal.ltcgBrackets[status];
};

// Re-export common types for consumers
export * from '../model/types';

/**
 * Orchestrates the full Federal Tax calculation.
 * Acts as a Strategy Factory, delegating to the correct year-specific engine.
 *
 * @param inputs - The user's tax inputs.
 * @param year - The tax year to calculate for.
 * @returns A detailed `FederalTaxResult` object.
 */
export const calculateFederalTax = (inputs: TaxInputs, year: TaxYear): FederalTaxResult => {
    if (year === '2026') {
        return calculateFederalTax2026(inputs);
    }
    // Default to 2025
    return calculateFederalTax2025(inputs);
};
