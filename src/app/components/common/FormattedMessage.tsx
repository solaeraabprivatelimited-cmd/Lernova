import React from 'react';

/**
 * FormattedMessage Component
 * Renders markdown-formatted text with:
 * - Bold text: **text** → <strong>
 * - Numbered lists: 1. 2. 3.
 * - Bullet lists: - • *
 * - Paragraph separation via double newlines
 */
export function FormattedMessage({ text }: { text: string }) {
  // Split by double newlines to create paragraphs
  const paragraphs = text.split('\n\n');
  
  return (
    <div className="flex flex-col gap-3">
      {paragraphs.map((paragraph, pIdx) => {
        // Check if this is a numbered list
        const isNumberedList = /^\d+\./.test(paragraph.trim());
        // Check if this is a bullet list
        const isBulletList = /^[-•*]/.test(paragraph.trim());
        
        if (isNumberedList) {
          const items = paragraph.split('\n').filter(line => line.trim());
          return (
            <ol key={pIdx} className="list-decimal list-inside space-y-2 pl-1">
              {items.map((item, itemIdx) => {
                const cleanItem = item.replace(/^\d+\.\s*/, '').trim();
                const parts = cleanItem.split(/\*\*(.+?)\*\*/g);
                return (
                  <li key={itemIdx} className="text-[13px] text-slate-900 dark:text-slate-100 leading-relaxed">
                    {parts.map((part, partIdx) =>
                      partIdx % 2 === 1 ? (
                        <strong key={partIdx} className="font-semibold text-slate-900 dark:text-white">
                          {part}
                        </strong>
                      ) : (
                        <span key={partIdx}>{part}</span>
                      )
                    )}
                  </li>
                );
              })}
            </ol>
          );
        }
        
        if (isBulletList) {
          const items = paragraph.split('\n').filter(line => line.trim());
          return (
            <ul key={pIdx} className="list-disc list-inside space-y-2 pl-1">
              {items.map((item, itemIdx) => {
                const cleanItem = item.replace(/^[-•*]\s*/, '').trim();
                const parts = cleanItem.split(/\*\*(.+?)\*\*/g);
                return (
                  <li key={itemIdx} className="text-[13px] text-slate-900 dark:text-slate-100 leading-relaxed">
                    {parts.map((part, partIdx) =>
                      partIdx % 2 === 1 ? (
                        <strong key={partIdx} className="font-semibold text-slate-900 dark:text-white">
                          {part}
                        </strong>
                      ) : (
                        <span key={partIdx}>{part}</span>
                      )
                    )}
                  </li>
                );
              })}
            </ul>
          );
        }
        
        // Regular paragraph with bold support
        const parts = paragraph.split(/\*\*(.+?)\*\*/g);
        return (
          <p key={pIdx} className="text-[13px] text-slate-900 dark:text-slate-100 leading-relaxed">
            {parts.map((part, partIdx) =>
              partIdx % 2 === 1 ? (
                <strong key={partIdx} className="font-semibold text-slate-900 dark:text-white">
                  {part}
                </strong>
              ) : (
                <span key={partIdx}>{part}</span>
              )
            )}
          </p>
        );
      })}
    </div>
  );
}
