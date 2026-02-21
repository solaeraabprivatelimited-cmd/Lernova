import React, { useState, useRef, useEffect, useCallback } from "react";
import svgPaths from "@/imports/svg-7rmr01j40r";
import micSvgPaths from "@/imports/svg-tz09jhm2xe";
import imgSayHi1 from "figma:asset/5e91c4f0fbdda278a8c62c9c5428eca49ba69e08.png";

/* ── SVG Icon Components ── */

/** Small mic icon for the text input bar */
function MicIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]">
      <div className="absolute inset-[8.33%_20.83%_12.5%_20.83%]">
        <div className="absolute inset-[0_-7.14%_-5.26%_-7.14%]">
          <svg className="block size-full" fill="none" viewBox="0 0 16 20">
            <path d={svgPaths.p17188b80} fill="#003566" />
            <path
              d={svgPaths.p11bfc93e}
              stroke="#003566"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

/** Large mic icon for the "On Mic" listening panel */
function LargeMicIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[67px]">
      <div className="absolute inset-[19.4%_28.99%_12.5%_20.83%]">
        <div className="absolute inset-[0_-2.97%_-2.2%_-2.97%]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 35.6189 46.6248"
          >
            <g>
              <path d={micSvgPaths.p11c0ecb0} fill="#003566" />
              <path
                d={micSvgPaths.p168ffd40}
                stroke="#003566"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function SendIcon() {
  return (
    <svg className="size-[20px]" viewBox="0 0 24 24" fill="none">
      <path
        d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
  happy:
    "That's wonderful to hear! Being happy is a great state of mind. What's making you feel this way? Recognizing the sources of our joy helps us cultivate more of it.",
  sad: "I'm sorry you're feeling down. It's okay to feel sad sometimes \u2014 it's part of being human. Would you like to talk about what's on your mind? I'm here to listen.",
  stressed:
    "Stress can be really overwhelming. Take a deep breath with me \u2014 in for 4 counts, hold for 4, out for 4. Would you like me to suggest some stress-relief techniques?",
  anxious:
    "Feeling anxious can be tough. Remember, you're safe right now. Try grounding yourself: name 5 things you can see, 4 you can touch, 3 you can hear. Would you like to explore more calming strategies?",
  tired:
    "It sounds like you need some rest. Make sure you're taking care of yourself \u2014 hydration, breaks, and sleep are important. Would you like tips for better energy management?",
  angry:
    "I understand you're feeling frustrated. It's valid to feel angry. Taking a moment to step back and breathe can help. What triggered this feeling? Let's work through it together.",
  excited:
    "Your excitement is contagious! Channel that positive energy into something productive. What are you looking forward to?",
  confused:
    "Feeling confused is a normal part of learning and growing. Sometimes stepping away and coming back with fresh eyes helps. Would you like to break down what's confusing you?",
  lonely:
    "Feeling lonely is more common than you think. You're not alone in this \u2014 I'm here, and there are communities waiting to connect with you. Would you like to explore the World Chat?",
  grateful:
    "Gratitude is a beautiful emotion! Studies show that practicing gratitude regularly can boost happiness by 25%. What are you grateful for today?",
};

function getAIResponse(message: string): string {
  const lowerMsg = message.toLowerCase();

  for (const [mood, response] of Object.entries(moodResponses)) {
    if (lowerMsg.includes(mood)) {
      return response;
    }
  }

  if (
    lowerMsg.includes("good") ||
    lowerMsg.includes("great") ||
    lowerMsg.includes("amazing") ||
    lowerMsg.includes("fantastic")
  ) {
    return "That's great to hear! Positive feelings are worth celebrating. What's contributing to your good mood today?";
  }
  if (
    lowerMsg.includes("bad") ||
    lowerMsg.includes("terrible") ||
    lowerMsg.includes("awful") ||
    lowerMsg.includes("horrible")
  ) {
    return "I'm sorry you're not feeling well. Remember, tough days don't last forever. Would you like to talk about what's going on?";
  }
  if (
    lowerMsg.includes("okay") ||
    lowerMsg.includes("fine") ||
    lowerMsg.includes("alright") ||
    lowerMsg.includes("so-so")
  ) {
    return "Sometimes 'okay' is perfectly fine. Is there anything specific on your mind? Even small feelings are worth exploring.";
  }
  if (lowerMsg.includes("help") || lowerMsg.includes("support")) {
    return "I'm here to help! You can share how you're feeling in your own words, and I'll do my best to understand and support you. What's on your mind?";
  }

  return "Thank you for sharing. I'm here to listen and support you. Can you tell me more about how you're feeling? You can describe your emotions in any way that feels natural to you.";
}

/* ── Main Component ── */

interface MoodCheckInViewProps {
  onBack: () => void;
}

export function MoodCheckInView({ onBack }: MoodCheckInViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [listeningSeconds, setListeningSeconds] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listeningTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Cleanup listening timer on unmount
  useEffect(() => {
    return () => {
      if (listeningTimerRef.current) {
        clearInterval(listeningTimerRef.current);
      }
    };
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: "user",
        text: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsTyping(true);

      setTimeout(() => {
        const aiResponse = getAIResponse(trimmed);
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: aiResponse,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
      }, 1200 + Math.random() * 800);
    },
    []
  );

  const handleSend = () => {
    sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /** Start listening — show the On Mic panel */
  const startListening = () => {
    setIsListening(true);
    setListeningSeconds(0);

    listeningTimerRef.current = setInterval(() => {
      setListeningSeconds((s) => s + 1);
    }, 1000);
  };

  /** Stop listening — simulate a transcription and send it */
  const stopListening = () => {
    setIsListening(false);
    setListeningSeconds(0);

    if (listeningTimerRef.current) {
      clearInterval(listeningTimerRef.current);
      listeningTimerRef.current = null;
    }

    // Pick a random transcription to simulate voice input
    const randomTranscription =
      voiceTranscriptions[Math.floor(Math.random() * voiceTranscriptions.length)];

    // Simulate a small delay for "processing"
    setTimeout(() => {
      sendMessage(randomTranscription);
    }, 400);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="w-full flex flex-col h-[calc(100vh-96px)]">
      {/* Header */}
      <div className="flex flex-col items-start pb-1.5 mb-4 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="font-['Poppins'] text-[14px] text-black/60 cursor-pointer hover:text-black/80 transition-colors mb-0.5"
        >
          {"< Emotional Wellness"}
        </button>
        <h1 className="font-['Poppins'] font-medium text-[40px] text-black leading-tight">
          Mood Check-In
        </h1>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-1">
          {!hasMessages ? (
            /* Initial Welcome State */
            <div className="flex flex-col items-center justify-center h-full">
              {/* Robot Mascot */}
              <div className="w-[145px] h-[252px] relative mb-4">
                <img
                  src={imgSayHi1}
                  alt="AI Mascot waving hello"
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Greeting */}
              <div className="text-center">
                <p className="font-['Poppins'] font-medium text-[32px] text-black/70 leading-[1.3]">
                  Hello, Jack Sparrow
                </p>
                <p className="font-['Poppins'] font-medium text-[32px] text-black/70 leading-[1.3]">
                  How are you feeling today?
                </p>
              </div>
            </div>
          ) : (
            /* Chat Messages */
            <div className="flex flex-col gap-4 py-4 max-w-[800px] mx-auto w-full">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "ai" && (
                    <div className="size-[36px] rounded-full bg-[#003566] flex items-center justify-center shrink-0 mr-3 mt-1">
                      <img
                        src={imgSayHi1}
                        alt="AI"
                        className="size-[24px] object-contain"
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] px-4 py-3 rounded-[16px] font-['Poppins'] text-[14px] leading-[1.6] ${
                      msg.sender === "user"
                        ? "bg-[#003566] text-white rounded-br-[4px]"
                        : "bg-[#f0f4f8] text-black/80 rounded-bl-[4px]"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* AI Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="size-[36px] rounded-full bg-[#003566] flex items-center justify-center shrink-0 mr-3 mt-1">
                    <img
                      src={imgSayHi1}
                      alt="AI"
                      className="size-[24px] object-contain"
                    />
                  </div>
                  <div className="bg-[#f0f4f8] px-4 py-3 rounded-[16px] rounded-bl-[4px] flex items-center gap-1.5">
                    <span
                      className="size-[8px] bg-black/30 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="size-[8px] bg-black/30 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="size-[8px] bg-black/30 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Bar — toggles between text input and On Mic panel */}
        <div className="shrink-0 pt-4 pb-2">
          {isListening ? (
            /* ── On Mic Listening Panel ── */
            <div className="bg-white rounded-[12px] shadow-[0px_4px_60px_5px_rgba(0,0,0,0.15)] overflow-clip flex flex-col items-center py-[36px] gap-[24px] w-full max-w-[1082px]">
              <p className="font-['Poppins'] font-medium text-[24px] text-black/60">
                Ask me anything
              </p>

              {/* Large Mic Button */}
              <button
                type="button"
                onClick={stopListening}
                className="bg-white rounded-full shadow-[0px_4px_60px_0px_rgba(0,0,0,0.1)] size-[105px] flex items-center justify-center cursor-pointer hover:shadow-[0px_4px_60px_0px_rgba(0,0,0,0.18)] transition-shadow relative"
              >
                {/* Pulsing ring animation */}
                <span className="absolute inset-0 rounded-full border-2 border-[#003566]/20 animate-ping" />
                <span className="absolute inset-[6px] rounded-full border-2 border-[#003566]/10 animate-pulse" />
                <LargeMicIcon />
              </button>

              {/* Listening indicator */}
              <div className="flex items-center gap-3">
                <span className="size-[10px] bg-red-500 rounded-full animate-pulse" />
                <p className="font-['Poppins'] text-[14px] text-black/50">
                  Listening... {formatTime(listeningSeconds)}
                </p>
                <button
                  type="button"
                  onClick={stopListening}
                  className="font-['Poppins'] text-[14px] text-[#003566] cursor-pointer hover:underline"
                >
                  Stop
                </button>
              </div>
            </div>
          ) : (
            /* ── Text Input Bar ── */
            <div className="flex gap-[20px] items-start w-full max-w-[1082px]">
              {/* Input Field */}
              <div className="flex-1 h-[54px] bg-white rounded-[12px] shadow-[0px_4px_60px_5px_rgba(0,0,0,0.15)] flex items-center px-4 justify-between">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type here"
                  className="flex-1 font-['Poppins'] font-medium text-[16px] text-black/60 bg-transparent outline-none border-none placeholder:text-black/60"
                />
                <button
                  type="button"
                  className="shrink-0 cursor-pointer p-1 hover:opacity-70 transition-opacity"
                  onClick={startListening}
                >
                  <MicIcon />
                </button>
              </div>

              {/* Send Button */}
              <button
                type="button"
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="bg-[#003566] size-[54px] rounded-full shrink-0 flex items-center justify-center cursor-pointer hover:bg-[#002a52] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SendIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
