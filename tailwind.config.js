/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs", // Adjust path to match where your EJS files are
    "./public/**/*.html", // If you have static HTML files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
