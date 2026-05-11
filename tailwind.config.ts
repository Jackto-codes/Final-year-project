import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#7c3aed",
        },
        secondary: {
          DEFAULT: "#22c55e",
        },
        navbar: {
          bg: "rgba(255,255,255,0.7)",
          border: "rgba(124,58,237,0.15)",
        },
        bg: {
          DEFAULT: "#f8f8ff",
        },
      },
    },
  },
  plugins: [],
};
export default config;
