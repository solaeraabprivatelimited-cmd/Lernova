import React from 'react';
import { Button } from "./ui/button";
import { Link } from 'lucide-react';

export function Navbar({ onLogin }: { onLogin?: () => void }) {
  return (
    <nav className="w-full flex items-center justify-between px-4 md:px-20 py-6 bg-transparent relative z-10 max-w-[1440px] mx-auto">
      <div className="flex items-center gap-2">
        <h1 className="font-['Righteous'] text-[#003566] text-2xl">Learnova</h1>
        <div className="relative w-8 h-8 bg-[#003566] rounded-full flex items-center justify-center">
             <svg className="w-5 h-5 text-[#F77F00]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
             </svg>
        </div>
      </div>
      
      <div className="hidden md:flex items-center gap-10 font-['Poppins'] text-base text-black">
        <a href="#study-rooms" className="hover:text-[#0967bd] transition-colors">Study Rooms</a>
        <a href="#mentor-support" className="hover:text-[#0967bd] transition-colors">Mentor Support</a>
        <a href="#testimonials" className="hover:text-[#0967bd] transition-colors">Testimonials</a>
      </div>

      <Button onClick={onLogin} className="bg-[#003566] hover:bg-[#00284d] text-white rounded-[20px] px-8 py-2 h-[42px] font-['Poppins'] font-medium">
        Login
      </Button>
    </nav>
  );
}
