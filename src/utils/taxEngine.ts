import taxConfig from '../data/tax_config.json';

export type FilingStatus = 'single' | 'mfj' | 'hoh';
export type TaxYear = '2025' | '2026';

export interface TaxInputs {
    filingStatus: FilingStatus;
    ageApplicant: number;
    ageSpouse?: number; // Only for MFJ
    income: {
        wages: number;
        socialSecurity: number; // Total annual benefits
        socialSecurityDisability: number;
        pensionPublic: number;
        pensionMilitary: number;
        pensionPrivate: number;
        iraWithdrawals: number;
        ltcg: number;
        stcg: number;
    };
}

export interface FederalTaxResult {
    grossIncome: number;
    taxableSS: number;
    adjustedGrossIncome: number;
    standardDeduction: number;
    taxableIncome: number;
    ordinaryIncomeTax: number;
    ltcgTax: number;
    totalFederalTax: number;
    effectiveTaxRate: number;
    brackets: {
        rate: number;
        amount: number;
        tax: number;
    }[];
}

const getTaxConfig = (year: TaxYear) => {
    return taxConfig[year].federal;
};

export const calculateStandardDeduction = (inputs: TaxInputs, year: TaxYear): number => {
    const config = getTaxConfig(year).standardDeduction;
    let deduction = config[inputs.filingStatus];

    // Senior Bonus
    if (inputs.ageApplicant >= 65) {
        deduction += config.seniorBonus;
    }
    if (inputs.filingStatus === 'mfj' && inputs.ageSpouse && inputs.ageSpouse >= 65) {
        deduction += config.seniorBonus;
    }

    return deduction;
};

export const calculateTaxableSS = (inputs: TaxInputs, year: TaxYear): number => {
    // Provisional Income = AGI (excluding SS) + TaxExemptInterest + 50% of SS
    // For simplicity in this first pass, we assume AGI excluding SS is sum of other incomes.
    // Real AGI calculation might be more complex, but this fits the requirements.

    const otherIncome = inputs.income.wages +
        inputs.income.pensionPublic +
        inputs.income.pensionMilitary +
        inputs.income.pensionPrivate +
        inputs.income.iraWithdrawals +
        inputs.income.stcg +
        inputs.income.ltcg; // LTCG is included in AGI

    const totalSS = inputs.income.socialSecurity + inputs.income.socialSecurityDisability;
    const provisionalIncome = otherIncome + (0.5 * totalSS);

    let threshold1, threshold2;
    if (inputs.filingStatus === 'mfj') {
        threshold1 = 32000;
        threshold2 = 44000;
    } else { // single or hoh
        threshold1 = 25000;
        threshold2 = 34000;
    }

    let taxableSS = 0;

    if (provisionalIncome > threshold2) {
        // Up to 85% is taxable
        // Formula: 0.85 * (Provisional - Threshold2) + min(0.5 * (Threshold2 - Threshold1), 0.5 * SS)
        // Capped at 0.85 * SS
        const amountOver2 = provisionalIncome - threshold2;
        const amountBetween = threshold2 - threshold1;
        taxableSS = (0.85 * amountOver2) + Math.min(0.5 * amountBetween, 0.5 * totalSS);
    } else if (provisionalIncome > threshold1) {
        // Up to 50% is taxable
        taxableSS = 0.5 * (provisionalIncome - threshold1);
    } else {
        taxableSS = 0;
    }

    // Taxable SS cannot exceed 85% of total SS
    return Math.min(taxableSS, 0.85 * totalSS);
};

export const calculateFederalTax = (inputs: TaxInputs, year: TaxYear): FederalTaxResult => {
    const config = getTaxConfig(year);
    const standardDeduction = calculateStandardDeduction(inputs, year);

    const taxableSS = calculateTaxableSS(inputs, year);

    const grossIncome = inputs.income.wages +
        inputs.income.pensionPublic +
        inputs.income.pensionMilitary +
        inputs.income.pensionPrivate +
        inputs.income.iraWithdrawals +
        inputs.income.stcg +
        inputs.income.ltcg +
        inputs.income.socialSecurity +
        inputs.income.socialSecurityDisability;

    // AGI for federal tax purposes includes the TAXABLE portion of SS, not the gross SS
    // But wait, the prompt says "Gross Income Calculation: Sum of all inputs." 
    // Then "SS/SSDI Taxability... Formula: AGI + ...". This is circular if AGI includes SS.
    // Standard definition: Provisional Income uses "Modified AGI" which excludes SS.
    // Taxable Income = AGI - Deductions.
    // AGI = All taxable income sources.

    const ordinaryIncomeSources = inputs.income.wages +
        inputs.income.pensionPublic +
        inputs.income.pensionMilitary +
        inputs.income.pensionPrivate +
        inputs.income.iraWithdrawals +
        inputs.income.stcg +
        taxableSS;

    const totalTaxableIncomeBeforeDeduction = ordinaryIncomeSources + inputs.income.ltcg;

    // Stacking Algorithm
    // Step 1: Fill Ordinary Income Floor
    // Step 2: Apply Standard Deduction to the Floor first

    let taxableOrdinaryIncome = Math.max(0, ordinaryIncomeSources - standardDeduction);
    let remainingDeduction = Math.max(0, standardDeduction - ordinaryIncomeSources);

    // Step 3: Stack LTCG on top
    let taxableLTCG = Math.max(0, inputs.income.ltcg - remainingDeduction);

    const totalTaxableIncome = taxableOrdinaryIncome + taxableLTCG;

    // Calculate Ordinary Tax
    let ordinaryTax = 0;
    let bracketsUsed: { rate: number; amount: number; tax: number }[] = [];

    const ordinaryBrackets = config.brackets[inputs.filingStatus];
    let currentOrdinaryIncome = taxableOrdinaryIncome;
    let previousMax = 0;

    // We need to calculate tax on the ordinary portion specifically
    // But tax brackets are progressive on TOTAL income? 
    // No, Ordinary income sits at the bottom. LTCG sits on top.
    // So we calculate tax on `taxableOrdinaryIncome` using the ordinary brackets.

    for (const bracket of ordinaryBrackets) {
        if (previousMax >= taxableOrdinaryIncome) break;

        const min = bracket.min; // effectively previousMax if contiguous
        const max = bracket.max === null ? Infinity : bracket.max;

        // The amount of income in this bracket is limited by the taxableOrdinaryIncome
        const effectiveMax = Math.min(max, taxableOrdinaryIncome);

        if (effectiveMax > min) { // Should be >= ? bracket.min is usually previous max + 1
            // Actually, standard bracket definitions: 0-11925. 
            // If taxable is 10000. 10000 > 0. Amount = 10000 - 0 = 10000.
            // If taxable is 20000. 
            // 1st bracket: min 0, max 11925. Amt = 11925.
            // 2nd bracket: min 11926, max 48475. Amt = 20000 - 11925.

            // Let's simplify: Amount in bracket = min(taxable, max) - (min - 1) ? 
            // Or just track remaining.

            // Better way:
            // Amount in this bracket = Math.max(0, Math.min(taxableOrdinaryIncome, max) - (min > 0 ? min - 1 : 0)); 
            // Wait, min is 11926. So we want 11926 to be included.
            // If min is 0, we subtract 0.

            const rangeStart = min;
            const rangeEnd = max;

            const incomeInBracket = Math.max(0, Math.min(taxableOrdinaryIncome, rangeEnd) - (rangeStart > 0 ? rangeStart - 1 : 0));

            if (incomeInBracket > 0) {
                const tax = incomeInBracket * bracket.rate;
                ordinaryTax += tax;
                bracketsUsed.push({ rate: bracket.rate, amount: incomeInBracket, tax });
            }
        }
    }

    // Calculate LTCG Tax
    // LTCG sits on top of Ordinary Income.
    // So the "start" of LTCG is at `taxableOrdinaryIncome`.
    // The "end" of LTCG is at `totalTaxableIncome`.

    let ltcgTax = 0;
    const ltcgBrackets = config.ltcgBrackets[inputs.filingStatus];

    for (const bracket of ltcgBrackets) {
        const min = bracket.min;
        const max = bracket.max === null ? Infinity : bracket.max;

        // We are looking for the overlap of [taxableOrdinaryIncome, totalTaxableIncome] with [min, max]

        const overlapStart = Math.max(taxableOrdinaryIncome, min > 0 ? min - 1 : 0); // Aligning with bracket definitions
        // Actually, LTCG brackets are based on TOTAL taxable income.
        // So if Ordinary is 40k, and LTCG is 20k. Total is 60k.
        // LTCG falls in the buckets between 40k and 60k.

        // Bracket 0%: 0 - 48350.
        // Overlap of (40k, 60k) with (0, 48350) is 40k to 48350 = 8350 taxed at 0%.
        // Bracket 15%: 48351 - 533400.
        // Overlap of (40k, 60k) with (48351, 533400) is 48351 to 60k = 11649 taxed at 15%.

        // Let's be precise with boundaries.
        // Range of LTCG dollars: [taxableOrdinaryIncome + 1, totalTaxableIncome]
        // Bracket range: [min, max]

        const start = Math.max(taxableOrdinaryIncome, min > 0 ? min - 1 : 0);
        // If min is 0, start is max(Ord, 0).
        // If min is 48351, start is max(Ord, 48350).

        // Wait, let's use the same logic as ordinary but shifted.
        // The "space" available in this bracket for LTCG is:
        // Space = max - min + 1.
        // Used by Ordinary = Math.max(0, Math.min(taxableOrdinaryIncome, max) - (min - 1)).
        // Remaining for LTCG = Space - UsedByOrdinary.
        // Actual LTCG in this bracket = Math.min(remainingForLTCG, remainingLTCGToTax).

        // Simpler:
        // Income covering this bracket = Math.min(totalTaxableIncome, max) - (min > 0 ? min - 1 : 0).
        // Ordinary portion = Math.min(taxableOrdinaryIncome, max) - (min > 0 ? min - 1 : 0).
        // LTCG portion = Math.max(0, Income covering this bracket - Ordinary portion).

        const incomeInBracketTotal = Math.max(0, Math.min(totalTaxableIncome, max) - (min > 0 ? min - 1 : 0));
        const incomeInBracketOrdinary = Math.max(0, Math.min(taxableOrdinaryIncome, max) - (min > 0 ? min - 1 : 0));
        const incomeInBracketLTCG = Math.max(0, incomeInBracketTotal - incomeInBracketOrdinary);

        if (incomeInBracketLTCG > 0) {
            ltcgTax += incomeInBracketLTCG * bracket.rate;
        }
    }

    return {
        grossIncome,
        taxableSS,
        adjustedGrossIncome: ordinaryIncomeSources + inputs.income.ltcg,
        standardDeduction,
        taxableIncome: totalTaxableIncome,
        ordinaryIncomeTax: ordinaryTax,
        ltcgTax,
        totalFederalTax: ordinaryTax + ltcgTax,
        effectiveTaxRate: grossIncome > 0 ? (ordinaryTax + ltcgTax) / grossIncome : 0,
        brackets: bracketsUsed
    };
};

export interface MissouriTaxResult {
    federalAGI: number;
    subtractions: {
        socialSecurity: number;
        publicPension: number;
        militaryPension: number;
        privatePension: number;
        totalSubtractions: number;
    };
    missouriAGI: number;
    standardDeduction: number;
    taxableIncome: number;
    totalStateTax: number;
}

export const calculateMissouriTax = (inputs: TaxInputs, federalAGI: number, year: TaxYear): MissouriTaxResult => {
    const config = taxConfig[year].missouri;

    // Subtractions
    // 1. Social Security & SSDI: 100% Exempt
    const ssExemption = (inputs.income.socialSecurity + inputs.income.socialSecurityDisability) * config.exemptions.socialSecurity;

    // 2. Public Pension: 100% Exempt
    const publicPensionExemption = inputs.income.pensionPublic * config.exemptions.publicPension;

    // 3. Military Pension: 100% Exempt
    const militaryPensionExemption = inputs.income.pensionMilitary * config.exemptions.militaryPension;

    // 4. Private Pension: Deduct up to $6,000 (subject to income phase-outs)
    // Phase out logic: "Single $85,000, MFJ $100,000". 
    // Usually means if AGI > Limit, you lose the deduction? Or it phases out?
    // Prompt says: "Deduct up to $6,000 (subject to income phase-outs)."
    // Standard MO rule: If AGI > Limit, deduction is reduced dollar-for-dollar? Or completely lost?
    // MO Form MO-A: "If your MO Adjusted Gross Income is greater than $85,000 (Single)... you are not eligible."
    // It's a cliff in some years, or phase out.
    // Let's assume cliff for simplicity unless specified. 
    // Actually, let's check the config I wrote. I put a single number.
    // Let's assume if Federal AGI > Limit, exemption = 0.

    let privatePensionExemption = 0;
    const phaseOutLimit = config.exemptions.privatePensionPhaseOut[inputs.filingStatus];

    if (federalAGI <= phaseOutLimit) {
        privatePensionExemption = Math.min(inputs.income.pensionPrivate, config.exemptions.privatePensionCap);
    }

    const totalSubtractions = ssExemption + publicPensionExemption + militaryPensionExemption + privatePensionExemption;

    const missouriAGI = Math.max(0, federalAGI - totalSubtractions);

    // Standard Deduction
    // MO uses Federal Standard Deduction usually, or similar.
    // Config has specific values.
    const standardDeduction = config.standardDeduction[inputs.filingStatus];

    const taxableIncome = Math.max(0, missouriAGI - standardDeduction);

    // Calculate Tax
    let tax = 0;
    let remainingIncome = taxableIncome;
    let previousMax = 0;

    for (const bracket of config.brackets) {
        if (remainingIncome <= 0) break;

        const min = bracket.min;
        const max = bracket.max === null ? Infinity : bracket.max;
        const range = max - (min > 0 ? min - 1 : 0); // Size of bracket

        // Income in this bracket
        // Since brackets are cumulative (0-100, 101-1088...), we can just fill them.
        // Actually, my logic in Federal was slightly complex.
        // Simple progressive tax:
        // Amount in bracket = Min(Taxable, Max) - (Min - 1).
        // But we must subtract what we already taxed.

        // Let's use the "previousMax" approach.
        // Amount in this bracket = Min(Taxable, Max) - PreviousMax.

        const effectiveMax = Math.min(taxableIncome, max);
        const amountInBracket = Math.max(0, effectiveMax - (min > 0 ? min - 1 : 0));

        // Wait, if Taxable is 5000.
        // Bracket 1 (0-100): Min(5000, 100) - 0 = 100. Correct.
        // Bracket 2 (101-1088): Min(5000, 1088) - 100 = 988. Correct.

        // But we need to ensure we don't double count.
        // The "Min - 1" is effectively the top of the previous bracket.

        if (amountInBracket > 0) {
            // We need to be careful. 
            // If we use the logic: amount = Min(Taxable, Max) - (Min - 1)
            // For bracket 2: Min(5000, 1088) - 100 = 988.
            // For bracket 3: Min(5000, 2176) - 1088 = 1088.
            // This works because the brackets are contiguous.

            tax += amountInBracket * bracket.rate;
        }
    }

    return {
        federalAGI,
        subtractions: {
            socialSecurity: ssExemption,
            publicPension: publicPensionExemption,
            militaryPension: militaryPensionExemption,
            privatePension: privatePensionExemption,
            totalSubtractions
        },
        missouriAGI,
        standardDeduction,
        taxableIncome,
        totalStateTax: tax
    };
};
