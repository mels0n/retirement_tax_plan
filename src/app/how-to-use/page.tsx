import { HowToUse } from '@/features/documentation/ui/HowToUse';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "How to Use | Retirement Tax Plan",
    description: "Step-by-step guide on how to use the Retirement Tax Plan calculator to optimize your withdrawal strategy.",
};

export default function HowToUsePage() {
    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-black p-4 sm:p-8">
            <div className="max-w-[1600px] mx-auto py-12">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">User Guide</h1>
                <HowToUse />
            </div>
        </main>
    );
}
