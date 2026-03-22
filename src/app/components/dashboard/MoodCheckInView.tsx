import React, { useState, useRef, useEffect, useCallback } from "react";
import imgSayHi1 from "figma:asset/5e91c4f0fbdda278a8c62c9c5428eca49ba69e08.png";
import { ArrowLeft, Send, Mic, MicOff, Bot, User, Sparkles, Heart, X } from "lucide-react";

/* ── Types ── */
interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

/* ── Simulated voice transcriptions ── */
const voiceTranscriptions = [
  "I'm feeling a bit stressed today with all my assignments.",
  "I feel happy because I just finished a big project!",
  "I'm kind of tired and could use some motivation.",
  "Feeling anxious about my upcoming exams.",
  "I'm doing okay, just a regular day.",
  "I've been feeling lonely lately and want to talk.",
  "I'm really excited about the weekend!",
  "I feel confused about what to prioritize right now.",
  "I'm grateful for my friends and study group.",
  "Feeling a bit sad today, not sure why.",
];

/* ── AI Response Logic ── */
const moodResponses: Record<string, string> = {
  happy: "That's wonderful to hear! Being happy is a great state of mind. What's making you feel this way? Recognizing the sources of our joy helps us cultivate more of it.",
  sad: "I'm sorry you're feeling down. It's okay to feel sad sometimes \u2014 it's part of being human. Would you like to talk about what's on your mind? I'm here to listen.",
  stressed: "Stress can be really overwhelming. Take a deep breath with me \u2014 in for 4 counts, hold for 4, out for 4. Would you like me to suggest some stress-relief techniques?",
  anxious: "Feeling anxious can be tough. Remember, you're safe right now. Try grounding yourself: name 5 things you can see, 4 you can touch, 3 you can hear. Would you like to explore more calming strategies?",
  tired: "It sounds like you need some rest. Make sure you're taking care of yourself \u2014 hydration, breaks, and sleep are important. Would you like tips for better energy management?",
  angry: "I understand you're feeling frustrated. It's valid to feel angry. Taking a moment to step back and breathe can help. What triggered this feeling? Let's work through it together.",
  excited: "Your excitement is contagious! Channel that positive energy into something productive. What are you looking forward to?",
  confused: "Feeling confused is a normal part of learning and growing. Sometimes stepping away and coming back with fresh eyes helps. Would you like to break down what's confusing you?",
  lonely: "Feeling lonely is more common than you think. You're not alone in this \u2014 I'm here, and there are communities waiting to connect with you. Would you like to explore the World Chat?",
  grateful: "Gratitude is a beautiful emotion! Studies show that practicing gratitude regularly can boost happiness by 25%. What are you grateful for today?",
};

function getAIResponse(message: string): string {
  const lowerMsg = message.toLowerCase();
  for (const [mood, response] of Object.entries(moodResponses)) {
    if (lowerMsg.includes(mood)) return response;
  }
  if (["good", "great", "amazing", "fantastic"].some((w) => lowerMsg.includes(w)))
    return "That's great to hear! Positive feelings are worth celebrating. What's contributing to your good mood today?";
  if (["bad", "terrible", "awful", "horrible"].some((w) => lowerMsg.includes(w)))
    return "I'm sorry you're not feeling well. Remember, tough days don't last forever. Would you like to talk about what's going on?";
  if (["okay", "fine", "alright", "so-so"].some((w) => lowerMsg.includes(w)))
    return "Sometimes 'okay' is perfectly fine. Is there anything specific on your mind? Even small feelings are worth exploring.";
  if (["help", "support"].some((w) => lowerMsg.includes(w)))
    return "I'm here to help! You can share how you're feeling in your own words, and I'll do my best to understand and support you. What's on your mind?";
  return "Thank you for sharing. I'm here to listen and support you. Can you tell me more about how you're feeling? You can describe your emotions in any way that feels natural to you.";
}

/* ── Waveform component ── */
function WaveformBars({ active }: { active: boolean }) {
  return (
    <div className="flex items-center justify-center gap-[3px] h-[40px]">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="w-[3px] rounded-full transition-all"
          style={{
            height: active ? `${8 + Math.sin(i * 0.8) * 14}px` : '4px',
            background: active ? 'linear-gradient(180deg, #f953c6, #b91d73)' : '#e2e8f0',
            animation: active ? `waveBar 1s ease-in-out ${i * 60}ms infinite alternate` : 'none',
            opacity: active ? 0.4 + Math.sin(i * 0.5) * 0.6 : 0.4,
          }} />
      ))}
      <style>{`@keyframes waveBar { 0% { transform: scaleY(0.3); } 50% { transform: scaleY(1); } 100% { transform: scaleY(0.5); } }`}</style>
    </div>
  );
}

/* ── Main Component ── */
interface MoodCheckInViewProps { onBack: () => void; }

export function MoodCheckInView({ onBack }: MoodCheckInViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [listeningSeconds, setListeningSeconds] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const listeningTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);
  useEffect(() => { return () => { if (listeningTimerRef.current) clearInterval(listeningTimerRef.current); }; }, []);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text: trimmed, timestamp: new Date() }]);
    setInputValue("");
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), sender: "ai", text: getAIResponse(trimmed), timestamp: new Date() }]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  }, []);

  const handleSend = () => sendMessage(inputValue);
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  const startListening = () => {
    setIsListening(true); setListeningSeconds(0);
    listeningTimerRef.current = setInterval(() => setListeningSeconds((s) => s + 1), 1000);
  };
  const stopListening = () => {
    setIsListening(false); setListeningSeconds(0);
    if (listeningTimerRef.current) { clearInterval(listeningTimerRef.current); listeningTimerRef.current = null; }
    setTimeout(() => sendMessage(voiceTranscriptions[Math.floor(Math.random() * voiceTranscriptions.length)]), 400);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const hasMessages = messages.length > 0;

  const quickMoods = [
    { emoji: "😊", label: "Happy", msg: "I'm feeling happy today!" },
    { emoji: "😔", label: "Sad", msg: "I'm feeling a bit sad right now." },
    { emoji: "😰", label: "Stressed", msg: "I'm feeling stressed out." },
    { emoji: "😴", label: "Tired", msg: "I'm feeling really tired." },
    { emoji: "🙏", label: "Grateful", msg: "I'm feeling grateful today." },
    { emoji: "😤", label: "Angry", msg: "I'm feeling angry about something." },
  ];

  return (
    <div className="w-full flex flex-col h-[calc(100vh-96px)]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header */}
      <div className="shrink-0 mb-4">
        <button onClick={onBack} className="flex items-center gap-2 text-[#5a7089] hover:text-[#003566] mb-3 transition-colors group cursor-pointer">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[13px] font-medium">Emotional Wellness</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #b91d73, #f953c6)' }}>
            <Heart className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-[28px] md:text-[34px] text-[#003566]" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Mood Check-In
          </h1>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-1">
          {!hasMessages ? (
            /* Welcome State */
            <div className="flex flex-col items-center justify-center h-full px-4 -mt-8">
              <div className="relative mb-5">
                <div className="absolute inset-0 blur-3xl opacity-15 rounded-full"
                  style={{ background: 'radial-gradient(circle, #f953c6, transparent 70%)' }} />
                <div className="w-[160px] h-[160px] relative">
                  <img src={imgSayHi1} alt="AI Mascot" className="w-full h-full object-contain drop-shadow-2xl" />
                </div>
              </div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
                  style={{ background: 'rgba(185,29,115,0.06)', border: '1px solid rgba(185,29,115,0.1)' }}>
                  <Heart className="w-3 h-3 text-[#b91d73]" />
                  <span className="text-[11px] font-semibold text-[#b91d73]">Safe & Private</span>
                </div>
                <h2 className="text-[26px] md:text-[32px] text-[#003566] mb-2"
                  style={{ fontFamily: "'DM Serif Display', serif" }}>
                  How are you feeling today?
                </h2>
                <p className="text-[14px] text-[#7a8ea3] max-w-[380px] mx-auto leading-relaxed">
                  Share your emotions — I'm here to listen, understand, and support you.
                </p>
              </div>

              {/* Quick mood buttons */}
              <div className="flex flex-wrap justify-center gap-2.5 max-w-[460px]">
                {quickMoods.map((m) => (
                  <button key={m.label} onClick={() => sendMessage(m.msg)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-[14px] bg-white border border-[#edf0f4] hover:border-[#b91d73]/20 hover:shadow-md transition-all cursor-pointer group">
                    <span className="text-[18px]">{m.emoji}</span>
                    <span className="text-[12px] font-semibold text-[#5a7089] group-hover:text-[#003566] transition-colors">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Chat Messages */
            <div className="flex flex-col gap-4 py-4 max-w-[800px] mx-auto w-full">
              {/* Time divider */}
              <div className="flex justify-center mb-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#edf0f4] shadow-sm">
                  <Heart className="w-3 h-3 text-[#b91d73]" />
                  <span className="text-[11px] font-medium text-[#94a3b8]">Mood Check-In</span>
                </div>
              </div>

              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} gap-2.5`}>
                  {msg.sender === "ai" && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1"
                      style={{ background: 'linear-gradient(135deg, #b91d73, #f953c6)' }}>
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div className="max-w-[72%]">
                    <div className={`px-5 py-3.5 text-[14px] leading-[1.7] ${
                      msg.sender === "user"
                        ? "rounded-[18px] rounded-br-[6px] text-white"
                        : "rounded-[18px] rounded-bl-[6px] bg-white text-[#2d3748] shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-[#edf0f4]"
                    }`}
                    style={msg.sender === "user" ? { background: 'linear-gradient(135deg, #003566, #0967bd)' } : undefined}>
                      {msg.text}
                    </div>
                    <p className={`text-[10px] text-[#c1c7ce] mt-1.5 ${msg.sender === "user" ? "text-right" : ""}`}>
                      {msg.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  {msg.sender === "user" && (
                    <div className="w-7 h-7 rounded-full bg-[#003566] flex items-center justify-center shrink-0 mt-1">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1"
                    style={{ background: 'linear-gradient(135deg, #b91d73, #f953c6)' }}>
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-white rounded-[18px] rounded-bl-[6px] px-5 py-4 shadow-sm border border-[#edf0f4]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#b91d73]/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-[#b91d73]/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-[#b91d73]/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="shrink-0 pt-3 pb-2">
          {isListening ? (
            /* Voice Listening Panel */
            <div className="bg-white rounded-[22px] border border-[#edf0f4] shadow-xl p-6 flex flex-col items-center gap-4 max-w-[800px] mx-auto animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-[18px] font-bold text-[#003566]" style={{ fontFamily: "'DM Serif Display', serif" }}>
                I'm listening...
              </h3>
              <WaveformBars active={true} />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#cc3636] rounded-full animate-pulse" />
                  <span className="text-[12px] text-[#94a3b8] font-medium">{formatTime(listeningSeconds)}</span>
                </div>
                <button onClick={stopListening}
                  className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #b91d73, #f953c6)' }}>
                  <MicOff className="w-6 h-6 text-white" />
                </button>
                <button onClick={stopListening} className="text-[12px] font-bold text-[#cc3636] hover:underline cursor-pointer">Stop</button>
              </div>
            </div>
          ) : (
            /* Text Input */
            <div className="flex gap-2.5 items-center max-w-[800px] mx-auto">
              <div className="flex-1 h-[52px] rounded-[16px] bg-white flex items-center px-3 border border-[#e2e8f0] shadow-lg shadow-black/[0.05] hover:border-[#c9ddf0] focus-within:border-[#0967bd] focus-within:shadow-[#0967bd]/10 transition-all">
                <input
                  type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown}
                  placeholder="Share how you're feeling..."
                  className="flex-1 bg-transparent border-none outline-none text-[14px] text-[#1e293b] placeholder:text-[#b0b8c4] font-medium px-2" />
                <button onClick={startListening}
                  className="p-2 hover:bg-[#f5f7fa] rounded-[10px] text-[#003566]/50 hover:text-[#b91d73] transition-colors cursor-pointer">
                  <Mic className="w-5 h-5" />
                </button>
              </div>
              <button onClick={handleSend} disabled={!inputValue.trim()}
                className="w-[52px] h-[52px] rounded-[16px] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-[1.04] transition-all shrink-0 cursor-pointer disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}>
                <Send className="w-5 h-5 text-white ml-0.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
