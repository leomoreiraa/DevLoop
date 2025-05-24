/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#A7C7E7",        // Azul pastel
        secondary: "#B5EAD7",      // Verde pastel
        accent: "#F9D5A7",         // Laranja pastel
        dark: "#252525",           // Preto personalizado
        offwhite: "#FAFAF7",       // Branco off-white
        background: "#F7F6F3",     // Background geral
        "text-primary": "#252525", // Texto principal
        "text-secondary": "#555",  // Texto secundário
        "text-muted": "#888",      // Texto terciário
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'soft': '0 2px 8px 0 rgba(60,60,60,0.04)',
        'card': '0 4px 12px 0 rgba(60,60,60,0.06)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.2rem',
      },
    },
  },
  plugins: [],
}
