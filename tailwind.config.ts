import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        martian: ["Martian Mono", "system-ui", "sans-serif"],
      },
      colors: {
        "ag-200": "#c2c2c5",
        "ag-300": "#9c9ca0",
        "ag-400": "#68686e",
        "ag-500": "#222628",
        "ag-600": "#181d1f",
        "ag-700": "#121719",
      },
    },
  },
  plugins: [],
} satisfies Config;
