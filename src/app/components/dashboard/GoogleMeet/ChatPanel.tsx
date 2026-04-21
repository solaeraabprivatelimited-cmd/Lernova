/**
 * ChatPanel — Slide-in right sidebar chat
 * Message bubbles, timestamps, real-time scroll, send on Enter
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import { X, Send, Smile } from 'lucide-react';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  isLocal: boolean;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  currentUserName: string;
  draftMessage?: string;
  isSending?: boolean;
  onDraftChange?: (v: string) => void;
  onSendMessage: (msg: string) => Promise<void>;
  onClose: () => void;
}

function formatTime(d: Date) {
  return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(d);
}

export function ChatPanel({
  messages,
  currentUserName,
  draftMessage = '',
  isSending = false,
  onDraftChange,
  onSendMessage,
  onClose,
}: ChatPanelProps) {
  const [localDraft, setLocalDraft] = useState(draftMessage);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const draft = onDraftChange ? draftMessage : localDraft;
  const setDraft = onDraftChange ?? setLocalDraft;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = useCallback(async () => {
    const text = draft.trim();
    if (!text || isSending) return;
    setDraft('');
    await onSendMessage(text);
  }, [draft, isSending, onSendMessage, setDraft]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <aside
      className="w-[320px] shrink-0 h-full flex flex-col bg-[#1e1f20] border-l border-white/[0.06] shadow-2xl"
      aria-label="Chat panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06] shrink-0">
        <h2 className="text-[15px] font-semibold text-white">In-call messages</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          aria-label="Close chat"
        >
          <X className="w-4 h-4 text-white/60" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
              <Smile className="w-6 h-6 text-white/30" />
            </div>
            <p className="text-sm text-white/40">No messages yet</p>
            <p className="text-xs text-white/25">Messages are visible to everyone in the call</p>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => {
              const showName = !msg.isLocal && (i === 0 || messages[i - 1].senderId !== msg.senderId);
              return (
                <div key={msg.id} className={`flex ${msg.isLocal ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] ${msg.isLocal ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                    {showName && (
                      <span className="text-[11px] text-white/40 px-1">{msg.senderName}</span>
                    )}
                    <div
                      className={[
                        'px-3 py-2 rounded-2xl text-sm leading-relaxed break-words',
                        msg.isLocal
                          ? 'bg-[#1a73e8] text-white rounded-br-sm'
                          : 'bg-[#2d2e30] text-white/90 rounded-bl-sm',
                      ].join(' ')}
                    >
                      {msg.message}
                    </div>
                    <span className="text-[10px] text-white/25 px-1">{formatTime(msg.timestamp)}</span>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-white/[0.06] p-3">
        <div className="flex items-end gap-2 bg-[#2d2e30] rounded-2xl px-3 py-2">
          <textarea
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Send a message to everyone"
            disabled={isSending}
            rows={1}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none resize-none max-h-24 leading-relaxed disabled:opacity-50"
            aria-label="Message input"
          />
          <button
            onClick={() => void handleSend()}
            disabled={!draft.trim() || isSending}
            className="w-8 h-8 rounded-full bg-[#1a73e8] hover:bg-[#1765cc] flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            aria-label="Send message"
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
        <p className="text-[10px] text-white/20 mt-1.5 px-1">
          Messages are not saved after the call ends
        </p>
      </div>
    </aside>
  );
}
