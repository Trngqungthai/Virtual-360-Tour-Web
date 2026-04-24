import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563EB",
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A"
        }
      },
      boxShadow: {
        soft: "0 24px 80px -36px rgba(15, 23, 42, 0.32)"
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top left, rgba(37,99,235,0.22), transparent 35%), radial-gradient(circle at right, rgba(14,165,233,0.14), transparent 25%)"
      }
    }
  },
  plugins: []
};

export default config;
