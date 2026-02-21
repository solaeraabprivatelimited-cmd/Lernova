import React, { useState, useRef, useEffect } from "react";
import imgEllipse1 from "figma:asset/798eac6e288222603807db12d070c52d1a145785.png";
import imgRectangle39951 from "figma:asset/e1dadbc98b774e2ab4d6bd1189e0b24dd17951cb.png";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { worldChat, getCurrentUser } from "@/app/lib/api";

/* ── Types ── */

interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  time: string;
  isOwn: boolean;
}

/* ── Mock Data ── */

const mockUsers = [
  {
    name: "Alex",
    avatar: "https://images.unsplash.com/photo-1543132220-e7fef0b974e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHlvdW5nJTIwbWFuJTIwY2FzdWFsfGVufDF8fHx8MTc3MTEyMjU2Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "Mia",
    avatar: "https://images.unsplash.com/photo-1680983387172-aedb346ba443?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHlvdW5nJTIwd29tYW4lMjBzdHVkZW50fGVufDF8fHx8MTc3MTE3Mjg3NHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "Jordan",
    avatar: "https://images.unsplash.com/photo-1623594675959-02360202d4d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHNtaWxpbmclMjB3b21hbiUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzExNzI4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

const autoReplies = [
  "That's a great point! I totally agree.",
  "Has anyone tried the new study technique mentioned in the wellness resources?",
  "I've been feeling much better since I started meditating daily.",
  "Same here! The mood check-in feature really helped me track my progress.",
  "Anyone else studying for finals this week?",
  "Just finished a 2-hour focus session. Feeling accomplished!",
  "Remember to take breaks everyone! Self-care matters.",
  "The lofi beats playlist is amazing for studying!",
];

/* ── Send Button SVG ── */

function SendIcon() {
  return (
    <div className="relative size-[24px]">
      <svg className="block size-full" fill="none" viewBox="0 0 24 24">
        <mask
          id="sendMask"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <image
            href={imgRectangle39951}
            x="0"
            y="0"
            width="24"
            height="24"
          />
        </mask>
        <g mask="url(#sendMask)">
          <rect fill="white" width="24" height="24" />
        </g>
      </svg>
    </div>
  );
}

/* ── Chat Bubble Components ── */

interface ChatBubbleProps {
  message: ChatMessage;
  reportOpenId: string | null;
  onAvatarClick: (id: string) => void;
  onReport: (senderName: string) => void;
}

function OtherChatBubble({ message, reportOpenId, onAvatarClick, onReport }: ChatBubbleProps) {
  return (
    <div className="flex flex-col gap-0 items-start w-full">
      <div className="flex gap-[8px] items-end w-full">
        <button
          type="button"
          onClick={() => onAvatarClick(message.id)}
          className="relative shrink-0 size-[38px] rounded-full overflow-hidden cursor-pointer hover:ring-2 hover:ring-black/20 transition-all"
          data-report-area
        >
          <ImageWithFallback
            alt={message.sender}
            className="block max-w-none size-full object-cover"
            src={message.avatar}
          />
        </button>
        <div className="flex flex-1 flex-col gap-[3px] items-start min-w-0">
          <p className="font-['Poppins'] text-[12px] text-black/60 w-full">
            <span className="text-black">{message.sender}</span>
            <span>{` | ${message.time}`}</span>
          </p>
          <div className="bg-white rounded-[12px] shadow-[0px_4px_60px_5px_rgba(0,0,0,0.15)] w-full">
            <div className="flex items-center p-[16px] w-full">
              <p className="font-['Poppins'] text-[16px] text-black/70">
                {message.text}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Report Popup */}
      {reportOpenId === message.id && (
        <button
          type="button"
          onClick={() => onReport(message.sender)}
          className="bg-white h-[40px] w-[147px] rounded-[12px] shadow-[0px_4px_60px_5px_rgba(0,0,0,0.15)] flex items-center justify-center ml-[46px] mt-[4px] cursor-pointer hover:bg-red-50 transition-colors"
          data-report-area
        >
          <span className="font-['Poppins'] font-medium text-[12px] text-[#ff5e5e]">
            Report
          </span>
        </button>
      )}
    </div>
  );
}

function OwnChatBubble({ message }: Pick<ChatBubbleProps, "message">) {
  return (
    <div className="flex gap-[8px] items-end w-full">
      <div className="flex flex-1 flex-col gap-[3px] items-end min-w-0">
        <p className="font-['Poppins'] text-[12px] text-black/60 text-right w-full">
          <span className="text-black">{message.sender}</span>
          <span>{` | ${message.time}`}</span>
        </p>
        <div className="bg-[#c9e5ff] rounded-[12px] shadow-[0px_4px_60px_5px_rgba(0,0,0,0.15)] w-full">
          <div className="flex items-center p-[16px] w-full">
            <p className="font-['Poppins'] text-[16px] text-black/70">
              {message.text}
            </p>
          </div>
        </div>
      </div>
      <div className="relative shrink-0 size-[38px] rounded-full overflow-hidden">
        <ImageWithFallback
          alt={message.sender}
          className="block max-w-none size-full object-cover"
          src={message.avatar}
        />
      </div>
    </div>
  );
}

/* ── Main Component ── */

const reportReasons = [
  "Inappropriate visuals or gestures",
  "Camera showing disturbing or distracting content",
  "Using unrelated or misleading video feed",
  "Other",
] as const;

/* ── Report User Modal ── */

interface ReportModalProps {
  senderName: string;
  onClose: () => void;
  onSubmit: (reason: string, description: string) => void;
}

function ReportUserModal({ senderName, onClose, onSubmit }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>(reportReasons[0]);
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    onSubmit(
      selectedReason,
      selectedReason === "Other" ? description : ""
    );
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[20px] shadow-[0px_4px_60px_5px_rgba(0,0,0,0.15)] w-[436px] p-[24px] flex flex-col gap-[26px] items-start">
        {/* Header */}
        <div className="flex flex-col gap-[6px] items-start w-full">
          <p className="font-['Poppins'] font-semibold text-[24px] text-black w-full">
            Report User
          </p>
          <p className="font-['Poppins'] text-[12px] text-black w-full">
            Help us maintain a calm and distraction-free study environment
          </p>
        </div>

        {/* Radio Options */}
        <div className="flex flex-col gap-[15px] items-start w-full">
          {reportReasons.map((reason) => (
            <button
              key={reason}
              type="button"
              onClick={() => setSelectedReason(reason)}
              className="flex gap-[8px] items-center cursor-pointer"
            >
              {/* Radio Circle */}
              <div className="relative shrink-0 size-[18px]">
                <svg className="block size-full" fill="none" viewBox="0 0 18 18">
                  <circle cx="9" cy="9" r="9" fill={selectedReason === reason ? "#D9D9D9" : "#D9D9D9"} />
                  {selectedReason === reason && (
                    <circle cx="9" cy="9" r="4" fill="#003566" />
                  )}
                </svg>
              </div>
              <span className="font-['Poppins'] text-[14px] text-black">
                {reason}
              </span>
            </button>
          ))}

          {/* Other — Description Textarea */}
          {selectedReason === "Other" && (
            <div className="bg-[#d9d9d9] rounded-[20px] w-full h-[127px] ml-[26px] overflow-hidden"
              style={{ width: "calc(100% - 26px)" }}
            >
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue briefly"
                className="font-['Poppins'] text-[12px] text-black/70 bg-transparent outline-none border-none w-full h-full resize-none p-[16px] placeholder:text-black/70"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-[16px] items-center justify-end w-full">
          {/* Cancel */}
          <button
            type="button"
            onClick={onClose}
            className="h-[42px] w-[156px] flex items-center justify-center rounded-[20px] border border-black cursor-pointer hover:bg-black/5 transition-colors"
          >
            <span className="font-['Poppins'] text-[14px] text-black">
              Cancel
            </span>
          </button>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedReason === "Other" && !description.trim()}
            className="bg-[#ff5e5e] h-[42px] w-[156px] flex items-center justify-center rounded-[20px] cursor-pointer hover:bg-[#e54e4e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-['Poppins'] font-medium text-[14px] text-white">
              Submit
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

interface WorldChatViewProps {
  onBack: () => void;
}

export function WorldChatView({ onBack }: WorldChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [reportOpenId, setReportOpenId] = useState<string | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportSenderName, setReportSenderName] = useState("");
  const currentUser = getCurrentUser();
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load messages from API and poll for new ones
  const loadMessages = async () => {
    try {
      const raw = await worldChat.getMessages();
      const myId = currentUser?.id;
      setMessages(raw.map((m: any) => ({ ...m, isOwn: m.senderId === myId })));
    } catch (e) {
      console.log("WorldChat load error:", e);
    }
  };

  useEffect(() => {
    loadMessages();
    pollRef.current = setInterval(loadMessages, 5000); // poll every 5s
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  // Close report popup when clicking outside
  useEffect(() => {
    if (!reportOpenId) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-report-area]")) setReportOpenId(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [reportOpenId]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes}${ampm}`;
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const text = inputText.trim();
    setInputText("");
    try {
      const senderName = currentUser?.name || "You";
      const senderAvatar = currentUser?.avatar || imgEllipse1;
      await worldChat.sendMessage(text, senderName, senderAvatar);
      await loadMessages();
    } catch (e) {
      console.log("Send message error:", e);
      // Optimistic local fallback
      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: currentUser?.name || "You",
        avatar: currentUser?.avatar || imgEllipse1,
        text,
        time: getCurrentTime(),
        isOwn: true,
      };
      setMessages((prev) => [...prev, newMsg]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleAvatarClick = (id: string) => {
    setReportOpenId((prev) => (prev === id ? null : id));
  };

  const handleReport = (senderName: string) => {
    setReportOpenId(null);
    setReportSenderName(senderName);
    setReportModalOpen(true);
  };

  const handleReportModalClose = () => {
    setReportModalOpen(false);
  };

  const handleReportModalSubmit = (reason: string, description: string) => {
    setReportModalOpen(false);
    // Show a brief confirmation
    setTimeout(() => {
      alert(`${reportSenderName} has been reported. Our team will review this.`);
    }, 100);
  };

  return (
    <div className="w-full flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col items-start pb-1.5 mb-6 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="font-['Poppins'] text-[14px] text-black/60 cursor-pointer hover:text-black/80 transition-colors mb-0.5"
        >
          {"< Emotional Wellness"}
        </button>
        <h1 className="font-['Poppins'] font-medium text-[40px] text-black leading-tight">
          World Chat
        </h1>
      </div>

      {/* Chat Messages Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 flex flex-col gap-[24px] overflow-y-auto pb-4 pr-2 max-w-[1082px] w-full min-h-0"
      >
        {messages.map((msg) =>
          msg.isOwn ? (
            <OwnChatBubble key={msg.id} message={msg} />
          ) : (
            <OtherChatBubble key={msg.id} message={msg} reportOpenId={reportOpenId} onAvatarClick={handleAvatarClick} onReport={handleReport} />
          )
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="flex gap-[20px] items-center max-w-[1082px] w-full pt-4 shrink-0">
        {/* Text Input */}
        <div className="bg-white flex-1 h-[54px] rounded-[12px] shadow-[0px_4px_60px_5px_rgba(0,0,0,0.15)]">
          <div className="flex items-center px-[16px] size-full">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type here"
              className="font-['Poppins'] font-medium text-[16px] text-black bg-transparent outline-none border-none w-full placeholder:text-black/60"
            />
          </div>
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={sendMessage}
          disabled={!inputText.trim()}
          className="bg-[#003566] rounded-full size-[54px] flex items-center justify-center cursor-pointer hover:bg-[#002a52] transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Report User Modal */}
      {reportModalOpen && (
        <ReportUserModal
          senderName={reportSenderName}
          onClose={handleReportModalClose}
          onSubmit={handleReportModalSubmit}
        />
      )}
    </div>
  );
}