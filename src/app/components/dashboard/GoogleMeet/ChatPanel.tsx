/**
 * ChatPanel - Side panel for real-time chat messaging
 */

import React, { useRef, useEffect, useState } from 'react';
import { X, Send, Smile, Paperclip } from 'lucide-react';

interface ChatMessage {
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
  isLoading?: boolean;
  onSendMessage: (message: string) => Promise<void>;
  onClose: () => void;
}

export function ChatPanel({
  messages,
  currentUserName,
  isLoading = false,
  onSendMessage,
  onClose,
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    setSending(true);
    try {
      await onSendMessage(input.trim());
      setInput('');
    } catch (err) {
      console.error('[ChatPanel] Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <div className="w-80 max-w-full h-full bg-white dark:bg-[#1a1a2e] border-l border-black/5 dark:border-white/10 flex flex-col shadow-lg">
      {/* Header */}
      <div className="border-b border-black/5 dark:border-white/10 px-4 py-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-black dark:text-white">Chat</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          aria-label="Close chat panel"
        >
          <X className="w-5 h-5 text-black/60 dark:text-white/60" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-sm text-black/60 dark:text-white/60">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-sm text-black/60 dark:text-white/60 mb-2">No messages yet</p>
              <p className="text-xs text-black/50 dark:text-white/50">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isLocal ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    msg.isLocal
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-bl-none'
                  }`}
                >
                  {!msg.isLocal && (
                    <p className="text-xs font-semibold opacity-75 mb-1">{msg.senderName}</p>
                  )}
                  <p className="text-sm break-words">{msg.message}</p>
                  <p className={`text-xs mt-1 opacity-60`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-black/5 dark:border-white/10 p-3 space-y-3">
        {/* Typing Indicator (optional) */}
        {sending && (
          <div className="text-xs text-black/50 dark:text-white/50 px-2">
            Sending...
          </div>
        )}

        {/* Input Box */}
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={sending}
            className="flex-1 px-3 py-2 rounded-lg border border-black/20 dark:border-white/20 bg-white dark:bg-gray-900 text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none max-h-24"
            rows={1}
          />

          <div className="flex items-center gap-1">
            <button
              className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              title="Add emoji"
              aria-label="Add emoji"
            >
              <Smile className="w-5 h-5 text-black/60 dark:text-white/60" />
            </button>

            <button
              className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              title="Attach file"
              aria-label="Attach file"
            >
              <Paperclip className="w-5 h-5 text-black/60 dark:text-white/60" />
            </button>

            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Send message"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-xs text-black/50 dark:text-white/50 px-2">
          Press <kbd className="bg-gray-300 dark:bg-gray-700 px-1 rounded text-xs">Shift + Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}
