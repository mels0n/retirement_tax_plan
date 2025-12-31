export const faqData = [
    {
        question: "Why was this tool created?",
        answer: "I made this tool to help my dad (and other retired family members) visualize how various forms of income cause various levels of tax drag in retirement. The tax situation especially around things like social security is insanely complex."
    },
    {
        question: "What is the purpose of this tool?",
        answer: "To estimate federal taxes for retirees and test income stacking strategies across different tax years (2025 vs 2026)."
    },
    {
        question: "How accurate are the tax calculations?",
        answer: "The calculations are estimates based on 2025/2026 IRS tax brackets and standard deductions, including adjustments for age (65+) and blindness. While we strive for precision, this tool provides a strategic overview for planning purposes. It does not account for every complex situation (like AMT, certain business credits, or foreign tax credits)."
    },
    {
        question: "Is this professional tax advice?",
        answer: "No. This application is a self-directed educational planning tool, not a substitute for a CPA or tax attorney. It handles the most common retirement income streams (Wages, SS, Pensions, IRAs, Capital Gains). If you have complex income sources—such as ISO/NSO stock options, K-1 partnership income, rental properties with depreciation recapture, or significant foreign earnings—these are strictly outside the scope of this model. Always verify your specific plan with a qualified professional."
    },
    {
        question: "Does this tool calculate State Taxes?",
        answer: "Currently, calculations focus on Federal tax liability. State taxes vary wildly by jurisdiction (some tax SS, some don't; some tax pensions, others exclude them). Please utilize state-specific resources for that portion of your liability."
    },
    {
        question: "What is 'Income Stacking'?",
        answer: "Income stacking is the strategy of withdrawing from different account types in a specific order. Ordinary income (like 401k withdrawals or wages) fills the standard deduction and lower tax brackets first. Long-term capital gains are 'stacked' on top. This order is crucial because Capital Gains often have a 0% tax rate up to a certain total income threshold (approx. $96,700 for married couples in 2025)."
    },
    {
        question: "How is Social Security taxed?",
        answer: "The tool estimates the taxable portion of your Social Security benefits using the 'Provisional Income' formula. Depending on your total combined income, up to 85% of your benefits may be taxable. The tool automatically performs this calculation and treats the taxable portion as ordinary income."
    },
    {
        question: "What is the Net Investment Income Tax (NIIT)?",
        answer: "The NIIT is an additional 3.8% tax that applies if you have both: 1) Net Investment Income (like capital gains, dividends, and interest) and 2) Modified Adjusted Gross Income (MAGI) above certain thresholds ($200,000 for singles, $250,000 for married couples). This tool automatically checks if you trigger this surcharge and includes it in your total tax liability."
    },
    {
        question: "Why compare 2025 and 2026?",
        answer: "The Tax Cuts and Jobs Act (TCJA) provisions are set to expire at the end of 2025. This means that in 2026, tax rates may revert to higher pre-2018 levels, and the standard deduction could be nearly halved. Comparing both years helps you decide if you should accelerate income (like Roth conversions) into 2025 to lock in lower rates."
    },
    {
        question: "What is the difference between Effective and Marginal Rate?",
        answer: "Your 'Marginal Rate' is the tax percentage paid on the very last dollar you earned (your highest bracket). Your 'Effective Rate' is the actual percentage of your total income that goes to the IRS. Because of the progressive tax system and the standard deduction (which is taxed at 0%), your Effective Rate is almost always significantly lower than your Marginal Rate."
    },
    {
        question: "Is my data stored?",
        answer: "No. All calculations are performed efficiently in your browser. No personal data, income figures, or settings are ever sent to a server or stored in a database. Your financial privacy is absolute."
    }
];
