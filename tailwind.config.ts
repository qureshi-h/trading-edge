import type { Config } from 'tailwindcss';

export default {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    safelist: [
        '!text-green-800',
        '!text-green-700',
        '!text-green-600',
        '!text-green-500',
        '!text-yellow-500',
        '!text-orange-500',
        '!text-red-500',
        '!text-red-600',
        '!text-red-700',
    ],

    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
            },
            height: {
                '17/20': '85%',
            },
        },
    },
    plugins: [],
} satisfies Config;
