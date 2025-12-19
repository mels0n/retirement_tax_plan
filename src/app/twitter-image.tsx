import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Retirement Tax Plan';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#09090b', // zinc-950
                    color: 'white',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #27272a', // zinc-800
                        borderRadius: '24px',
                        padding: '40px 80px',
                        background: '#18181b', // zinc-900
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    }}
                >
                    <div
                        style={{
                            fontSize: 64,
                            fontWeight: 800,
                            letterSpacing: '-0.025em',
                            background: 'linear-gradient(to bottom right, #ffffff, #a1a1aa)',
                            backgroundClip: 'text',
                            color: 'transparent',
                            marginBottom: 20,
                            textAlign: 'center',
                        }}
                    >
                        Retirement Tax Plan
                    </div>
                    <div
                        style={{
                            fontSize: 32,
                            fontWeight: 500,
                            color: '#a1a1aa', // zinc-400
                            textAlign: 'center',
                        }}
                    >
                        Optimize Your Withdrawal Strategy
                    </div>
                    <div
                        style={{
                            fontSize: 24,
                            marginTop: 40,
                            padding: '12px 24px',
                            backgroundColor: '#27272a',
                            borderRadius: '9999px',
                            color: '#e4e4e7',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        2025 vs 2026 Comparison
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
