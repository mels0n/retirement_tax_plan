export type FilingStatus = 'single' | 'mfj' | 'hoh' | 'mfs';
export type TaxYear = '2025' | '2026';

/**
 * Represents the comprehensive set of user inputs required for tax calculation.
 * Includes details on filing status, age, and various income streams.
 */
export interface TaxInputs {
    filingStatus: FilingStatus;
    ageApplicant: number;
    ageSpouse?: number; // Applicable only for 'mfj' status.
    income: {
        wages: number;
        socialSecurity: number; // Total gross annual Social Security benefits.
        socialSecurityDisability: number;
        pensionPublic: number;
        pensionMilitary: number;
        pensionPrivate: number;
        iraWithdrawals: number;
        ltcg: number;
        stcg: number;
        dividends?: number; // Added for completeness, usually treated as LTCG or Ordinary depending on type.
        interest?: number; // Added for completeness, usually Ordinary.
    };
}

/**
 * Represents the detailed breakdown of the Federal Tax calculation results.
 */
export interface FederalTaxResult {
    grossIncome: number;
    taxableSS: number;
    adjustedGrossIncome: number;
    standardDeduction: number;
    taxableIncome: number;
    ordinaryIncomeTax: number;
    ltcgTax: number;
    niitTax: number; // Net Investment Income Tax (3.8% Surcharge)
    netInvestmentIncome: number; // Helper for UI display
    totalFederalTax: number;
    effectiveTaxRate: number;
    brackets: {
        rate: number;
        amount: number;
        tax: number;
    }[];
}
