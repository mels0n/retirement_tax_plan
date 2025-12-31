import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';

import remarkGfm from 'remark-gfm';

// We are ensuring this runs at build time for static export
export async function generateStaticParams() {
    return [
        { year: '2025' },
        { year: '2026' },
        { year: '2027' },
    ];
}

export default async function DocPage({ params }: { params: Promise<{ year: string }> }) {
    const { year } = await params;

    // Read the file. For SSG/Export, we can read during build.
    // We moved them to public/docs/*.txt in the previous step.
    const filePath = path.join(process.cwd(), 'public', 'docs', `federal_tax_${year}.txt`);
    const content = fs.readFileSync(filePath, 'utf8');

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-8 flex justify-center">
            <div className="max-w-3xl w-full">
                <a href="/" className="inline-block mb-8 text-blue-600 dark:text-blue-400 hover:underline">
                    &larr; Back to Calculator
                </a>

                <article className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                </article>
            </div>
        </div>
    );
}
