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
                    50: '#eef7ff',
                    100: '#d9edff',
                    200: '#bce0ff',
                    300: '#8ecdff',
                    400: '#59b0ff',
                    500: '#338dff',
                    600: '#1a6df5',
                    700: '#1357e1',
                    800: '#1647b6',
                    900: '#183f8f',
                    950: '#142857',
                },
                status: {
                    reported: '#ef4444',
                    'in-progress': '#f59e0b',
                    resolved: '#22c55e',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
            },
        },
    },
    plugins: [],
}
