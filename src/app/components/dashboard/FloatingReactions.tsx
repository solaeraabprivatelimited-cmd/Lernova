import React, { useEffect, useState } from 'react';

interface FloatingReaction {
  id: string;
  emoji: string;
  x: number;
  y: number;
  delay: number;
}

interface FloatingReactionsProps {
  reactions: { emoji: string; timestamp: number }[];
}

export function FloatingReactions({ reactions }: FloatingReactionsProps) {
  const [activeReactions, setActiveReactions] = useState<FloatingReaction[]>([]);

  useEffect(() => {
    if (reactions.length > 0) {
      const latestReaction = reactions[reactions.length - 1];
      
      // Generate multiple floating emojis for a reaction burst
      const burst: FloatingReaction[] = [];
      const emojiCount = 15; // Number of emojis to show
      
      for (let i = 0; i < emojiCount; i++) {
        burst.push({
          id: `${latestReaction.timestamp}-${i}`,
          emoji: latestReaction.emoji,
          x: Math.random() * 100, // Random horizontal position (0-100%)
          y: Math.random() * 100, // Random vertical position (0-100%)
          delay: Math.random() * 0.5 // Random delay for staggered appearance (0-0.5s)
        });
      }
      
      setActiveReactions(prev => [...prev, ...burst]);
      
      // Remove these reactions after animation completes
      setTimeout(() => {
        setActiveReactions(prev => 
          prev.filter(r => !burst.some(b => b.id === r.id))
        );
      }, 3000); // Match animation duration
    }
  }, [reactions]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[35] overflow-hidden">
      {activeReactions.map((reaction) => (
        <div
          key={reaction.id}
          className="absolute text-[36px] animate-float-up-fade floating-reaction"
          style={{
            left: `${reaction.x}%`,
            top: `${reaction.y}%`,
          } as React.CSSProperties}
        >
          {reaction.emoji}
        </div>
      ))}
    </div>
  );
}
