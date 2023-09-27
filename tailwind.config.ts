import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        martian: ["Martian Mono", "system-ui", "sans-serif"],
      },
      colors: {
        "ag-400": "#68686e",
        "ag-500": "#222628",
        "ag-600": "#181d1f",
        "ag-700": "#121719",
      },
    },
  },
  plugins: [],
} satisfies Config;
