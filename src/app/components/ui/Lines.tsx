import React from 'react';

export function Lines({ className }: { className?: string }) {
  return (
    <div className={`absolute inset-0 w-full h-full -z-10 opacity-30 pointer-events-none overflow-hidden ${className}`}>
      <svg className="w-full h-full" preserveAspectRatio="none">
         <defs>
            <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="50%" stopColor="#003566" stopOpacity="0.5" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
         </defs>
         {Array.from({ length: 10 }).map((_, i) => (
             <line 
                key={i} 
                x1={`${10 + i * 10}%`} 
                y1="0" 
                x2={`${10 + i * 10}%`} 
                y2="100%" 
                stroke="url(#line-gradient)" 
                strokeWidth="1" 
            />
         ))}
      </svg>
    </div>
  );
}
