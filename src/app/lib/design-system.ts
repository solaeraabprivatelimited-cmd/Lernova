/**
 * ════════════════════════════════════════════════════════════════════════════════
 * LERNOVA - UNIFIED DESIGN SYSTEM & ARCHITECTURE
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * This is the SINGLE SOURCE OF TRUTH for the entire application.
 * Every UI element, layout, and component must follow this system.
 * 
 * Structure:
 * 1. Typography Hierarchy (H1-H6, body, labels)
 * 2. Spacing Scale (4/8/16/24/32px)
 * 3. Color Palette (light/dark modes)
 * 4. Layout System (grid, flexbox, containers)
 * 5. Component Defaults
 * 6. Dark Mode Variables
 * 7. Z-Index Stack
 * 8. Responsive Breakpoints
 */

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 1: TYPOGRAPHY SYSTEM
// ════════════════════════════════════════════════════════════════════════════════
// 
// Hierarchy ensures readability and visual order.
// All sizes are in rem for accessibility (based on 16px base).
// 

export const TYPOGRAPHY = {
  // Headings (used once per page section)
  h1: {
    fontSize: '2.5rem',    // 40px
    lineHeight: '1.1',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    // Tailwind: text-4xl font-bold leading-tight tracking-tight
  },
  
  h2: {
    fontSize: '2rem',      // 32px
    lineHeight: '1.2',
    fontWeight: 700,
    letterSpacing: '-0.01em',
    // Tailwind: text-3xl font-bold leading-snug tracking-tight
  },
  
  h3: {
    fontSize: '1.5rem',    // 24px
    lineHeight: '1.3',
    fontWeight: 600,
    letterSpacing: '0',
    // Tailwind: text-2xl font-semibold leading-normal
  },
  
  h4: {
    fontSize: '1.25rem',   // 20px
    lineHeight: '1.4',
    fontWeight: 600,
    // Tailwind: text-xl font-semibold leading-relaxed
  },
  
  h5: {
    fontSize: '1.125rem',  // 18px
    lineHeight: '1.4',
    fontWeight: 600,
    // Tailwind: text-lg font-semibold leading-relaxed
  },
  
  h6: {
    fontSize: '1rem',      // 16px
    lineHeight: '1.5',
    fontWeight: 600,
    // Tailwind: text-base font-semibold leading-relaxed
  },

  // Body text (most of the page)
  bodyLarge: {
    fontSize: '1.125rem',  // 18px
    lineHeight: '1.6',
    fontWeight: 400,
    // Tailwind: text-lg leading-relaxed
  },

  body: {
    fontSize: '1rem',      // 16px
    lineHeight: '1.6',
    fontWeight: 400,
    // Tailwind: text-base leading-relaxed
  },

  bodySmall: {
    fontSize: '0.875rem',  // 14px
    lineHeight: '1.5',
    fontWeight: 400,
    // Tailwind: text-sm leading-relaxed
  },

  // Labels, captions, meta info
  label: {
    fontSize: '0.875rem',  // 14px
    lineHeight: '1.4',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    // Tailwind: text-sm font-medium uppercase tracking-wider
  },

  caption: {
    fontSize: '0.75rem',   // 12px
    lineHeight: '1.4',
    fontWeight: 400,
    // Tailwind: text-xs leading-relaxed
  },

  // Mono / code
  mono: {
    fontSize: '0.875rem',
    lineHeight: '1.5',
    fontWeight: 400,
    fontFamily: 'monospace',
    // Tailwind: text-sm leading-relaxed font-mono
  },
};

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 2: SPACING SCALE
// ════════════════════════════════════════════════════════════════════════════════
// 
// 8px base unit = professional, responsive design.
// Use for: padding, margin, gaps, heights, widths
// Rule: Always use scale, never arbitrary values
//

export const SPACING = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '2.5rem',  // 40px
  '3xl': '3rem',    // 48px
  '4xl': '4rem',    // 64px
};

// Common spacing combinations
export const SPACING_COMMON = {
  paddingSmall: { padding: '0.5rem 1rem' },           // 8px 16px
  paddingMedium: { padding: '1rem 1.5rem' },          // 16px 24px
  paddingLarge: { padding: '1.5rem 2rem' },           // 24px 32px
  
  marginSmall: { marginBottom: '1rem' },              // 16px
  marginMedium: { marginBottom: '1.5rem' },           // 24px
  marginLarge: { marginBottom: '2rem' },              // 32px
  
  gapSmall: { gap: '0.5rem' },                        // 8px
  gapMedium: { gap: '1rem' },                         // 16px
  gapLarge: { gap: '1.5rem' },                        // 24px
};

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 3: COLOR PALETTE
// ════════════════════════════════════════════════════════════════════════════════
// 
// Theme-aware colors. All components MUST use these, never hardcoded colors.
// Light mode = default, Dark mode = prefixed with "dark:"
//

export const COLORS = {
  // Brand colors
  primary: {
    light: '#003f87',     // Dark blue (light mode)
    dark: '#60a5fa',      // Light blue (dark mode)
  },

  // Semantic colors
  success: {
    light: '#059669',     // Green
    dark: '#10b981',
  },

  warning: {
    light: '#d97706',     // Orange
    dark: '#fbbf24',
  },

  error: {
    light: '#dc2626',     // Red
    dark: '#ef4444',
  },

  info: {
    light: '#0284c7',     // Sky blue
    dark: '#38bdf8',
  },

  // Neutral colors
  background: {
    light: '#ffffff',     // White
    dark: '#0f172a',      // Almost black (slate-950)
  },

  surface: {
    light: '#f8fafc',     // Light gray (slate-50)
    dark: '#1e293b',      // Dark gray (slate-800)
  },

  surfaceAlt: {
    light: '#f1f5f9',     // Slate-100
    dark: '#334155',      // Slate-700
  },

  textPrimary: {
    light: '#0f172a',     // Slate-950 (almost black)
    dark: '#f1f5f9',      // Slate-100
  },

  textSecondary: {
    light: '#475569',     // Slate-600
    dark: '#cbd5e1',      // Slate-300
  },

  textMuted: {
    light: '#64748b',     // Slate-500
    dark: '#94a3b8',      // Slate-400
  },

  border: {
    light: '#e2e8f0',     // Slate-200
    dark: '#334155',      // Slate-700
  },
};

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 4: LAYOUT SYSTEM
// ════════════════════════════════════════════════════════════════════════════════
// 
// Defines the page structure and prevents overlapping issues.
// Used at root level for proper layout stacking.
//

export const LAYOUT = {
  // Main page container (constrains width, centers)
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',

  // Header (fixed at top, z-40)
  header: {
    height: 'h-16 sm:h-20',
    zIndex: 'z-40',
    classes: 'fixed top-0 left-0 right-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800',
  },

  // Content area (below header with proper spacing)
  contentWrapper: {
    marginTop: 'mt-16 sm:mt-20',
    classes: 'min-h-screen bg-white dark:bg-slate-950',
  },

  // Sidebar (fixed left, z-30, proper spacing)
  sidebar: {
    width: 'w-64',
    zIndex: 'z-30',
    classes: 'fixed left-0 top-0 h-screen bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto',
  },

  // Main grid (with sidebar)
  gridWithSidebar: 'grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-6',

  // Responsive container
  responsive: {
    mobile: 'p-4',
    tablet: 'sm:p-6',
    desktop: 'lg:p-8',
  },
};

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 5: Z-INDEX STACK
// ════════════════════════════════════════════════════════════════════════════════
// 
// CRITICAL: All z-index values MUST come from this object.
// Prevents overlapping bugs by maintaining proper stacking order.
//
// Stack (low to high):
// 0 = base content
// 10 = dropdowns, tooltips
// 20 = sticky elements
// 30 = sidebars, overlays
// 40 = header, nav
// 50 = modals, dialogs
// 60 = notifications, toasts
// 70 = alerts, popups
//

export const Z_INDEX = {
  base: 0,              // Content, cards, sections
  dropdown: 10,         // Select menus, popovers
  sticky: 20,           // Sticky headers in tables
  sidebar: 30,          // Sidebar panels
  header: 40,           // Header, navbar (FIXED)
  modal: 50,            // Modals, dialogs
  notification: 60,     // Toast notifications
  alert: 70,            // Alert dialogs, critical UI
};

// Tailwind classes
export const Z_CLASSES = {
  base: 'z-0',
  dropdown: 'z-10',
  sticky: 'z-20',
  sidebar: 'z-30',
  header: 'z-40',
  modal: 'z-50',
  notification: 'z-60',
  alert: 'z-70',
};

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 6: COMPONENT DEFAULTS
// ════════════════════════════════════════════════════════════════════════════════
// 
// Default styling for all components.
// Components inherit these unless explicitly overridden.
//

export const COMPONENT_DEFAULTS = {
  button: {
    base: 'px-4 py-2.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600',
    secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-500 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600',
    ghost: 'bg-transparent text-slate-900 hover:bg-slate-100 focus:ring-slate-500 dark:text-white dark:hover:bg-slate-800',
    disabled: 'opacity-50 cursor-not-allowed',
  },

  input: {
    base: 'w-full px-4 py-2 text-base border-2 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 border-slate-300 dark:border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-colors',
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500/30',
    disabled: 'bg-slate-100 dark:bg-slate-800 opacity-50 cursor-not-allowed',
  },

  card: {
    base: 'bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow',
    light: 'bg-slate-50 dark:bg-slate-800',
  },

  modal: {
    backdrop: 'fixed inset-0 bg-black/50 z-50',
    container: 'fixed inset-0 z-50 flex items-center justify-center p-4',
    content: 'bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-md w-full',
  },

  link: {
    base: 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline transition-colors',
    nav: 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-4 py-2 rounded-lg',
  },
};

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 7: RESPONSIVE BREAKPOINTS
// ════════════════════════════════════════════════════════════════════════════════
// 
// Mobile-first design. Use min-width media queries.
// xs < sm < md < lg < xl < 2xl
//

export const BREAKPOINTS = {
  xs: '0px',      // Mobile
  sm: '640px',    // Tablet
  md: '768px',    // Small desktop
  lg: '1024px',   // Desktop
  xl: '1280px',   // Large desktop
  '2xl': '1536px', // Extra large
};

// Media query helpers
export const MEDIA = {
  mobile: '@media (max-width: 639px)',
  tablet: '@media (min-width: 640px) and (max-width: 1023px)',
  desktop: '@media (min-width: 1024px)',
};

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 8: DARK MODE
// ════════════════════════════════════════════════════════════════════════════════
// 
// All color values automatically switch based on dark: prefix
// Classes use: dark: for dark mode
// Examples:
//   - bg-white dark:bg-slate-900
//   - text-slate-900 dark:text-white
//   - border-slate-200 dark:border-slate-700
//

export const DARK_MODE_RULES = {
  // Background
  bg: 'bg-white dark:bg-slate-950',
  bgAlt: 'bg-slate-50 dark:bg-slate-900',

  // Text
  text: 'text-slate-900 dark:text-white',
  textSecondary: 'text-slate-600 dark:text-slate-300',
  textMuted: 'text-slate-500 dark:text-slate-400',

  // Borders
  border: 'border-slate-200 dark:border-slate-700',
  borderAlt: 'border-slate-300 dark:border-slate-600',

  // Surfaces
  surface: 'bg-slate-50 dark:bg-slate-900',
};

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 9: HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Get typography classes for a given level
 */
export function getTypographyClass(level: keyof typeof TYPOGRAPHY): string {
  const classes: Record<string, string> = {
    h1: 'text-4xl font-bold leading-tight tracking-tight',
    h2: 'text-3xl font-bold leading-snug tracking-tight',
    h3: 'text-2xl font-semibold leading-normal',
    h4: 'text-xl font-semibold leading-relaxed',
    h5: 'text-lg font-semibold leading-relaxed',
    h6: 'text-base font-semibold leading-relaxed',
    bodyLarge: 'text-lg leading-relaxed',
    body: 'text-base leading-relaxed',
    bodySmall: 'text-sm leading-relaxed',
    label: 'text-sm font-medium uppercase tracking-wider',
    caption: 'text-xs leading-relaxed',
    mono: 'text-sm leading-relaxed font-mono',
  };
  return classes[level] || '';
}

/**
 * Get color by theme
 */
export function getThemeColor(colorKey: string, isDark: boolean): string {
  const colors: Record<string, { light: string; dark: string }> = {
    primary: COLORS.primary,
    success: COLORS.success,
    warning: COLORS.warning,
    error: COLORS.error,
    textPrimary: COLORS.textPrimary,
    textSecondary: COLORS.textSecondary,
    background: COLORS.background,
    surface: COLORS.surface,
  };
  
  if (!colors[colorKey]) return '#000000';
  return isDark ? colors[colorKey].dark : colors[colorKey].light;
}

/**
 * Combine spacing values
 */
export function getSpacing(...keys: (keyof typeof SPACING)[]): string {
  return keys.map(key => SPACING[key]).join(' ');
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORT COMPLETE SYSTEM
// ════════════════════════════════════════════════════════════════════════════════

export const DESIGN_SYSTEM = {
  TYPOGRAPHY,
  SPACING,
  COLORS,
  LAYOUT,
  Z_INDEX,
  Z_CLASSES,
  COMPONENT_DEFAULTS,
  BREAKPOINTS,
  MEDIA,
  DARK_MODE_RULES,
};

export default DESIGN_SYSTEM;
