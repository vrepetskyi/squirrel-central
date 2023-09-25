import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        martian: ["Martian Mono", "system-ui", "sans-serif"],
      },
      colors: {
        "ag-header": "#222628",
        "ag-border": "#68686e",
        "ag-background": "#181d1f",
      },
    },
  },
  plugins: [],
} satisfies Config;
