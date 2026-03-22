import React from 'react';
import { ArrowLeft, Plus, Search, Mic, MicOff, MessageSquare, Sparkles, Clock, Bot, User, Keyboard, Zap, Volume2 } from 'lucide-react';

interface AiMentorVoiceChatProps {
  onBack: () => void;
  onTextMode: () => void;
}

// Animated waveform bars
const WaveformBars = ({ active }: { active: boolean }) => {
  const bars = 24;
  return (
    <div className="flex items-center justify-center gap-[3px] h-[48px]">
      {Array.from({ length: bars }).map((_, i) => {
        const delay = i * 60;
        const baseHeight = active ? 8 + Math.sin(i * 0.8) * 16 : 4;
        return (
          <div
            key={i}
            className="w-[3px] rounded-full transition-all"
            style={{
              height: active ? `${baseHeight}px` : '4px',
              background: active
                ? `linear-gradient(180deg, #0967bd, #003566)`
                : '#e2e8f0',
              animation: active ? `waveBar 1s ease-in-out ${delay}ms infinite alternate` : 'none',
              opacity: active ? 0.4 + Math.sin(i * 0.5) * 0.6 : 0.4,
            }}
          />
        );
      })}
      <style>{`
        @keyframes waveBar {
          0% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
          100% { transform: scaleY(0.5); }
        }
      `}</style>
    </div>
  );
};

export function AiMentorVoiceChat({ onBack, onTextMode }: AiMentorVoiceChatProps) {
  const [isListening, setIsListening] = React.useState(false);
  const [pulsePhase, setPulsePhase] = React.useState(0);

  React.useEffect(() => {
    if (!isListening) return;
    const interval = setInterval(() => setPulsePhase((p) => (p + 1) % 360), 50);
    return () => clearInterval(interval);
  }, [isListening]);

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Left Sidebar Panel */}
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
              <span className="text-[10px] text-white/30 font-medium">Voice Mode</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 mb-6">
            <button onClick={onTextMode}
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
              <button className="flex items-center gap-3 px-4 h-[40px] rounded-[12px] hover:bg-white/[0.06] text-white/40 hover:text-white/70 transition-all text-left cursor-pointer">
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[13px] truncate">Maths Doubt</span>
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
                <span className="text-[11px] font-bold text-[#f77f00]">Voice Tips</span>
              </div>
              <p className="text-[10px] text-white/30 leading-relaxed">
                Speak clearly and ask one question at a time for the best results.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative flex flex-col h-full overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[#fafbfd]" />
        {isListening && (
          <div className="absolute inset-0 transition-opacity duration-700"
            style={{ background: 'radial-gradient(ellipse at 50% 70%, rgba(9,103,189,0.04) 0%, transparent 60%)' }} />
        )}

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
                <Volume2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-bold text-[#003566]">Voice Mode</h3>
                  {isListening && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white bg-[#22c55e] animate-pulse">LIVE</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-[5px] h-[5px] rounded-full ${isListening ? 'bg-[#22c55e] animate-pulse' : 'bg-[#94a3b8]'}`} />
                  <span className="text-[10px] text-[#94a3b8]">{isListening ? 'Listening...' : 'Ready'}</span>
                </div>
              </div>
            </div>

            <button onClick={onTextMode}
              className="flex items-center gap-2 px-3.5 py-2 rounded-[12px] text-[11px] font-bold text-[#003566] hover:bg-[#f5f7fa] transition-colors cursor-pointer border border-[#e2e8f0] hover:border-[#003566]/15">
              <Keyboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Text Mode</span>
            </button>
          </div>
        </div>

        {/* Chat Bubbles */}
        <div className="flex-1 overflow-y-auto px-5 md:px-6 py-5 pb-[300px] relative z-10">
          <div className="max-w-[860px] mx-auto flex flex-col gap-5">
            {/* Time divider */}
            <div className="flex justify-center mb-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#edf0f4] shadow-sm">
                <Volume2 className="w-3 h-3 text-[#0967bd]" />
                <span className="text-[11px] font-medium text-[#94a3b8]">Voice conversation started</span>
              </div>
            </div>

            {/* User Message */}
            <div className="flex justify-end gap-2.5">
              <div className="max-w-[70%]">
                <div className="rounded-[18px] rounded-br-[6px] px-5 py-3.5"
                  style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Mic className="w-3 h-3 text-white/50" />
                    <span className="text-[10px] text-white/50 font-medium">Voice message</span>
                  </div>
                  <p className="text-[14px] text-white leading-relaxed">Hello there</p>
                </div>
                <p className="text-[10px] text-[#c1c7ce] mt-1.5 text-right">10:30 AM</p>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#003566] flex items-center justify-center shrink-0 mt-1">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            {/* AI Message */}
            <div className="flex justify-start gap-2.5 group">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1"
                style={{ background: 'linear-gradient(135deg, #0967bd, #003566)' }}>
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="max-w-[70%]">
                <div className="bg-white rounded-[18px] rounded-bl-[6px] px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-[#edf0f4]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Volume2 className="w-3 h-3 text-[#0967bd]" />
                    <span className="text-[10px] text-[#0967bd] font-medium">AI Response</span>
                  </div>
                  <p className="text-[14px] text-[#2d3748] leading-relaxed">Hello there! How may I assist you today? You can ask me anything by speaking into the microphone.</p>
                </div>
                <p className="text-[10px] text-[#c1c7ce] mt-1.5">10:30 AM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Voice Interface (Bottom) */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="px-5 md:px-6 pb-6"
            style={{ background: 'linear-gradient(180deg, transparent 0%, #fafbfd 15%)' }}>
            <div className="w-full max-w-[860px] mx-auto">
              <div className="rounded-[24px] bg-white border border-[#e2e8f0] shadow-xl shadow-black/[0.04] py-7 px-6 flex flex-col items-center gap-5">

                {/* Status Text */}
                <div className="text-center">
                  <h3 className="text-[20px] font-bold text-[#003566] mb-1"
                    style={{ fontFamily: "'DM Serif Display', serif" }}>
                    {isListening ? "I'm listening..." : "Tap to speak"}
                  </h3>
                  <p className="text-[12px] text-[#94a3b8]">
                    {isListening ? "Speak clearly, I'll respond when you pause" : "Ask me anything about your studies"}
                  </p>
                </div>

                {/* Waveform Visualizer */}
                <div className="w-full max-w-[360px]">
                  <WaveformBars active={isListening} />
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                  {/* Secondary: Switch to text */}
                  <button onClick={onTextMode}
                    className="w-12 h-12 rounded-full flex items-center justify-center border border-[#e2e8f0] bg-white hover:bg-[#f5f7fa] text-[#5a7089] hover:text-[#003566] transition-all cursor-pointer shadow-sm hover:shadow-md"
                    title="Switch to text">
                    <Keyboard className="w-5 h-5" />
                  </button>

                  {/* Main Mic Button */}
                  <div className="relative">
                    {/* Outer animated rings */}
                    {isListening && (
                      <>
                        <div className="absolute -inset-3 rounded-full border-2 border-[#0967bd]/15 animate-ping"
                          style={{ animationDuration: '2s' }} />
                        <div className="absolute -inset-6 rounded-full border border-[#0967bd]/8 animate-ping"
                          style={{ animationDuration: '2.5s' }} />
                      </>
                    )}

                    <button
                      onClick={() => setIsListening(!isListening)}
                      className={`relative w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer ${
                        isListening
                          ? 'shadow-[0_0_50px_rgba(9,103,189,0.25)] scale-110'
                          : 'shadow-lg hover:shadow-xl hover:scale-105'
                      }`}
                      style={{
                        background: isListening
                          ? 'linear-gradient(135deg, #0967bd, #003566)'
                          : 'linear-gradient(135deg, #003566, #0967bd)',
                      }}>
                      {isListening ? (
                        <MicOff className="w-7 h-7 text-white" />
                      ) : (
                        <Mic className="w-7 h-7 text-white" />
                      )}
                    </button>
                  </div>

                  {/* Secondary: End session */}
                  <button onClick={onBack}
                    className="w-12 h-12 rounded-full flex items-center justify-center border border-[#e2e8f0] bg-white hover:bg-red-50 text-[#5a7089] hover:text-[#cc3636] hover:border-[#cc3636]/20 transition-all cursor-pointer shadow-sm hover:shadow-md"
                    title="End voice session">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 2.59 3.4z" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  </button>
                </div>

                {/* Helper text */}
                <p className="text-[11px] text-[#c1c7ce] flex items-center gap-1.5">
                  {isListening ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                      Recording • Tap mic to stop
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3" />
                      Hands-free study mode
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
