import React from 'react';
import { ArrowLeft, Plus, Search, Mic, Send } from 'lucide-react';
import { ImageWithFallback } from "./figma/ImageWithFallback";
import imgSayHi1 from "figma:asset/5e91c4f0fbdda278a8c62c9c5428eca49ba69e08.png";

interface AiMentorHomeProps {
  onBack: () => void;
  onVoiceMode: () => void;
  onChatMode?: () => void;
}

export function AiMentorHome({ onBack, onVoiceMode, onChatMode }: AiMentorHomeProps) {
  return (
    <div className="flex h-[calc(100vh-6rem)] w-full bg-white font-['Poppins'] overflow-hidden">
      {/* Left Sidebar Panel - Hidden on mobile, same as in VoiceChat for consistency */}
      <div className="w-[280px] shrink-0 border-r border-gray-100 bg-white flex flex-col p-6 h-full z-10 relative shadow-[0px_4px_18px_-1px_rgba(0,0,0,0.1)] md:shadow-none hidden md:flex">
        
        {/* Back Link */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-black/60 hover:text-black mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[12px] font-medium">Mentor Support</span>
        </button>

        {/* Title */}
        <h2 className="text-[24px] font-medium text-[#003566] mb-8">AI Mentor</h2>

        {/* Actions */}
        <div className="flex flex-col gap-2 mb-8">
          <button 
            onClick={onChatMode}
            className="flex items-center gap-3 px-4 h-[42px] rounded-[10px] hover:bg-gray-50 text-black transition-colors border border-transparent hover:border-gray-100"
          >
            <Plus className="w-5 h-5" />
            <span className="text-[14px]">New Chat</span>
          </button>
          <button className="flex items-center gap-3 px-4 h-[42px] rounded-[10px] hover:bg-gray-50 text-black transition-colors border border-transparent hover:border-gray-100">
            <Search className="w-5 h-5" />
            <span className="text-[14px]">Search Chats</span>
          </button>
        </div>

        {/* Recent Chats Section */}
        <div className="flex-1 overflow-y-auto">
           <div className="mb-2">
              <span className="text-[14px] text-black/60 pl-4">Chats</span>
           </div>
           <div className="flex flex-col gap-1">
              <button 
                onClick={onChatMode}
                className="flex items-center px-4 h-[42px] rounded-[10px] hover:bg-[#e6f0ff] text-black transition-colors text-left"
              >
                 <span className="text-[14px]">Maths Doubt</span>
              </button>
              <button 
                onClick={onChatMode}
                className="flex items-center px-4 h-[42px] rounded-[10px] hover:bg-[#e6f0ff] text-black transition-colors text-left"
              >
                 <span className="text-[14px]">Physics</span>
              </button>
           </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 relative bg-white flex flex-col items-center justify-center p-8">
        
        {/* Mobile Back Button */}
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 md:hidden flex items-center gap-2 text-black/60 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[12px] font-medium">Back</span>
        </button>

        {/* Center Content */}
        <div className="flex flex-col items-center max-w-2xl w-full -mt-20">
           {/* Robot Image */}
           <div className="w-[300px] h-[300px] relative mb-4">
              <ImageWithFallback 
                 src={imgSayHi1} 
                 alt="AI Robot" 
                 className="w-full h-full object-contain drop-shadow-xl"
              />
           </div>

           {/* Greeting Text */}
           <div className="text-center space-y-2 mb-12">
              <h1 className="text-[32px] font-medium text-black/70 leading-tight">
                Good Morning, Jack Sparrow
              </h1>
              <h2 className="text-[32px] font-medium leading-tight">
                <span className="text-black/70">How Can I </span>
                <span className="text-[#003566]">Assist you today ?</span>
              </h2>
           </div>
        </div>

        {/* Input Area (Bottom Floating) */}
        <div className="absolute bottom-10 left-0 right-0 px-8 flex justify-center">
           <div className="w-full max-w-[900px] flex items-center gap-4">
              
              {/* Input Box */}
              <div className="flex-1 bg-white h-[54px] rounded-[12px] shadow-[0px_4px_60px_5px_rgba(0,0,0,0.15)] flex items-center px-4 border border-gray-100">
                 <button 
                    onClick={onChatMode}
                    className="p-2 hover:bg-gray-100 rounded-full text-black/60 mr-2"
                 >
                    <Plus className="w-5 h-5" />
                 </button>
                 <input 
                    type="text" 
                    placeholder="Type here"
                    className="flex-1 bg-transparent border-none outline-none text-[16px] placeholder:text-black/40 font-medium"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onChatMode?.();
                      }
                    }}
                 />
                 <button 
                    onClick={onVoiceMode}
                    className="p-2 hover:bg-gray-100 rounded-full text-[#003566]"
                 >
                    <Mic className="w-5 h-5 fill-current" />
                 </button>
              </div>

              {/* Send Button */}
              <button 
                onClick={onChatMode}
                className="w-[54px] h-[54px] bg-[#003566] rounded-full flex items-center justify-center shadow-lg hover:bg-[#00284d] transition-colors shrink-0"
              >
                 <Send className="w-6 h-6 text-white ml-1" />
              </button>

           </div>
        </div>
      </div>
    </div>
  );
}
