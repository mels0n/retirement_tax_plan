import { ControlPanel } from '../components/ControlPanel';
import { SummaryCards } from '../components/SummaryCards';
import { SSOptimization } from '../components/SSOptimization';
import { OptimizationInsights } from '../components/OptimizationInsights';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Retirement Tax Plan</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Estimate your Federal and Missouri State taxes with income stacking optimization.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ControlPanel />
            <SSOptimization />
          </div>
          <div className="lg:col-span-1 space-y-8 sticky top-8 h-fit">
            <SummaryCards />
            <OptimizationInsights />
          </div>
        </div>
      </div>
    </main>
  );
}

