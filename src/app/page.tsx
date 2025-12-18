import { TaxYearToggle } from '@/features/tax-form/ui/TaxYearToggle';
import { PersonalDetailsForm } from '@/features/tax-form/ui/PersonalDetailsForm';
import { IncomeForm } from '@/features/tax-form/ui/IncomeForm';
import { TaxSummary } from '@/widgets/tax-summary/ui/TaxSummary';
import { SSOptimization } from '@/widgets/optimization-dashboard/ui/LazySSOptimization';
import { OptimizationInsights } from '@/widgets/optimization-dashboard/ui/OptimizationInsights';
import { AiFaq } from '@/features/documentation/ui/AiFaq';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-4 sm:p-8">
      <div className="max-w-[1600px] mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Retirement Tax Plan</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">
              Estimate your Federal taxes with income stacking optimization.
            </p>
          </div>
          <a
            href="https://financial-independence.melson.us/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors flex items-center gap-1 group"
          >
            <span>Not retired yet? Start with reaching financial independence</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </a>
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

        {/* Section 3: Documentation & Help */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8 space-y-12">
          <AiFaq />
        </div>
      </div>
    </main>
  );
}

