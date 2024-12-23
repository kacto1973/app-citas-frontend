/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        green: "#148527",
        red: "#dc2626",
        yellow: "#f59905",
        blue: "#2954d6",
        strblue: "#000B58",
        softblue: "#003161",
        softgreen: "#006A67",
        softyellow: "#FFF4B7",
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
