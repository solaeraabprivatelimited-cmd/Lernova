import React from 'react';

interface ReactionBarProps {
  isVisible: boolean;
  onReactionSelect: (emoji: string) => void;
}

export function ReactionBar({ isVisible, onReactionSelect }: ReactionBarProps) {
  const reactions = [
    { emoji: '💝', label: 'heart' },
    { emoji: '👍', label: 'thumbs up' },
    { emoji: '👏', label: 'clap' },
    { emoji: '✏️', label: 'pencil' },
    { emoji: '😂', label: 'laugh' },
    { emoji: '😯', label: 'surprised' },
    { emoji: '😱', label: 'shocked' },
    { emoji: '😭', label: 'cry' },
    { emoji: '👎', label: 'thumbs down' }
  ];

  if (!isVisible) return null;

  return (
    <div className="absolute bottom-[100px] left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-4 fade-in duration-200 font-['Poppins']">
      <div className="bg-[rgba(39,39,42,0.95)] backdrop-blur-md rounded-[40px] px-6 py-4 flex items-center gap-4 shadow-2xl border border-white/10">
        {reactions.map((reaction, index) => (
          <button
            key={index}
            onClick={() => onReactionSelect(reaction.emoji)}
            className={`text-[32px] hover:scale-125 active:scale-95 transition-transform cursor-pointer ${
              index === 0 ? 'relative' : ''
            }`}
            aria-label={reaction.label}
          >
            {index === 0 && (
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full blur-lg opacity-50 -z-10" />
            )}
            {reaction.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
