import { TaxYearToggle } from '@/features/tax-form/ui/TaxYearToggle';
import { PersonalDetailsForm } from '@/features/tax-form/ui/PersonalDetailsForm';
import { IncomeForm } from '@/features/tax-form/ui/IncomeForm';
import { TaxSummary } from '@/widgets/tax-summary/ui/TaxSummary';
import { SSOptimization } from '@/widgets/optimization-dashboard/ui/SSOptimization';
import { OptimizationInsights } from '@/widgets/optimization-dashboard/ui/OptimizationInsights';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-4 sm:p-8">
      <div className="max-w-[1600px] mx-auto space-y-12">
        <header>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Retirement Tax Plan</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Estimate your Federal taxes with income stacking optimization.
          </p>
        </header>

        {/* Section 1: Core Tax Estimator (4 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
          {/* Col 1: Tax Year & Personal Details */}
          <div className="space-y-6">
            <TaxYearToggle />
            <PersonalDetailsForm />
          </div>

          {/* Col 2: Income Streams */}
          <div className="space-y-6">
            <IncomeForm />
          </div>

          {/* Col 3: Tax Summary */}
          <div className="space-y-6">
            <TaxSummary />
          </div>

          {/* Col 4: Optimization Insights */}
          <div className="space-y-6">
            <OptimizationInsights />
          </div>
        </div>

        {/* Section 2: Social Security Optimization */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
          <SSOptimization />
        </div>
      </div>
    </main>
  );
}

