import React from 'react';
import { ArrowLeft, Plus, Search, Mic, Send, Image as ImageIcon, FileText, X } from 'lucide-react';
import imgElephant from "figma:asset/4e16ad2540e61a1b7fc5e392f14ede2bc142f362.png";

interface AiMentorChatProps {
  onBack: () => void;
  onVoiceMode: () => void;
}

type Attachment = {
  type: 'image' | 'file';
  content: string; // URL for image, filename for file
};

export function AiMentorChat({ onBack, onVoiceMode }: AiMentorChatProps) {
  const [showAttachMenu, setShowAttachMenu] = React.useState(false);
  const [attachment, setAttachment] = React.useState<Attachment | null>(null);
  const [inputText, setInputText] = React.useState("");

  const handleAttachImage = () => {
    setAttachment({ type: 'image', content: imgElephant });
    setInputText("What animal is this?"); 
    setShowAttachMenu(false);
  };

  const handleAttachFile = () => {
    setAttachment({ type: 'file', content: "Animal.pdf" });
    setInputText("What animal is this?");
    setShowAttachMenu(false);
  };

  const clearAttachment = () => {
    setAttachment(null);
    setInputText("");
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] w-full bg-white font-['Poppins'] overflow-hidden" onClick={() => setShowAttachMenu(false)}>
      {/* Left Sidebar Panel */}
      <div className="w-[280px] shrink-0 border-r border-gray-100 bg-white flex flex-col p-6 h-full z-10 relative shadow-[0px_4px_18px_-1px_rgba(0,0,0,0.1)] md:shadow-none hidden md:flex" onClick={(e) => e.stopPropagation()}>
        
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

      {/* Main Chat Area */}
      <div className="flex-1 relative bg-[#FAFAFA]/50 flex flex-col h-full">
        
        {/* Mobile Back Button */}
        <div className="md:hidden p-4 absolute top-0 left-0 z-20 bg-white/80 backdrop-blur w-full border-b border-gray-100">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-black/60 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[12px] font-medium">Back</span>
          </button>
        </div>

        {/* Scrollable Chat History */}
        <div className="flex-1 overflow-y-auto p-8 pt-16 md:pt-8 pb-[250px] scroll-smooth" onClick={() => setShowAttachMenu(false)}>
           <div className="max-w-4xl mx-auto flex flex-col gap-6">
              
              {/* Message 1 - User */}
              <div className="flex justify-end">
                 <div className="bg-[#c9e5ff] rounded-[12px] p-4 shadow-[0px_4px_60px_5px_rgba(0,0,0,0.05)] max-w-[80%] md:max-w-[60%]">
                    <p className="text-[16px] text-black leading-normal font-['Poppins']">Hello there</p>
                 </div>
              </div>

              {/* Message 2 - AI */}
              <div className="flex justify-start">
                 <div className="bg-white rounded-[12px] p-4 shadow-[0px_4px_60px_5px_rgba(0,0,0,0.05)] max-w-[80%] md:max-w-[60%]">
                    <p className="text-[16px] text-black leading-normal font-['Poppins']">Hello there! How may I assist you today?</p>
                 </div>
              </div>

              {/* Message 3 - User */}
              <div className="flex justify-end">
                 <div className="bg-[#c9e5ff] rounded-[12px] p-4 shadow-[0px_4px_60px_5px_rgba(0,0,0,0.05)] max-w-[80%] md:max-w-[60%]">
                    <p className="text-[16px] text-black leading-normal font-['Poppins']">What is amoeba?</p>
                 </div>
              </div>

              {/* Message 4 - AI */}
              <div className="flex justify-start w-full">
                 <div className="bg-white rounded-[12px] p-4 shadow-[0px_4px_60px_5px_rgba(0,0,0,0.05)] max-w-[80%] md:max-w-[60%]">
                    <p className="text-[16px] text-black leading-[21px] font-['Poppins']">
                      An amoeba is a single-celled organism that can change shape. It's a type of protozoan, typically found in water or soil. Amoebas move and feed by extending parts of their cell membrane called pseudopodia, which means "false feet." They are often studied in biology because of their simple structure and unique movement. Some amoebas can cause diseases, like Acanthamoeba and Entamoeba histolytica.
                    </p>
                 </div>
              </div>
              
              <div className="h-1"></div>
           </div>
        </div>

        {/* Input Area (Bottom Floating) */}
        <div className="absolute bottom-10 left-0 right-0 px-8 flex justify-center z-10 pointer-events-none">
           <div className="w-full max-w-[1098px] flex items-end gap-4 pointer-events-auto relative">
              
              {/* Attachment Menu Popup */}
              {showAttachMenu && (
                <div 
                  className="absolute bottom-[80px] left-0 bg-[rgba(255,255,255,0.9)] backdrop-blur-md rounded-[12px] p-2 shadow-[0px_4px_60px_5px_rgba(0,0,0,0.15)] flex flex-col gap-1 min-w-[160px] animate-in fade-in slide-in-from-bottom-2 duration-200 z-30 border border-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    onClick={handleAttachImage}
                    className="flex items-center gap-3 text-black hover:bg-gray-100 p-2 rounded-lg transition-colors text-left w-full"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#003566]">
                        <ImageIcon className="w-4 h-4" />
                    </div>
                    <span className="text-[14px] font-['Poppins']">Images</span>
                  </button>
                  <button 
                    onClick={handleAttachFile}
                    className="flex items-center gap-3 text-black hover:bg-gray-100 p-2 rounded-lg transition-colors text-left w-full"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#003566]">
                        <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-[14px] font-['Poppins']">Documents</span>
                  </button>
                </div>
              )}

              {/* Input Box Container */}
              <div className={`flex-1 bg-white rounded-[12px] shadow-[0px_4px_60px_5px_rgba(0,0,0,0.15)] flex flex-col px-4 border border-gray-100 z-20 transition-all duration-300 ${attachment ? 'py-[10px] gap-6' : 'h-[54px] justify-center'}`}>
                 
                 {/* Attachment Preview */}
                 {attachment && (
                    <div className="shrink-0 animate-in fade-in slide-in-from-bottom-1 duration-200">
                      {attachment.type === 'image' ? (
                        <div className="relative w-[112px] h-[113px] rounded-[20px] overflow-hidden group">
                           <img src={attachment.content} alt="Attachment" className="w-full h-full object-cover" />
                           <button 
                             onClick={clearAttachment}
                             className="absolute top-2 right-2 bg-white/90 p-1 rounded-full shadow-sm hover:bg-white transition-colors"
                           >
                              <X className="w-3 h-3 text-black" />
                           </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-[166px] bg-black/5 rounded-[20px] p-4 relative group">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <FileText className="w-4 h-5 text-black shrink-0" />
                                <span className="text-[14px] text-black font-['Poppins'] truncate">{attachment.content}</span>
                            </div>
                            <button 
                             onClick={clearAttachment}
                             className="text-black/60 hover:text-black transition-colors"
                           >
                              <X className="w-4 h-4" />
                           </button>
                        </div>
                      )}
                    </div>
                 )}

                 {/* Input Row */}
                 <div className="flex items-center gap-2 w-full">
                     <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAttachMenu(!showAttachMenu);
                        }}
                        className={`p-2 hover:bg-gray-100 rounded-full text-black/60 transition-transform duration-200 ${showAttachMenu ? 'rotate-45' : ''}`}
                     >
                        <Plus className="w-5 h-5" />
                     </button>
                     <input 
                        type="text" 
                        placeholder="Type here"
                        className="flex-1 bg-transparent border-none outline-none text-[16px] placeholder:text-black/40 font-medium font-['Poppins']"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                     />
                     <button 
                        onClick={onVoiceMode}
                        className="p-2 hover:bg-gray-100 rounded-full text-[#003566]"
                     >
                        <Mic className="w-5 h-5 fill-current" />
                     </button>
                 </div>
              </div>

              {/* Send Button - Aligned to bottom */}
              <button className="w-[54px] h-[54px] bg-[#003566] rounded-full flex items-center justify-center shadow-lg hover:bg-[#00284d] transition-colors shrink-0 z-20 mb-0">
                 <Send className="w-6 h-6 text-white ml-1" />
              </button>

           </div>
        </div>

        {/* Scrollbar Thumb */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-[6px] h-[358px] bg-black/5 rounded-full hidden lg:block pointer-events-none">
            <div className="w-full h-[57px] bg-[#003566] rounded-full absolute top-[100px]"></div>
        </div>

      </div>
    </div>
  );
}
