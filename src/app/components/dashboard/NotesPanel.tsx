import React, { useState } from 'react';
import { X, Search, Plus } from 'lucide-react';

interface NotesPanelProps {
  onClose: () => void;
}

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: string;
}

export function NotesPanel({ onClose }: NotesPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [notes] = useState<Note[]>([
    {
      id: '1',
      title: 'Social Science',
      content: 'Lorem ipsum dolor sit amet consectetur. Semper leo quis odio enim. Purus diam at aenean morbi dictum. Est dui id malesuada amet pellentesque mattis leo. Placerat id libero eget enim ut rhoncus massa lectus. In et bibendum sem phasellus.',
      timestamp: 'Today, 15:24'
    },
    {
      id: '2',
      title: 'Mathematics',
      content: 'Lorem ipsum dolor sit amet consectetur. Semper leo quis odio enim. Purus diam at aenean morbi dictum. Est dui id malesuada amet pellentesque mattis leo. Placerat id libero eget enim ut rhoncus massa lectus. In et bibendum sem phasellus.Lorem ipsum dolor sit amet consectetur. Semper leo quis odio enim. Purus diam at aenean morbi dictum. Est dui id malesuada amet pellentesque mattis leo. Placerat id libero eget enim ut rhoncus massa lectus. In et bibendum sem phasellus.',
      timestamp: 'Today, 15:24'
    }
  ]);

  return (
    <div className="absolute right-8 top-[62px] bg-[rgba(247,247,247,0.2)] backdrop-blur-md rounded-[20px] w-[462px] h-[722px] font-['Poppins'] z-40 overflow-hidden">
      {/* Content Area */}
      <div className="flex flex-col gap-5 pl-8 pr-4 pt-4 pb-8 h-full">
        {/* Header */}
        <div className="flex items-center justify-end gap-2.5 w-full">
          <h2 className="text-[24px] font-medium text-white flex-1">Notes</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-[32px] h-[32px] flex shrink-0 items-center justify-center hover:opacity-70 transition-opacity cursor-pointer relative z-50"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white stroke-2" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-5">
          {/* Search Bar */}
          <div className="bg-white/10 rounded-[20px] px-6 py-[9px] flex items-center gap-3">
            <Search className="w-6 h-6 text-white/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Notes"
              className="bg-transparent outline-none text-white text-[16px] placeholder:text-white/60 flex-1 font-['Poppins']"
            />
          </div>

          {/* My Notes Section Header */}
          <div className="flex items-center justify-between w-full">
            <p className="text-[12px] text-white/60 font-normal">MY NOTES</p>
            <button className="text-white/60 hover:text-white transition-colors">
              <Plus className="w-6 h-6" />
            </button>
          </div>

          {/* Notes List */}
          <div className="flex flex-col gap-5">
            {notes
              .filter(note => 
                note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.content.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((note) => (
                <div
                  key={note.id}
                  className="bg-white/10 rounded-[20px] p-6 flex flex-col gap-2.5"
                >
                  {/* Note Title */}
                  <h3 className="text-[16px] font-medium text-white leading-normal">{note.title}</h3>
                  
                  {/* Note Content */}
                  <p className="text-[16px] text-white/60 leading-normal overflow-hidden" style={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: note.id === '1' ? 6 : 8,
                    WebkitBoxOrient: 'vertical',
                    height: note.id === '1' ? '170px' : '222px'
                  }}>
                    {note.content}
                  </p>
                  
                  {/* Timestamp */}
                  <div className="flex items-center justify-end w-full">
                    <p className="text-[12px] font-medium text-white/70 leading-normal">{note.timestamp}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}