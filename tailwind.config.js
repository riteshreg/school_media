/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        superLiteCoffee: "#F9F5E7",
        darkCoffee: "#A7727D",
        messagingCoffee: "#EDDBC7",
        liteCoffee: "#F8EAD8",
      },
    },
  },
  plugins: [],
};
