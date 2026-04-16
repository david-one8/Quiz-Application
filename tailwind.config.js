/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0f766e",
          foreground: "#ffffff"
        },
        bg: {
          light: "#f8fafc",
          dark: "#0b1220"
        },
        surface: {
          light: "#ffffff",
          dark: "#111827"
        },
        muted: {
          light: "#64748b",
          dark: "#94a3b8"
        },
        border: {
          light: "#e2e8f0",
          dark: "#1f2937"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(2, 8, 23, 0.08)",
        card: "0 12px 40px rgba(15, 23, 42, 0.10)"
      },
      borderRadius: {
        xl2: "1.25rem"
      },
      backgroundImage: {
        gridLight:
          "radial-gradient(circle at top, rgba(15,118,110,0.08), transparent 35%)",
        gridDark:
          "radial-gradient(circle at top, rgba(45,212,191,0.12), transparent 35%)"
      }
    }
  },
  plugins: []
};