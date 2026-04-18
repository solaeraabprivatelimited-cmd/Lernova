/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        xs: "375px", // Extra small devices (mobile phones)
      },
      fontSize: {
        // Custom sizes for dashboard
        xs: "11px",
        xs2: "12px",
        sm2: "13px",
        base2: "14px",
        lg2: "15px",
        xl2: "20px",
        xl3: "24px",
        xl4: "28px",
        "2xl2": "36px",
        "3xl2": "40px",
        "4xl2": "48px",
        "5xl2": "56px",
        "6xl2": "72px",
      },
      opacity: {
        3: "0.03",
        4: "0.04",
        6: "0.06",
        7: "0.07",
      },
      spacing: {
        11: "44px",
        12: "48px",
      },
      borderRadius: {
        11: "11px",
        12: "12px",
        14: "14px",
        16: "16px",
        20: "20px",
        24: "24px",
      },
      width: {
        9: "36px",
        10: "40px",
        11: "44px",
        12: "48px",
        "200px": "200px",
        "300px": "300px",
      },
      height: {
        9: "36px",
        10: "40px",
        11: "44px",
        12: "48px",
        "200px": "200px",
        "300px": "300px",
      },
      minHeight: {
        240: "240px",
        280: "280px",
      },
      zIndex: {
        60: "60",
      },
      maxHeight: {
        270: "270px",
      },
      letterSpacing: {
        wider2: "0.15em",
      },
      lineHeight: {
        tight: "1.25",
        snug: "1.375",
        relaxed: "1.625",
        1.1: "1.1",
      },
    },
  },
  plugins: [],
};
