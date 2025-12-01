/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Light Mode
                light: {
                    bg: '#F5F5F5', // Light gray background
                    surface: '#FFFFFF', // White surface
                    text: '#171717', // Almost black text
                    border: '#E5E7EB', // Light border
                },
                // Dark Mode
                dark: {
                    bg: '#121212', // Dark graphite background
                    surface: '#1E1E1E', // Darker surface
                    text: '#FFFFFF', // White text
                    border: '#333333', // Dark border
                },
                // Accents
                primary: '#2563EB', // Adobe Blue-ish
                'primary-hover': '#1D4ED8',
                accent: '#60A5FA', // Ice Blue
            }
        },
    },
    plugins: [],
}
