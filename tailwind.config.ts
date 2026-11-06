import type { Config } from "tailwindcss";
// Components expose BEM aliases; utility declarations live in globals.css.
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { ink: "#101010", panel: "#222222", line: "#CCCCCC" } } },
  plugins: [],
} satisfies Config;
