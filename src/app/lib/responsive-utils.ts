/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * RESPONSIVE & DARK MODE UTILITIES
 * ═══════════════════════════════════════════════════════════════════════════════
 * Centralized utility functions for mobile-first design and dark mode optimization
 * Applied across all Elm Orbit frontend pages
 */

import React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSIVE DESIGN CLASSES
// ─────────────────────────────────────────────────────────────────────────────

export const responsiveClasses = {
  // PADDING
  sectionPaddingX: "px-4 md:px-6 lg:px-8 xl:px-12", // Horizontal padding
  sectionPaddingY: "py-6 md:py-10 lg:py-14 xl:py-20", // Vertical padding
  cardPadding: "p-4 md:p-5 lg:p-6", // Card padding
  modalPadding: "p-4 md:p-6 lg:p-8", // Modal/dialog padding

  // MARGINS
  sectionMarginY: "my-4 md:my-6 lg:my-8 xl:my-10",
  itemGap: "gap-3 md:gap-4 lg:gap-5 xl:gap-6",

  // GRID LAYOUTS
  grid2Col: "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6",
  grid3Col: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8",
  grid4Col: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6",
  gridAuto: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6",

  // TEXT SIZES
  h1: "text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight",
  h2: "text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold",
  h3: "text-lg md:text-xl lg:text-2xl font-bold",
  h4: "text-base md:text-lg font-bold",
  bodyLarge: "text-base md:text-lg leading-relaxed",
  body: "text-sm md:text-base leading-relaxed",
  bodySmall: "text-xs md:text-sm",

  // CONTAINERS
  container: "w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8",
  containerSmall: "w-full max-w-4xl mx-auto px-4 md:px-6",
  containerTiny: "w-full max-w-2xl mx-auto px-4",

  // BUTTONS
  buttonBase: "px-4 py-2.5 md:px-6 md:py-3 rounded-lg font-semibold transition-all duration-300",
  buttonLarge: "px-5 md:px-7 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg",
  buttonSmall: "px-3 py-1.5 md:px-4 md:py-2 rounded-md font-medium text-xs md:text-sm",

  // INPUTS
  inputBase: "w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg text-sm md:text-base border transition-all",
  inputLarge: "w-full px-4 md:px-6 py-3 md:py-4 rounded-lg text-base md:text-lg border",
};

// ─────────────────────────────────────────────────────────────────────────────
// DARK MODE COLOR PALETTE
// ─────────────────────────────────────────────────────────────────────────────

export const darkModeColors = {
  // Primary
  bg: "bg-white dark:bg-slate-950",
  bgSecondary: "bg-slate-50 dark:bg-slate-900",
  bgTertiary: "bg-slate-100 dark:bg-slate-800",

  // Text
  textPrimary: "text-slate-950 dark:text-white",
  textSecondary: "text-slate-700 dark:text-slate-300",
  textTertiary: "text-slate-600 dark:text-slate-400",
  textMuted: "text-slate-500 dark:text-slate-500",

  // Borders
  border: "border-slate-200 dark:border-slate-700",
  borderLight: "border-slate-100 dark:border-slate-800",

  // Accent
  accentBg: "bg-blue-50 dark:bg-blue-950/30",
  accentBorder: "border-blue-200 dark:border-blue-800",
  accentText: "text-blue-600 dark:text-blue-400",

  // Status
  success: "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400",
  error: "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400",
  warning: "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400",
  info: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400",
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT CLASSES
// ─────────────────────────────────────────────────────────────────────────────

export const componentClasses = {
  // CARD
  card: `${responsiveClasses.cardPadding} rounded-lg md:rounded-xl border ${darkModeColors.border} ${darkModeColors.bg} shadow-sm hover:shadow-md transition-shadow`,

  // BUTTON PRIMARY
  buttonPrimary: `${responsiveClasses.buttonBase} bg-gradient-to-r from-[#0967bd] to-[#003566] text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed`,

  // BUTTON SECONDARY
  buttonSecondary: `${responsiveClasses.buttonBase} ${darkModeColors.border} ${darkModeColors.textPrimary} border hover:${darkModeColors.bgTertiary}`,

  // INPUT
  input: `${responsiveClasses.inputBase} ${darkModeColors.bg} ${darkModeColors.textPrimary} ${darkModeColors.border} focus:border-[#0967bd] focus:ring-2 focus:ring-[#0967bd]/20 placeholder:${darkModeColors.textMuted}`,

  // BADGE
  badge: "inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-semibold",

  // SECTION HEADER
  sectionHeader: `flex flex-col gap-2 md:gap-3 mb-6 md:mb-8 lg:mb-10`,

  // MODAL
  modal: `${responsiveClasses.modalPadding} rounded-xl md:rounded-2xl ${darkModeColors.bg} shadow-2xl max-w-full md:max-w-lg lg:max-w-2xl`,

  // PANEL
  panel: `${responsiveClasses.cardPadding} rounded-lg md:rounded-xl ${darkModeColors.bgSecondary} border ${darkModeColors.border}`,
};

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE-FIRST LAYOUT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export const layoutClasses = {
  // FLEX LAYOUTS
  flexColMobile: "flex flex-col md:flex-row",
  flexCenter: "flex items-center justify-center",
  flexBetween: "flex items-center justify-between",
  flexStart: "flex items-start justify-start",

  // STACKS
  vStackSmall: "flex flex-col gap-2",
  vStackMedium: "flex flex-col gap-3 md:gap-4",
  vStackLarge: "flex flex-col gap-4 md:gap-6",

  hStackSmall: "flex flex-row gap-2",
  hStackMedium: "flex flex-row gap-3 md:gap-4",
  hStackLarge: "flex flex-row gap-4 md:gap-6",

  // BREADCRUMBS & NAVIGATION
  breadcrumb: "flex flex-wrap gap-2 md:gap-3 items-center text-xs md:text-sm",

  // SIDEBAR LAYOUT (mobile-first with side drawer pattern)
  sidebarLayout: "grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_350px] gap-6 lg:gap-8",
};

// ─────────────────────────────────────────────────────────────────────────────
// SHADOW UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

export const shadowClasses = {
  sm: "shadow-sm dark:shadow-none",
  base: "shadow-md dark:shadow-lg dark:shadow-black/30",
  lg: "shadow-lg dark:shadow-xl dark:shadow-black/40",
  xl: "shadow-xl dark:shadow-2xl dark:shadow-black/50",
};

// ─────────────────────────────────────────────────────────────────────────────
// GRADIENT UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

export const gradientClasses = {
  primary: "bg-gradient-to-r from-[#003566] via-[#0967bd] to-[#003566]",
  secondary: "bg-gradient-to-r from-[#0967bd] to-[#f77f00]",
  subtle: "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800",
};

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSIVE HOOKS
// ─────────────────────────────────────────────────────────────────────────────

export const useResponsive = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(true);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isMobile, isTablet, isDesktop };
};

// ─────────────────────────────────────────────────────────────────────────────
// DARK MODE HOOK
// ─────────────────────────────────────────────────────────────────────────────

export const useDarkMode = () => {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);

    const observer = new MutationObserver(() => {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return { isDark };
};

// ─────────────────────────────────────────────────────────────────────────────
// COMMON COMBINATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const combos = {
  // HEADERS
  pageHeader: `${responsiveClasses.h1} ${darkModeColors.textPrimary} mb-2 md:mb-4`,
  subheader: `${responsiveClasses.bodyLarge} ${darkModeColors.textSecondary} mb-4 md:mb-6`,

  // FORMS
  formGroup: "flex flex-col gap-2 md:gap-3",
  formLabel: `text-sm md:text-base font-semibold ${darkModeColors.textPrimary}`,
  formHelper: `text-xs md:text-sm ${darkModeColors.textTertiary} mt-1`,

  // LISTINGS
  listItem: `p-3 md:p-4 rounded-lg border ${darkModeColors.border} ${darkModeColors.bg} hover:${darkModeColors.bgTertiary} transition-colors`,
  emptyState: `py-12 md:py-16 lg:py-20 text-center`,
  emptyStateIcon: "w-12 md:w-16 mx-auto mb-4 md:mb-6 opacity-50",
  emptyStateText: `${responsiveClasses.bodyLarge} ${darkModeColors.textSecondary}`,

  // ALERTS
  alertBox: `p-4 md:p-6 rounded-lg border flex items-start gap-3 md:gap-4`,
  alertIcon: "w-5 md:w-6 flex-shrink-0 mt-0.5",
  alertContent: "flex-1 min-w-0",
};

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

export const animationClasses = {
  fadeIn: "animate-in fade-in duration-300",
  slideInUp: "animate-in slide-in-from-bottom-3 duration-500",
  slideInDown: "animate-in slide-in-from-top-3 duration-500",
  slideInLeft: "animate-in slide-in-from-left-3 duration-500 md:duration-300",
  slideInRight: "animate-in slide-in-from-right-3 duration-500 md:duration-300",
  scaleIn: "animate-in zoom-in-50 duration-300",
};
