/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                civic: {
                    50: '#f7f2e8',
                    100: '#eee3cf',
                    200: '#e0cfb2',
                    300: '#c8b08a',
                    400: '#ad9168',
                    500: '#8f744e',
                    600: '#725a3c',
                    700: '#5d4830',
                    800: '#443625',
                    900: '#2f241b',
                    950: '#1f1812',
                },
                status: {
                    reported: '#ef4444',
                    'in-progress': '#f59e0b',
                    resolved: '#22c55e',
                },
            },
            fontFamily: {
                sans: ['Work Sans', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                wiggle: 'wiggle 0.35s ease-in-out',
                'float-slow': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                wiggle: {
                    '0%, 100%': { transform: 'rotate(0deg)' },
                    '50%': { transform: 'rotate(2deg)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-6px)' },
                },
            },
        },
    },
    plugins: [],
}
