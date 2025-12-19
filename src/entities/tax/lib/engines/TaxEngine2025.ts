import taxConfig from '../../config/tax_config_2025.json';
import { TaxInputs, FederalTaxResult } from '../../model/types';

/**
 * Calculates the Standard Deduction for 2025.
 * Includes the standard Senior Bonus.
 */
export const calculateStandardDeduction2025 = (inputs: TaxInputs): number => {
    const config = taxConfig.federal.standardDeduction;
    // @ts-ignore: Dynamic access
    let deduction = config[inputs.filingStatus];

    // @ts-ignore: Dynamic access
    const bonusAmount = config.seniorBonus[inputs.filingStatus];

    if (inputs.ageApplicant >= 65) {
        deduction += bonusAmount;
    }
    if (inputs.filingStatus === 'mfj' && inputs.ageSpouse && inputs.ageSpouse >= 65) {
        deduction += bonusAmount;
    }

    return deduction;
};

/**
 * Calculates taxable SS for 2025.
 */
export const calculateTaxableSS2025 = (inputs: TaxInputs): number => {
    const otherIncome = inputs.income.wages +
        inputs.income.pensionPublic +
        inputs.income.pensionMilitary +
        inputs.income.pensionPrivate +
        inputs.income.iraWithdrawals +
        inputs.income.stcg +
        inputs.income.ltcg;

    const totalSS = inputs.income.socialSecurity + inputs.income.socialSecurityDisability;
    const provisionalIncome = otherIncome + (0.5 * totalSS);

    let threshold1, threshold2;
    if (inputs.filingStatus === 'mfj') {
        threshold1 = 32000;
        threshold2 = 44000;
    } else {
        threshold1 = 25000;
        threshold2 = 34000;
    }

    let taxableSS = 0;
    if (provisionalIncome > threshold2) {
        const amountOver2 = provisionalIncome - threshold2;
        const amountBetween = threshold2 - threshold1;
        taxableSS = (0.85 * amountOver2) + Math.min(0.5 * amountBetween, 0.5 * totalSS);
    } else if (provisionalIncome > threshold1) {
        taxableSS = 0.5 * (provisionalIncome - threshold1);
    } else {
        taxableSS = 0;
    }

    return Math.min(taxableSS, 0.85 * totalSS);
};

/**
 * Calculates Net Investment Income Tax (NIIT) for 2025.
 * Rate: 3.8% on the lesser of:
 * 1. Net Investment Income (NII)
 * 2. MAGI - Threshold
 * 
 * Thresholds (not indexed for inflation):
 * - MFJ: $250,000
 * - MFS: $125,000
 * - Single/HOH: $200,000
 */
export const calculateNIIT2025 = (inputs: TaxInputs, adjustedGrossIncome: number): { niitTax: number; nii: number } => {
    // 1. Calculate Net Investment Income (NII)
    // NII includes: Interest, Dividends, Capital Gains (ST & LT), Rental income, etc.
    // For this model, we sum STCG and LTCG + explicit optional fields if present.
    const nii = (inputs.income.stcg || 0) +
        (inputs.income.ltcg || 0) +
        (inputs.income.dividends || 0) +
        (inputs.income.interest || 0);

    if (nii <= 0) return { niitTax: 0, nii: 0 };

    // 2. Determine Threshold based on Filing Status
    let threshold = 200000; // Default (Single, HOH)
    if (inputs.filingStatus === 'mfj') {
        threshold = 250000;
    } else if (inputs.filingStatus === 'mfs') {
        threshold = 125000;
    }

    // 3. Calculate Excess MAGI
    // For simplicity in this scope, we use AGI as proxy for MAGI (usually identical unless foreign income inclusions exist).
    const excessMagi = Math.max(0, adjustedGrossIncome - threshold);

    if (excessMagi <= 0) return { niitTax: 0, nii };

    // 4. Calculate Tax Base (Lesser of NII or Excess MAGI)
    const taxBase = Math.min(nii, excessMagi);

    return { niitTax: taxBase * 0.038, nii };
};

/**
 * Main 2025 Tax Calculation Strategy.
 */
export const calculateFederalTax2025 = (inputs: TaxInputs): FederalTaxResult => {
    const config = taxConfig.federal;
    const standardDeduction = calculateStandardDeduction2025(inputs);
    const taxableSS = calculateTaxableSS2025(inputs);

    const grossIncome = inputs.income.wages +
        inputs.income.pensionPublic +
        inputs.income.pensionMilitary +
        inputs.income.pensionPrivate +
        inputs.income.iraWithdrawals +
        inputs.income.stcg +
        inputs.income.ltcg +
        inputs.income.socialSecurity +
        inputs.income.socialSecurityDisability +
        (inputs.income.dividends || 0) +
        (inputs.income.interest || 0);

    const ordinaryIncomeSources = inputs.income.wages +
        inputs.income.pensionPublic +
        inputs.income.pensionMilitary +
        inputs.income.pensionPrivate +
        inputs.income.iraWithdrawals +
        inputs.income.stcg +
        (inputs.income.dividends || 0) +
        (inputs.income.interest || 0) +
        taxableSS;

    const adjustedGrossIncome = ordinaryIncomeSources + inputs.income.ltcg;

    let taxableOrdinaryIncome = Math.max(0, ordinaryIncomeSources - standardDeduction);
    let remainingDeduction = Math.max(0, standardDeduction - ordinaryIncomeSources);
    let taxableLTCG = Math.max(0, inputs.income.ltcg - remainingDeduction);
    const totalTaxableIncome = taxableOrdinaryIncome + taxableLTCG;

    let ordinaryTax = 0;
    let bracketsUsed: { rate: number; amount: number; tax: number }[] = [];
    // @ts-ignore
    const ordinaryBrackets = config.brackets[inputs.filingStatus];
    let previousMax = 0;

    for (const bracket of ordinaryBrackets) {
        if (previousMax >= taxableOrdinaryIncome) break;
        const min = bracket.min;
        const max = bracket.max === null ? Infinity : bracket.max;
        const incomeInBracket = Math.max(0, Math.min(taxableOrdinaryIncome, max) - (min > 0 ? min - 1 : 0));

        if (incomeInBracket > 0) {
            const tax = incomeInBracket * bracket.rate;
            ordinaryTax += tax;
            bracketsUsed.push({ rate: bracket.rate, amount: incomeInBracket, tax });
        }
    }

    let ltcgTax = 0;
    // @ts-ignore
    const ltcgBrackets = config.ltcgBrackets[inputs.filingStatus];

    for (const bracket of ltcgBrackets) {
        const min = bracket.min;
        const max = bracket.max === null ? Infinity : bracket.max;
        const incomeInBracketTotal = Math.max(0, Math.min(totalTaxableIncome, max) - (min > 0 ? min - 1 : 0));
        const incomeInBracketOrdinary = Math.max(0, Math.min(taxableOrdinaryIncome, max) - (min > 0 ? min - 1 : 0));
        const incomeInBracketLTCG = Math.max(0, incomeInBracketTotal - incomeInBracketOrdinary);

        if (incomeInBracketLTCG > 0) {
            ltcgTax += incomeInBracketLTCG * bracket.rate;
        }
    }

    // --- NIIT Calculation ---
    const { niitTax, nii } = calculateNIIT2025(inputs, adjustedGrossIncome);

    const totalFederalTax = ordinaryTax + ltcgTax + niitTax;

    return {
        grossIncome,
        taxableSS,
        adjustedGrossIncome,
        standardDeduction,
        taxableIncome: totalTaxableIncome,
        ordinaryIncomeTax: ordinaryTax,
        ltcgTax,
        niitTax,
        netInvestmentIncome: nii,
        totalFederalTax,
        effectiveTaxRate: grossIncome > 0 ? totalFederalTax / grossIncome : 0,
        brackets: bracketsUsed
    };
};
