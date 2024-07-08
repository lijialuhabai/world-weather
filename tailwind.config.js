/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    // spacing: Array.from({ length: 1000 }).reduce((map, _, index) => {
    //   map[index] = `${index}px`;
    //   return map;
    // }, {}),
    important: true,
    extend: {
      colors: {
        // "bg-weather-primary": "rgb(0 102 138)",
        "weather-primary": "#00668a", //背景颜色为深蓝色
        "weather-secondary": "#004d70", //颜色为更深的蓝色
      },
      // fontSize: ({ theme }) => ({
      //   ...theme("spacing"), //将文字单位改成px
      // }),
      fontSize: {
        sm: ["14px", "20px"],
        base: ["16px", "24px"],
        lg: ["20px", "28px"],
        xl: ["24px", "32px"],
      },
      container: {
        center: true,
        // width: "4444px",
      },
    },
  },
  plugins: [],
};
