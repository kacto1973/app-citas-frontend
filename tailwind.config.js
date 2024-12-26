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
        a1: "#FAF6E3",
        a2: "#D8DBBD",
        a3: "#B59F78",
        a4: "#2A3663",
        b1: "#FBF6E9",
        b2: "#E3F0AF",
        b3: "#5DB996",
        b4: "#118B50",
        c1: "#4C585B",
        c2: "#7E99A3",
        c3: "#A5BFCC",
        c4: "#F4EDD3",
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
