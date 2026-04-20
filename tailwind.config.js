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
        // Semantic typography scale
        // Labels & Captions
        xs: ["0.75rem", { lineHeight: "1rem" }], // 12px - Labels, small text
        sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px - Body text, descriptions
        base: ["1rem", { lineHeight: "1.5rem" }], // 16px - Body, standard text
        // Headings
        lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px - Subheadings
        xl: ["1.5rem", { lineHeight: "2rem" }], // 24px - Section headings
        "2xl": ["2rem", { lineHeight: "2.5rem" }], // 32px - Page headings
        "3xl": ["2.5rem", { lineHeight: "3rem" }], // 40px - Large titles
        "4xl": ["3rem", { lineHeight: "3.5rem" }], // 48px - Extra large headings
        // Legacy custom sizes (kept for backward compatibility during migration)
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
        0: "0",
        10: "10",
        20: "20",
        30: "30",
        40: "40",
        50: "50",
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
        auto: "auto",
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
