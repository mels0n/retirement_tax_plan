'use client';

import dynamic from 'next/dynamic';

const SSOptimizationBase = dynamic(
    () => import('./SSOptimization').then((mod) => mod.SSOptimization),
    {
        loading: () => (
            <div className="h-[400px] animate-pulse bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
        ),
        ssr: false,
    }
);

export const SSOptimization = () => {
    return <SSOptimizationBase />;
};
