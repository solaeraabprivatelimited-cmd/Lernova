import React, { useEffect, useState } from 'react';

interface ReactionBurstProps {
  emoji: string;
}

interface FloatingEmoji {
  id: number;
  x: number; // percentage from left
  delay: number; // animation delay in ms
  duration: number; // animation duration in seconds
}

export function ReactionBurst({ emoji }: ReactionBurstProps) {
  const [emojis, setEmojis] = useState<FloatingEmoji[]>([]);

  useEffect(() => {
    // Generate 20-25 random emojis scattered across the video area
    const emojiCount = Math.floor(Math.random() * 6) + 20; // 20-25 emojis
    const newEmojis: FloatingEmoji[] = [];

    for (let i = 0; i < emojiCount; i++) {
      newEmojis.push({
        id: i,
        x: Math.random() * 90 + 5, // 5% to 95% from left
        delay: Math.random() * 400, // 0-400ms delay
        duration: 2 + Math.random() * 1.5, // 2-3.5 seconds
      });
    }

    setEmojis(newEmojis);
  }, [emoji]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      {emojis.map((emojiData) => (
        <div
          key={emojiData.id}
          className="absolute bottom-0 animate-float-up-fade"
          style={{
            left: `${emojiData.x}%`,
            animationDelay: `${emojiData.delay}ms`,
            animationDuration: `${emojiData.duration}s`,
          }}
        >
          <span className="text-[30px] select-none font-semibold">
            {emoji}
          </span>
        </div>
      ))}
    </div>
  );
}