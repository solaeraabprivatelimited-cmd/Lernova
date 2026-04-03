import React from 'react';
import { Button } from "./ui/button";
import { ArrowRight } from 'lucide-react';
import imgFrame36 from "figma:asset/fdcac54381ce6b38d712d670e118f9aab0696587.png";
import imgFrame37 from "figma:asset/50e2bbc23961dfb1fb031d40ddc0d9f18d6f6392.png";

const modes = [
    {
        id: "01",
        title: "Focus Mode",
        desc: "Stay distraction-free with timers, note tools, and soothing background ambience."
    },
    {
        id: "02",
        title: "Silent Mode",
        desc: "Join quiet study sessions with peers for shared accountability and motivation."
    },
    {
        id: "03",
        title: "Collaborative Mode",
        desc: "Work together with your study group — share notes, ideas, and resources in real time."
    },
    {
        id: "04",
        title: "Live Mode",
        desc: "Learn together through interactive study jams or mentor-led live sessions."
    }
];

export function StudyRooms() {
  return (
    <div id="study-rooms" className="w-full bg-[#013566] py-20 px-4 md:px-20 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-[-200px] left-[-300px] w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left Content */}
        <div className="space-y-12">
            <h2 className="font-['Poppins'] text-4xl md:text-5xl font-medium text-white leading-tight max-w-lg">
                Study Rooms Designed to Help You Focus and Grow.
            </h2>
            
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                     <div className="w-[30px] h-[30px] bg-white rounded-full flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#013566" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                     </div>
                     <span className="font-['Poppins'] text-white text-lg">Verified Mentors and Trusted Platform</span>
                </div>

                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl w-fit backdrop-blur-sm">
                    <div className="flex -space-x-3">
                         <img src={imgFrame36} alt="Mentor 1" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                         <img src={imgFrame37} alt="Mentor 2" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                    </div>
                    <p className="font-['Poppins'] text-white text-sm">Guided by Experienced Mentors</p>
                </div>

                 <Button className="bg-white hover:bg-gray-100 text-[#013566] rounded-[20px] px-6 py-2 h-[42px] font-['Poppins'] font-medium gap-2">
                    Join Study Room <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>

        {/* Right Grid (Modes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 pt-8 md:pt-0">
            {modes.map((mode, index) => (
                <div key={mode.id} className={`flex gap-4 group ${index % 2 !== 0 ? 'md:mt-12' : ''}`}>
                     <span className="font-['Poppins'] text-6xl text-white/20 font-light select-none group-hover:text-white/40 transition-colors">
                        {mode.id}
                     </span>
                     <div className="space-y-2 pt-2">
                        <h3 className="font-['Poppins'] text-xl text-white font-medium">{mode.title}</h3>
                        <p className="font-['Poppins'] text-sm text-white/70 font-light leading-relaxed max-w-[250px]">
                            {mode.desc}
                        </p>
                        <div className="w-[80px] h-[3px] bg-white/60 rounded-full mt-2" />
                     </div>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
}
