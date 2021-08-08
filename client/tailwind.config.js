// tailwind.config.js
module.exports = {
  mode: "jit",
  purge: [],
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },

  variants: {
    extend: {
      borderWidth: ["hover"],
    },
  },

  plugins: [],
};
