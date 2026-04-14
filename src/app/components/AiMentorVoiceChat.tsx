import React from 'react';
import { ArrowLeft, Plus, Search, Mic, MicOff, MessageSquare, Sparkles, Clock, Bot, User, Keyboard, Zap, Volume2, Trash2, Archive } from 'lucide-react';
import { getAiMentorResponse, formatChatHistory } from '@/app/lib/groq';
import { aiChat } from '@/app/lib/api';
import { toast } from 'sonner';
import { SkeletonChatPage } from '@/app/components/skeletons/PageSkeletons';

interface AiMentorVoiceChatProps {
  onBack: () => void;
  onTextMode: () => void;
}

interface VoiceMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  time: string;
}

type ChatSession = {
  id: string;
  name: string;
  description?: string;
  chatType: 'text' | 'voice';
  totalMessages: number;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  lastMessageAt?: string;
};

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
                : '#e2e8f0 dark:#64748b',
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
  // Chat Session Management State
  const [chatSessions, setChatSessions] = React.useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = React.useState<string | null>(null);
  const [isLoadingChats, setIsLoadingChats] = React.useState(true);
  const [showNewChatModal, setShowNewChatModal] = React.useState(false);
  const [newChatName, setNewChatName] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');

  // Voice Chat State
  const [isListening, setIsListening] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [pulsePhase, setPulsePhase] = React.useState(0);
  const [messages, setMessages] = React.useState<VoiceMessage[]>([]);
  const recognitionRef = React.useRef<any>(null);
  const synthesisRef = React.useRef<SpeechSynthesisUtterance | null>(null);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  // Load chat sessions on mount
  React.useEffect(() => {
    const loadChats = async () => {
      try {
        setIsLoadingChats(true);
        const sessions = await aiChat.listSessions();
        const voiceSessions = sessions.filter(s => s.chatType === 'voice');
        setChatSessions(voiceSessions);
        
        // Auto-select first voice chat if available
        if (voiceSessions.length > 0 && !currentSessionId) {
          const firstSessionId = voiceSessions[0].id;
          setCurrentSessionId(firstSessionId);
          await loadChatMessages(firstSessionId);
        }
      } catch (error) {
        console.error('Failed to load voice chat sessions:', error);
        toast.error('Failed to load chat history');
      } finally {
        setIsLoadingChats(false);
      }
    };
    loadChats();
  }, []);

  // Load messages when current session changes
  React.useEffect(() => {
    if (currentSessionId) {
      loadChatMessages(currentSessionId);
    }
  }, [currentSessionId]);

  const loadChatMessages = async (sessionId: string) => {
    try {
      const { session, messages: dbMessages } = await aiChat.getSession(sessionId);
      
      // Convert DB messages to UI format
      const uiMessages: VoiceMessage[] = dbMessages.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        text: msg.content,
        time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));
      
      setMessages(uiMessages);
    } catch (error) {
      console.error('Failed to load chat messages:', error);
      toast.error('Failed to load chat messages');
    }
  };

  const handleCreateNewChat = async () => {
    if (!newChatName.trim()) {
      toast.error('Please enter a chat name');
      return;
    }

    try {
      const newSession = await aiChat.createSession({
        name: newChatName,
        chatType: 'voice'
      });
      
      setChatSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      setMessages([]);
      setNewChatName('');
      setShowNewChatModal(false);
      toast.success('Voice chat created successfully');
    } catch (error) {
      console.error('Failed to create chat:', error);
      toast.error('Failed to create new chat');
    }
  };

  const handleDeleteChat = async (sessionId: string) => {
    try {
      await aiChat.deleteSession(sessionId);
      setChatSessions(prev => prev.filter(s => s.id !== sessionId));
      if (currentSessionId === sessionId) {
        const remaining = chatSessions.filter(s => s.id !== sessionId);
        setCurrentSessionId(remaining.length > 0 ? remaining[0].id : null);
      }
      toast.success('Chat deleted');
    } catch (error) {
      console.error('Failed to delete chat:', error);
      toast.error('Failed to delete chat');
    }
  };

  const handleArchiveChat = async (sessionId: string) => {
    try {
      await aiChat.archiveSession(sessionId);
      setChatSessions(prev => prev.filter(s => s.id !== sessionId));
      if (currentSessionId === sessionId) {
        const remaining = chatSessions.filter(s => s.id !== sessionId);
        setCurrentSessionId(remaining.length > 0 ? remaining[0].id : null);
      }
      toast.success('Chat archived');
    } catch (error) {
      console.error('Failed to archive chat:', error);
      toast.error('Failed to archive chat');
    }
  };

  const handlePinChat = async (sessionId: string, isPinned: boolean) => {
    try {
      const updated = await aiChat.updateSession(sessionId, { isPinned: !isPinned });
      setChatSessions(prev => prev.map(s => s.id === sessionId ? { ...s, isPinned: updated.isPinned } : s));
      toast.success(isPinned ? 'Chat unpinned' : 'Chat pinned');
    } catch (error) {
      console.error('Failed to update pin status:', error);
      toast.error('Failed to update chat');
    }
  };

  const handleSearchChats = async () => {
    if (!searchQuery.trim()) {
      const sessions = await aiChat.listSessions();
      const voiceSessions = sessions.filter(s => s.chatType === 'voice');
      setChatSessions(voiceSessions);
      return;
    }

    try {
      const results = await aiChat.searchSessions(searchQuery);
      const voiceSessions = results.filter(s => s.chatType === 'voice');
      setChatSessions(voiceSessions);
    } catch (error) {
      console.error('Failed to search chats:', error);
      toast.error('Failed to search chats');
    }
  };

  // Initialize speech recognition
  React.useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Speech Recognition not supported in your browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = async (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        await handleUserMessage(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      toast.error(`Speech error: ${event.error}`);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  React.useEffect(() => {
    if (!isListening) return;
    const interval = setInterval(() => setPulsePhase((p) => (p + 1) % 360), 50);
    return () => clearInterval(interval);
  }, [isListening]);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      toast.error('Text-to-Speech not supported');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleUserMessage = async (userText: string) => {
    if (!userText.trim()) return;
    if (!currentSessionId) {
      toast.error('Please create or select a voice chat first');
      return;
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message to UI
    const userMsg: VoiceMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: userText,
      time: timestamp,
    };
    setMessages(prev => [...prev, userMsg]);

    setIsProcessing(true);

    try {
      // Save user message to database
      await aiChat.addMessage(currentSessionId, {
        role: 'user',
        content: userText,
      });

      // Convert messages to Groq format
      const chatHistory = formatChatHistory(messages.map(m => ({ role: m.role, text: m.text })));

      // Get AI response
      const aiResponse = await getAiMentorResponse(userText, chatHistory);

      const aiTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const aiMsg: VoiceMessage = {
        id: `msg-${Date.now()}`,
        role: 'ai',
        text: aiResponse,
        time: aiTimestamp,
      };

      setMessages(prev => [...prev, aiMsg]);

      // Save AI message to database
      await aiChat.addMessage(currentSessionId, {
        role: 'ai',
        content: aiResponse,
      });

      // Speak the response
      speakText(aiResponse);
      toast.success('Response ready!');
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to get response');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleListening = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    } else if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  // Show skeleton while loading chats
  if (isLoadingChats) {
    return <SkeletonChatPage />;
  }

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
            <button onClick={() => setShowNewChatModal(true)}
              className="flex items-center gap-3 px-4 h-[40px] rounded-[12px] text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all cursor-pointer">
              <Plus className="w-4 h-4" />
              <span className="text-[13px] font-medium">New Voice Chat</span>
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchChats()}
                className="w-full h-[40px] pl-3 pr-10 rounded-[12px] bg-white/[0.06] border border-white/10 text-white/80 text-[13px] placeholder:text-white/30 focus:outline-none focus:border-white/30"
              />
              <button onClick={handleSearchChats} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="h-px bg-white/[0.06] mb-4" />

          <div className="flex-1 overflow-y-auto">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.18em] pl-4 mb-3">Voice Chats</p>
            {isLoadingChats ? (
              <p className="text-[12px] text-white/30 pl-4">Loading chats...</p>
            ) : chatSessions.length === 0 ? (
              <p className="text-[12px] text-white/30 pl-4">No voice chats yet. Create one to start!</p>
            ) : (
              <div className="flex flex-col gap-0.5">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`group flex items-center gap-2 px-3 h-[40px] rounded-[12px] transition-all text-left cursor-pointer relative ${
                      currentSessionId === session.id
                        ? 'bg-white/[0.1] text-white/90'
                        : 'hover:bg-white/[0.06] text-white/40 hover:text-white/70'
                    }`}
                    onClick={() => setCurrentSessionId(session.id)}
                  >
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[13px] font-medium truncate flex-1">{session.name}</span>
                    
                    {/* Action buttons on hover */}
                    <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleArchiveChat(session.id); }}
                        className="p-1 hover:bg-white/10 rounded text-white/50 hover:text-white/80 transition-colors"
                        title="Archive"
                      >
                        <Archive className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteChat(session.id); }}
                        className="p-1 hover:bg-red-500/20 rounded text-white/50 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
      <div className="flex-1 relative flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-950">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950" />
        {isListening && (
          <div className="absolute inset-0 transition-opacity duration-700"
            style={{ background: 'radial-gradient(ellipse at 50% 70%, rgba(9,103,189,0.04) 0%, transparent 60%)' }} />
        )}

        {/* Top Bar */}
        <div className="sticky top-0 z-20 px-5 md:px-6 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-gray-100/80 dark:border-slate-700/80">
          <div className="flex items-center justify-between max-w-[860px] mx-auto">
            <div className="flex items-center gap-3">
              <button onClick={onBack}
                className="lg:hidden flex items-center justify-center w-8 h-8 rounded-[10px] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="w-9 h-9 rounded-[12px] flex items-center justify-center relative"
                style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}>
                <Volume2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">Voice Mode</h3>
                  {isListening && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white bg-[#22c55e] animate-pulse">LIVE</span>
                  )}
                  {isProcessing && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white bg-blue-600 animate-pulse">PROCESSING</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-[5px] h-[5px] rounded-full ${isListening ? 'bg-[#22c55e] animate-pulse' : 'bg-slate-400 dark:bg-slate-600'}`} />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Ready'}</span>
                </div>
              </div>
            </div>

            <button onClick={onTextMode}
              className="flex items-center gap-2 px-3.5 py-2 rounded-[12px] text-[11px] font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700">
              <Keyboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Text Mode</span>
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-5 md:px-6 py-5 pb-[350px] relative z-10">
          <div className="max-w-[860px] mx-auto flex flex-col gap-5">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <Volume2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">No messages yet</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">Tap the mic to start talking</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2.5`}>
                  {msg.role === 'ai' && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1"
                      style={{ background: 'linear-gradient(135deg, #0967bd, #003566)' }}>
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[70%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`rounded-[18px] px-5 py-3.5 ${
                      msg.role === 'user'
                        ? 'rounded-br-[6px] bg-gradient-to-br from-slate-900 dark:from-[#003566] to-slate-700 dark:to-[#0967bd] text-white'
                        : 'rounded-bl-[6px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white shadow-sm'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Volume2 className="w-3 h-3 opacity-50" />
                        <span className="text-[10px] opacity-60 font-medium">{msg.role === 'user' ? 'You' : 'AI Response'}</span>
                      </div>
                      <p className="text-[14px] leading-relaxed">{msg.text}</p>
                    </div>
                    <p className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-right' : 'text-left'} text-slate-400 dark:text-slate-500`}>{msg.time}</p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-[#003566] flex items-center justify-center shrink-0 mt-1">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Voice Interface (Bottom) */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="px-5 md:px-6 pb-6 pt-4"
            style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(15,23,42,0.02) 15%, rgba(15,23,42,0.05) 100%) dark:linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 15%, rgba(0,0,0,0.5) 100%)' }}>
            <div className="w-full max-w-[860px] mx-auto">
              <div className="rounded-[24px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl shadow-black/[0.04] dark:shadow-black/20 py-7 px-6 flex flex-col items-center gap-5">
                {/* Status Text */}
                <div className="text-center">
                  <h3 className="text-[20px] font-bold text-slate-900 dark:text-white mb-1"
                    style={{ fontFamily: "'DM Serif Display', serif" }}>
                    {isListening ? "I'm listening..." : isProcessing ? "Processing..." : "Tap to speak"}
                  </h3>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400">
                    {isListening ? "Speak clearly, I'll respond when you pause" : isProcessing ? "Getting AI response..." : "Ask me anything about your studies"}
                  </p>
                </div>

                {/* Waveform Visualizer */}
                <div className="w-full max-w-[360px]">
                  <WaveformBars active={isListening || isProcessing} />
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                  {/* Secondary: Switch to text */}
                  <button onClick={onTextMode}
                    className="w-12 h-12 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-sm hover:shadow-md"
                    title="Switch to text">
                    <Keyboard className="w-5 h-5" />
                  </button>

                  {/* Main Mic Button */}
                  <div className="relative">
                    {(isListening || isProcessing) && (
                      <>
                        <div className="absolute -inset-3 rounded-full border-2 border-[#0967bd]/15 animate-ping"
                          style={{ animationDuration: '2s' }} />
                        <div className="absolute -inset-6 rounded-full border border-[#0967bd]/8 animate-ping"
                          style={{ animationDuration: '2.5s' }} />
                      </>
                    )}

                    <button
                      onClick={toggleListening}
                      disabled={isProcessing}
                      className={`relative w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer ${
                        isListening
                          ? 'shadow-[0_0_50px_rgba(9,103,189,0.25)] scale-110'
                          : 'shadow-lg hover:shadow-xl hover:scale-105'
                      } ${isProcessing ? 'opacity-60 cursor-not-allowed' : ''}`}
                      style={{
                        background: isListening || isProcessing
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
                    className="w-12 h-12 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800/20 transition-all cursor-pointer shadow-sm hover:shadow-md"
                    title="End voice session">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 2.59 3.4z" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  </button>
                </div>

                {/* Helper text */}
                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  {isListening ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                      Recording • Tap mic to stop
                    </>
                  ) : isProcessing ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      Getting response...
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

        {/* New Chat Modal */}
        {showNewChatModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowNewChatModal(false)} />
            <div className="relative bg-white dark:bg-slate-800 rounded-[24px] shadow-2xl p-6 w-full max-w-[420px] animate-in fade-in zoom-in-95">
              <h2 className="text-[20px] font-bold text-slate-900 dark:text-white mb-4">Create Voice Chat</h2>
              
              <input
                type="text"
                placeholder="Chat name (e.g., 'Physics Session', 'Math Questions')"
                value={newChatName}
                onChange={(e) => setNewChatName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateNewChat()}
                className="w-full h-[44px] px-4 rounded-[12px] border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 mb-6"
                autoFocus
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewChatModal(false)}
                  className="flex-1 h-[44px] rounded-[12px] border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-bold text-[14px] hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNewChat}
                  className="flex-1 h-[44px] rounded-[12px] bg-blue-600 text-white font-bold text-[14px] hover:bg-blue-700 transition-colors"
                >
                  Create Chat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
