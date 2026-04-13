import React from 'react';
import { ArrowLeft, Plus, Search, Mic, Send, Image as ImageIcon, FileText, X, MessageSquare, Sparkles, Clock, Bot, User, Zap, Copy, Check, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react';
import { getAiMentorResponse, formatChatHistory } from '@/app/lib/groq';
import { toast } from 'sonner';
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
    <div className="bg-white dark:bg-slate-800 rounded-[16px] rounded-bl-[4px] px-5 py-4 shadow-sm dark:shadow-slate-900/20 border border-gray-100/60 dark:border-slate-700">
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-blue-500/40 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-blue-500/40 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-blue-500/40 animate-bounce" style={{ animationDelay: '300ms' }} />
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
        className="p-1.5 rounded-[8px] hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-600 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
        title="Copy">
        {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
      </button>
      <button className="p-1.5 rounded-[8px] hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-600 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer" title="Good response">
        <ThumbsUp className="w-3 h-3" />
      </button>
      <button className="p-1.5 rounded-[8px] hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-600 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer" title="Bad response">
        <ThumbsDown className="w-3 h-3" />
      </button>
      <button className="p-1.5 rounded-[8px] hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-600 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer" title="Regenerate">
        <RotateCcw className="w-3 h-3" />
      </button>
    </div>
  );
};

export function AiMentorChat({ onBack, onVoiceMode }: AiMentorChatProps) {
  const [showAttachMenu, setShowAttachMenu] = React.useState(false);
  const [attachment, setAttachment] = React.useState<Attachment | null>(null);
  const [inputText, setInputText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);
  const [messages, setMessages] = React.useState<Message[]>([
    { id: '1', role: 'user', text: 'Hello there', time: new Date(Date.now() - 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    { id: '2', role: 'ai', text: 'Hello there! I\'m Elm, your AI Study Mentor. 👋\n\nI\'m here to help you with:\n- **Explaining concepts** in simple, relatable ways\n- **Solving problems** step-by-step\n- **Summarizing** your study material\n- **Creating quizzes** to test your knowledge\n\nWhat would you like to learn about today?', time: new Date(Date.now() - 55000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  ]);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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

  const handleSend = async () => {
    if (!inputText.trim() && !attachment) return;

    const userMessage = inputText;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message immediately
    setMessages(prev => [...prev, {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: userMessage,
      time: timestamp,
      attachment
    }]);

    setInputText("");
    setAttachment(null);
    setIsLoading(true);

    try {
      // Convert messages to Groq format
      const chatHistory = formatChatHistory(messages.map(m => ({ role: m.role, text: m.text })));

      // Get AI response from Groq
      const aiResponse = await getAiMentorResponse(userMessage, chatHistory);

      const aiTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}`,
        role: 'ai',
        text: aiResponse,
        time: aiTimestamp
      }]);

      toast.success("Response generated!");
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error(error instanceof Error ? error.message : "Failed to get AI response");
    } finally {
      setIsLoading(false);
    }
  };

  // Format message text with basic markdown
  const formatText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-blue-600 dark:text-blue-400 font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="text-slate-700 dark:text-slate-300">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} onClick={() => setShowAttachMenu(false)}>
      {/* Left Sidebar Panel */}
      <div className="w-[280px] shrink-0 flex-col h-full z-10 relative hidden lg:flex overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
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
              <span className="text-[10px] text-white/30 font-medium">Powered by Elm Orbit AI</span>
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
      <div className="flex-1 relative bg-slate-50 dark:bg-slate-950 flex flex-col h-full">

        {/* Top Bar */}
        <div className="sticky top-0 z-20 px-5 md:px-6 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center justify-between max-w-[860px] mx-auto">
            <div className="flex items-center gap-3">
              <button onClick={onBack}
                className="lg:hidden flex items-center justify-center w-8 h-8 rounded-[10px] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="w-9 h-9 rounded-[12px] flex items-center justify-center relative"
                style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}>
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">AI Mentor</h3>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-blue-700 dark:text-blue-400 bg-blue-100/80 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800">AI</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-[5px] h-[5px] rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-slate-600 dark:text-slate-400">Online • Always ready to help</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={onVoiceMode}
                className="flex items-center gap-2 px-3.5 py-2 rounded-[12px] text-[11px] font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600">
                <Mic className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Voice Mode</span>
              </button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-5 md:px-6 py-5 pb-[170px] bg-slate-50 dark:bg-slate-950" onClick={() => setShowAttachMenu(false)}>
          <div className="max-w-[860px] mx-auto flex flex-col gap-5">

            {/* Welcome message */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <Sparkles className="w-3 h-3 text-orange-500 dark:text-orange-400" />
                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Today, 10:30 AM</span>
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
                    <div className="bg-white dark:bg-slate-800 rounded-[18px] rounded-bl-[6px] px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-slate-900/20 border border-slate-200 dark:border-slate-700">
                      {msg.text.split('\n\n').map((paragraph, pi) => (
                        <p key={pi} className={`text-[14px] text-slate-900 dark:text-white leading-[1.75] ${pi > 0 ? 'mt-3' : ''}`}>
                          {formatText(paragraph)}
                        </p>
                      ))}
                    </div>
                  )}
                  <div className={`flex items-center gap-2 mt-1 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <p className="text-[10px] text-slate-500 dark:text-slate-500">{msg.time}</p>
                    {msg.role === 'ai' && <AiMessageActions />}
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-blue-600 dark:bg-blue-600 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && <TypingIndicator />}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="px-5 md:px-6 pb-5 pt-3 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-slate-50/90 dark:via-slate-950/90 to-transparent">
            <div className="w-full max-w-[860px] mx-auto flex items-end gap-2.5 relative">

              {/* Attachment Menu */}
              {showAttachMenu && (
                <div
                  className="absolute bottom-[66px] left-0 bg-white dark:bg-slate-800 rounded-[16px] p-1.5 shadow-xl dark:shadow-slate-900/40 flex flex-col gap-0.5 min-w-[180px] animate-in fade-in slide-in-from-bottom-2 duration-200 z-30 border border-slate-200 dark:border-slate-700"
                  onClick={(e) => e.stopPropagation()}>
                  <button onClick={handleAttachImage}
                    className="flex items-center gap-3 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 px-3 py-2.5 rounded-[12px] transition-colors text-left w-full cursor-pointer">
                    <div className="w-8 h-8 rounded-[10px] flex items-center justify-center bg-blue-50 dark:bg-blue-950/40">
                      <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <span className="text-[13px] font-semibold block">Image</span>
                      <span className="text-[10px] text-slate-600 dark:text-slate-400">JPG, PNG, GIF</span>
                    </div>
                  </button>
                  <button onClick={handleAttachFile}
                    className="flex items-center gap-3 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 px-3 py-2.5 rounded-[12px] transition-colors text-left w-full cursor-pointer">
                    <div className="w-8 h-8 rounded-[10px] flex items-center justify-center bg-orange-50 dark:bg-orange-950/40">
                      <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <span className="text-[13px] font-semibold block">Document</span>
                      <span className="text-[10px] text-slate-600 dark:text-slate-400">PDF, DOCX, TXT</span>
                    </div>
                  </button>
                </div>
              )}

              {/* Input Box */}
              <div className={`flex-1 bg-white dark:bg-slate-800 rounded-[18px] shadow-lg shadow-black/[0.05] dark:shadow-slate-900/40 flex flex-col border border-slate-200 dark:border-slate-700 z-20 transition-all duration-300 focus-within:border-blue-500/30 dark:focus-within:border-blue-400/30 focus-within:shadow-blue-500/8 ${attachment ? 'p-3 gap-3' : 'h-[52px] justify-center px-3'}`}>
                {attachment && (
                  <div className="shrink-0 animate-in fade-in slide-in-from-bottom-1 duration-200">
                    {attachment.type === 'image' ? (
                      <div className="relative w-[90px] h-[90px] rounded-[14px] overflow-hidden group border border-slate-200 dark:border-slate-700">
                        <img src={attachment.content} alt="Attachment" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        <button onClick={clearAttachment}
                          className="absolute top-1.5 right-1.5 bg-white/95 dark:bg-slate-800/95 p-1 rounded-full shadow-sm hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer">
                          <X className="w-3 h-3 text-slate-900 dark:text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2.5 rounded-[12px] px-3.5 py-2.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span className="text-[12px] font-semibold text-blue-700 dark:text-blue-300">{attachment.content}</span>
                        <button onClick={clearAttachment}
                          className="text-blue-400 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors cursor-pointer ml-1">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-1 w-full">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowAttachMenu(!showAttachMenu); }}
                    className={`p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-[10px] text-slate-400 dark:text-slate-600 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 cursor-pointer ${showAttachMenu ? 'rotate-45 text-blue-600 dark:text-blue-400' : ''}`}>
                    <Plus className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent border-none outline-none text-[14px] placeholder:text-slate-500 dark:placeholder:text-slate-500 text-slate-900 dark:text-white font-medium px-1"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                  />
                  <button onClick={onVoiceMode}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-[10px] text-slate-500 dark:text-slate-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button onClick={handleSend}
                disabled={isLoading || (!inputText.trim() && !attachment)}
                className={`w-[52px] h-[52px] rounded-[16px] flex items-center justify-center shadow-lg transition-all shrink-0 z-20 cursor-pointer ${
                  isLoading || (!inputText.trim() && !attachment)
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:shadow-xl hover:scale-[1.04]'
                }`}
                style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}>
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5 text-white ml-0.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
