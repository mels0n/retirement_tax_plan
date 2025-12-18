import { describe, it, expect } from 'vitest';
import { calculateFederalTax, TaxInputs } from './taxEngine';

const emptyIncome = {
    wages: 0,
    socialSecurity: 0,
    socialSecurityDisability: 0,
    pensionPublic: 0,
    pensionMilitary: 0,
    pensionPrivate: 0,
    iraWithdrawals: 0,
    ltcg: 0,
    stcg: 0,
    dividends: 0,
    interest: 0
};

describe('Federal Tax Engine', () => {
    const defaultInputs: TaxInputs = {
        filingStatus: 'single',
        ageApplicant: 60, // Default, will be overridden in specific tests
        income: emptyIncome
    };

    it('should calculate standard deduction correctly for Single 2025', () => {
        const inputs: TaxInputs = {
            filingStatus: 'single',
            ageApplicant: 60,
            income: emptyIncome
        };
        const result = calculateFederalTax(inputs, '2025');
        expect(result.standardDeduction).toBe(15000);
    });

    it('should calculate standard deduction with Senior Bonus for Single 65+ 2026 (OBBB Base)', () => {
        const inputs = {
            ...defaultInputs,
            ageApplicant: 67,
            income: { ...emptyIncome, wages: 50000 } // Below phase-out
        };
        const result = calculateFederalTax(inputs, '2026');
        // 16100 (Std) + 2050 (Bonus) + 6000 (OBBB) = 24150
        expect(result.standardDeduction).toBe(16100 + 2050 + 6000);
    });

    it('should phase out OBBB Bonus for Single 65+ 2026 if income too high', () => {
        const inputs = {
            ...defaultInputs,
            ageApplicant: 67,
            income: { ...emptyIncome, wages: 80000 } // Above $75k phase-out
        };
        const result = calculateFederalTax(inputs, '2026');
        // 16100 (Std) + 2050 (Bonus) + 0 (OBBB Phased out) = 18150
        expect(result.standardDeduction).toBe(16100 + 2050);
    });

    it('should calculate standard deduction with Senior Bonus for Single 65+ 2025', () => {
        const inputs: TaxInputs = {
            filingStatus: 'single',
            ageApplicant: 65,
            income: emptyIncome
        };
        const result = calculateFederalTax(inputs, '2025');
        expect(result.standardDeduction).toBe(15000 + 2000);
    });

    it('should calculate SS taxability correctly (0% taxable)', () => {
        const inputs: TaxInputs = {
            filingStatus: 'single',
            ageApplicant: 65,
            income: {
                ...emptyIncome,
                socialSecurity: 20000,
                wages: 10000
            }
        };
        // Provisional = 10000 + 0.5 * 20000 = 20000.
        // Threshold1 for Single is 25000.
        // 20000 < 25000 -> 0 taxable.
        const result = calculateFederalTax(inputs, '2025');
        expect(result.taxableSS).toBe(0);
    });

    it('should calculate SS taxability correctly (50% taxable range)', () => {
        const inputs: TaxInputs = {
            filingStatus: 'single',
            ageApplicant: 65,
            income: {
                ...emptyIncome,
                socialSecurity: 20000,
                wages: 20000
            }
        };
        // Provisional = 20000 + 0.5 * 20000 = 30000.
        // Threshold1 (25k) < 30k < Threshold2 (34k).
        // Taxable = 0.5 * (30000 - 25000) = 2500.
        const result = calculateFederalTax(inputs, '2025');
        expect(result.taxableSS).toBe(2500);
    });

    it('should calculate SS taxability correctly (85% taxable range)', () => {
        const inputs: TaxInputs = {
            filingStatus: 'single',
            ageApplicant: 65,
            income: {
                ...emptyIncome,
                socialSecurity: 20000,
                wages: 40000
            }
        };
        // Provisional = 40000 + 0.5 * 20000 = 50000.
        // Threshold2 is 34000.
        // AmountOver2 = 50000 - 34000 = 16000.
        // AmountBetween = 34000 - 25000 = 9000.
        // Taxable = 0.85 * 16000 + min(0.5 * 9000, 0.5 * 20000)
        // Taxable = 13600 + 4500 = 18100.
        // Max Taxable = 0.85 * 20000 = 17000.
        // Result should be 17000.
        const result = calculateFederalTax(inputs, '2025');
        expect(result.taxableSS).toBe(17000);
    });

    it('should apply Stacking Algorithm correctly (Ordinary vs LTCG)', () => {
        const inputs: TaxInputs = {
            filingStatus: 'single',
            ageApplicant: 60,
            income: {
                ...emptyIncome,
                wages: 40000, // Ordinary
                ltcg: 20000   // Capital Gains
            }
        };
        // Standard Deduction (Single < 65) = 15000.
        // Ordinary Taxable = 40000 - 15000 = 25000.
        // LTCG Taxable = 20000.
        // Total Taxable = 45000.

        // Ordinary Tax (2025 Single):
        // 0-11925 @ 10% = 1192.50
        // 11926-48475 @ 12%.
        // 25000 is in 12% bracket.
        // Amount in 12% = 25000 - 11925 = 13075.
        // Tax = 13075 * 0.12 = 1569.
        // Total Ordinary Tax = 1192.50 + 1569 = 2761.50.

        // LTCG Tax:
        // LTCG sits on top of 25000. Range: 25001 to 45000.
        // LTCG Bracket 0%: 0 - 48350.
        // Entire LTCG is within 0% bracket.
        // LTCG Tax = 0.

        const result = calculateFederalTax(inputs, '2025');
        expect(result.ordinaryIncomeTax).toBeCloseTo(2761.50, 1);
        expect(result.ltcgTax).toBe(0);
    });

    it('should apply Stacking Algorithm correctly (LTCG spilling into 15%)', () => {
        const inputs: TaxInputs = {
            filingStatus: 'single',
            ageApplicant: 60,
            income: {
                ...emptyIncome,
                wages: 40000, // Ordinary Taxable = 25000
                ltcg: 50000   // Total Taxable = 75000
            }
        };
        // Ordinary Taxable = 25000.
        // LTCG Range: 25001 to 75000.
        // LTCG 0% Bracket: 0 - 48350.
        // LTCG 15% Bracket: 48351 - 533400.

        // LTCG in 0%: 48350 - 25000 = 23350.
        // LTCG in 15%: 75000 - 48350 = 26650.

        // LTCG Tax = (23350 * 0) + (26650 * 0.15) = 3997.50.

        const result = calculateFederalTax(inputs, '2025');
        expect(result.ltcgTax).toBeCloseTo(3997.50, 1);
    });
});


