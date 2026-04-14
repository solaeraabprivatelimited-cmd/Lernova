module.exports = {
  extends: "react-app",
  rules: {
    // Inline styles are necessary for:
    // - Dynamic animation delays (animationDelay: '150ms')
    // - Dynamic font families (fontFamily: "'DM Serif Display'")
    // - Computed/dynamic colors and spacing
    "react/style-prop-object": "off",
  },
  overrides: [
    {
      files: ["src/**/*.tsx", "src/**/*.jsx"],
      rules: {
        // Disable warn for inline styles as they're needed for dynamic values
      },
    },
  ],
};
