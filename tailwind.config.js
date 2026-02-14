/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./app/components/**/*.{js,vue,ts}",
        "./app/layouts/**/*.vue",
        "./app/pages/**/*.vue",
        "./app/plugins/**/*.{js,ts}",
        "./app/app.vue",
        "./app/error.vue",
    ],
    theme: {
        extend: {
            colors: {
                bg: 'var(--color-bg)',
                surface: 'var(--color-surface)',
                text: 'var(--color-text)',
                'text-muted': 'var(--color-text-muted)',
                accent: 'var(--color-accent)',
                'accent-warm': 'var(--color-accent-warm)',
            },
            fontFamily: {
                serif: 'var(--font-serif)',
                sans: 'var(--font-sans)',
            },
            animation: {
                'fade-in': 'fadeIn 2s ease-in-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
