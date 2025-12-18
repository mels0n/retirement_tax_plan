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
        inputs.income.socialSecurityDisability;

    const ordinaryIncomeSources = inputs.income.wages +
        inputs.income.pensionPublic +
        inputs.income.pensionMilitary +
        inputs.income.pensionPrivate +
        inputs.income.iraWithdrawals +
        inputs.income.stcg +
        taxableSS;

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
