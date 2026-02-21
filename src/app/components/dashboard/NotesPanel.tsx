import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Plus, ArrowLeft, Trash2 } from 'lucide-react';
import { notes as notesApi } from '@/app/lib/api';
import { toast } from 'sonner';

interface NotesPanelProps {
  onClose: () => void;
  isOpen?: boolean;
}

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: string;
}

function mapApiNote(n: any): Note {
  return {
    id: n.id,
    title: n.title || 'Untitled',
    content: n.content || '',
    timestamp: n.createdAt
      ? new Date(n.createdAt).toLocaleString('en-US', {
          month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit',
        })
      : 'Just now',
  };
}

export function NotesPanel({ onClose, isOpen }: NotesPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [notesList, setNotesList] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // editing: null = list, 'new' = create, id = edit existing
  const [editingId, setEditingId] = useState<string | null | 'new'>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Track when the panel opens to (re)load notes
  const wasOpen = useRef(false);

  // Load notes from backend whenever the panel becomes visible
  useEffect(() => {
    // isOpen is undefined (always-mounted mode) or explicitly true
    if (isOpen === false) return;
    // Only load if not already loaded or if re-opening
    if (!wasOpen.current || notesList.length === 0) {
      wasOpen.current = true;
      setIsLoading(true);
      notesApi.list()
        .then((data: any[]) => setNotesList(data.map(mapApiNote)))
        .catch((e) => {
          console.log('NotesPanel: failed to load notes', e);
          toast.error('Failed to load notes');
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  // If controlled via isOpen prop and closed, render nothing (after hooks)
  if (isOpen === false) return null;

  const openNew = () => {
    setEditTitle('');
    setEditContent('');
    setEditingId('new');
  };

  const openEdit = (note: Note) => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditingId(note.id);
  };

  const handleSave = async () => {
    if (!editTitle.trim() && !editContent.trim()) {
      setEditingId(null);
      return;
    }
    setIsSaving(true);
    try {
      if (editingId === 'new') {
        const created = await notesApi.create(editTitle.trim() || 'Untitled', editContent.trim());
        setNotesList((prev) => [mapApiNote(created), ...prev]);
        toast.success('Note saved');
      } else if (editingId) {
        await notesApi.update(editingId, {
          title: editTitle.trim() || 'Untitled',
          content: editContent.trim(),
        });
        setNotesList((prev) =>
          prev.map((n) =>
            n.id === editingId
              ? { ...n, title: editTitle.trim() || 'Untitled', content: editContent.trim() }
              : n
          )
        );
        toast.success('Note updated');
      }
    } catch (e) {
      console.log('NotesPanel: save error', e);
      toast.error('Failed to save note');
    } finally {
      setIsSaving(false);
      setEditingId(null);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notesApi.delete(id);
      setNotesList((prev) => prev.filter((n) => n.id !== id));
      toast.success('Note deleted');
    } catch (e) {
      console.log('NotesPanel: delete error', e);
      toast.error('Failed to delete note');
    }
  };

  const filtered = notesList.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Edit / Create view ──
  if (editingId !== null) {
    return (
      <div className="absolute right-8 top-[62px] bg-[rgba(247,247,247,0.15)] backdrop-blur-md rounded-[20px] w-[462px] h-[722px] font-['Poppins'] z-40 overflow-hidden flex flex-col">
        <div className="flex flex-col gap-5 pl-8 pr-4 pt-5 pb-8 h-full">
          {/* Header */}
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[14px]">Notes</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full px-4 py-1.5 disabled:opacity-50 mr-3"
            >
              {isSaving && (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span className="text-[13px] text-white">Save</span>
            </button>
          </div>

          {/* Title */}
          <input
            type="text"
            placeholder="Note title…"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
            className="bg-transparent font-medium text-[20px] text-white outline-none placeholder:text-white/30 border-b border-white/10 pb-3"
          />

          {/* Content */}
          <textarea
            placeholder="Start writing your note…"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="flex-1 bg-transparent text-[15px] text-white/80 outline-none placeholder:text-white/30 resize-none leading-relaxed"
          />

          {/* Character count */}
          <p className="text-[11px] text-white/30 text-right pr-3">{editContent.length} characters</p>
        </div>
      </div>
    );
  }

  // ── List view ──
  return (
    <div className="absolute right-8 top-[62px] bg-[rgba(247,247,247,0.2)] backdrop-blur-md rounded-[20px] w-[462px] h-[722px] font-['Poppins'] z-40 overflow-hidden">
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
            <Search className="w-6 h-6 text-white/60 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Notes"
              className="bg-transparent outline-none text-white text-[16px] placeholder:text-white/60 flex-1 font-['Poppins']"
            />
          </div>

          {/* Section Header */}
          <div className="flex items-center justify-between w-full">
            <p className="text-[12px] text-white/60 font-normal uppercase">My Notes</p>
            <button
              type="button"
              onClick={openNew}
              className="text-white/60 hover:text-white transition-colors"
              title="New note"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-10">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Empty state */}
          {!isLoading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <svg className="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p className="text-white/40 text-[14px] text-center font-['Poppins']">
                {searchQuery ? 'No notes match your search' : 'No notes yet. Tap + to create one.'}
              </p>
              {!searchQuery && (
                <button
                  type="button"
                  onClick={openNew}
                  className="mt-2 bg-white/10 hover:bg-white/15 transition-colors rounded-full px-5 py-2 text-white/70 text-[13px]"
                >
                  + Create your first note
                </button>
              )}
            </div>
          )}

          {/* Notes list */}
          {!isLoading && filtered.length > 0 && (
            <div className="flex flex-col gap-5">
              {filtered.map((note) => (
                <div
                  key={note.id}
                  onClick={() => openEdit(note)}
                  className="bg-white/10 hover:bg-white/15 rounded-[20px] p-6 flex flex-col gap-2.5 cursor-pointer group transition-colors relative"
                >
                  {/* Title */}
                  <h3 className="text-[16px] font-medium text-white leading-normal">{note.title}</h3>

                  {/* Content preview */}
                  <p
                    className="text-[14px] text-white/60 leading-normal overflow-hidden"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 5,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {note.content || <span className="italic text-white/30">Empty note</span>}
                  </p>

                  {/* Footer row */}
                  <div className="flex items-center justify-between w-full mt-1">
                    <p className="text-[12px] font-medium text-white/50 leading-normal">{note.timestamp}</p>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(note.id, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded-full"
                      title="Delete note"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}