import React from 'react';
import { ArrowLeft, Plus, Search, Mic, Send, MessageSquare, Sparkles, Clock, Bot, Zap, BookOpen, HelpCircle, Brain, ListChecks } from 'lucide-react';
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { getCurrentUser } from '@/app/lib/api';
import imgSayHi1 from "figma:asset/5e91c4f0fbdda278a8c62c9c5428eca49ba69e08.png";

interface AiMentorHomeProps {
  onBack: () => void;
  onVoiceMode: () => void;
  onChatMode?: () => void;
}

const SidebarPanel = ({ onBack, onChatMode }: { onBack: () => void; onChatMode?: () => void }) => (
  <div className="w-[280px] shrink-0 flex-col h-full z-10 relative hidden lg:flex overflow-hidden"
    style={{ background: 'linear-gradient(180deg, #001d3d 0%, #003566 50%, #001d3d 100%)' }}>
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
          <span className="text-[10px] text-white/30 font-medium">Powered by Elm Orbit AI</span>
        </div>
      </div>

      <div className="flex flex-col gap-1 mb-6">
        <button onClick={onChatMode}
          className="flex items-center gap-3 px-4 h-[40px] rounded-[12px] text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all cursor-pointer">
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
          {[
            { title: "Maths Doubt", time: "2h ago" },
            { title: "Physics", time: "Yesterday" },
          ].map((chat) => (
            <button key={chat.title} onClick={onChatMode}
              className="flex items-center justify-between px-4 h-[40px] rounded-[12px] hover:bg-white/[0.06] text-white/40 hover:text-white/70 transition-all text-left cursor-pointer group">
              <div className="flex items-center gap-2.5 min-w-0">
                <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-60" />
                <span className="text-[13px] truncate">{chat.title}</span>
              </div>
              <span className="text-[9px] text-white/20 shrink-0 group-hover:text-white/30">{chat.time}</span>
            </button>
          ))}
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
            Try voice mode for hands-free learning while you study!
          </p>
        </div>
      </div>
    </div>
  </div>
);

export function AiMentorHome({ onBack, onVoiceMode, onChatMode }: AiMentorHomeProps) {
  const [inputValue, setInputValue] = React.useState("");
  const currentUser = getCurrentUser();
  const userName = currentUser?.name?.split(' ')[0] || 'there';

  const capabilities = [
    { icon: <HelpCircle className="w-4 h-4" />, title: "Explain Concepts", desc: "Break down complex topics into simple terms", color: "#0967bd" },
    { icon: <Brain className="w-4 h-4" />, title: "Solve Problems", desc: "Step-by-step guidance on tough questions", color: "#7c3aed" },
    { icon: <BookOpen className="w-4 h-4" />, title: "Summarize Notes", desc: "Get concise summaries of your study material", color: "#f77f00" },
    { icon: <ListChecks className="w-4 h-4" />, title: "Quiz Me", desc: "Test your knowledge with smart questions", color: "#22c55e" },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <SidebarPanel onBack={onBack} onChatMode={onChatMode} />

      {/* Main Area */}
      <div className="flex-1 relative flex flex-col h-full overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950" />
        <div className="absolute top-0 left-0 right-0 h-[50%] dark:opacity-30"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(9,103,189,0.04) 0%, transparent 70%)' }} />

        {/* Mobile Back */}
        <div className="lg:hidden sticky top-0 z-20 px-5 py-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center justify-between">
            <button onClick={onBack}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[13px] font-medium">Back</span>
            </button>
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-[14px] font-bold text-slate-900 dark:text-white">AI Mentor</span>
            </div>
            <div className="w-16" />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 relative z-10 overflow-y-auto flex flex-col items-center px-5 md:px-8 py-8 md:py-12 pb-[140px]">
          {/* Robot Image with glow */}
          <div className="relative mb-6">
            <div className="absolute inset-0 blur-3xl opacity-20 dark:opacity-10 rounded-full"
              style={{ background: 'radial-gradient(circle, #0967bd, transparent 70%)' }} />
            <div className="w-[200px] h-[200px] md:w-[240px] md:h-[240px] relative">
              <ImageWithFallback src={imgSayHi1} alt="AI Mentor" className="w-full h-full object-contain drop-shadow-2xl" />
            </div>
          </div>

          {/* Greeting */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
              <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300">AI-Powered Study Assistant</span>
            </div>
            <h1 className="text-[26px] md:text-[32px] lg:text-[38px] text-slate-900 dark:text-white leading-[1.15] mb-3"
              style={{ fontFamily: "'DM Serif Display', serif" }}>
              Good Morning, {userName}
            </h1>
            <p className="text-[15px] md:text-[16px] text-slate-600 dark:text-slate-400 max-w-[400px] mx-auto leading-relaxed">
              I'm your AI study companion. Ask me anything, or pick a topic to get started.
            </p>
          </div>

          {/* Capability Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-[720px] mb-8">
            {capabilities.map((cap) => (
              <button
                key={cap.title}
                onClick={onChatMode}
                className="group flex flex-col items-center text-center p-4 rounded-[18px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer hover:shadow-lg dark:hover:shadow-blue-900/20 hover:-translate-y-0.5"
                style={{ ['--cap-color' as string]: cap.color }}
              >
                <div className="w-10 h-10 rounded-[12px] flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${cap.color}12`, color: cap.color }}>
                  {cap.icon}
                </div>
                <span className="text-[12px] font-bold text-slate-900 dark:text-white mb-1">{cap.title}</span>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 leading-snug hidden md:block">{cap.desc}</span>
              </button>
            ))}
          </div>

          {/* Quick prompts */}
          <div className="w-full max-w-[720px]">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.12em] mb-3 pl-1">Try asking</p>
            <div className="flex flex-col gap-2">
              {[
                "Explain the theory of relativity in simple terms",
                "Help me solve this quadratic equation: x² + 5x + 6 = 0",
                "Create a study plan for my physics exam next week",
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={onChatMode}
                  className="group flex items-center gap-3 px-5 py-3.5 rounded-[14px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md dark:hover:shadow-blue-900/20 transition-all text-left cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-[9px] flex items-center justify-center shrink-0 bg-slate-100 dark:bg-slate-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                    <Sparkles className="w-3 h-3 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </div>
                  <span className="text-[13px] text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors leading-snug">{prompt}</span>
                  <Send className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0 ml-auto transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Input */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="px-5 md:px-8 pb-6 pt-4 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-slate-50/90 dark:via-slate-950/90 to-transparent">
            <div className="w-full max-w-[720px] mx-auto flex items-center gap-2.5">
              <div className="flex-1 h-[52px] rounded-[16px] bg-white dark:bg-slate-800 flex items-center px-3 border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-900/[0.05] dark:shadow-slate-900/20 hover:border-slate-300 dark:hover:border-slate-600 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:shadow-blue-500/10 dark:focus-within:shadow-blue-500/10 transition-all">
                <button onClick={onChatMode}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-[10px] text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                  <Plus className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent border-none outline-none text-[14px] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium px-1"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') onChatMode?.(); }}
                />
                <button onClick={onVoiceMode}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-[10px] text-slate-500 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                  <Mic className="w-5 h-5" />
                </button>
              </div>
              <button onClick={onChatMode}
                className="w-[52px] h-[52px] rounded-[16px] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-[1.04] transition-all shrink-0 cursor-pointer"
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
