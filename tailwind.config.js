/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}", // Add any other folder paths as needed
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        Montserrat: ["Montserrat", "sans-serif"],
        MontserratBold: ["Montserrat-Bold", "sans-serif"],
        MontserratExtraBold: ["Montserrat-ExtraBold", "sans-serif"],
        MontserratExtraLight: ["Montserrat-ExtraLight", "sans-serif"],
        MontserratLight: ["Montserrat-Light", "sans-serif"],
        MontserratMedium: ["Montserrat-Medium", "sans-serif"],
        MontserratSemiBold: ["Montserrat-SemiBold", "sans-serif"],
      },
      colors: {
        bg: "#0E0E0E",
        blue: "#0EA8F5",
        purple: "#692EF8",
        orange: "#FFBD55",
        darkOrange: "#FF7009",
        text: "#FFFFFF",
      }
    },
  },
  plugins: [],
}