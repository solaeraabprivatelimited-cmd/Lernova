import React, { useState, useRef, useEffect } from "react";
import imgEllipse1 from "figma:asset/798eac6e288222603807db12d070c52d1a145785.png";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { worldChat, getCurrentUser } from "@/app/lib/api";
import {
  ArrowLeft, Send, MessageCircle, Globe, Users, AlertTriangle, X, Flag
} from "lucide-react";

/* ── Types ── */
interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  time: string;
  isOwn: boolean;
}

const reportReasons = [
  "Inappropriate visuals or gestures",
  "Camera showing disturbing or distracting content",
  "Using unrelated or misleading video feed",
  "Other",
] as const;

/* ── Report Modal ── */
function ReportUserModal({ senderName, onClose, onSubmit }: {
  senderName: string; onClose: () => void; onSubmit: (reason: string, desc: string) => void;
}) {
  const [selectedReason, setSelectedReason] = useState<string>(reportReasons[0]);
  const [description, setDescription] = useState("");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#001d3d]/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[24px] shadow-2xl p-7 w-full max-w-[440px] z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-[14px] bg-[#cc3636]/10 flex items-center justify-center shrink-0">
            <Flag className="w-5 h-5 text-[#cc3636]" />
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-[#003566]" style={{ fontFamily: "'DM Serif Display', serif" }}>Report User</h2>
            <p className="text-[11px] text-[#94a3b8]">Help us maintain a safe environment</p>
          </div>
          <button onClick={onClose} className="ml-auto w-8 h-8 rounded-[10px] hover:bg-[#f5f7fa] flex items-center justify-center text-[#94a3b8] hover:text-[#003566] transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2.5 mb-5">
          {reportReasons.map((reason) => (
            <button key={reason} onClick={() => setSelectedReason(reason)}
              className={`flex items-center gap-3 px-4 py-3 rounded-[12px] border text-left cursor-pointer transition-all text-[13px] ${
                selectedReason === reason
                  ? "border-[#0967bd] bg-[#0967bd]/5 text-[#003566] font-semibold"
                  : "border-[#e2e8f0] text-[#5a7089] hover:border-[#c9ddf0]"
              }`}>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                selectedReason === reason ? "border-[#0967bd]" : "border-[#c1c7ce]"
              }`}>
                {selectedReason === reason && <div className="w-2 h-2 rounded-full bg-[#0967bd]" />}
              </div>
              {reason}
            </button>
          ))}

          {selectedReason === "Other" && (
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue briefly..."
              className="w-full h-[100px] border border-[#e2e8f0] rounded-[12px] px-4 py-3 text-[13px] outline-none focus:border-[#0967bd] focus:ring-1 focus:ring-[#0967bd]/20 transition-all text-[#1e293b] placeholder:text-[#94a3b8] bg-white resize-none ml-7" style={{ width: 'calc(100% - 28px)' }} />
          )}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onClose}
            className="flex-1 h-[44px] rounded-[14px] border border-[#e2e8f0] text-[#5a7089] font-bold text-[13px] hover:bg-[#f5f7fa] transition-colors cursor-pointer">
            Cancel
          </button>
          <button onClick={() => onSubmit(selectedReason, selectedReason === "Other" ? description : "")}
            disabled={selectedReason === "Other" && !description.trim()}
            className="flex-1 h-[44px] rounded-[14px] bg-[#cc3636] text-white font-bold text-[13px] hover:bg-[#b52e2e] transition-colors cursor-pointer disabled:opacity-50">
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export function WorldChatView({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [reportOpenId, setReportOpenId] = useState<string | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportSenderName, setReportSenderName] = useState("");
  const currentUser = getCurrentUser();
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadMessages = async () => {
    try {
      const raw = await worldChat.getMessages();
      const myId = currentUser?.id;
      setMessages(raw.map((m: any) => ({ ...m, isOwn: m.senderId === myId })));
    } catch (e) { console.log("WorldChat load error:", e); }
  };

  useEffect(() => {
    loadMessages();
    pollRef.current = setInterval(loadMessages, 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  useEffect(() => {
    if (!reportOpenId) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-report-area]")) setReportOpenId(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [reportOpenId]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const getCurrentTime = () => {
    const now = new Date();
    let h = now.getHours(); const m = now.getMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM"; h = h % 12 || 12;
    return `${h}:${m}${ampm}`;
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const text = inputText.trim(); setInputText("");
    try {
      const name = currentUser?.name || "You";
      const avatar = currentUser?.avatar || imgEllipse1;
      await worldChat.sendMessage(text, name, avatar);
      await loadMessages();
    } catch (e) {
      console.log("Send message error:", e);
      setMessages((prev) => [...prev, { id: Date.now().toString(), sender: currentUser?.name || "You", avatar: currentUser?.avatar || imgEllipse1, text, time: getCurrentTime(), isOwn: true }]);
    }
  };

  return (
    <div className="w-full flex flex-col h-full" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header */}
      <div className="shrink-0 mb-4">
        <button onClick={onBack} className="flex items-center gap-2 text-[#5a7089] hover:text-[#003566] mb-3 transition-colors group cursor-pointer">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[13px] font-medium">Emotional Wellness</span>
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #11998e, #38ef7d)' }}>
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[28px] md:text-[34px] text-[#003566]" style={{ fontFamily: "'DM Serif Display', serif" }}>
                World Chat
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(17,153,142,0.06)', border: '1px solid rgba(17,153,142,0.1)' }}>
            <Users className="w-3.5 h-3.5 text-[#11998e]" />
            <span className="text-[11px] font-semibold text-[#11998e]">{messages.length > 0 ? `${new Set(messages.map(m => m.sender)).size} online` : "Global"}</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={chatContainerRef}
        className="flex-1 flex flex-col gap-4 overflow-y-auto pb-4 pr-1 max-w-[800px] w-full min-h-0">

        {/* Welcome divider */}
        {messages.length > 0 && (
          <div className="flex justify-center mb-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#edf0f4] shadow-sm">
              <Globe className="w-3 h-3 text-[#11998e]" />
              <span className="text-[11px] font-medium text-[#94a3b8]">World Chat</span>
            </div>
          </div>
        )}

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 text-center px-4">
            <div className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-4" style={{ background: 'rgba(17,153,142,0.08)' }}>
              <MessageCircle className="w-7 h-7 text-[#11998e]/40" />
            </div>
            <p className="text-[14px] font-semibold text-[#5a7089]">No messages yet</p>
            <p className="text-[12px] text-[#94a3b8] mt-1">Be the first to start the conversation!</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"} gap-2.5`}>
            {!msg.isOwn && (
              <button onClick={() => setReportOpenId((p) => (p === msg.id ? null : msg.id))}
                className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-1 cursor-pointer hover:ring-2 hover:ring-[#0967bd]/20 transition-all" data-report-area>
                <ImageWithFallback src={msg.avatar} alt={msg.sender} className="w-full h-full object-cover" />
              </button>
            )}
            <div className={`max-w-[72%] ${msg.isOwn ? "flex flex-col items-end" : ""}`}>
              <p className={`text-[10px] text-[#c1c7ce] mb-1 ${msg.isOwn ? "text-right" : ""}`}>
                <span className="font-semibold text-[#5a7089]">{msg.sender}</span> · {msg.time}
              </p>
              <div className={`px-4 py-3 text-[14px] leading-relaxed ${
                msg.isOwn
                  ? "rounded-[18px] rounded-br-[6px] text-white"
                  : "rounded-[18px] rounded-bl-[6px] bg-white text-[#2d3748] shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-[#edf0f4]"
              }`} style={msg.isOwn ? { background: 'linear-gradient(135deg, #003566, #0967bd)' } : undefined}>
                {msg.text}
              </div>

              {/* Report popup */}
              {!msg.isOwn && reportOpenId === msg.id && (
                <button onClick={() => { setReportOpenId(null); setReportSenderName(msg.sender); setReportModalOpen(true); }}
                  className="mt-1.5 flex items-center gap-1.5 px-3 py-2 rounded-[10px] bg-white border border-[#edf0f4] shadow-lg cursor-pointer hover:bg-red-50 hover:border-[#cc3636]/20 transition-all animate-in fade-in slide-in-from-top-1 duration-150"
                  data-report-area>
                  <AlertTriangle className="w-3 h-3 text-[#cc3636]" />
                  <span className="text-[11px] font-bold text-[#cc3636]">Report</span>
                </button>
              )}
            </div>
            {msg.isOwn && (
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-5">
                <ImageWithFallback src={msg.avatar} alt={msg.sender} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="flex gap-2.5 items-center max-w-[800px] w-full pt-3 shrink-0">
        <div className="flex-1 h-[52px] rounded-[16px] bg-white flex items-center px-4 border border-[#e2e8f0] shadow-lg shadow-black/[0.05] hover:border-[#c9ddf0] focus-within:border-[#11998e] focus-within:shadow-[#11998e]/10 transition-all">
          <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-none outline-none text-[14px] text-[#1e293b] placeholder:text-[#b0b8c4] font-medium" />
        </div>
        <button onClick={sendMessage} disabled={!inputText.trim()}
          className="w-[52px] h-[52px] rounded-[16px] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-[1.04] transition-all shrink-0 cursor-pointer disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}>
          <Send className="w-5 h-5 text-white ml-0.5" />
        </button>
      </div>

      {reportModalOpen && (
        <ReportUserModal senderName={reportSenderName} onClose={() => setReportModalOpen(false)}
          onSubmit={(reason, desc) => { setReportModalOpen(false); setTimeout(() => alert(`${reportSenderName} has been reported. Our team will review this.`), 100); }} />
      )}
    </div>
  );
}
