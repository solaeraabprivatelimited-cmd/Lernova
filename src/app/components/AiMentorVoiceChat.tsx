import React from 'react';
import { ArrowLeft, Plus, Search, Mic } from 'lucide-react';
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface AiMentorVoiceChatProps {
  onBack: () => void;
  onTextMode: () => void;
}

export function AiMentorVoiceChat({ onBack, onTextMode }: AiMentorVoiceChatProps) {
  return (
    <div className="flex h-[calc(100vh-6rem)] w-full bg-white font-['Poppins'] overflow-hidden">
      {/* Left Sidebar Panel */}
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
          <button className="flex items-center gap-3 px-4 h-[42px] rounded-[10px] hover:bg-gray-50 text-black transition-colors border border-transparent hover:border-gray-100">
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
              <button className="flex items-center px-4 h-[42px] rounded-[10px] hover:bg-[#e6f0ff] text-black transition-colors text-left">
                 <span className="text-[14px]">Maths Doubt</span>
              </button>
              <button className="flex items-center px-4 h-[42px] rounded-[10px] hover:bg-[#e6f0ff] text-black transition-colors text-left">
                 <span className="text-[14px]">Physics</span>
              </button>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative bg-[#FAFAFA]/50 flex flex-col h-full">
        
        {/* Mobile Back Button */}
        <div className="md:hidden p-4 absolute top-0 left-0 z-20">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-black/60 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[12px] font-medium">Back</span>
          </button>
        </div>

        {/* Chat Bubbles Container */}
        <div className="flex-1 w-full max-w-5xl mx-auto p-8 flex flex-col gap-6 overflow-y-auto pt-16 md:pt-8 pb-[250px]">
           
           {/* User Message */}
           <div className="flex justify-end">
              <div className="bg-[#c9e5ff] rounded-[12px] p-4 shadow-[0px_4px_60px_5px_rgba(0,0,0,0.05)] max-w-[80%] md:max-w-[60%]">
                 <p className="text-[16px] text-black leading-normal">Hello there</p>
              </div>
           </div>

           {/* AI Message */}
           <div className="flex justify-start">
              <div className="bg-white rounded-[12px] p-4 shadow-[0px_4px_60px_5px_rgba(0,0,0,0.05)] max-w-[80%] md:max-w-[60%]">
                 <p className="text-[16px] text-black leading-normal">Hello there! How may I assist you today?</p>
              </div>
           </div>

        </div>

        {/* Voice Chat Interface (Bottom Floating Card) */}
        <div className="absolute bottom-10 left-0 right-0 px-8 flex justify-center z-10">
           <div className="w-full max-w-[1098px] bg-white rounded-[12px] shadow-[0px_4px_60px_5px_rgba(0,0,0,0.15)] py-9 px-8 flex flex-col items-center gap-6 border border-gray-50">
              
              <p className="text-[24px] text-black/60 font-medium">Ask me anything</p>

              {/* Big Mic Button */}
              <button 
                onClick={onTextMode} 
                className="w-[105px] h-[105px] bg-white rounded-full shadow-[0px_4px_60px_0px_rgba(0,0,0,0.1)] flex items-center justify-center hover:scale-105 transition-transform cursor-pointer group border border-gray-50"
              >
                 <div className="text-[#003566] group-hover:text-[#00284d]">
                    <Mic className="w-[40px] h-[40px] fill-current" />
                 </div>
              </button>

           </div>
        </div>

      </div>
    </div>
  );
}
