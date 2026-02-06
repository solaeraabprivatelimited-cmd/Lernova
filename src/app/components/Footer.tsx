import React from 'react';
import { Button } from "./ui/button";
import { ArrowRight, ThumbsUp } from 'lucide-react';
import { Lines } from "./ui/Lines";

export function Footer() {
  return (
    <footer className="relative bg-white pt-32 pb-10 border-t-[12px] border-[#F77F00] mt-20">
      <Lines />
      
      {/* Banner Overlap */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[860px] bg-[#F77F00] rounded-[20px] p-6 md:px-12 md:py-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <p className="font-['Poppins'] font-medium text-white text-lg md:text-xl text-center md:text-left">
            New learners welcome ! Start your learning journey today.
          </p>
          <Button className="bg-white hover:bg-gray-100 text-[#F77F00] rounded-[20px] px-6 py-2 h-[42px] font-['Poppins'] font-medium gap-2 shrink-0">
             <ThumbsUp className="w-4 h-4" /> Get Started
          </Button>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-20 grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
               <div className="flex items-center gap-2">
                    <h1 className="font-['Righteous'] text-[#003566] text-2xl">Learnova</h1>
                    <div className="relative w-8 h-8 bg-[#003566] rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#F77F00]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                    </div>
                </div>
                <p className="font-['Poppins'] text-[#4d4d4d] text-sm leading-relaxed">
                    Empowering learners worldwide with expert-led, interactive, and goal-driven education.
                </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
              <h3 className="font-['Poppins'] font-medium text-black">Home</h3>
              <div className="flex flex-col gap-2 font-['Poppins'] text-sm text-[#4d4d4d]">
                  <a href="#" className="hover:text-[#003566]">Study Rooms</a>
                  <a href="#" className="hover:text-[#003566]">Mentor Support</a>
                  <a href="#" className="hover:text-[#003566]">Community</a>
              </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
               <h3 className="font-['Poppins'] font-medium text-black">Need Help ?</h3>
               <div className="flex flex-col gap-2 font-['Poppins'] text-sm text-[#4d4d4d]">
                  <p>+1 234 567 8910</p>
                  <p>support@learnova.com</p>
               </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
               <h3 className="font-['Poppins'] font-medium text-black">Subscribe our newsletter</h3>
               <div className="flex bg-[#ebf3fb] rounded-[20px] p-0 overflow-hidden max-w-[300px]">
                   <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="bg-transparent px-4 py-3 text-sm outline-none text-[#4d4d4d] w-full placeholder:text-[#4d4d4d]/70"
                   />
                   <button className="bg-[#b7dbff] hover:bg-[#a0cfff] px-4 flex items-center gap-2 text-sm text-black font-['Poppins'] transition-colors">
                      Submit <ArrowRight className="w-3 h-3" />
                   </button>
               </div>
          </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-20 mt-16 pt-8 border-t border-[#ACACAC]/50 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="font-['Poppins'] text-sm text-[#4d4d4d]">© 2025, Learnova. All rights reserved.</p>
           <div className="flex gap-6 font-['Poppins'] text-sm text-[#4d4d4d]">
               <a href="#" className="hover:text-[#003566]">Disclaimer</a>
               <span className="text-[#4d4d4d]/50">|</span>
               <a href="#" className="hover:text-[#003566]">Privacy Policy</a>
               <span className="text-[#4d4d4d]/50">|</span>
               <a href="#" className="hover:text-[#003566]">Terms of Service</a>
           </div>
      </div>
    </footer>
  );
}
