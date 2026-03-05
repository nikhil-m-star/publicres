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
                    50: '#f9f3e8',
                    100: '#f0e0c7',
                    200: '#e2c49a',
                    300: '#cf9d63',
                    400: '#b8793d',
                    500: '#9a5b2a',
                    600: '#7f4520',
                    700: '#64361c',
                    800: '#4a2817',
                    900: '#301b11',
                    950: '#1a0f0a',
                },
                ember: {
                    300: '#ffb067',
                    400: '#ff8f3d',
                    500: '#f06b27',
                },
                moss: {
                    300: '#b7c36a',
                    400: '#8fa14b',
                    500: '#6b7f35',
                },
                status: {
                    reported: '#ef4444',
                    'in-progress': '#f59e0b',
                    resolved: '#22c55e',
                },
            },
            fontFamily: {
                sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                wiggle: 'wiggle 0.35s ease-in-out',
                'float-slow': 'float 6s ease-in-out infinite',
                'glow-pulse': 'glowPulse 3.5s ease-in-out infinite',
                'scan': 'scan 8s linear infinite',
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
                glowPulse: {
                    '0%, 100%': { opacity: '0.35' },
                    '50%': { opacity: '0.8' },
                },
                scan: {
                    '0%': { transform: 'translateX(-30%)' },
                    '100%': { transform: 'translateX(30%)' },
                },
            },
        },
    },
    plugins: [],
}
