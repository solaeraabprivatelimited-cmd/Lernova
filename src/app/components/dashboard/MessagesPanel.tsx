import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';

interface Message {
  id: string;
  userId: number;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

interface MessagesPanelProps {
  onClose: () => void;
  currentUserId: number;
  currentUserName: string;
  currentUserAvatar: string;
}

export function MessagesPanel({ onClose, currentUserId, currentUserName, currentUserAvatar }: MessagesPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      userId: 0,
      userName: 'You',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      text: 'Hey, there everyone',
      timestamp: '10:14PM',
      isOwn: true,
    },
    {
      id: '2',
      userId: 2,
      userName: 'Alex',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      text: 'Hello',
      timestamp: '10:15PM',
      isOwn: false,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const timestamp = `${displayHours}:${minutes.toString().padStart(2, '0')}${ampm}`;

      const newMessage: Message = {
        id: Date.now().toString(),
        userId: currentUserId,
        userName: currentUserName,
        userAvatar: currentUserAvatar,
        text: inputText,
        timestamp,
        isOwn: true,
      };

      setMessages(prev => [...prev, newMessage]);
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="absolute right-[32px] top-[62px] w-[462px] h-[722px] bg-white/20 backdrop-blur-sm rounded-[20px] overflow-hidden z-50">
      {/* Header */}
      <div className="absolute left-[32px] top-[16px] w-[410px] flex items-center justify-between">
        <h3 className="font-['Poppins'] font-medium text-[24px] text-white leading-normal">Messages</h3>
        <button 
          onClick={onClose}
          type="button"
          className="w-[32px] h-[32px] flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer relative z-50"
          aria-label="Close"
        >
          <X className="w-7 h-7 text-white" strokeWidth={2} />
        </button>
      </div>

      {/* Messages Container */}
      <div className="absolute left-[32px] top-[72px] w-[410px] h-[537px] overflow-y-auto messages-scrollbar">
        <div className="flex flex-col gap-4 pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 items-end ${message.isOwn ? 'flex-row' : 'flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div className="shrink-0 w-[38px] h-[38px] rounded-full overflow-hidden">
                <img
                  src={message.userAvatar}
                  alt={message.userName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Message Content */}
              <div className={`flex flex-col gap-[3px] w-[344px] ${message.isOwn ? 'items-start' : 'items-end'}`}>
                <p className="font-['Poppins'] text-[12px] text-white/60 leading-normal">
                  <span className="text-white">{message.userName}</span>
                  <span> | {message.timestamp}</span>
                </p>
                <div className="bg-white/10 rounded-[20px] px-6 py-4 min-h-[40px] flex items-center max-w-full">
                  <p className="font-['Poppins'] text-[16px] text-white leading-normal break-words">
                    {message.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scrollbar */}
      <div className="absolute left-[436px] top-1/2 -translate-y-1/2 w-[6px] h-[190px] rounded-[20px] bg-white/20 overflow-hidden">
        <div className="absolute left-0 top-[calc(50%-68.5px)] -translate-y-1/2 w-[6px] h-[57px] bg-white rounded-[20px]" />
      </div>

      {/* Input Field */}
      <div className="absolute left-[32px] top-[641px] w-[390px] bg-white/10 rounded-[20px] px-6 py-4 flex items-center justify-between">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here"
          className="flex-1 bg-transparent border-none outline-none font-['Poppins'] text-[16px] text-white placeholder:text-white/60"
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputText.trim()}
          className="ml-4 flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-40"
        >
          <Send className="w-[27px] h-[27px] text-white" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
