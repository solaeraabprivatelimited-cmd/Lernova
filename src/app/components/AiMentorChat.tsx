import React from 'react';
import { ArrowLeft, Plus, Search, Mic, Send, Image as ImageIcon, FileText, X, MessageSquare, Sparkles, Clock, Bot, User, Zap, Copy, Check, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react';
import imgElephant from "figma:asset/4e16ad2540e61a1b7fc5e392f14ede2bc142f362.png";

interface AiMentorChatProps {
  onBack: () => void;
  onVoiceMode: () => void;
}

type Attachment = {
  type: 'image' | 'file';
  content: string;
};

type Message = {
  id: string;
  role: 'user' | 'ai';
  text: string;
  time: string;
  attachment?: Attachment;
};

const TypingIndicator = () => (
  <div className="flex justify-start gap-2.5">
    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1"
      style={{ background: 'linear-gradient(135deg, #0967bd, #003566)' }}>
      <Bot className="w-3.5 h-3.5 text-white" />
    </div>
    <div className="bg-white rounded-[16px] rounded-bl-[4px] px-5 py-4 shadow-sm border border-gray-100/60">
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-[#0967bd]/40 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-[#0967bd]/40 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-[#0967bd]/40 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
);

const AiMessageActions = () => {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="flex items-center gap-0.5 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        className="p-1.5 rounded-[8px] hover:bg-[#f5f7fa] text-[#c1c7ce] hover:text-[#5a7089] transition-colors cursor-pointer"
        title="Copy">
        {copied ? <Check className="w-3 h-3 text-[#22c55e]" /> : <Copy className="w-3 h-3" />}
      </button>
      <button className="p-1.5 rounded-[8px] hover:bg-[#f5f7fa] text-[#c1c7ce] hover:text-[#5a7089] transition-colors cursor-pointer" title="Good response">
        <ThumbsUp className="w-3 h-3" />
      </button>
      <button className="p-1.5 rounded-[8px] hover:bg-[#f5f7fa] text-[#c1c7ce] hover:text-[#5a7089] transition-colors cursor-pointer" title="Bad response">
        <ThumbsDown className="w-3 h-3" />
      </button>
      <button className="p-1.5 rounded-[8px] hover:bg-[#f5f7fa] text-[#c1c7ce] hover:text-[#5a7089] transition-colors cursor-pointer" title="Regenerate">
        <RotateCcw className="w-3 h-3" />
      </button>
    </div>
  );
};

export function AiMentorChat({ onBack, onVoiceMode }: AiMentorChatProps) {
  const [showAttachMenu, setShowAttachMenu] = React.useState(false);
  const [attachment, setAttachment] = React.useState<Attachment | null>(null);
  const [inputText, setInputText] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  const [messages] = React.useState<Message[]>([
    { id: '1', role: 'user', text: 'Hello there', time: '10:30 AM' },
    { id: '2', role: 'ai', text: 'Hello there! How may I assist you today? I can help you with explanations, problem-solving, summarizing notes, and much more.', time: '10:30 AM' },
    { id: '3', role: 'user', text: 'What is amoeba?', time: '10:31 AM' },
    { id: '4', role: 'ai', text: 'An **amoeba** is a single-celled organism that can change shape. It\'s a type of protozoan, typically found in water or soil.\n\nAmoebas move and feed by extending parts of their cell membrane called **pseudopodia**, which means "false feet."\n\nThey are often studied in biology because of their simple structure and unique movement. Some amoebas can cause diseases, like *Acanthamoeba* and *Entamoeba histolytica*.', time: '10:31 AM' },
  ]);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

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

  const handleSend = () => {
    if (!inputText.trim() && !attachment) return;
    setIsTyping(true);
    setInputText("");
    setAttachment(null);
    setTimeout(() => setIsTyping(false), 2000);
  };

  // Format message text with basic markdown
  const formatText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-[#003566] font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="text-[#5a7089]">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} onClick={() => setShowAttachMenu(false)}>
      {/* Left Sidebar Panel */}
      <div className="w-[280px] shrink-0 flex-col h-full z-10 relative hidden lg:flex overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #001d3d 0%, #003566 50%, #001d3d 100%)' }}
        onClick={(e) => e.stopPropagation()}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative flex flex-col h-full p-6">
          <button onClick={onBack}
            className="flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors group cursor-pointer">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[12px] font-medium">Mentor Support</span>
          </button>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-[14px] flex items-center justify-center relative"
              style={{ background: 'rgba(9,103,189,0.25)', border: '1px solid rgba(9,103,189,0.15)' }}>
              <Bot className="w-5 h-5 text-[#7cc4ff]" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#22c55e] border-2 border-[#003566]" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
                AI Mentor
              </h2>
              <span className="text-[10px] text-white/30 font-medium">Powered by Learnova AI</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 mb-6">
            <button className="flex items-center gap-3 px-4 h-[40px] rounded-[12px] text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all cursor-pointer">
              <Plus className="w-4 h-4" />
              <span className="text-[13px] font-medium">New Chat</span>
            </button>
            <button className="flex items-center gap-3 px-4 h-[40px] rounded-[12px] text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all cursor-pointer">
              <Search className="w-4 h-4" />
              <span className="text-[13px] font-medium">Search Chats</span>
            </button>
          </div>

          <div className="h-px bg-white/[0.06] mb-4" />

          <div className="flex-1 overflow-y-auto">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.18em] pl-4 mb-3">Recent</p>
            <div className="flex flex-col gap-0.5">
              <button className="flex items-center gap-3 px-4 h-[40px] rounded-[12px] bg-white/[0.1] text-white/80 transition-all text-left cursor-pointer relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-r-full bg-[#f77f00]" />
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[13px] font-semibold truncate">Maths Doubt</span>
              </button>
              <button className="flex items-center gap-3 px-4 h-[40px] rounded-[12px] hover:bg-white/[0.06] text-white/40 hover:text-white/70 transition-all text-left cursor-pointer">
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[13px] truncate">Physics</span>
              </button>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-white/[0.06]">
            <div className="px-4 py-3 rounded-[14px] border border-white/[0.06]"
              style={{ background: 'rgba(247,127,0,0.06)' }}>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-3 h-3 text-[#f77f00]" />
                <span className="text-[11px] font-bold text-[#f77f00]">Pro Tip</span>
              </div>
              <p className="text-[10px] text-white/30 leading-relaxed">
                Use the + button to attach images or files for visual Q&A!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 relative bg-[#fafbfd] flex flex-col h-full">

        {/* Top Bar */}
        <div className="sticky top-0 z-20 px-5 md:px-6 py-3 bg-white/90 backdrop-blur-xl border-b border-gray-100/80">
          <div className="flex items-center justify-between max-w-[860px] mx-auto">
            <div className="flex items-center gap-3">
              <button onClick={onBack}
                className="lg:hidden flex items-center justify-center w-8 h-8 rounded-[10px] hover:bg-[#f5f7fa] text-[#5a7089] transition-colors cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="w-9 h-9 rounded-[12px] flex items-center justify-center relative"
                style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}>
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-bold text-[#003566]">AI Mentor</h3>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-[#0967bd] bg-[#0967bd]/8 border border-[#0967bd]/10">AI</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-[5px] h-[5px] rounded-full bg-[#22c55e] animate-pulse" />
                  <span className="text-[10px] text-[#94a3b8]">Online • Always ready to help</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={onVoiceMode}
                className="flex items-center gap-2 px-3.5 py-2 rounded-[12px] text-[11px] font-bold text-[#003566] hover:bg-[#f5f7fa] transition-colors cursor-pointer border border-[#e2e8f0] hover:border-[#003566]/15">
                <Mic className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Voice Mode</span>
              </button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-5 md:px-6 py-5 pb-[170px]" onClick={() => setShowAttachMenu(false)}>
          <div className="max-w-[860px] mx-auto flex flex-col gap-5">

            {/* Welcome message */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#edf0f4] shadow-sm">
                <Sparkles className="w-3 h-3 text-[#f77f00]" />
                <span className="text-[11px] font-medium text-[#94a3b8]">Today, 10:30 AM</span>
              </div>
            </div>

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2.5 group`}>
                {msg.role === 'ai' && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1"
                    style={{ background: 'linear-gradient(135deg, #0967bd, #003566)' }}>
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div className={`max-w-[72%] ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                  {msg.role === 'user' ? (
                    <div className="rounded-[18px] rounded-br-[6px] px-5 py-3.5"
                      style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}>
                      <p className="text-[14px] text-white leading-relaxed">{msg.text}</p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-[18px] rounded-bl-[6px] px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-[#edf0f4]">
                      {msg.text.split('\n\n').map((paragraph, pi) => (
                        <p key={pi} className={`text-[14px] text-[#2d3748] leading-[1.75] ${pi > 0 ? 'mt-3' : ''}`}>
                          {formatText(paragraph)}
                        </p>
                      ))}
                    </div>
                  )}
                  <div className={`flex items-center gap-2 mt-1 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <p className="text-[10px] text-[#c1c7ce]">{msg.time}</p>
                    {msg.role === 'ai' && <AiMessageActions />}
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-[#003566] flex items-center justify-center shrink-0 mt-1">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && <TypingIndicator />}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="px-5 md:px-6 pb-5 pt-3"
            style={{ background: 'linear-gradient(180deg, transparent 0%, #fafbfd 25%)' }}>
            <div className="w-full max-w-[860px] mx-auto flex items-end gap-2.5 relative">

              {/* Attachment Menu */}
              {showAttachMenu && (
                <div
                  className="absolute bottom-[66px] left-0 bg-white rounded-[16px] p-1.5 shadow-xl flex flex-col gap-0.5 min-w-[180px] animate-in fade-in slide-in-from-bottom-2 duration-200 z-30 border border-[#edf0f4]"
                  onClick={(e) => e.stopPropagation()}>
                  <button onClick={handleAttachImage}
                    className="flex items-center gap-3 text-[#1e293b] hover:bg-[#f5f7fa] px-3 py-2.5 rounded-[12px] transition-colors text-left w-full cursor-pointer">
                    <div className="w-8 h-8 rounded-[10px] flex items-center justify-center"
                      style={{ background: 'rgba(9,103,189,0.08)' }}>
                      <ImageIcon className="w-4 h-4 text-[#0967bd]" />
                    </div>
                    <div>
                      <span className="text-[13px] font-semibold block">Image</span>
                      <span className="text-[10px] text-[#94a3b8]">JPG, PNG, GIF</span>
                    </div>
                  </button>
                  <button onClick={handleAttachFile}
                    className="flex items-center gap-3 text-[#1e293b] hover:bg-[#f5f7fa] px-3 py-2.5 rounded-[12px] transition-colors text-left w-full cursor-pointer">
                    <div className="w-8 h-8 rounded-[10px] flex items-center justify-center"
                      style={{ background: 'rgba(247,127,0,0.08)' }}>
                      <FileText className="w-4 h-4 text-[#f77f00]" />
                    </div>
                    <div>
                      <span className="text-[13px] font-semibold block">Document</span>
                      <span className="text-[10px] text-[#94a3b8]">PDF, DOCX, TXT</span>
                    </div>
                  </button>
                </div>
              )}

              {/* Input Box */}
              <div className={`flex-1 bg-white rounded-[18px] shadow-lg shadow-black/[0.05] flex flex-col border border-[#e2e8f0] z-20 transition-all duration-300 focus-within:border-[#0967bd]/30 focus-within:shadow-[#0967bd]/8 ${attachment ? 'p-3 gap-3' : 'h-[52px] justify-center px-3'}`}>
                {attachment && (
                  <div className="shrink-0 animate-in fade-in slide-in-from-bottom-1 duration-200">
                    {attachment.type === 'image' ? (
                      <div className="relative w-[90px] h-[90px] rounded-[14px] overflow-hidden group border border-[#edf0f4]">
                        <img src={attachment.content} alt="Attachment" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        <button onClick={clearAttachment}
                          className="absolute top-1.5 right-1.5 bg-white/95 p-1 rounded-full shadow-sm hover:bg-white transition-colors cursor-pointer">
                          <X className="w-3 h-3 text-[#1e293b]" />
                        </button>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2.5 rounded-[12px] px-3.5 py-2.5"
                        style={{ background: 'rgba(0,53,102,0.03)', border: '1px solid rgba(0,53,102,0.06)' }}>
                        <FileText className="w-4 h-4 text-[#003566] shrink-0" />
                        <span className="text-[12px] font-semibold text-[#003566]">{attachment.content}</span>
                        <button onClick={clearAttachment}
                          className="text-[#94a3b8] hover:text-[#1e293b] transition-colors cursor-pointer ml-1">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-1 w-full">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowAttachMenu(!showAttachMenu); }}
                    className={`p-2 hover:bg-[#f5f7fa] rounded-[10px] text-[#c1c7ce] hover:text-[#0967bd] transition-all duration-200 cursor-pointer ${showAttachMenu ? 'rotate-45 text-[#0967bd]!' : ''}`}>
                    <Plus className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent border-none outline-none text-[14px] placeholder:text-[#b0b8c4] text-[#1e293b] font-medium px-1"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                  />
                  <button onClick={onVoiceMode}
                    className="p-2 hover:bg-[#f5f7fa] rounded-[10px] text-[#003566]/50 hover:text-[#0967bd] transition-colors cursor-pointer">
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button onClick={handleSend}
                className={`w-[52px] h-[52px] rounded-[16px] flex items-center justify-center shadow-lg transition-all shrink-0 z-20 cursor-pointer ${
                  inputText.trim() || attachment
                    ? 'hover:shadow-xl hover:scale-[1.04]'
                    : 'opacity-60'
                }`}
                style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}>
                <Send className="w-5 h-5 text-white ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
