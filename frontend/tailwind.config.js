/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["poppins", "ui-sans-serif", "system-ui"],
    },
    extend: {},
  },
  plugins: [require("daisyui")],
};
