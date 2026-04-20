/**
 * ════════════════════════════════════════════════════════════════════════════════
 * APP LAYOUT - Root Layout Component
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * This is the main layout that wraps the entire application.
 * It ensures:
 * - No overlapping elements
 * - Proper z-index stacking
 * - Consistent spacing
 * - Dark mode applied globally
 * - Responsive on all screen sizes
 * 
 * EVERY page must use this layout via AppLayout.
 */

import React, { ReactNode, useState, useEffect } from 'react';
import { DESIGN_SYSTEM, LAYOUT, Z_CLASSES, DARK_MODE_RULES } from '@/app/lib/design-system';
import { useTheme } from '@/app/hooks/useTheme';
import { useAuth } from '@/app/hooks/useAuth';

interface AppLayoutProps {
  children: ReactNode;
  sidebar?: boolean;
  headerTitle?: string;
}

/**
 * HEADER COMPONENT - Fixed at top, z-index 40
 */
const Header: React.FC<{ isDark: boolean; title?: string }> = ({ isDark, title }) => {
  return (
    <header
      className={`
        fixed top-0 left-0 right-0
        ${Z_CLASSES.header}
        ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}
        border-b transition-colors duration-200
      `}
    >
      <div className={LAYOUT.container}>
        <div className="h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold">
            <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>Lernova</span>
          </div>

          {/* Title (centered) */}
          {title && (
            <div className="flex-1 text-center">
              <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {title}
              </h1>
            </div>
          )}

          {/* Actions (user menu, settings) */}
          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <button
              className={`
                p-2 rounded-lg transition-colors
                ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}
              `}
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* User menu placeholder */}
            <div className={`w-8 h-8 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
          </div>
        </div>
      </div>
    </header>
  );
};

/**
 * SIDEBAR COMPONENT - Fixed left, z-index 30
 */
const Sidebar: React.FC<{ isDark: boolean; isOpen: boolean }> = ({ isDark, isOpen }) => {
  const { user } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Study Rooms', path: '/rooms', icon: '📚' },
    { label: 'AI Mentor', path: '/mentor', icon: '🤖' },
    { label: 'Community', path: '/community', icon: '👥' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className={`
            fixed inset-0 top-16
            ${Z_CLASSES.sidebar}
            ${isDark ? 'bg-black/50' : 'bg-black/30'}
            md:hidden transition-opacity
          `}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-16
          w-64 h-screen
          ${Z_CLASSES.sidebar}
          ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}
          border-r
          transition-transform duration-200
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          md:translate-x-0
          overflow-y-auto
        `}
      >
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition-colors duration-200
                ${isDark
                  ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* User info at bottom */}
        {user && (
          <div
            className={`
              absolute bottom-0 left-0 right-0 p-4
              border-t
              ${isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-100'}
            `}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}
              />
              <div>
                <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {user.email}
                </div>
                <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {user.role}
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

/**
 * MAIN CONTENT AREA - Scrollable, below header, beside sidebar
 */
const MainContent: React.FC<{ children: ReactNode; isDark: boolean; hasSidebar: boolean }> = ({
  children,
  isDark,
  hasSidebar,
}) => {
  return (
    <main
      className={`
        ${hasSidebar ? 'ml-64' : ''}
        mt-16 sm:mt-20
        min-h-screen
        ${isDark ? 'bg-slate-950' : 'bg-white'}
        transition-colors duration-200
      `}
    >
      <div className={LAYOUT.container}>
        <div className="py-8">
          {children}
        </div>
      </div>
    </main>
  );
};

/**
 * ROOT APP LAYOUT - Enforces proper structure and prevents overlaps
 */
export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  sidebar = true,
  headerTitle,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on navigation
  useEffect(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div
      className={`
        min-h-screen
        ${isDark ? 'bg-slate-950' : 'bg-white'}
        transition-colors duration-200
      `}
    >
      {/* HEADER - Fixed at top, z-40 */}
      <Header isDark={isDark} title={headerTitle} />

      {/* SIDEBAR - Fixed left, z-30 (below modals but above content) */}
      {sidebar && <Sidebar isDark={isDark} isOpen={sidebarOpen} />}

      {/* MAIN CONTENT - Below header, proper margin */}
      <MainContent hasSidebar={sidebar} isDark={isDark}>
        {children}
      </MainContent>

      {/* Mobile menu button (shows/hides sidebar) */}
      {sidebar && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`
            fixed bottom-6 right-6
            md:hidden
            w-14 h-14
            rounded-full
            ${Z_CLASSES.notification}
            ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}
            text-white
            font-bold text-xl
            shadow-lg
            transition-all duration-200
          `}
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
      )}

      {/* Global styles - applied to entire app */}
      <style>{`
        * {
          --color-primary: ${isDark ? DESIGN_SYSTEM.COLORS.primary.dark : DESIGN_SYSTEM.COLORS.primary.light};
          --color-bg: ${isDark ? DESIGN_SYSTEM.COLORS.background.dark : DESIGN_SYSTEM.COLORS.background.light};
          --color-surface: ${isDark ? DESIGN_SYSTEM.COLORS.surface.dark : DESIGN_SYSTEM.COLORS.surface.light};
          --color-text: ${isDark ? DESIGN_SYSTEM.COLORS.textPrimary.dark : DESIGN_SYSTEM.COLORS.textPrimary.light};
          --color-text-secondary: ${isDark ? DESIGN_SYSTEM.COLORS.textSecondary.dark : DESIGN_SYSTEM.COLORS.textSecondary.light};
          --color-border: ${isDark ? DESIGN_SYSTEM.COLORS.border.dark : DESIGN_SYSTEM.COLORS.border.light};
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Global font */
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          letter-spacing: -0.01em;
        }
        
        /* Selection color */
        ::selection {
          background-color: var(--color-primary);
          color: white;
        }
      `}</style>
    </div>
  );
};

/**
 * PAGE WRAPPER - Use this for all pages
 */
export const PageWrapper: React.FC<{
  children: ReactNode;
  title?: string;
  sidebar?: boolean;
}> = ({ children, title, sidebar = true }) => {
  return <AppLayout headerTitle={title} sidebar={sidebar}>{children}</AppLayout>;
};

export default AppLayout;
