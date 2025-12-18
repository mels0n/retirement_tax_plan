import { Faq } from '@/features/documentation/ui/Faq';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Frequently Asked Questions | Retirement Tax Plan",
    description: "Common questions about the Retirement Tax Plan application, tax assumptions, and methodology.",
};

export default function FaqPage() {
    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-black p-4 sm:p-8">
            <div className="max-w-3xl mx-auto py-12">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">Frequently Asked Questions</h1>
                <Faq />
            </div>
        </main>
    );
}
