import React from 'react';
import { ImageWithFallback } from "./figma/ImageWithFallback";
import imgImage22 from "figma:asset/0e9be4322071079db03af57bb0f8639a28cb33b8.png";
import imgImage21 from "figma:asset/ea1b48400101ed37bbd08ba927f38f0586b2ad63.png";

interface MentorSupportProps {
  onStartAiMentor?: () => void;
  onStartHumanMentor?: () => void;
}

export function MentorSupport({ onStartAiMentor, onStartHumanMentor }: MentorSupportProps) {
  return (
    <div className="w-full h-full animate-in fade-in zoom-in-95 duration-300">
      {/* Header Section */}
      <div className="mb-8 md:mb-10">
        <h1 className="text-[28px] md:text-[32px] lg:text-[40px] font-['Poppins'] font-medium text-black mb-1">
          Mentor Support
        </h1>
        <p className="text-[14px] text-black/60 font-['Poppins']">
          Get personalized guidance from mentors and AI support.
        </p>
      </div>

      {/* Cards Container */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full">
        
        {/* AI Mentor Card */}
        <div className="flex-1 bg-[#4c5da3] rounded-[20px] overflow-hidden relative min-h-[500px] md:min-h-[655px] shadow-sm hover:shadow-md transition-shadow">
          
          {/* Image Area */}
          <div className="absolute top-0 left-0 w-full h-[60%] md:h-[70%] overflow-hidden">
             <div className="w-full h-full relative">
                <ImageWithFallback 
                    src={imgImage22} 
                    alt="AI Mentor" 
                    className="w-full h-full object-cover object-top md:object-center"
                />
             </div>
          </div>

          {/* Content Area */}
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 text-white z-10 flex flex-col gap-4 bg-gradient-to-t from-[#4c5da3] via-[#4c5da3] to-transparent pt-20">
             <div>
                <h3 className="font-['Poppins'] font-semibold text-[20px] md:text-[24px] mb-2">AI Mentor</h3>
                <p className="font-['Poppins'] text-[12px] md:text-[14px] opacity-90 mb-4">
                  Get instant answers, explanations, and study help from our AI-powered mentor.
                </p>
                
                <ul className="list-disc pl-5 space-y-1 font-['Poppins'] text-[12px] md:text-[13px] opacity-90 mb-6">
                    <li>Chat interface for Q&A</li>
                    <li>Upload files or notes for context</li>
                    <li>Quick concept summaries</li>
                </ul>
             </div>

             <button 
                onClick={onStartAiMentor}
                className="bg-white text-[#5666b1] font-['Poppins'] font-medium text-[14px] py-3 px-6 rounded-[20px] w-fit hover:bg-gray-100 transition-colors"
             >
                Chat with AI Mentor
             </button>
          </div>
        </div>

        {/* Human Mentor Card */}
        <div className="flex-1 bg-[#fae0c1] rounded-[20px] overflow-hidden relative min-h-[500px] md:min-h-[655px] shadow-sm hover:shadow-md transition-shadow">
           
           {/* Image Area */}
           <div className="absolute top-10 left-0 w-full h-[50%] md:h-[60%] overflow-hidden flex justify-center">
              <div className="w-[90%] h-full relative">
                <ImageWithFallback 
                    src={imgImage21} 
                    alt="Human Mentor" 
                    className="w-full h-full object-contain object-top"
                />
              </div>
           </div>

           {/* Content Area */}
           <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 text-[#333e6c] z-10 flex flex-col gap-4 bg-gradient-to-t from-[#fae0c1] via-[#fae0c1] to-transparent pt-20">
             <div>
                <h3 className="font-['Poppins'] font-semibold text-[20px] md:text-[24px] mb-2">Human Mentor</h3>
                <p className="font-['Poppins'] text-[12px] md:text-[14px] opacity-90 mb-4">
                  Connect with verified mentors for personalized guidance, sessions, and progress feedback.
                </p>
                
                <ul className="list-disc pl-5 space-y-1 font-['Poppins'] text-[12px] md:text-[13px] opacity-90 mb-6">
                    <li>Search by subject or exam type</li>
                    <li>View mentor profiles and ratings</li>
                    <li>Book 1:1 or group sessions</li>
                </ul>
             </div>

             <button 
                onClick={onStartHumanMentor}
                className="bg-white text-[#e98e5a] font-['Poppins'] font-medium text-[14px] py-3 px-6 rounded-[20px] w-fit hover:bg-gray-100 transition-colors shadow-sm"
             >
                Find a Mentor
             </button>
           </div>
        </div>

      </div>
    </div>
  );
}
