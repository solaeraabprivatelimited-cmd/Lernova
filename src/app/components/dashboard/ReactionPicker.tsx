import React from 'react';

interface ReactionPickerProps {
  onReactionSelect: (emoji: string) => void;
  onClose: () => void;
}

export function ReactionPicker({ onReactionSelect, onClose }: ReactionPickerProps) {
  const reactions = [
    { emoji: '💖', name: 'Heart' },
    { emoji: '👍', name: 'Thumbs up' },
    { emoji: '👏', name: 'Clap' },
    { emoji: '🎉', name: 'Celebration' },
    { emoji: '😂', name: 'Laughing' },
    { emoji: '😮', name: 'Open Mouth' },
    { emoji: '😢', name: 'Crying' },
    { emoji: '🤔', name: 'Thinking' },
    { emoji: '👎', name: 'Thumbs Down' },
  ];

  const handleReactionClick = (emoji: string) => {
    onReactionSelect(emoji);
    onClose();
  };

  return (
    <>
      {/* Backdrop - invisible but clickable to close */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Reaction Picker Bar */}
      <div className="absolute bottom-[100px] left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-[20px] px-[46px] py-[23px] z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center gap-4">
          {reactions.map((reaction) => (
            <button
              key={reaction.name}
              onClick={() => handleReactionClick(reaction.emoji)}
              className="w-[30px] h-[30px] flex items-center justify-center text-[30px] hover:scale-125 transition-transform duration-200 cursor-pointer select-none"
              title={reaction.name}
            >
              {reaction.emoji}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}