import React from 'react';
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight, MessageSquare, Star } from 'lucide-react';
import imgFrame56 from "figma:asset/5adf8cd9c4cf9fcee0abb0f1637ac1ec9de9cdcc.png";
import { Lines } from "./ui/Lines";

export function Testimonials() {
  return (
    <div id="testimonials" className="w-full bg-white py-20 px-4 md:px-20 relative">
      <Lines />
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-16 items-start">
        
        {/* Left Content */}
        <div className="flex-1 space-y-10">
             <div className="flex items-center gap-3">
                 <div className="bg-[#013566] p-2 rounded-full">
                    <MessageSquare className="w-4 h-4 text-white" />
                 </div>
                 <span className="font-['Poppins'] text-black">Students Feedback</span>
             </div>

             <h2 className="font-['Poppins'] text-4xl font-medium text-black leading-tight max-w-md">
                Trusted by dedicated learners worldwide.
             </h2>

             <p className="font-['Poppins'] text-black/70 max-w-md">
                Our mentors and tools have helped thousands of students stay consistent, confident, and focused on their goals.
             </p>

             <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8">
                 <div>
                    <h3 className="font-['Poppins'] text-6xl text-[#003566]">99%</h3>
                    <div className="w-full h-1 bg-gray-200 my-2 rounded-full relative">
                        <div className="absolute top-0 left-0 w-[99%] h-full bg-[#003566] rounded-full"></div>
                    </div>
                    <p className="font-['Poppins'] text-sm text-black/70">Learners reported visible improvement in focus and productivity.</p>
                 </div>
                 
                 <div className="space-y-6 col-span-2 flex justify-between items-start pt-4">
                     <div>
                        <h4 className="font-['Poppins'] text-2xl font-medium">10K+</h4>
                        <div className="w-10 h-1 bg-[#003566] my-1 rounded-full"></div>
                        <p className="font-['Poppins'] text-xs text-black/60">Mentor Sessions<br/>Completed</p>
                     </div>
                     <div>
                        <h4 className="font-['Poppins'] text-2xl font-medium">2M+</h4>
                        <div className="w-10 h-1 bg-[#003566] my-1 rounded-full"></div>
                        <p className="font-['Poppins'] text-xs text-black/60">Study Hours<br/>Logged</p>
                     </div>
                     <div>
                        <h4 className="font-['Poppins'] text-2xl font-medium">50+</h4>
                        <div className="w-10 h-1 bg-[#003566] my-1 rounded-full"></div>
                        <p className="font-['Poppins'] text-xs text-black/60">Countries<br/>Reached</p>
                     </div>
                 </div>
             </div>
        </div>

        {/* Right Content - Testimonial Card */}
        <div className="flex-1 w-full flex justify-center lg:justify-end relative">
             <button className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#F77F00]/60 rounded-full flex items-center justify-center text-white hover:bg-[#F77F00] transition-colors">
                <ArrowLeft className="w-5 h-5" />
             </button>
             
             <div className="bg-[#ebf3fb] rounded-[10px] p-6 md:p-8 max-w-[550px] w-full flex flex-col md:flex-row gap-6 items-center shadow-lg relative">
                 <div className="w-full md:w-[230px] h-[340px] shrink-0 rounded-[10px] overflow-hidden">
                    <img src={imgFrame56} alt="Student" className="w-full h-full object-cover" />
                 </div>
                 
                 <div className="flex-1 space-y-4">
                     <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => (
                            <Star key={i} className="w-4 h-4 fill-white text-white bg-[#003566] p-0.5 rounded-sm box-content" />
                        ))}
                     </div>
                     
                     <p className="font-['Poppins'] italic text-black/70 text-sm leading-relaxed">
                        “ Learnova completely changed the way I study. My mentor guided me through every step, and the focus sessions helped me stay on track. I’ve become more confident and disciplined in my routine. “
                     </p>
                     
                     <div>
                        <h5 className="font-['Poppins'] font-semibold text-black">Aarav Mehta</h5>
                        <p className="font-['Poppins'] text-sm text-black/70">Computer Science Student</p>
                     </div>
                 </div>
             </div>

             <button className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#F77F00] rounded-full flex items-center justify-center text-white hover:bg-[#F77F00]/80 transition-colors">
                <ArrowRight className="w-5 h-5" />
             </button>
        </div>

      </div>
    </div>
  );
}
