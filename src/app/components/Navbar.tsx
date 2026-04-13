import React from 'react';
import { Button } from "./ui/button";
import { ThemeToggle } from './ThemeToggle';

export function Navbar({ onLogin }: { onLogin?: () => void }) {
  return (
    <nav
      className="w-full flex items-center justify-between px-4 md:px-20 py-5 bg-transparent relative z-10 max-w-[1440px] mx-auto"
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-2.5">
        <div className="relative w-8 h-8 bg-[#003566] dark:bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
          <svg className="w-4 h-4 text-[#F77F00]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
        <span className="font-['Righteous'] text-[#003566] dark:text-blue-400 text-xl tracking-wide">
          Elm Orbit
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8 font-['Plus_Jakarta_Sans'] text-[15px] font-medium text-foreground/80">
        <a href="#study-rooms" className="hover:text-[#0967bd] dark:hover:text-blue-400 transition-colors">Study Rooms</a>
        <a href="#mentor-support" className="hover:text-[#0967bd] dark:hover:text-blue-400 transition-colors">Mentor Support</a>
        <a href="#testimonials" className="hover:text-[#0967bd] dark:hover:text-blue-400 transition-colors">Testimonials</a>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button
          onClick={onLogin}
          className="bg-[#003566] hover:bg-[#0967bd] dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-full px-6 h-10 font-['Plus_Jakarta_Sans'] font-semibold text-sm shadow-sm transition-all active:scale-95"
        >
          Login
        </Button>
      </div>
    </nav>
  );
}
