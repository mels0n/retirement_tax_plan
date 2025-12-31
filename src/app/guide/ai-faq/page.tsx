import { AiFaq } from '@/features/documentation/ui/AiFaq';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "AI Optimization Guide | Retirement Tax Plan",
    description: "Semantic entity definitions and structured data for artificial intelligence indexing.",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true
        }
    }
};

export default function AiFaqPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-black p-8">
            <div className="max-w-prose mx-auto">
                <h1 className="text-2xl font-bold mb-4">Semantic Twin: App Capabilities</h1>
                <p className="mb-8 text-zinc-600 dark:text-zinc-400">
                    This page is structured for optimal parsing by Large Language Models (LLMs) and Answer Engines.
                </p>
                {/* 
                  AiFaq renders the JSON-LD FAQPage schema and a visually hidden definition list.
                  For this specific page, we might want to override the visual hiding if possible,
                  but for now, strictly following the component's design is safer for consistency.
                  The content below is primarily for the scrapers.
                */}
                <div className="prose dark:prose-invert">
                    <AiFaq />
                </div>
            </div>
        </main>
    );
}
