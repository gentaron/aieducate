/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    900: '#0a0a0a',
                    800: '#171717',
                    700: '#262626',
                },
                gold: {
                    400: '#FFD700',
                    500: '#D4AF37',
                    600: '#C5A028',
                }
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['"Montserrat"', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
