import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, mentorDashboard, profile as profileApi, notifications as notificationsApi, setCurrentUser } from '../lib/api';
import { roomAPI } from '../../utils/api/roomAPI';
import { completePendingOnboarding, shouldShowPendingOnboarding } from '../lib/onboarding';
import svgPaths from '../../imports/svg-awezib197y';
import svgWellness from '../../imports/svg-fui5khiao7';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { RouteLoader } from './RouteLoader';
import { Building2, AlignLeft, Lock, Globe, Hash, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import imgUserAvatar from 'figma:asset/1d3b37310d86db33d00fb05038f712cfa0e01556.png';
import imgSayHi from 'figma:asset/5e91c4f0fbdda278a8c62c9c5428eca49ba69e08.png';
import svgMic from '../../imports/svg-xoj20dj40s';
import svgMicLarge from '../../imports/svg-x88i2k0erj';
import imgResThumb from 'figma:asset/f0a250ad1361e9247b086e20f69a2980c11fcc14.png';
import imgResAuthor from 'figma:asset/d0b5e8618139abd2e6c665600d3134442c6ea4a3.png';
import imgResAttach from 'figma:asset/605a593a8aec5bcd93a6caef17da90dbf55364dc.png';
import svgWellRes from '../../imports/svg-spu5c0og85';
import svgWellResFill from '../../imports/svg-ux77gu3q65';

const OnboardingWalkthrough = React.lazy(async () => {
  const module = await import('./OnboardingWalkthrough');
  return { default: module.OnboardingWalkthrough };
});

const MentorCommunityView = React.lazy(async () => {
  const module = await import('./dashboard/CommunityView');
  return { default: module.CommunityView };
});

const MentorProfileSettings = React.lazy(async () => {
  const module = await import('./dashboard/MentorProfileSettings');
  return { default: module.MentorProfileSettings };
});

const SharedWorldChatView = React.lazy(async () => {
  const module = await import('./dashboard/WorldChatView');
  return { default: module.WorldChatView };
});

interface MentorDashboardProps {
  onLogout: () => void;
}

// ────────────────────────────────────────────────────────────────────────────────
// SVG Icon helpers
// ────────────────────────────────────────────────────────────────────────────────

function ElmOrbitLogo({ onClick }: { onClick?: () => void }) {
  return (
    <button 
      onClick={onClick} 
      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      type="button"
      aria-label="Go to homepage"
    >
      <div className="size-[35px] shrink-0">
        <svg className="block size-full" fill="none" viewBox="0 0 35 35">
          <path d={svgPaths.p3781200} fill="#003566" />
          <path d={svgPaths.p1c6f2500} stroke="#003566" strokeWidth="0.245515" />
          <path d={svgPaths.p31318300} fill="#003566" />
          <path d={svgPaths.p275764f0} stroke="#003566" strokeWidth="0.23811" />
          <circle cx="17.5" cy="17.5" r="15.8594" stroke="#003566" strokeWidth="3.28125" />
          <g clipPath="url(#clip0_m)">
            <path clipRule="evenodd" d={svgPaths.p2338ef00} fill="#F77F00" fillRule="evenodd" />
          </g>
          <g clipPath="url(#clip1_m)">
            <path clipRule="evenodd" d={svgPaths.p17aefc80} fill="#F77F00" fillRule="evenodd" />
          </g>
          <defs>
            <clipPath id="clip0_m">
              <rect fill="white" height="10.5795" transform="translate(10.4914 20.704) rotate(-11.508)" width="10.5795" />
            </clipPath>
            <clipPath id="clip1_m">
              <rect fill="white" height="10.2012" transform="translate(11.5055 10.7851) rotate(-11.508)" width="10.2012" />
            </clipPath>
          </defs>
        </svg>
      </div>
      <span className="font-['Righteous'] text-blue-600 dark:text-blue-400 text-[20px]">Elm Orbit</span>
    </button>
  );
}

function BellIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" className="w-6 h-6 dark:text-white light:text-black" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
    </svg>
  );
}

function CreateSessionIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
      <path d={svgPaths.p155fb3f0} fill="#003566" />
    </svg>
  );
}

function SessionRequestsIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" className="w-5 h-5 shrink-0 dark:text-white/60 light:text-black/60" stroke="currentColor" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={svgPaths.p16a0cd00} />
    </svg>
  );
}

function StudyRoomIcon() {
  return (
    <svg fill="none" viewBox="0 0 20 20" className="w-5 h-5 shrink-0 dark:text-white/60 light:text-black/60">
      <path d={svgPaths.p12a85400} fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
}

function WellnessIcon() {
  return (
    <svg fill="none" viewBox="0 0 21 22" className="w-5 h-5 shrink-0 dark:text-white/60 light:text-black/60">
      <path d={svgPaths.p2ab57600} fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
}

function CommunityIcon() {
  return (
    <svg fill="none" viewBox="0 0 22 22" className="w-5 h-5 shrink-0 dark:text-white/60 light:text-black/60">
      <path d={svgPaths.p7213140} fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg fill="none" viewBox="0 0 20 20" className="w-5 h-5 shrink-0">
      <path d={svgPaths.p1b39c5c0} fill="#CC3636" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg fill="none" viewBox="0 0 20 20" className="w-5 h-5 shrink-0">
      <g>
        <path d={svgPaths.p3991c040} stroke="#003566" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <path d={svgPaths.pf7b8300} stroke="#003566" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

function UserIcon() {
  return (
    <svg fill="none" viewBox="0 0 18 18" className="w-4 h-4 shrink-0 dark:text-white/80 light:text-black/80" stroke="currentColor" strokeOpacity="0.8" strokeWidth="2" strokeLinejoin="round">
      <path d={svgPaths.p36395980} />
      <path d={svgPaths.p372d2a00} />
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────────

type NavItem = 'create-session' | 'study-room' | 'wellness' | 'community' | 'profile';

interface TimeSlot {
  id: string;
  datetime: string;
}

interface SessionPost {
  id: string;
  mentorName: string;
  rate: string;
  timeSlots: TimeSlot[];
  hours: number[];
  readOnly?: boolean;
}

interface MentorStats {
  totalSessions: number;
  completedSessions: number;
  totalEarnings: number;
  averageRating: number | null;
}

function formatInr(amount: number): string {
  return `₹${Math.max(0, Math.round(amount)).toLocaleString('en-IN')}`;
}

function formatRating(rating: number | null): string {
  if (rating == null || Number.isNaN(rating)) return '--';
  return rating.toFixed(1);
}

function formatRateLabel(amountPaise: number | null): string {
  if (amountPaise == null || Number.isNaN(amountPaise)) return '--';
  return `${formatInr(amountPaise / 100)}/hr`;
}

function parseDatabaseDateTime(value: string): Date | null {
  if (!value) return null;
  if (value.includes('T') || value.endsWith('Z')) {
    const isoDate = new Date(value);
    return Number.isNaN(isoDate.getTime()) ? null : isoDate;
  }

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!match) {
    const fallback = new Date(value);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
  }

  const [, year, month, day, hour, minute, second] = match;
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second ?? '0'),
    0
  );
}

function formatTimestampForDb(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function formatSessionSlot(datetime: string): string {
  if (typeof datetime === 'string' && datetime.includes('|')) {
    return datetime;
  }

  const date = parseDatabaseDateTime(datetime);
  if (!date || Number.isNaN(date.getTime())) return datetime || 'Schedule unavailable';

  const datePart = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
  const timePart = date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).toUpperCase();

  return `${datePart} | ${timePart}`;
}

// ────────────────────────────────────────────────────────────────────────────────
// Create / Edit Modal
// ────────────────────────────────────────────────────────────────────────────────

interface SessionModalProps {
  mode: 'create' | 'edit';
  initial?: SessionPost;
  onSave: (s: SessionPost) => void;
  onClose: () => void;
}

function SessionModal({ mode, initial, onSave, onClose }: SessionModalProps) {
  const blank: SessionPost = {
    id: Date.now().toString(),
    mentorName: 'Jack Sparrow',
    rate: '₹500/hr',
    timeSlots: [{ id: '1', datetime: '' }],
    hours: [1],
  };

  const [form, setForm] = useState<SessionPost>(initial ?? blank);
  const [newSlot, setNewSlot] = useState('');
  const [rateInput, setRateInput] = useState(initial?.rate.replace('₹', '').replace('/hr', '') ?? '500');
  const [hoursInput, setHoursInput] = useState<string>(initial?.hours.join(', ') ?? '1, 2, 3');
  const [error, setError] = useState('');

  const addSlot = () => {
    if (!newSlot.trim()) return;
    setForm(f => ({ ...f, timeSlots: [...f.timeSlots, { id: Date.now().toString(), datetime: newSlot.trim() }] }));
    setNewSlot('');
  };

  const removeSlot = (id: string) => {
    setForm(f => ({ ...f, timeSlots: f.timeSlots.filter(s => s.id !== id) }));
  };

  const handleSave = () => {
    setError('');
    if (!form.mentorName.trim()) { setError('Mentor name is required.'); return; }
    if (!rateInput.trim() || isNaN(Number(rateInput))) { setError('Enter a valid rate (numbers only).'); return; }
    if (form.timeSlots.length === 0) { setError('Add at least one time slot.'); return; }
    const parsedHours = hoursInput.split(',').map(h => Number(h.trim())).filter(h => !isNaN(h) && h > 0);
    if (parsedHours.length === 0) { setError('Enter at least one valid number of hours.'); return; }
    onSave({ ...form, rate: `₹${rateInput}/hr`, hours: parsedHours });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="dark:bg-[#2b2c2f] light:bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.15)] w-full max-w-[560px] p-8 flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-['Poppins'] font-medium text-[24px] dark:text-white light:text-black">
              {mode === 'create' ? 'Create New Session' : 'Edit Session'}
            </p>
            <p className="font-['Poppins'] text-[13px] dark:text-white/60 light:text-[rgba(0,0,0,0.6)]">Fill in your session details below.</p>
          </div>
          <button onClick={onClose} className="dark:text-white/40 dark:hover:text-white light:text-[rgba(0,0,0,0.4)] light:hover:text-black transition-colors text-2xl leading-none mt-1">×</button>
        </div>

        {/* Mentor Name */}
        <div className="flex flex-col gap-2">
          <label className="font-['Poppins'] text-[14px] dark:text-white light:text-black">Mentor Name</label>
          <div className="border dark:border-white/10 light:border-[rgba(0,0,0,0.2)] rounded-[10px] px-3 h-[39px] flex items-center">
            <input
              className="flex-1 font-['Poppins'] text-[14px] outline-none bg-transparent dark:text-white light:text-black"
              value={form.mentorName}
              onChange={e => setForm(f => ({ ...f, mentorName: e.target.value }))}
              placeholder="e.g. Your Name or Preferred Title"
            />
          </div>
        </div>

        {/* Rate */}
        <div className="flex flex-col gap-2">
          <label className="font-['Poppins'] text-[14px] dark:text-white light:text-black">Rate (₹/hr)</label>
          <div className="border dark:border-white/10 light:border-[rgba(0,0,0,0.2)] rounded-[10px] px-3 h-[39px] flex items-center gap-2">
            <span className="font-['Poppins'] text-[14px] dark:text-white/50 light:text-[rgba(0,0,0,0.5)]">₹</span>
            <input
              className="flex-1 font-['Poppins'] text-[14px] outline-none bg-transparent dark:text-white light:text-black"
              value={rateInput}
              onChange={e => setRateInput(e.target.value)}
              placeholder="Enter hourly rate"
              type="number"
              min="0"
            />
            <span className="font-['Poppins'] text-[14px] dark:text-white/50 light:text-[rgba(0,0,0,0.5)]">/hr</span>
          </div>
        </div>

        {/* Time Slots */}
        <div className="flex flex-col gap-2">
          <label className="font-['Poppins'] text-[14px] dark:text-white light:text-black">Date & Time Slots</label>
          <div className="flex flex-wrap gap-2">
            {form.timeSlots.map(slot => (
              <div key={slot.id} className="flex items-center gap-1 border dark:border-white/10 light:border-[rgba(0,0,0,0.2)] rounded-[10px] px-3 py-1">
                <span className="font-['Poppins'] text-[13px] dark:text-white light:text-black">{slot.datetime}</span>
                <button onClick={() => removeSlot(slot.id)} className="text-red-600 ml-1 leading-none text-sm">×</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="flex-1 border dark:border-white/10 light:border-[rgba(0,0,0,0.2)] rounded-[10px] px-3 h-[39px] flex items-center">
              <input
                className="w-full font-['Poppins'] text-[13px] outline-none bg-transparent dark:text-white light:text-black"
                value={newSlot}
                onChange={e => setNewSlot(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSlot()}
                placeholder="e.g. 18-10-25 | 7:00 PM"
              />
            </div>
            <button
              onClick={addSlot}
              className="h-[39px] px-4 bg-blue-600 text-white rounded-[10px] font-['Poppins'] text-[13px] dark:hover:bg-blue-700 light:hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Number of Hours */}
        <div className="flex flex-col gap-2">
          <label className="font-['Poppins'] text-[14px] dark:text-white light:text-black">Available Hours (comma-separated)</label>
          <div className="border dark:border-white/10 light:border-[rgba(0,0,0,0.2)] rounded-[10px] px-3 h-[39px] flex items-center">
            <input
              className="flex-1 font-['Poppins'] text-[14px] outline-none bg-transparent dark:text-white light:text-black"
              value={hoursInput}
              onChange={e => setHoursInput(e.target.value)}
              placeholder="1, 2, 3"
            />
          </div>
        </div>

        {error && <p className="font-['Poppins'] text-[13px] text-red-600 -mt-3">{error}</p>}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-1">
          <button
            onClick={onClose}
            className="h-[42px] px-6 border dark:border-white/20 light:border-[rgba(0,0,0,0.3)] rounded-[20px] font-['Poppins'] text-[14px] dark:text-white/60 dark:hover:bg-white/5 light:text-[rgba(0,0,0,0.6)] light:hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="h-[42px] px-8 bg-blue-600 dark:bg-blue-600 light:bg-blue-600 rounded-[20px] font-['Poppins'] text-[14px] text-white dark:hover:bg-blue-700 light:hover:bg-blue-700 transition-colors"
          >
            {mode === 'create' ? 'Create Session' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Confirm Delete Modal
// ────────────────────────────────────────────────────────────────────────────────

function DeleteModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="dark:bg-[#2b2c2f] light:bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.15)] w-full max-w-[400px] p-8 flex flex-col gap-6 items-center text-center">
        <div className="w-[60px] h-[60px] rounded-full dark:bg-red-500/10 light:bg-[#fde8e8] flex items-center justify-center">
          <DeleteIcon />
        </div>
        <div>
          <p className="font-['Poppins'] font-medium text-[20px] dark:text-white light:text-black">Delete Session?</p>
          <p className="font-['Poppins'] text-[13px] dark:text-white/60 light:text-[rgba(0,0,0,0.6)] mt-1">This action cannot be undone. Your session post will be permanently removed.</p>
        </div>
        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 h-[42px] border dark:border-white/10 light:border-[rgba(0,0,0,0.3)] rounded-[20px] font-['Poppins'] text-[14px] dark:text-white/60 dark:hover:bg-white/5 light:text-[rgba(0,0,0,0.6)] light:hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-[42px] bg-red-600 rounded-[20px] font-['Poppins'] text-[14px] text-white dark:hover:bg-red-700 light:hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Session Card
// ────────────────────────────────────────────────────────────────────────────────

interface SessionCardProps {
  session: SessionPost;
  onDelete: () => void;
  onEdit: () => void;
}

function SessionCard({ session, onDelete, onEdit }: SessionCardProps) {
  return (
    <div className="dark:bg-[#2b2c2f] light:bg-white rounded-[20px] shadow-[0px_4px_29.4px_0px_rgba(0,0,0,0.1)] p-8 flex flex-col gap-6">
      {/* Top row */}
      <div className="flex flex-wrap gap-6 items-start justify-between">
        {/* Mentor info */}
        <div className="dark:bg-[#3a3b3f] light:bg-white rounded-[10px] shadow-[0px_4px_29.4px_0px_rgba(0,0,0,0.1)] px-4 py-3 flex items-center justify-between gap-6 min-w-[220px]">
          <div className="flex items-center gap-2">
            <div className="dark:bg-white/10 light:bg-[#e5e7eb] rounded-[4px] size-[27px] flex items-center justify-center">
              <UserIcon />
            </div>
            <span className="font-['Poppins'] font-medium text-[16px] dark:text-white light:text-[rgba(0,0,0,0.8)]">{session.mentorName}</span>
          </div>
          <span className="font-['Poppins'] font-medium text-[16px] dark:text-white light:text-[rgba(0,0,0,0.8)]">{session.rate}</span>
        </div>

        {/* Date & Time Slots */}
        <div className="flex flex-col gap-2">
          <p className="font-['Poppins'] font-medium text-[16px] dark:text-white light:text-[rgba(0,0,0,0.8)]">Date and Time Slots</p>
          <div className="flex flex-wrap gap-2">
            {session.timeSlots.map(slot => (
              <div key={slot.id} className="border dark:border-white/10 light:border-[rgba(0,0,0,0.2)] rounded-[10px] px-3 h-[39px] flex items-center">
                <span className="font-['Poppins'] font-medium text-[14px] dark:text-white light:text-[rgba(0,0,0,0.8)]">{slot.datetime}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Number of Hours */}
        <div className="flex flex-col gap-2">
          <p className="font-['Poppins'] font-medium text-[16px] dark:text-white light:text-[rgba(0,0,0,0.8)]">Number of Hours</p>
          <div className="flex gap-2 flex-wrap">
            {session.hours.map((h, i) => (
              <div key={i} className="border dark:border-white/10 light:border-[rgba(0,0,0,0.2)] rounded-[10px] px-3 h-[39px] flex items-center">
                <span className="font-['Poppins'] font-medium text-[14px] dark:text-white light:text-[rgba(0,0,0,0.8)]">{h} {h === 1 ? 'hour' : 'hours'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      {session.readOnly ? (
        <div className="flex justify-end">
          <p className="font-['Poppins'] text-[12px] dark:text-white/45 light:text-[rgba(0,0,0,0.45)]">Synced from your live mentor bookings</p>
        </div>
      ) : (
        <div className="flex justify-end gap-4">
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 h-[42px] px-6 border border-red-600 rounded-[20px] dark:hover:bg-red-500/10 light:hover:bg-[#fde8e8] transition-colors"
          >
            <DeleteIcon />
            <span className="font-['Poppins'] font-medium text-[14px] text-red-600">Delete</span>
          </button>
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 h-[42px] px-6 border border-blue-600 rounded-[20px] dark:hover:bg-blue-600/10 light:hover:bg-[#e8f0fa] transition-colors"
          >
            <EditIcon />
            <span className="font-['Poppins'] font-medium text-[14px] text-blue-600">Edit</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Create Session — Date & Time Modal  (Figma: "Book a Session")
// ────────────────────────────────────────────────────────────────────────────────

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_LABELS  = ['SU','MO','TU','WE','TH','FR','SA'];

const TIME_SLOTS = [
  '09:00 AM','09:30 AM','10:00 AM','10:30 AM',
  '11:00 AM','11:30 AM','12:00 PM','12:30 PM',
  '01:00 PM','01:30 PM','02:00 PM','02:30 PM',
  '03:00 PM','03:30 PM','04:00 PM','04:30 PM',
  '05:00 PM','05:30 PM','06:00 PM','06:30 PM',
];

interface SelectedSlot { id: string; date: Date; time: string; }

interface CreateSessionDateTimeModalProps {
  title?: string;
  initialSlots?: SelectedSlot[];
  onNext: (slots: SelectedSlot[]) => void;
  onClose: () => void;
}

function selectedSlotToDate(slot: SelectedSlot): Date {
  const [time, meridiemRaw] = slot.time.split(' ');
  const [rawHour, rawMinute] = time.split(':').map(Number);
  const meridiem = meridiemRaw?.toUpperCase();
  let hour = rawHour % 12;
  if (meridiem === 'PM') hour += 12;
  const date = new Date(slot.date);
  date.setHours(hour, rawMinute || 0, 0, 0);
  return date;
}

function CreateSessionDateTimeModal({ title = 'Create Session', initialSlots = [], onNext, onClose }: CreateSessionDateTimeModalProps) {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selDate,   setSelDate]   = useState<Date | null>(null);
  const [selTime,   setSelTime]   = useState<string | null>(null);
  const [slots,     setSlots]     = useState<SelectedSlot[]>(initialSlots);
  const [pickerError, setPickerError] = useState('');
  const MAX_SLOTS = 3;
  const timeScrollRef = useRef<HTMLDivElement>(null);

  // Build calendar grid for current viewMonth/viewYear
  const firstDay  = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevDays  = new Date(viewYear, viewMonth, 0).getDate();

  // flat 42-cell grid
  const cells: { day: number; month: 'prev'|'cur'|'next' }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevDays - i, month: 'prev' });
  for (let d = 1; d <= daysInMonth; d++)  cells.push({ day: d,             month: 'cur'  });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++)    cells.push({ day: d,             month: 'next' });

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const isToday = (d: Date) => isSameDay(d, today);

  const isSelected = (d: Date) => selDate ? isSameDay(d, selDate) : false;

  const addCurrentSlot = () => {
    if (!selDate || !selTime) return;
    if (slots.length >= MAX_SLOTS) return;
    const candidate = selectedSlotToDate({ id: 'candidate', date: selDate, time: selTime });
    if (candidate.getTime() <= Date.now()) {
      setPickerError('Please choose a future date and time.');
      return;
    }
    // prevent duplicate
    const dup = slots.find(s => isSameDay(s.date, selDate) && s.time === selTime);
    if (dup) return;
    setPickerError('');
    setSlots(prev => [...prev, { id: Date.now().toString(), date: new Date(selDate), time: selTime }]);
  };

  const removeSlot = (id: string) => setSlots(prev => prev.filter(s => s.id !== id));

  const formatSlotDate = (d: Date) =>
    `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

  const handleNext = () => {
    if (slots.length === 0) return;
    if (slots.some((slot) => selectedSlotToDate(slot).getTime() <= Date.now())) {
      setPickerError('Remove any past slots before continuing.');
      return;
    }
    onNext(slots);
  };

  // derive display label for right panel
  const selDayLabel = selDate
    ? `${['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][selDate.getDay()]}, ${MONTH_NAMES[selDate.getMonth()]} ${selDate.getDate()}`
    : 'Select a date';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="dark:bg-[#2b2c2f] light:bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.15)] w-full max-w-[700px] sm:max-w-[600px] md:max-w-[700px] p-4 sm:p-6 lg:p-8 flex flex-col gap-4 sm:gap-6 max-h-[90vh] overflow-y-auto">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col gap-1">
        <div className="font-['Poppins'] font-semibold text-[20px] sm:text-[24px] dark:text-white light:text-black">{title}</div>
            <p className="font-['Poppins'] font-semibold text-[14px] sm:text-[16px] dark:text-white light:text-black">Select Date and Time Slots</p>
          </div>
          <button onClick={onClose} className="hover:opacity-60 transition-opacity">
            <svg fill="none" viewBox="0 0 25 25" className="w-[24px] sm:w-[30px] h-[24px] sm:h-[30px]">
              <circle cx="12.469" cy="12.469" r="11.719" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M16.688 8.25L8.25 16.688M8.25 8.25L16.688 16.688" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
            </svg>
          </button>
        </div>

        {/* ── Calendar + Time Picker ──────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 w-full">

          {/* Calendar */}
          <div className="dark:bg-[#3a3b3f] light:bg-white rounded-[5px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] pb-6 sm:pb-8 pt-3 sm:pt-4 px-4 sm:px-6 flex flex-col gap-[15px] sm:gap-[23px] shrink-0 w-full lg:w-[305px]">
            {/* Month nav */}
            <div className="flex items-center justify-between w-full">
              <button onClick={prevMonth} className="hover:opacity-60 transition-opacity">
                <svg fill="none" viewBox="0 0 24 24" className="w-6 h-6">
                  <path d="M17 14L12 9L7 14" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="2" transform="rotate(-90 12 12)"/>
                </svg>
              </button>
              <p className="font-['Poppins'] font-medium text-[16px] text-[rgba(0,0,0,0.8)]">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </p>
              <button onClick={nextMonth} className="hover:opacity-60 transition-opacity">
                <svg fill="none" viewBox="0 0 24 24" className="w-6 h-6">
                  <path d="M17 14L12 9L7 14" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="2" transform="rotate(90 12 12)"/>
                </svg>
              </button>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 gap-y-4">
              {DAY_LABELS.map(d => (
                <p key={d} className="font-['Poppins'] font-semibold text-[12px] text-[rgba(0,0,0,0.6)] text-center">{d}</p>
              ))}

              {/* Calendar cells */}
              {cells.map((cell, i) => {
                const isCurrentMonth = cell.month === 'cur';
                const cellDate = new Date(
                  cell.month === 'prev' ? (viewMonth === 0 ? viewYear - 1 : viewYear) : cell.month === 'next' ? (viewMonth === 11 ? viewYear + 1 : viewYear) : viewYear,
                  cell.month === 'prev' ? (viewMonth === 0 ? 11 : viewMonth - 1) : cell.month === 'next' ? (viewMonth === 11 ? 0 : viewMonth + 1) : viewMonth,
                  cell.day
                );
                const selected = isSelected(cellDate);
                const todayCell = isToday(cellDate);
                return (
                  <button
                    key={i}
                    onClick={() => isCurrentMonth && setSelDate(cellDate)}
                    disabled={!isCurrentMonth}
                    className="flex items-center justify-center"
                  >
                    <span className={`w-[26px] h-[26px] flex items-center justify-center rounded-full font-['Poppins'] font-medium text-[12px] transition-colors
                      ${selected ? 'bg-blue-600 text-white' : ''}
                      ${!selected && todayCell && isCurrentMonth ? 'border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400' : ''}
                      ${!selected && !todayCell && isCurrentMonth ? 'text-black dark:text-white hover:bg-blue-100 dark:hover:bg-blue-900' : ''}
                      ${!isCurrentMonth ? 'text-[rgba(0,0,0,0.3)] dark:text-[rgba(255,255,255,0.3)]' : ''}
                    `}>
                      {cell.day}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time slot picker */}
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <p className="font-['Poppins'] font-medium text-[14px] text-[rgba(0,0,0,0.8)]">{selDayLabel}</p>
              {selDate && <p className="font-['Poppins'] font-medium text-[12px] text-[rgba(0,0,0,0.6)]">Select from available time slots.</p>}
            </div>

            {/* Scrollable time list */}
            <div ref={timeScrollRef} className="flex flex-col gap-3 overflow-y-auto max-h-270 pr-2 relative time-scroll-list\">
              {TIME_SLOTS.map(t => {
                const active = selTime === t;
                const isPastTime = !selDate || selectedSlotToDate({ id: 'preview', date: selDate, time: t }).getTime() <= Date.now();
                return (
                  <button
                    key={t}
                    onClick={() => setSelTime(t)}
                    disabled={isPastTime}
                    className={`w-full rounded-[5px] px-3 py-[5px] text-left transition-colors border font-['Poppins'] text-[12px]
                      ${active
                        ? 'bg-blue-100 dark:bg-blue-900 border-blue-600 dark:border-blue-500 font-semibold text-blue-600 dark:text-blue-400'
                        : 'border-[rgba(0,0,0,0.6)] dark:border-[rgba(255,255,255,0.3)] text-[rgba(0,0,0,0.8)] dark:text-[rgba(255,255,255,0.8)] hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed'
                      }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Selected Slots ──────────────────────────────────── */}
        <div className="flex flex-col gap-[10px] w-full">
          <p className="font-['Poppins'] font-medium text-[14px] text-[rgba(0,0,0,0.8)]">
            Selected Slots ({slots.length}/{MAX_SLOTS})
          </p>
          {pickerError && (
            <p className="font-['Poppins'] text-[12px] text-[#cc3636]">{pickerError}</p>
          )}

          {/* Existing slot cards */}
          {slots.map(slot => (
            <div key={slot.id} className="dark:bg-[#3a3b3f] light:bg-white rounded-[5px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] flex items-center justify-between p-2 sm:p-[10px] w-full">
              <div className="flex flex-col gap-0.5">
                <p className="font-['Poppins'] font-medium text-[12px] text-[rgba(0,0,0,0.8)]">{formatSlotDate(slot.date)}</p>
                <p className="font-['Poppins'] font-medium text-[12px] text-[rgba(0,0,0,0.6)]">{slot.time}</p>
              </div>
              <button onClick={() => removeSlot(slot.id)} className="hover:opacity-60 transition-opacity">
                <svg fill="none" viewBox="0 0 24 24" className="w-6 h-6">
                  <path d="M8 8L12 12M12 12L16 16M12 12L16 8M12 12L8 16" stroke="black" strokeLinecap="round" strokeOpacity="0.6" strokeWidth="2"/>
                </svg>
              </button>
            </div>
          ))}

          {/* Add slot button */}
          {slots.length < MAX_SLOTS && (
            <button
              onClick={addCurrentSlot}
              disabled={!selDate || !selTime}
              className="dark:bg-[#3a3b3f] dark:border-white/10 dark:hover:bg-[#444649] light:bg-white light:border-[rgba(0,0,0,0.2)] light:hover:bg-gray-50 rounded-[5px] border dark:border-white/10 light:border-dashed light:border-[rgba(0,0,0,0.2)] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] flex items-center justify-center p-2 sm:p-[10px] w-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg fill="none" viewBox="0 0 24 24" className="w-6 h-6">
                <path d="M18 12.998H13V17.998C13 18.263 12.895 18.518 12.707 18.705C12.52 18.893 12.265 18.998 12 18.998C11.735 18.998 11.48 18.893 11.293 18.705C11.105 18.518 11 18.263 11 17.998V12.998H6C5.735 12.998 5.48 12.893 5.293 12.705C5.105 12.518 5 12.263 5 11.998C5 11.733 5.105 11.478 5.293 11.291C5.48 11.103 5.735 10.998 6 10.998H11V5.998C11 5.733 11.105 5.478 11.293 5.291C11.48 5.103 11.735 4.998 12 4.998C12.265 4.998 12.52 5.103 12.707 5.291C12.895 5.478 13 5.733 13 5.998V10.998H18C18.265 10.998 18.52 11.103 18.707 11.291C18.895 11.478 19 11.733 19 11.998C19 12.263 18.895 12.518 18.707 12.705C18.52 12.893 18.265 12.998 18 12.998Z" fill="black" fillOpacity="0.6"/>
              </svg>
            </button>
          )}
        </div>

        {/* ── Footer Buttons ──────────────────────────────────── */}
        <div className="flex items-center justify-end gap-4 w-full">
          <button
            onClick={onClose}
            className="h-[42px] px-6 border border-red-600 rounded-[20px] font-['Poppins'] font-medium text-[14px] text-red-600 dark:hover:bg-red-500/10 light:hover:bg-[#fde8e8] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleNext}
            disabled={slots.length === 0}
            className="h-[42px] px-8 bg-blue-600 rounded-[20px] font-['Poppins'] font-medium text-[14px] text-white dark:hover:bg-blue-700 light:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Create Session — Step 2: Fees, Payment Mode, Session Hours
// ────────────────────────────────────────────────────────────────────────────────

interface CreateSessionDetailsModalProps {
  title?: string;
  slots: SelectedSlot[];
  initialFee?: string;
  initialPaymentMode?: 'upi' | 'bank' | null;
  initialHours?: number | null;
  onBack: () => void;
  onClose: () => void;
  onPost: (fee: string, paymentMode: string, hours: number) => void;
}

function CreateSessionDetailsModal({ title = 'Create Session', initialFee = '', initialPaymentMode = null, initialHours = null, onBack, onClose, onPost }: CreateSessionDetailsModalProps) {
  const [fee, setFee] = useState(initialFee);
  const [paymentMode, setPaymentMode] = useState<'upi' | 'bank' | null>(initialPaymentMode ?? null);
  const [sessionHours, setSessionHours] = useState<number | null>(initialHours ?? null);
  const [error, setError] = useState('');

  const paymentOptions = [
    { id: 'upi',  label: 'UPI' },
    { id: 'bank', label: 'Bank Account' },
  ];

  const handlePost = () => {
    setError('');
    if (!fee.trim() || isNaN(Number(fee)) || Number(fee) <= 0) {
      setError('Please enter a valid fee per hour.');
      return;
    }
    if (!paymentMode) {
      setError('Please select a payment mode.');
      return;
    }
    if (!sessionHours) {
      setError('Please select the max session duration.');
      return;
    }
    onPost(fee, paymentMode, sessionHours);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="dark:bg-[#2b2c2f] light:bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] w-full max-w-[642px] p-8 flex flex-col gap-4">

        {/* Header */}
        <div className="flex flex-col gap-[5px] w-full">
          <div className="flex items-center justify-between w-full">
            <button onClick={onBack} className="font-['Poppins'] text-[16px] dark:text-white light:text-black dark:hover:text-blue-400 light:hover:text-blue-600 transition-colors">
              &lt;Back
            </button>
            <button onClick={onClose} className="hover:opacity-60 transition-opacity">
              <svg fill="none" viewBox="0 0 25 25" className="w-[30px] h-[30px]">
                <path d="M16.6875 8.25L8.25 16.6875M8.25 8.25L16.6875 16.6875"
                  stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
                <path d="M12.4688 24.1875C18.9408 24.1875 24.1875 18.9408 24.1875 12.4688C24.1875 5.99666 18.9408 0.75 12.4688 0.75C5.99666 0.75 0.75 5.99666 0.75 12.4688C0.75 18.9408 5.99666 24.1875 12.4688 24.1875Z"
                  stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
              </svg>
            </button>
          </div>
          <p className="font-['Poppins'] font-semibold text-[24px] dark:text-white light:text-black">{title}</p>
        </div>

        {/* Fees per hour */}
        <div className="flex flex-col gap-[10px] w-full">
          <label className="font-['Poppins'] text-[16px] dark:text-white light:text-black">Fees per hour</label>
          <div className="h-[39px] rounded-[10px] w-full border border-[rgba(0,0,0,0.4)] flex items-center gap-[10px] px-[10px]">
            <svg fill="none" viewBox="0 0 24 24" className="w-6 h-6 shrink-0">
              <path d="M17.12 9.88C16.5577 9.31774 15.7952 9.00187 15 9.00187C14.2048 9.00187 13.4423 9.31774 12.88 9.88C12.3177 10.4423 12.0019 11.2048 12.0019 12C12.0019 12.7952 12.3177 13.5577 12.88 14.12C13.1584 14.3984 13.4889 14.6192 13.8527 14.7699C14.2164 14.9206 14.6063 14.9981 15 14.9981C15.3937 14.9981 15.7836 14.9206 16.1473 14.7699C16.5111 14.6192 16.8416 14.3984 17.12 14.12C17.3984 13.8416 17.6192 13.5111 17.7699 13.1473C17.9206 12.7836 17.9981 12.3937 17.9981 12C17.9981 11.6063 17.9206 11.2164 17.7699 10.8527C17.6192 10.4889 17.3984 10.1584 17.12 9.88ZM7 6V18H23V6H7ZM21 14C20.47 14 19.96 14.21 19.59 14.59C19.21 14.96 19 15.47 19 16H11C11 15.47 10.79 14.96 10.41 14.59C10.04 14.21 9.53 14 9 14V10C9.53 10 10.04 9.79 10.41 9.41C10.79 9.04 11 8.53 11 8H19C19 8.53 19.21 9.04 19.59 9.41C19.96 9.79 20.47 10 21 10V14ZM5 8H3C2.45 8 2 7.55 2 7C2 6.45 2.45 6 3 6H5V8ZM5 13H2C1.45 13 1 12.55 1 12C1 11.45 1.45 11 2 11H5V13ZM5 18H1C0.448 18 0 17.55 0 17C0 16.45 0.448 16 1 16H5V18Z" fill="black"/>
            </svg>
            <input
              type="number" min="0"
              value={fee}
              onChange={e => setFee(e.target.value)}
              placeholder="Enter fees per hour"
              className="flex-1 bg-transparent font-['Poppins'] text-[14px] dark:text-white dark:placeholder:text-white/40 light:text-[rgba(0,0,0,0.7)] light:placeholder:text-[rgba(0,0,0,0.4)] outline-none"
            />
          </div>
        </div>

        {/* Payment Mode */}
        <div className="flex flex-col gap-[10px] w-full">
          <div>
            <p className="font-['Poppins'] text-[16px] dark:text-white light:text-black">Select your preferred payment mode</p>
            <p className="font-['Poppins'] text-[12px] dark:text-white/80 light:text-[rgba(0,0,0,0.8)]">Choose how you'd like to receive your payment.</p>
          </div>
          <div className="flex gap-4 w-full">
            {paymentOptions.map(opt => {
              const active = paymentMode === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setPaymentMode(opt.id as 'upi' | 'bank')}
                  className={`flex-1 flex items-center gap-2 px-4 py-[10px] rounded-[5px] border dark:border-white/20 light:border-[rgba(0,0,0,0.6)] transition-colors ${active ? 'dark:bg-blue-600/20 light:bg-blue-50' : 'dark:bg-[#3a3b3f] dark:hover:bg-[#444649] light:bg-white light:hover:bg-gray-50'}`}
                >
                  <svg viewBox="0 0 20 20" className="w-5 h-5 shrink-0">
                    <circle cx="10" cy="10" r="10" fill={active ? '#2563eb' : '#D9D9D9'} />
                  </svg>
                  <span className={`font-['Poppins'] text-[16px] ${active ? 'dark:text-blue-400 light:text-blue-600' : 'dark:text-white/60 light:text-[rgba(0,0,0,0.6)]'}`}>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Max session hours */}
        <div className="flex flex-col gap-[10px] w-full">
          <label className="font-['Poppins'] text-[16px] dark:text-white light:text-black">Max. no. of session time(in hrs)</label>
          <div className="flex gap-4">
            {[1, 2, 3].map(h => {
              const active = sessionHours === h;
              return (
                <button
                  key={h}
                  onClick={() => setSessionHours(h)}
                  className={`flex items-center gap-2 px-4 py-[10px] rounded-[5px] border dark:border-white/20 light:border-[rgba(0,0,0,0.6)] transition-colors ${active ? 'dark:bg-blue-600/20 light:bg-[#dff0ff]' : 'dark:bg-[#3a3b3f] dark:hover:bg-[#444649] light:bg-white light:hover:bg-gray-50'}`}
                >
                  <svg viewBox="0 0 20 20" className="w-5 h-5 shrink-0">
                    <circle cx="10" cy="10" r="10" fill={active ? '#2563eb' : '#D9D9D9'} />
                  </svg>
                  <span className={`font-['Poppins'] text-[16px] ${active ? 'dark:text-blue-400 light:text-black' : 'dark:text-white/60 light:text-[rgba(0,0,0,0.6)]'}`}>{h}</span>
                </button>
              );
            })}
          </div>
        </div>

        {error && <p className="font-['Poppins'] text-[13px] text-red-600 -mt-2">{error}</p>}

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 w-full pt-2">
          <button onClick={onClose} className="h-[42px] px-6 border border-red-600 rounded-[20px] font-['Poppins'] font-medium text-[14px] text-red-600 dark:hover:bg-red-500/10 light:hover:bg-[#fde8e8] transition-colors">
            Cancel
          </button>
          <button onClick={handlePost} className="h-[42px] px-6 bg-blue-600 rounded-[20px] font-['Poppins'] font-medium text-[14px] text-white dark:hover:bg-blue-700 light:hover:bg-blue-700 transition-colors">
            Post Session
          </button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Success Toast — "Session Successfully Posted"
// ────────────────────────────────────────────────────────────────────────────────

function SuccessToast({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-[60] dark:bg-[#2b2c2f] light:bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] flex items-center gap-4 sm:gap-6 px-4 sm:px-8 py-3 sm:py-5 w-[calc(100%-2rem)] sm:w-auto" style={{ minWidth: window.innerWidth < 640 ? undefined : 380 }}>
      <svg viewBox="0 0 55 52.6395" className="w-[55px] h-[52px] shrink-0">
        <path d="M55 26.3197C55 29.1171 51.4972 31.3267 50.6777 33.8509C49.8282 36.4671 51.3338 40.3079 49.749 42.4855C48.1484 44.6848 44.0196 44.4321 41.8202 46.0328C39.6426 47.6175 38.616 51.6311 35.9999 52.4805C33.4757 53.3001 30.2974 50.6833 27.5 50.6833C24.7026 50.6833 21.5244 53.3001 19.0002 52.4805C16.384 51.6311 15.3574 47.6175 13.1798 46.0328C10.9805 44.4321 6.85163 44.6849 5.25101 42.4856C3.66623 40.308 5.17175 36.4671 4.32237 33.851C3.50278 31.3268 0 29.1171 0 26.3197C0 23.5223 3.50278 21.3127 4.32237 18.7885C5.17182 16.1723 3.66629 12.3315 5.25108 10.1539C6.8517 7.95456 10.9805 8.20727 13.1799 6.60672C15.3574 5.02193 16.3841 1.0084 19.0002 0.15894C21.5244 -0.660647 24.7026 1.9562 27.5 1.9562C30.2974 1.9562 33.4757 -0.660647 35.9999 0.15894C38.616 1.0084 39.6427 5.02193 41.8203 6.60672C44.0196 8.20734 48.1484 7.95457 49.7491 10.154C51.3338 12.3315 49.8283 16.1724 50.6777 18.7885C51.4973 21.3126 55 23.5223 55 26.3197Z" fill="#70AF53"/>
        <path d="M23.3919 39.2567L13.569 30.3301L17.137 26.4037L22.8179 31.5662L36.1697 15.1951L40.2812 18.5484L23.3919 39.2567Z" fill="white"/>
      </svg>
      <div className="flex items-center justify-between flex-1 gap-6">
        <p className="font-['Poppins'] font-medium text-[16px] text-black">Session Successfully Posted</p>
        <button onClick={onClose} className="hover:opacity-60 transition-opacity shrink-0">
          <svg fill="none" viewBox="0 0 26 26" className="w-[30px] h-[30px]">
            <path d="M16.9375 8.5L8.5 16.9375M8.5 8.5L16.9375 16.9375" stroke="#FF5E5E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
            <path d="M12.7188 24.4375C19.1908 24.4375 24.4375 19.1908 24.4375 12.7188C24.4375 6.24666 19.1908 1 12.7188 1C6.24666 1 1 6.24666 1 12.7188C1 19.1908 6.24666 24.4375 12.7188 24.4375Z" stroke="#FF5E5E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// Parse a stored "dd-mm-yy | H:MM AM/PM" string into a SelectedSlot
function parseExistingSlot(slot: TimeSlot): SelectedSlot {
  try {
    const [datePart, timePart] = slot.datetime.split(' | ');
    const [d, m, y] = datePart.split('-').map(Number);
    const fullYear = y < 100 ? 2000 + y : y;
    return { id: slot.id, date: new Date(fullYear, m - 1, d), time: timePart };
  } catch {
    return { id: slot.id, date: new Date(), time: '09:00 AM' };
  }
}

interface CreateSessionViewProps {
  stats: MentorStats;
  loadingStats: boolean;
  mentorName: string;
}

function CreateSessionView({ stats, loadingStats, mentorName }: CreateSessionViewProps) {
  const [sessions, setSessions] = useState<SessionPost[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [savingSession, setSavingSession] = useState(false);

  const refreshSessions = async () => {
    setLoadingSessions(true);
    try {
      const liveSessions = await mentorDashboard.listActiveSessions();
      setSessions(
        liveSessions.map((session: any) => ({
          id: session.id,
          mentorName: session.mentorName || mentorName,
          rate: formatRateLabel(session.hourlyRate),
          timeSlots: [{ id: `${session.id}-slot`, datetime: formatSessionSlot(session.scheduledAt) }],
          hours: [session.durationHours],
          readOnly: Boolean(session.readOnly),
        }))
      );
    } catch {
      setSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const liveSessions = await mentorDashboard.listActiveSessions();
        if (!mounted) return;

        setSessions(
          liveSessions.map((session: any) => ({
            id: session.id,
            mentorName: session.mentorName || mentorName,
            rate: formatRateLabel(session.hourlyRate),
            timeSlots: [{ id: `${session.id}-slot`, datetime: formatSessionSlot(session.scheduledAt) }],
            hours: [session.durationHours],
            readOnly: Boolean(session.readOnly),
          }))
        );
      } catch {
        if (!mounted) return;
        setSessions([]);
      } finally {
        if (mounted) setLoadingSessions(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [mentorName]);

  // ── Create flow ──────────────────────────────────────
  const [showCreateStep1, setShowCreateStep1] = useState(false);
  const [createPendingSlots, setCreatePendingSlots] = useState<SelectedSlot[]>([]);
  const [showCreateStep2, setShowCreateStep2] = useState(false);

  // ── Edit flow ────────────────────────────────────────
  const [sessionBeingEdited, setSessionBeingEdited] = useState<SessionPost | null>(null);
  const [showEditStep1, setShowEditStep1] = useState(false);
  const [editPendingSlots, setEditPendingSlots] = useState<SelectedSlot[]>([]);
  const [showEditStep2, setShowEditStep2] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // ── Create handlers ──────────────────────────────────
  const handleCreateNext = (slots: SelectedSlot[]) => {
    setCreatePendingSlots(slots);
    setShowCreateStep1(false);
    setShowCreateStep2(true);
  };
  const handleCreateBack = () => { setShowCreateStep2(false); setShowCreateStep1(true); };
  const handleCreate = async (fee: string, _pm: string, hours: number) => {
    const hourlyRatePaise = Math.max(0, Math.round((Number(fee) || 0) * 100));
    const scheduledAts = createPendingSlots.map((slot) => {
      const [time, meridiem] = slot.time.split(' ');
      const [rawHour, rawMinute] = time.split(':').map(Number);
      let hour = rawHour % 12;
      if (meridiem?.toUpperCase() === 'PM') hour += 12;
      const date = new Date(slot.date);
      date.setHours(hour, rawMinute || 0, 0, 0);
      return formatTimestampForDb(date);
    });

    setSavingSession(true);
    try {
      await mentorDashboard.createAvailabilitySessions({
        hourlyRatePaise,
        durationHours: hours,
        scheduledAts,
      });
      await refreshSessions();
      setCreatePendingSlots([]);
      setShowCreateStep2(false);
      setShowSuccess(true);
    } catch (error: any) {
      toast.error(error?.message || 'Unable to save this session right now.');
    } finally {
      setSavingSession(false);
    }
  };
  const closeCreate = () => { setShowCreateStep1(false); setShowCreateStep2(false); setCreatePendingSlots([]); };

  // ── Edit handlers ────────────────────────────────────
  const openEdit = (session: SessionPost) => {
    setSessionBeingEdited(session);
    setEditPendingSlots(session.timeSlots.map(parseExistingSlot));
    setShowEditStep1(true);
  };
  const handleEditNext = (slots: SelectedSlot[]) => {
    setEditPendingSlots(slots);
    setShowEditStep1(false);
    setShowEditStep2(true);
  };
  const handleEditBack = () => { setShowEditStep2(false); setShowEditStep1(true); };
  const handleEditPost = async (fee: string, _pm: string, hours: number) => {
    if (!sessionBeingEdited) return;
    const slot = editPendingSlots[0];
    if (!slot) return;

    const [time, meridiem] = slot.time.split(' ');
    const [rawHour, rawMinute] = time.split(':').map(Number);
    let hour = rawHour % 12;
    if (meridiem?.toUpperCase() === 'PM') hour += 12;
    const scheduledAt = new Date(slot.date);
    scheduledAt.setHours(hour, rawMinute || 0, 0, 0);

    setSavingSession(true);
    try {
      await mentorDashboard.updateAvailabilitySession(sessionBeingEdited.id, {
        hourlyRatePaise: Math.max(0, Math.round((Number(fee) || 0) * 100)),
        durationHours: hours,
        scheduledAt: formatTimestampForDb(scheduledAt),
      });
      await refreshSessions();
      setSessionBeingEdited(null);
      setEditPendingSlots([]);
      setShowEditStep2(false);
      setShowSuccess(true);
    } catch (error: any) {
      toast.error(error?.message || 'Unable to update this session right now.');
    } finally {
      setSavingSession(false);
    }
  };
  const closeEdit = () => { setShowEditStep1(false); setShowEditStep2(false); setSessionBeingEdited(null); setEditPendingSlots([]); };

  const handleDelete = async (id: string) => {
    setSavingSession(true);
    try {
      await mentorDashboard.deleteAvailabilitySession(id);
      await refreshSessions();
      setDeletingId(null);
    } catch (error: any) {
      toast.error(error?.message || 'Unable to delete this session right now.');
    } finally {
      setSavingSession(false);
    }
  };

  // Pre-fill values for edit Step 2
  const editInitialFee   = sessionBeingEdited?.rate.replace('₹','').replace('/hr','') ?? '';
  const editInitialHours = sessionBeingEdited?.hours[0] ?? null;

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-['Poppins'] font-medium text-[40px] text-foreground leading-tight">Create Session</p>
          <p className="font-['Poppins'] text-[14px] text-muted-foreground">Define your session details and get ready to teach.</p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-[760px]">
            <div className="dark:bg-blue-600/10 dark:border-blue-600/20 light:bg-blue-50 light:border-blue-200 border rounded-[12px] px-4 py-3">
              <p className="font-['Poppins'] text-[12px] dark:text-white/60 light:text-[rgba(0,0,0,0.6)]">Total Sessions</p>
              <p className="font-['Poppins'] font-semibold text-[20px] dark:text-blue-400 light:text-blue-600">
                {loadingStats ? '--' : stats.totalSessions}
              </p>
              <p className="font-['Poppins'] text-[11px] dark:text-white/45 light:text-[rgba(0,0,0,0.45)]">
                {loadingStats ? 'Loading...' : `${stats.completedSessions} completed`}
              </p>
            </div>

            <div className="dark:bg-orange-600/10 dark:border-orange-600/20 light:bg-orange-50 light:border-orange-200 border rounded-[12px] px-4 py-3">
              <p className="font-['Poppins'] text-[12px] dark:text-white/60 light:text-[rgba(0,0,0,0.6)]">Total Earnings</p>
              <p className="font-['Poppins'] font-semibold text-[20px] dark:text-orange-400 light:text-orange-600">
                {loadingStats ? '--' : formatInr(stats.totalEarnings)}
              </p>
              <p className="font-['Poppins'] text-[11px] dark:text-white/45 light:text-[rgba(0,0,0,0.45)]">From completed paid sessions</p>
            </div>

            <div className="dark:bg-green-600/10 dark:border-green-600/20 light:bg-green-50 light:border-green-200 border rounded-[12px] px-4 py-3">
              <p className="font-['Poppins'] text-[12px] dark:text-white/60 light:text-[rgba(0,0,0,0.6)]">Average Rating</p>
              <p className="font-['Poppins'] font-semibold text-[20px] dark:text-green-400 light:text-green-600">
                {loadingStats ? '--' : formatRating(stats.averageRating)}
              </p>
              <p className="font-['Poppins'] text-[11px] dark:text-white/45 light:text-[rgba(0,0,0,0.45)]">Live mentor profile score</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowCreateStep1(true)}
          disabled={savingSession}
          className="w-[49px] h-[49px] bg-blue-600 rounded-[12px] flex items-center justify-center dark:hover:bg-blue-700 light:hover:bg-blue-700 transition-colors shrink-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg fill="none" viewBox="0 0 49 49" className="w-full h-full">
            <rect fill="currentColor" height="49" rx="12" width="49" />
            <path d={svgPaths.p36014500} fill="white" />
          </svg>
        </button>
      </div>

      {/* Session list */}
      {loadingSessions ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-[70px] h-[70px] bg-[#c9e5ff] rounded-full flex items-center justify-center">
            <CreateSessionIcon />
          </div>
          <p className="font-['Poppins'] font-medium text-[18px] text-[rgba(0,0,0,0.6)]">Loading live sessions...</p>
          <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.4)] max-w-[300px]">Fetching your booked mentor sessions and current schedule from the database.</p>
        </div>
      ) : sessions.length > 0 ? (
        <div className="flex flex-col gap-4">
          <p className="font-['Poppins'] text-[16px] text-black">Active Session Post{sessions.length > 1 ? 's' : ''}:</p>
          {sessions.map(session => (
            <SessionCard
              key={session.id}
              session={session}
              onDelete={() => setDeletingId(session.id)}
              onEdit={() => openEdit(session)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-[70px] h-[70px] bg-[#c9e5ff] rounded-full flex items-center justify-center">
            <CreateSessionIcon />
          </div>
          <p className="font-['Poppins'] font-medium text-[18px] text-[rgba(0,0,0,0.6)]">No active sessions yet</p>
          <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.4)] max-w-[300px]">Click the + button to create your first session post and start teaching.</p>
        </div>
      )}

      {/* ── CREATE Step 1 ── */}
      {showCreateStep1 && (
        <CreateSessionDateTimeModal
          title="Create Session"
          onNext={handleCreateNext}
          onClose={closeCreate}
        />
      )}
      {/* ── CREATE Step 2 ── */}
      {showCreateStep2 && (
        <CreateSessionDetailsModal
          title="Create Session"
          slots={createPendingSlots}
          onBack={handleCreateBack}
          onClose={closeCreate}
          onPost={handleCreate}
        />
      )}

      {/* ── EDIT Step 1 ── */}
      {showEditStep1 && (
        <CreateSessionDateTimeModal
          title="Edit Session"
          initialSlots={editPendingSlots}
          onNext={handleEditNext}
          onClose={closeEdit}
        />
      )}
      {/* ── EDIT Step 2 ── */}
      {showEditStep2 && (
        <CreateSessionDetailsModal
          title="Edit Session"
          slots={editPendingSlots}
          initialFee={editInitialFee}
          initialHours={editInitialHours}
          onBack={handleEditBack}
          onClose={closeEdit}
          onPost={handleEditPost}
        />
      )}

      {/* ── Delete modal ── */}
      {deletingId && (
        <DeleteModal onConfirm={() => handleDelete(deletingId)} onCancel={() => setDeletingId(null)} />
      )}

      {/* ── Success toast ── */}
      {showSuccess && <SuccessToast onClose={() => setShowSuccess(false)} />}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Session Requests View
// ────────────────────────────────────────────────────────────────────────────────

type RequestStatus = 'pending' | 'accepted' | 'postponed' | 'completed';
type FilterTab    = 'requests' | 'upcoming' | 'postponed' | 'completed';

interface SessionRequest {
  id: string;
  student: string;
  datetime: string;
  hours: number;
  status: RequestStatus;
  canJoin?: boolean;
  newDatetime?: string;   // postponed: rescheduled time
  oldDatetime?: string;   // postponed: original time
}

function canJoinSession(datetime: string): boolean {
  const parts = datetime.split('|').map((part) => part.trim());
  if (parts.length !== 2) return false;

  const dateBits = parts[0].split(/[-/]/).map(Number);
  if (dateBits.length !== 3 || dateBits.some((bit) => Number.isNaN(bit))) return false;

  const [day, month, yearShort] = dateBits;
  const year = yearShort < 100 ? 2000 + yearShort : yearShort;
  const parsed = new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${parts[1]}`);
  if (Number.isNaN(parsed.getTime())) return false;

  const diffMs = parsed.getTime() - Date.now();
  return diffMs <= 10 * 60 * 1000 && diffMs >= -2 * 60 * 60 * 1000;
}

function mapBookingStatusToRequestStatus(status: string): RequestStatus {
  if (status === 'pending') return 'pending';
  if (status === 'confirmed') return 'accepted';
  if (status === 'cancelled') return 'postponed';
  return 'completed';
}

function TickIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 16 16">
      <path d="M2.75 8.75L6.25 12.25L13.25 4.75"
        stroke="#34B161" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
    </svg>
  );
}

function ClockIconSR() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 13.5 13.5">
      <path d="M0.75 6.75C0.75 7.53793 0.905195 8.31815 1.20672 9.0461C1.50825 9.77405 1.95021 10.4355 2.50736 10.9926C3.06451 11.5498 3.72595 11.9917 4.4539 12.2933C5.18185 12.5948 5.96207 12.75 6.75 12.75C7.53793 12.75 8.31815 12.5948 9.0461 12.2933C9.77405 11.9917 10.4355 11.5498 10.9926 10.9926C11.5498 10.4355 11.9917 9.77405 12.2933 9.0461C12.5948 8.31815 12.75 7.53793 12.75 6.75C12.75 5.1587 12.1179 3.63258 10.9926 2.50736C9.86742 1.38214 8.3413 0.75 6.75 0.75C5.1587 0.75 3.63258 1.38214 2.50736 2.50736C1.38214 3.63258 0.75 5.1587 0.75 6.75Z"
        stroke="#CC3636" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
      <path d="M6.75 3.41667V6.75L8.75 8.75"
        stroke="#CC3636" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/>
    </svg>
  );
}

function CalendarIconSR() {
  return (
    <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 18 18">
      <path d="M14.25 3H12.75V2.25C12.75 2.05109 12.671 1.86032 12.5303 1.71967C12.3897 1.57902 12.1989 1.5 12 1.5C11.8011 1.5 11.6103 1.57902 11.4697 1.71967C11.329 1.86032 11.25 2.05109 11.25 2.25V3H6.75V2.25C6.75 2.05109 6.67098 1.86032 6.53033 1.71967C6.38968 1.57902 6.19891 1.5 6 1.5C5.80109 1.5 5.61032 1.57902 5.46967 1.71967C5.32902 1.86032 5.25 2.05109 5.25 2.25V3H3.75C3.15326 3 2.58097 3.23705 2.15901 3.65901C1.73705 4.08097 1.5 4.65326 1.5 5.25V14.25C1.5 14.8467 1.73705 15.419 2.15901 15.841C2.58097 16.2629 3.15326 16.5 3.75 16.5H14.25C14.8467 16.5 15.419 16.2629 15.841 15.841C16.2629 15.419 16.5 14.8467 16.5 14.25V5.25C16.5 4.65326 16.2629 4.08097 15.841 3.65901C15.419 3.23705 14.8467 3 14.25 3ZM15 14.25C15 14.4489 14.921 14.6397 14.7803 14.7803C14.6397 14.921 14.4489 15 14.25 15H3.75C3.55109 15 3.36032 14.921 3.21967 14.7803C3.07902 14.6397 3 14.4489 3 14.25V9H15V14.25ZM15 7.5H3V5.25C3 5.05109 3.07902 4.86032 3.21967 4.71967C3.36032 4.57902 3.55109 4.5 3.75 4.5H5.25V5.25C5.25 5.44891 5.32902 5.63968 5.46967 5.78033C5.61032 5.92098 5.80109 6 6 6C6.19891 6 6.38968 5.92098 6.53033 5.78033C6.67098 5.63968 6.75 5.44891 6.75 5.25V4.5H11.25V5.25C11.25 5.44891 11.329 5.63968 11.4697 5.78033C11.6103 5.92098 11.8011 6 12 6C12.1989 6 12.3897 5.92098 12.5303 5.78033C12.671 5.63968 12.75 5.44891 12.75 5.25V4.5H14.25C14.4489 4.5 14.6397 4.57902 14.7803 4.71967C14.921 4.86032 15 5.05109 15 5.25V7.5Z"
        fill="black"/>
    </svg>
  );
}

// Arrow-right icon  (basil:arrow-right-outline — path from svg-2vqsdn872w)
function ArrowRightIcon({ color = 'black', opacity = 0.6 }: { color?: string; opacity?: number }) {
  return (
    <svg className="w-[22px] h-[22px] shrink-0" fill="none" viewBox="0 0 22 22">
      <path
        d="M12.3475 7.81917C12.2261 7.68884 12.1599 7.51646 12.1631 7.33836C12.1662 7.16025 12.2384 6.99031 12.3643 6.86435C12.4903 6.73839 12.6602 6.66623 12.8384 6.66309C13.0165 6.65995 13.1888 6.72606 13.3192 6.8475L16.9858 10.5142C17.1146 10.6431 17.1869 10.8178 17.1869 11C17.1869 11.1822 17.1146 11.3569 16.9858 11.4858L13.3192 15.1525C13.2562 15.22 13.1803 15.2742 13.096 15.3118C13.0117 15.3494 12.9206 15.3696 12.8283 15.3712C12.736 15.3728 12.6443 15.3559 12.5587 15.3213C12.4731 15.2867 12.3953 15.2352 12.33 15.17C12.2648 15.1047 12.2133 15.0269 12.1787 14.9413C12.1441 14.8557 12.1272 14.764 12.1288 14.6717C12.1304 14.5794 12.1506 14.4883 12.1882 14.404C12.2258 14.3197 12.28 14.2438 12.3475 14.1808L14.8408 11.6875H5.95833C5.776 11.6875 5.60113 11.6151 5.4722 11.4861C5.34327 11.3572 5.27083 11.1823 5.27083 11C5.27083 10.8177 5.34327 10.6428 5.4722 10.5139C5.60113 10.3849 5.776 10.3125 5.95833 10.3125H14.8408L12.3475 7.81917Z"
        fill={color}
        fillOpacity={opacity}
      />
    </svg>
  );
}

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'requests',  label: 'Requests'  },
  { id: 'upcoming',  label: 'Upcoming'  },
  { id: 'postponed', label: 'Postponed' },
  { id: 'completed', label: 'Completed' },
];

const TAB_STATUS_MAP: Record<FilterTab, RequestStatus> = {
  requests:  'pending',
  upcoming:  'accepted',
  postponed: 'postponed',
  completed: 'completed',
};

function SessionRequestsView() {
  const [requests, setRequests] = useState<SessionRequest[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>('requests');
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [busyRequestId, setBusyRequestId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const rows = await mentorDashboard.listSessionRequests();
        if (!mounted) return;

        setRequests(
          (rows ?? []).map((row: any) => ({
            id: row.id,
            student: row.student,
            datetime: row.datetime,
            hours: row.hours,
            status: mapBookingStatusToRequestStatus(row.status),
            canJoin: mapBookingStatusToRequestStatus(row.status) === 'accepted' ? canJoinSession(row.datetime) : false,
            oldDatetime: mapBookingStatusToRequestStatus(row.status) === 'postponed' ? row.datetime : undefined,
          }))
        );
      } catch {
        if (!mounted) return;
        setRequests([]);
      } finally {
        if (mounted) setLoadingRequests(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const visibleRows = requests.filter(r => r.status === TAB_STATUS_MAP[activeTab]);

  const acceptRequest = async (id: string) => {
    setBusyRequestId(id);
    try {
      await mentorDashboard.acceptBooking(id);
      setRequests(prev => prev.map(request => {
        if (request.id !== id) return request;
        return {
          ...request,
          status: 'accepted' as RequestStatus,
          canJoin: canJoinSession(request.datetime),
        };
      }));
      toast.success('Session accepted and student notified.');
    } catch (error: any) {
      toast.error(error?.message || 'Unable to accept this booking right now.');
    } finally {
      setBusyRequestId(current => (current === id ? null : current));
    }
  };
  const postponeRequest = async (id: string) => {
    setBusyRequestId(id);
    try {
      await mentorDashboard.postponeBooking(id);
      setRequests(prev => prev.filter(request => request.id !== id));
      toast.success('Student notified and booking removed.');
    } catch (error: any) {
      toast.error(error?.message || 'Unable to postpone this booking right now.');
    } finally {
      setBusyRequestId(current => (current === id ? null : current));
    }
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Page Header */}
      <div>
        <p className="font-['Poppins'] font-medium text-[40px] text-foreground leading-tight">Session Requests</p>
        <p className="font-['Poppins'] text-[14px] text-muted-foreground">View and respond to incoming session requests easily.</p>
      </div>

      {/* Filter bar */}
      <div className="dark:bg-[#2b2c2f] light:bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] flex items-center justify-between px-3 sm:px-6 py-2 sm:py-[10px] overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-4">
          <p className="font-['Poppins'] font-medium text-[12px] text-black shrink-0">Filter By</p>
          <div className="bg-[#f3f4f6] rounded-[20px] h-[50px] flex items-center px-[6px]">
            {FILTER_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-[42px] px-6 rounded-[20px] font-['Poppins'] font-medium text-[12px] transition-colors whitespace-nowrap flex items-center gap-1.5
                  ${activeTab === tab.id ? 'dark:bg-[#3a3b3f] dark:text-white light:bg-white light:text-black dark:shadow-sm light:shadow-sm' : 'dark:text-white/80 dark:hover:text-white light:text-[rgba(0,0,0,0.8)] light:hover:text-black'}`}
              >
                {tab.label}
                {tab.id === 'requests' && requests.filter(r => r.status === 'pending').length > 0 && (
                  <span className="bg-blue-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {requests.filter(r => r.status === 'pending').length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="border border-[rgba(0,0,0,0.4)] rounded-[12px] flex items-center gap-4 px-6 py-[10px] min-w-[180px]">
          <CalendarIconSR />
          <span className="font-['Poppins'] text-[12px] text-[rgba(0,0,0,0.6)]">Date Range</span>
        </div>
      </div>

      {/* Table */}
      <div className="dark:bg-[#2b2c2f] light:bg-white rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] overflow-hidden w-full">

        {/* Header row — 5-column layout for Postponed, 4-column for all others */}
        <div className="bg-[#c9e5ff] h-[62px] flex items-center px-6">
          {activeTab === 'postponed' ? (
            <>
              <div className="w-[180px] shrink-0">
                <p className="font-['Poppins'] font-medium text-[12px] text-[rgba(0,0,0,0.8)]">Student Name</p>
              </div>
              <div className="w-[210px] shrink-0">
                <p className="font-['Poppins'] font-medium text-[12px] text-[rgba(0,0,0,0.8)]">New Session Date and Time</p>
              </div>
              <div className="w-[210px] shrink-0">
                <p className="font-['Poppins'] font-medium text-[12px] text-[rgba(0,0,0,0.8)]">Old Session Date and Time</p>
              </div>
              <div className="w-[160px] shrink-0">
                <p className="font-['Poppins'] font-medium text-[12px] text-[rgba(0,0,0,0.8)]">No.of Hours</p>
              </div>
              <div className="flex-1 flex justify-center">
                <p className="font-['Poppins'] font-medium text-[12px] text-[rgba(0,0,0,0.8)]">Status</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-[200px] shrink-0">
                <p className="font-['Poppins'] font-medium text-[12px] text-[rgba(0,0,0,0.8)]">Student Name</p>
              </div>
              <div className="w-[230px] shrink-0">
                <p className="font-['Poppins'] font-medium text-[12px] text-[rgba(0,0,0,0.8)]">Session Date and Time</p>
              </div>
              <div className="w-[230px] shrink-0">
                <p className="font-['Poppins'] font-medium text-[12px] text-[rgba(0,0,0,0.8)]">No.of Hours</p>
              </div>
              <div className="flex-1 flex justify-center">
                <p className="font-['Poppins'] font-medium text-[12px] text-[rgba(0,0,0,0.8)]">
                  {activeTab === 'completed' ? 'Status' : 'Action'}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Empty state */}
        {loadingRequests ? (
          <div className="flex items-center justify-center py-14">
            <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.4)]">Loading session requests...</p>
          </div>
        ) : visibleRows.length === 0 ? (
          <div className="flex items-center justify-center py-14">
            <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.4)]">
              {activeTab === 'requests'  && 'No pending session requests.'}
              {activeTab === 'upcoming'  && 'No upcoming sessions yet.'}
              {activeTab === 'postponed' && 'No postponed sessions.'}
              {activeTab === 'completed' && 'No completed sessions.'}
            </p>
          </div>
        ) : (
          visibleRows.map((req, idx) => (
            <div
              key={req.id}
              className={`dark:bg-[#3a3b3f] dark:text-white dark:border-white/5 light:bg-white light:text-black light:border-[rgba(0,0,0,0.15)] h-[50px] sm:h-[62px] flex items-center px-3 sm:px-6 ${idx < visibleRows.length - 1 ? 'border-b' : ''}`}
            >
              {activeTab === 'postponed' ? (
                /* ── Postponed: 5-column layout ── */
                <>
                  <div className="w-[180px] shrink-0">
                    <p className="font-['Poppins'] font-medium text-[12px] text-black">{req.student}</p>
                  </div>
                  <div className="w-[210px] shrink-0">
                    <p className="font-['Poppins'] font-medium text-[12px] text-black">{req.newDatetime ?? '—'}</p>
                  </div>
                  <div className="w-[210px] shrink-0">
                    <p className="font-['Poppins'] font-medium text-[12px] text-black">{req.oldDatetime ?? req.datetime}</p>
                  </div>
                  <div className="w-[160px] shrink-0">
                    <p className="font-['Poppins'] font-medium text-[12px] text-black">
                      {req.hours} {req.hours === 1 ? 'hr' : 'hrs'}
                    </p>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <span className="font-['Poppins'] font-medium text-[12px] text-blue-600 dark:text-blue-400">Postponed</span>
                  </div>
                </>
              ) : (
                /* ── All other tabs: 4-column layout ── */
                <>
                  {/* Student Name */}
                  <div className="w-[200px] shrink-0">
                    <p className="font-['Poppins'] font-medium text-[12px] text-black">{req.student}</p>
                  </div>

                  {/* Date & Time */}
                  <div className="w-[230px] shrink-0">
                    <p className="font-['Poppins'] font-medium text-[12px] text-black">{req.datetime}</p>
                  </div>

                  {/* Hours */}
                  <div className="w-[230px] shrink-0">
                    <p className="font-['Poppins'] font-medium text-[12px] text-black">
                      {req.hours} {req.hours === 1 ? 'hr' : 'hrs'}
                    </p>
                  </div>

                  {/* Action cell */}
                  <div className="flex-1 flex items-center gap-6 h-[42px]">
                {activeTab === 'requests' && (
                  <>
                    <button
                      onClick={() => acceptRequest(req.id)}
                      disabled={busyRequestId === req.id}
                      className="flex-1 h-full bg-[rgba(52,177,97,0.4)] rounded-[20px] flex items-center justify-center gap-[6px] hover:bg-[rgba(52,177,97,0.55)] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <TickIcon />
                      <span className="font-['Poppins'] font-medium text-[12px] text-[#34b161]">
                        {busyRequestId === req.id ? 'Accepting...' : 'Accept'}
                      </span>
                    </button>
                    <button
                      onClick={() => postponeRequest(req.id)}
                      disabled={busyRequestId === req.id}
                      className="flex-1 h-full bg-[rgba(255,94,94,0.4)] rounded-[20px] flex items-center justify-center gap-[10px] hover:bg-[rgba(255,94,94,0.55)] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <ClockIconSR />
                      <span className="font-['Poppins'] font-medium text-[12px] text-[#cc3636]">
                        {busyRequestId === req.id ? 'Postponing...' : 'Postpone'}
                      </span>
                    </button>
                  </>
                )}
                {activeTab === 'upcoming' && (
                  <div className="flex-1 flex justify-center">
                    {req.canJoin ? (
                      // Blue — ready to join (within 10 min of session time)
                      <button className="bg-blue-100 dark:bg-blue-900 flex items-center justify-center gap-1 px-4 py-1 rounded-[20px] hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                        <span className="font-['Poppins'] font-medium text-[12px] text-blue-600 dark:text-blue-400">Join Session</span>
                        <ArrowRightIcon color="rgb(37, 99, 235)" opacity={1} />
                      </button>
                    ) : (
                      // Gray — not yet within 10 min of session time
                      <button disabled className="bg-gray-300 dark:bg-gray-600 flex items-center justify-center gap-1 px-4 py-1 rounded-[20px] cursor-not-allowed">
                        <span className="font-['Poppins'] font-medium text-[12px] text-[rgba(0,0,0,0.6)] dark:text-[rgba(255,255,255,0.6)]">Join Session</span>
                        <ArrowRightIcon color="black" opacity={0.6} />
                      </button>
                    )}
                  </div>
                )}
                {activeTab === 'completed' && (
                  <div className="flex-1 flex justify-center">
                    <span className="font-['Poppins'] font-medium text-[12px] text-[#34b161]">Completed</span>
                  </div>
                )}
                  </div>{/* /action cell */}
                </>
              )}{/* /ternary */}
            </div>
          ))
        )}
      </div>

      {/* Upcoming — note text (Figma: below the table) */}
      {activeTab === 'upcoming' && (
        <p className="font-['Poppins'] text-[12px] text-black">
          <span className="font-medium">* Note:</span>
          <span className="font-['Poppins']"> You'll be able to join your session 10 minutes before the scheduled time. You'll also receive a reminder notification when it's time to join. </span>
        </p>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Create Study Room View
// ────────────────────────────────────────────────────────────────────────────────

function CreateStudyRoomView() {
  const [step, setStep] = useState<'form' | 'share' | 'launching' | 'launched'>('form');
  const [roomName, setRoomName] = useState('');
  const [subject, setSubject] = useState('');
  const [roomType, setRoomType] = useState<'private' | 'public'>('private');
  const [maxParticipants, setMaxParticipants] = useState(8);
  const [roomId] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());
  const [copied, setCopied] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchError, setLaunchError] = useState('');

const joinLink = `${window.location.origin}/room/${roomId}`;

  const handleLaunch = async () => {
    // Validation
    setLaunchError('');
    if (!roomName.trim()) {
      setLaunchError('Please enter a room name');
      toast.error('Room name is required');
      return;
    }
    if (!subject.trim()) {
      setLaunchError('Please enter a subject/topic');
      toast.error('Subject/topic is required');
      return;
    }
    if (maxParticipants < 2 || maxParticipants > 50) {
      setLaunchError('Participants must be between 2 and 50');
      toast.error('Invalid participant count');
      return;
    }

    // Launch room via API
    setStep('launching');
    setIsLaunching(true);
    
    try {
      const roomData = await roomAPI.createRoom({
        name: roomName.trim(),
        subject: subject.trim(),
        maxParticipants: maxParticipants,
      });
      
      if (roomData && roomData.id) {
        toast.success(`Room "${roomName}" created successfully!`);
        setTimeout(() => setStep('launched'), 1500);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to create room. Please try again.';
      setLaunchError(errorMsg);
      toast.error(errorMsg);
      setStep('share');
      setIsLaunching(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://${joinLink}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setStep('form');
    setRoomName('');
    setSubject('');
    setRoomType('private');
    setMaxParticipants(8);
    setLaunchError('');
  };

  /* ── Shared page header ── */
  const PageHeader = () => (
    <div>
      <p className="font-['Poppins'] font-medium text-[40px] text-foreground leading-tight">Create Study Room</p>
      <p className="font-['Poppins'] text-[14px] text-muted-foreground">Build your own space to learn your way.</p>
    </div>
  );

  /* ── Launching state ── */
  if (step === 'launching') {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader />
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="font-['Poppins'] font-medium text-[16px] text-foreground">
                Creating your room...
              </p>
            </div>
            {launchError && (
              <p className="font-['Poppins'] text-[14px] text-red-500 text-center">{launchError}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── Launched / success state ── */
  if (step === 'launched') {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader />
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-[80px] h-[80px] bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <svg fill="none" viewBox="0 0 24 24" className="w-9 h-9" stroke="rgb(37, 99, 235)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <p className="font-['Poppins'] font-medium text-[20px] text-foreground">Room Launched!</p>
          <p className="font-['Poppins'] text-[14px] text-muted-foreground">
            Your study room <span className="text-blue-600 dark:text-blue-400 font-medium">"{roomName || 'Untitled Room'}"</span> is now live.
          </p>
          <button
            onClick={handleReset}
            className="mt-4 font-['Poppins'] font-medium text-[14px] px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-[20px] transition-colors"
          >
            Create another room
          </button>
        </div>
      </div>
    );
  }

  /* ── Share state ── */
  if (step === 'share') {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader />
        <div className="flex justify-center">
          <div className="dark:bg-slate-800 bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] p-4 sm:p-6 w-full max-w-[515px] flex flex-col gap-6">
            {/* Back + title inside card */}
            <div className="flex flex-col gap-[5px]">
              <button
                onClick={() => setStep('form')}
                className="font-['Poppins'] text-[16px] text-foreground text-left hover:opacity-60 transition-opacity"
              >
                &lt;Back
              </button>
              <p className="font-['Poppins'] font-medium text-[24px] text-foreground">Share Your Room</p>
            </div>

            {/* Room Name (read-only) */}
            <div className="flex flex-col gap-2.5">
              <p className="font-['Poppins'] text-[16px] text-foreground">Room Name</p>
              <div className="h-[39px] rounded-[10px] border dark:border-slate-700 border-slate-300 flex items-center gap-2.5 px-2.5 dark:bg-slate-800 bg-slate-50">
                <Building2 className="w-[24px] h-[24px] shrink-0 dark:text-white/60 text-slate-600" strokeWidth={1.4} />
                <p className="font-['Poppins'] text-[14px] text-foreground">{roomName || 'Maths Room'}</p>
              </div>
            </div>

            {/* Room ID */}
            <div className="flex flex-col gap-2.5">
              <p className="font-['Poppins'] text-[16px] text-foreground">Room ID</p>
              <div className="h-[39px] rounded-[10px] border dark:border-slate-700 border-slate-300 flex items-center gap-2.5 px-2.5 dark:bg-slate-800 bg-slate-50">
                <Hash className="w-[20px] h-[20px] shrink-0 dark:text-white/60 text-slate-600" strokeWidth={1.6} />
                <p className="font-['Poppins'] font-medium text-[14px] text-foreground">{roomId}</p>
              </div>
            </div>

            {/* Join Link */}
            <div className="flex flex-col gap-2.5">
              <p className="font-['Poppins'] text-[16px] text-foreground">Join Link</p>
              <div className="h-[39px] rounded-[10px] border dark:border-slate-700 border-slate-300 flex items-center gap-2.5 px-2.5 dark:bg-slate-800 bg-slate-50">
                <Link2 className="w-[24px] h-[24px] shrink-0 dark:text-white/60 text-slate-600" strokeWidth={1.6} />
                <p className="font-['Poppins'] font-medium text-[14px] text-blue-600 dark:text-blue-400">{joinLink}</p>
              </div>
            </div>

            {/* Copy Link */}
            <div className="flex justify-end">
              <button
                onClick={handleCopyLink}
                className="bg-blue-600 text-white font-['Poppins'] font-medium text-[14px] h-[42px] px-8 rounded-[20px] dark:hover:bg-blue-700 light:hover:bg-blue-700 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Form state (default) ── */
  return (
    <div className="flex flex-col gap-6">
      <PageHeader />
      <div className="flex justify-center">
        <div className="dark:bg-[#2b2c2f] light:bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] p-4 sm:p-6 w-full max-w-[515px] flex flex-col gap-6">

          {/* Room Name */}
          <div className="flex flex-col gap-2.5">
            <p className="font-['Poppins'] text-[16px] text-foreground">Room Name</p>
            <div className="h-[39px] rounded-[10px] border dark:border-white/10 border-slate-300 flex items-center gap-2.5 px-2.5 dark:bg-slate-800 bg-slate-50">
              <Building2 className="w-[24px] h-[24px] shrink-0 dark:text-white/60 text-slate-600" strokeWidth={1.4} />
              <input
                value={roomName}
                onChange={e => setRoomName(e.target.value)}
                placeholder="Name your study space"
                className="flex-1 bg-transparent outline-none font-['Poppins'] text-[14px] text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Subject/Topic */}
          <div className="flex flex-col gap-2.5">
            <p className="font-['Poppins'] text-[16px] text-foreground">Subject/Topic</p>
            <div className="h-[39px] rounded-[10px] border dark:border-white/10 border-slate-300 flex items-center gap-2.5 px-2.5 dark:bg-slate-800 bg-slate-50">
              <AlignLeft className="w-[24px] h-[24px] shrink-0 dark:text-white/60 text-slate-600" strokeWidth={1.4} />
              <input
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Enter Subject/Topic"
                className="flex-1 bg-transparent outline-none font-['Poppins'] text-[14px] text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Max Participants */}
          <div className="flex flex-col gap-2.5">
            <p className="font-['Poppins'] text-[16px] text-foreground">Max Participants</p>
            <div className="flex gap-2.5 items-center">
              <input
                type="range"
                min="2"
                max="50"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="bg-blue-600 dark:bg-blue-700 text-white rounded-[8px] px-3 py-1.5 min-w-[50px] text-center font-['Poppins'] text-[14px] font-medium">
                {maxParticipants}
              </div>
            </div>
            <p className="font-['Poppins'] text-[12px] text-muted-foreground">2–50 participants (recommended: 4–8)</p>
          </div>

          {/* Room Type */}
          <div className="flex flex-col gap-2.5">
            <p className="font-['Poppins'] text-[16px] text-foreground">Select Room Type</p>
            <div className="flex gap-2.5">
              {/* Private */}
              <button
                onClick={() => setRoomType('private')}
                className={`flex-1 rounded-[10px] p-2.5 text-left transition-colors ${
                  roomType === 'private'
                    ? 'bg-blue-100 dark:bg-blue-950'
                    : 'border dark:border-slate-700 border-slate-300 dark:hover:bg-slate-800 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <Lock className="w-[20px] h-[20px] shrink-0 text-foreground" strokeWidth={1.6} />
                  <span className="font-['Poppins'] font-medium text-[14px] text-foreground">Private</span>
                </div>
                <div className="font-['Poppins'] text-[12px] text-muted-foreground leading-snug">
                  <p>Accessible only through a</p>
                  <p>Room ID or invitation link.</p>
                </div>
              </button>

              {/* Public */}
              <button
                onClick={() => setRoomType('public')}
                className={`flex-1 rounded-[10px] p-2.5 text-left transition-colors ${
                  roomType === 'public'
                    ? 'bg-blue-100 dark:bg-blue-950'
                    : 'border dark:border-slate-700 border-slate-300 dark:hover:bg-slate-800 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <Globe className="w-[20px] h-[20px] shrink-0 text-foreground" strokeWidth={1.6} />
                  <span className="font-['Poppins'] font-medium text-[14px] text-foreground">Public</span>
                </div>
                <div className="font-['Poppins'] text-[12px] text-muted-foreground leading-snug">
                  <p>Open to all learners and listed</p>
                  <p>in Join Random Room Page.</p>
                </div>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-6 items-center">
            <button
              onClick={() => setStep('share')}
              disabled={isLaunching}
              className="flex-1 h-[42px] rounded-[20px] border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 font-['Poppins'] font-medium text-[14px] hover:bg-blue-600/10 dark:hover:bg-blue-600/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Share Room
            </button>
            <button
              onClick={handleLaunch}
              disabled={isLaunching || !roomName.trim() || !subject.trim()}
              className="flex-1 h-[42px] rounded-[20px] bg-blue-600 text-white font-['Poppins'] font-medium text-[14px] hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-blue-600 flex items-center justify-center gap-2"
            >
              {isLaunching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Launching...
                </>
              ) : (
                'Launch Room'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Emotional Wellness View
// ────────────────────────────────────────────────────────────────────────────────

type WellnessSubView = 'mood' | 'resources' | 'chat' | 'motivation';

type MoodChatState = 'welcome' | 'mic' | 'chat';
interface MoodMessage { id: number; role: 'ai' | 'user'; text: string; }

const INITIAL_MOOD_MESSAGES: MoodMessage[] = [
  { id: 1, role: 'ai',   text: 'Hello there! How may I assist you today?' },
  { id: 2, role: 'user', text: 'Hello there' },
  { id: 3, role: 'ai',   text: 'I\'m here to support your wellness journey. How are you feeling today?' },
  { id: 4, role: 'user', text: 'I\'m feeling a bit stressed about upcoming exams.' },
];

const AI_RESPONSES = [
  "I hear you. It's completely normal to feel that way. Would you like to talk more about it?",
  "Thank you for sharing. Your feelings are valid. Let me help you work through this.",
  "That sounds really meaningful. Remember, every step forward counts, no matter how small.",
  "I'm here with you. Take a deep breath — you're doing great by reaching out.",
];

function EmotionalWellnessView() {
  const [activeCard, setActiveCard] = useState<WellnessSubView | null>(null);

  // ── Motivation Corner state ──
  const [mcShowPostModal,  setMcShowPostModal]  = useState(false);
  const [mcPostType,       setMcPostType]       = useState<'' | 'Quote' | 'Story'>('');
  const [mcTypeDropOpen,   setMcTypeDropOpen]   = useState(false);
  const [mcPostContent,    setMcPostContent]    = useState('');
  const [mcPostAttached,   setMcPostAttached]   = useState(false);
  const [mcMotivLikes,     setMcMotivLikes]     = useState<Record<number, 'like' | 'dislike' | null>>({});
  const [mcPosts, setMcPosts] = useState([
    { id: 0, type: 'quote' as const, title: 'Motivational Quote', body: '' },
    { id: 1, type: 'story' as const, title: 'Success Through Persistence', body: 'Every expert was once a beginner who never gave up. Your effort today is building your success tomorrow.' },
  ]);

  const mcResetModal = () => {
    setMcShowPostModal(false); setMcPostType(''); setMcTypeDropOpen(false);
    setMcPostContent(''); setMcPostAttached(false);
  };
  const mcSubmitPost = () => {
    if (!mcPostType || !mcPostContent.trim()) return;
    setMcPosts(prev => [...prev, { id: Date.now(), type: mcPostType === 'Quote' ? 'quote' as const : 'story' as const, title: mcPostType === 'Quote' ? 'Motivational Quote' : 'Motivational Story', body: mcPostContent }]);
    mcResetModal();
  };
  const toggleMcLike = (id: number, action: 'like' | 'dislike') =>
    setMcMotivLikes(prev => ({ ...prev, [id]: prev[id] === action ? null : action }));

  // ── Wellness Resources state ──
  const [showPostModal, setShowPostModal]   = useState(false);
  const [postTitle, setPostTitle]           = useState('');
  const [postContent, setPostContent]       = useState('');
  const [postAttached, setPostAttached]     = useState(false);
  const [resLikes, setResLikes]             = useState<Record<number, 'like' | 'dislike' | null>>({});
  const [resArticles, setResArticles]       = useState([
    { id: 0, type: 'article' as const, title: 'Study Techniques', body: 'Learn effective study methods that enhance retention and reduce exam anxiety.' },
    { id: 1, type: 'video'   as const, title: 'Mindfulness Guide', body: 'A 5-minute guided breathing exercise to calm your mind before studying.' },
  ]);

  const handlePostArticle = () => {
    if (!postTitle.trim() && !postContent.trim()) return;
    setResArticles(prev => [...prev, { id: Date.now(), type: 'article', title: postTitle || 'New Article', body: postContent || '' }]);
    setPostTitle(''); setPostContent(''); setPostAttached(false); setShowPostModal(false);
  };

  const toggleResLike = (id: number, action: 'like' | 'dislike') => {
    setResLikes(prev => ({ ...prev, [id]: prev[id] === action ? null : action }));
  };

  // ── Mood Check-In chat state ──
  const [moodChatState, setMoodChatState]   = useState<MoodChatState>('welcome');
  const [moodMessages, setMoodMessages]     = useState<MoodMessage[]>(INITIAL_MOOD_MESSAGES);
  const [moodInput, setMoodInput]           = useState('');
  const [moodTyping, setMoodTyping]         = useState(false);
  const moodScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (moodScrollRef.current) {
      moodScrollRef.current.scrollTop = moodScrollRef.current.scrollHeight;
    }
  }, [moodMessages, moodTyping]);

  const handleMoodSend = () => {
    const text = moodInput.trim();
    if (!text) return;
    const userMsg: MoodMessage = { id: Date.now(), role: 'user', text };
    setMoodMessages(prev => [...prev, userMsg]);
    setMoodInput('');
    setMoodChatState('chat');
    setMoodTyping(true);
    setTimeout(() => {
      const aiText = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      setMoodMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: aiText }]);
      setMoodTyping(false);
    }, 1200);
  };

  /* ─── Arrow icon (rotated 90° = pointing right) ─── */
  const ArrowRight = () => (
    <svg fill="none" viewBox="0 0 22 22" className="w-[22px] h-[22px] rotate-90 shrink-0">
      <path clipRule="evenodd" d={svgWellness.p16746080} fill="white" fillRule="evenodd" />
    </svg>
  );

  /* ─── Card definitions ─── */
  const cards = [
    {
      id: 'mood' as WellnessSubView,
      title: 'Mood Check-In',
      subtitle: 'Share your feelings and let AI organize, track, and understand your mood journey.',
      cta: 'Start Check-In',
      gradient: 'from-[#f953c6] via-[#b91d73] to-[#ff5858]',
      icon: (
        <svg fill="none" viewBox="0 0 46 46" className="w-[46px] h-[46px] shrink-0">
          <path d={svgWellness.pf3ff700} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        </svg>
      ),
    },
    {
      id: 'resources' as WellnessSubView,
      title: 'Wellness Resources',
      subtitle: 'Access articles, videos and inspiring stories.',
      cta: 'Explore Resources',
      gradient: 'from-[#00c6ff] to-[#0072ff]',
      icon: (
        <svg fill="none" viewBox="0 0 46 46" className="w-[46px] h-[46px] shrink-0">
          <path d={svgWellness.p2bf7e800} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        </svg>
      ),
    },
    {
      id: 'chat' as WellnessSubView,
      title: 'World Chat',
      subtitle: 'Connect, share, and support each other worldwide.',
      cta: 'Join Conversation',
      gradient: 'from-[#56ab2f] to-[#a8e063]',
      icon: (
        <svg fill="none" viewBox="0 0 46 46" className="w-[46px] h-[46px] shrink-0">
          <path d={svgWellness.p232f3d30} fill="white" />
        </svg>
      ),
    },
    {
      id: 'motivation' as WellnessSubView,
      title: 'Motivation Corner',
      subtitle: 'Get inspired with uplifting quotes and real success stories.',
      cta: 'Find Inspiration',
      gradient: 'from-[#7f00ff] to-[#e100ff]',
      icon: (
        <svg fill="none" viewBox="0 0 46 46" className="w-[46px] h-[46px] shrink-0">
          <path d={svgWellness.p2a8f0980} stroke="white" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      ),
    },
  ];

  /* ─── Sub-view header with breadcrumb ─── */
  const SubHeader = ({ card }: { card: typeof cards[0] }) => (
    <div className="flex flex-col gap-1 shrink-0">
      <div className="flex items-center gap-2">
        <button
          onClick={() => { setActiveCard(null); setMoodChatState('welcome'); setMoodInput(''); }}
          className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.5)] hover:text-black transition-colors"
        >
          Emotional Wellness
        </button>
        <span className="text-[rgba(0,0,0,0.3)] text-[16px]">›</span>
        <span className="font-['Poppins'] text-[14px] text-black">{card.title}</span>
      </div>
      <p className="font-['Poppins'] font-medium text-[40px] text-black leading-tight">{card.title}</p>
    </div>
  );

  /* ─── Mood Check-In sub-view ─── */
  if (activeCard === 'mood') {
    const card = cards[0];

    /* Shared: robot image + greeting */
    const RobotGreeting = () => (
      <div className="flex flex-col items-center gap-6">
        {/* Robot image — matches Figma frame dimensions */}
        <div className="relative w-[145px] h-[253px] overflow-hidden pointer-events-none shrink-0">
          <img
            src={imgSayHi}
            alt="AI mentor waving"
            className="absolute max-w-none"
            style={{ width: '186.39%', height: '108.77%', left: '-32.4%', top: '-8.59%' }}
          />
        </div>
        {/* Greeting */}
        <div className="flex flex-col items-center text-center leading-[1.3]">
          <p className="font-['Poppins'] font-medium text-[32px] text-[rgba(0,0,0,0.7)]">Hello, Jack Sparrow</p>
          <p className="font-['Poppins'] font-medium text-[32px] text-[rgba(0,0,0,0.7)]">How are you feeling today?</p>
        </div>
      </div>
    );

    /* Shared: bottom input bar */
    const InputBar = () => (
      <div className="flex gap-5 items-center shrink-0">
        {/* Text field */}
        <div className="flex-1 bg-white h-[54px] rounded-[12px] shadow-[0px_4px_60px_5px_rgba(0,0,0,0.15)] relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <input
              value={moodInput}
              onChange={e => setMoodInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleMoodSend(); }}
              placeholder="Type here"
              className="flex-1 bg-transparent outline-none font-['Poppins'] font-medium text-[16px] text-[rgba(0,0,0,0.7)] placeholder:text-[rgba(0,0,0,0.6)]"
            />
            {/* Small mic icon */}
            <button
              onClick={() => setMoodChatState('mic')}
              className="shrink-0 p-1 hover:opacity-70 transition-opacity"
              title="Use microphone"
            >
              <svg fill="none" viewBox="0 0 16 20" className="w-4 h-5">
                <path d={svgMic.p17188b80} fill="#003566" />
                <path d={svgMic.p11bfc93e} stroke="#003566" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>
        {/* Navy send button */}
        <button
          onClick={handleMoodSend}
          className="bg-blue-600 rounded-[50px] size-[54px] flex items-center justify-center shrink-0 dark:hover:bg-blue-700 light:hover:bg-blue-700 transition-colors"
          title="Send"
        >
          {/* Up-arrow send icon (white) */}
          <svg fill="none" viewBox="0 0 24 24" className="w-[22px] h-[22px]">
            <path d="M12 20V4M12 4L6 10M12 4L18 10" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    );

    /* ── WELCOME state ── */
    if (moodChatState === 'welcome') {
      return (
        <div className="flex flex-col h-full min-h-0">
          <SubHeader card={card} />
          {/* Centered robot + greeting */}
          <div className="flex-1 flex items-center justify-center py-6">
            <RobotGreeting />
          </div>
          <InputBar />
        </div>
      );
    }

    /* ── MIC state ── */
    if (moodChatState === 'mic') {
      return (
        <div className="flex flex-col h-full min-h-0">
          <SubHeader card={card} />
          {/* Centered robot + greeting */}
          <div className="flex-1 flex items-center justify-center py-6">
            <RobotGreeting />
          </div>
          {/* "Ask me anything" card — matches Figma Frame14 */}
          <div className="dark:bg-[#3a3b3f] light:bg-white rounded-[12px] shadow-[0px_4px_60px_5px_rgba(0,0,0,0.15)] px-6 sm:px-10 py-6 sm:py-9 flex flex-col items-center gap-6 shrink-0">
            <p className="font-['Poppins'] font-medium text-[20px] sm:text-[24px] dark:text-white/60 light:text-[rgba(0,0,0,0.6)]">Ask me anything</p>
            {/* Large mic button — white circle with shadow */}
            <button
              onClick={() => setMoodChatState('welcome')}
              className="dark:bg-[#2b2c2f] light:bg-white rounded-[100px] shadow-[0px_4px_60px_0px_rgba(0,0,0,0.1)] size-[80px] sm:size-[105px] flex items-center justify-center dark:hover:shadow-[0px_6px_40px_rgba(37,99,235,0.2)] light:hover:shadow-[0px_6px_40px_rgba(0,53,102,0.2)] transition-shadow"
              title="Stop listening"
            >
              {/* Large mic SVG — viewBox matches Figma (35.6 × 46.6) */}
              <svg fill="none" viewBox="0 0 35.6189 46.6248" className="w-9 h-12">
                <path d={svgMicLarge.p11c0ecb0} className="dark:fill-blue-400 light:fill-[#003566]" />
                <path d={svgMicLarge.p168ffd40} className="dark:stroke-blue-400 light:stroke-[#003566]" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>
      );
    }

    /* ── CHAT state ── */
    return (
      <div className="flex flex-col h-full min-h-0">
        <SubHeader card={card} />
        {/* Scrollable messages */}
        <div
          ref={moodScrollRef}
          className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4 py-4 pr-1"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgb(37, 99, 235) rgba(37, 99, 235, 0.2)' }}
        >
          {moodMessages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[55%] p-4 rounded-[12px] shadow-[0px_4px_60px_5px_rgba(0,0,0,0.15)] ${
                  msg.role === 'ai' ? 'bg-white' : 'bg-[#c9e5ff]'
                }`}
              >
                <p className="font-['Poppins'] text-[16px] text-black leading-[21px]">{msg.text}</p>
              </div>
            </div>
          ))}
          {/* Typing indicator */}
          {moodTyping && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-[12px] shadow-[0px_4px_60px_5px_rgba(0,0,0,0.15)] flex gap-1 items-center">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-blue-600 rounded-full"
                    style={{ animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <InputBar />
      </div>
    );
  }

  /* ─── Wellness Resources sub-view ─── */
  if (activeCard === 'resources') {
    const card = cards[1];

    /* Like / Dislike SVG icons */
    const ThumbUp = () => (
      <div className="overflow-clip relative shrink-0 size-[24px]">
        <div className="absolute inset-[8.33%_12.5%_8.33%_25.5%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.8805 20">
            <path d={svgWellRes.p3e7c7e00} fill="#F77F00" />
          </svg>
        </div>
        <div className="absolute inset-[39.52%_80.32%_5.15%_9.37%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.474 13.2796">
            <path clipRule="evenodd" d={svgWellRes.p8514000} fill="#F77F00" fillRule="evenodd" />
          </svg>
        </div>
      </div>
    );

    const ThumbDown = () => (
      <div className="flex items-center justify-center relative shrink-0">
        <div className="-scale-y-100 flex-none">
          <div className="overflow-clip relative size-[24px]">
            <div className="absolute inset-[5.21%_9.38%]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.4996 21.4997">
                <path d={svgWellRes.p3779a540} fill="#F77F00" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div className="flex flex-col h-full min-h-0">
        {/* Header row: breadcrumb left, Post Article button right */}
        <div className="flex items-end justify-between shrink-0 pb-[6px]">
          <SubHeader card={card} />
          <button
            onClick={() => setShowPostModal(true)}
            className="relative flex gap-[6px] h-[42px] items-center px-[16px] rounded-[10px] hover:bg-[#f0f6ff] transition-colors"
          >
            <div aria-hidden="true" className="absolute border-2 border-blue-600 dark:border-blue-500 border-solid inset-[-1px] pointer-events-none rounded-[11px]" />
            <p className="font-['Poppins'] font-medium leading-normal text-blue-600 dark:text-blue-400 text-[14px]">Post Article</p>
            <svg fill="none" viewBox="0 0 24 24" className="w-6 h-6 shrink-0">
              <path d="M12 5V19M5 12H19" stroke="rgb(37, 99, 235)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
        </div>

        {/* Scrollable article list */}
        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-6 py-2 pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgb(37, 99, 235) rgba(37, 99, 235, 0.15)' }}>
          {resArticles.map(article => (
            <div key={article.id} className="dark:bg-[#2b2c2f] light:bg-white flex flex-col gap-[16px] sm:gap-[24px] items-start p-[16px] sm:p-[24px] rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] shrink-0 min-w-[280px] sm:min-w-[320px]">
              {/* Thumbnail */}
              {article.type === 'article' ? (
                <div className="bg-[#9f9f9f] h-[127px] overflow-clip relative rounded-[20px] shrink-0 w-[249px]">
                  <div className="absolute left-[-2px] size-[251px] top-[-63px]">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgResThumb} />
                  </div>
                </div>
              ) : (
                <div className="bg-[#9f9f9f] h-[127px] overflow-clip relative rounded-[20px] shrink-0 w-[249px]">
                  {/* White play icon centered */}
                  <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[24px] top-1/2">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                      <path d={svgWellRes.p1c33f400} fill="white" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Title + body */}
              <div className="flex flex-col gap-[4px] items-start w-full">
                <p className="font-['Poppins'] font-medium leading-normal text-[#003566] text-[24px] w-full">{article.title}</p>
                <p className="font-['Poppins'] leading-[21px] text-[16px] text-[rgba(0,0,0,0.7)] w-full">{article.body}</p>
              </div>

              {/* Author row + like/dislike */}
              <div className="flex items-center justify-between w-full">
                {/* Author */}
                <div className="flex gap-[10px] items-center">
                  <div className="relative rounded-[100px] shrink-0 size-[55px]">
                    <div className="absolute bg-[#cacaca] inset-0 rounded-[100px]" />
                    <div className="absolute inset-0 overflow-hidden rounded-[100px]">
                      <img alt="" className="absolute h-full left-0 max-w-none top-0 w-full object-cover" src={imgResAuthor} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-[10px]">
                    <p className="font-['Poppins'] font-medium leading-[21px] text-[14px] text-[rgba(0,0,0,0.7)]">Jack Sparrow</p>
                    <p className="font-['Poppins'] font-medium leading-[21px] text-[12px] text-[rgba(0,0,0,0.6)]">July 15, 2024</p>
                  </div>
                </div>

                {/* Like / Dislike */}
                <div className="flex gap-[24px] items-center">
                  <button
                    onClick={() => toggleResLike(article.id, 'like')}
                    className={`transition-transform hover:scale-110 ${resLikes[article.id] === 'like' ? 'scale-110' : ''}`}
                    title="Like"
                  >
                    <ThumbUp />
                  </button>
                  <button
                    onClick={() => toggleResLike(article.id, 'dislike')}
                    className={`transition-transform hover:scale-110 ${resLikes[article.id] === 'dislike' ? 'scale-110' : ''}`}
                    title="Dislike"
                  >
                    <ThumbDown />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Post New Article Modal ── */}
        {showPostModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
            onClick={e => { if (e.target === e.currentTarget) setShowPostModal(false); }}
          >
            <div className="dark:bg-[#2b2c2f] light:bg-white flex flex-col gap-[24px] items-end p-[24px] rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] w-full sm:w-[618px]">
              {/* Heading */}
              <p className="font-['Poppins'] font-semibold leading-normal min-w-full text-[24px] dark:text-white light:text-black">Post New Article</p>

              {/* Fields */}
              <div className="flex flex-col gap-[4px] w-full">
                {/* Title input */}
                <div className="dark:bg-[#3a3b3f] light:bg-white rounded-[10px] shadow-[0px_4px_29.4px_0px_rgba(0,0,0,0.1)] w-full">
                  <div className="flex items-start p-[16px] w-full">
                    <input
                      value={postTitle}
                      onChange={e => setPostTitle(e.target.value)}
                      placeholder="Article Title"
                      className="w-full bg-transparent outline-none font-['Poppins'] font-medium text-[16px] text-[rgba(0,0,0,0.8)] placeholder:text-[rgba(0,0,0,0.5)]"
                    />
                  </div>
                </div>
                {/* Content textarea */}
                <div className="dark:bg-[#3a3b3f] light:bg-white h-[150px] sm:h-[222px] rounded-[10px] shadow-[0px_4px_29.4px_0px_rgba(0,0,0,0.1)] w-full">
                  <div className="flex items-start p-[16px] size-full">
                    <textarea
                      value={postContent}
                      onChange={e => setPostContent(e.target.value)}
                      placeholder="Article Content"
                      className="w-full h-full bg-transparent outline-none resize-none font-['Poppins'] text-[16px] text-[rgba(0,0,0,0.7)] placeholder:text-[rgba(0,0,0,0.5)]"
                    />
                  </div>
                </div>
              </div>

              {/* Attach area */}
              {!postAttached ? (
                /* Attach button (empty state) */
                <div className="relative h-[40px] w-full">
                  <button
                    onClick={() => setPostAttached(true)}
                    className="absolute flex gap-[10px] items-center justify-center left-0 p-[10px] rounded-[10px] top-0 hover:bg-[#fff7f0] transition-colors"
                  >
                    <div aria-hidden="true" className="absolute border border-[#f77f00] border-solid inset-0 pointer-events-none rounded-[10px] shadow-[0px_4px_29.4px_0px_rgba(0,0,0,0.1)]" />
                    <svg fill="none" viewBox="0 0 20 20" className="relative shrink-0 size-[20px]">
                      <path d={svgWellResFill.pa4ae8c0} stroke="#F77F00" strokeLinecap="square" strokeWidth="2" />
                    </svg>
                    <p className="font-['Poppins'] font-medium leading-normal text-[#f77f00] text-[12px] relative">Attach Image, Video</p>
                  </button>
                </div>
              ) : (
                /* On-fill: image preview + add more */
                <div className="flex gap-[24px] items-center w-full">
                  {/* Attached image thumbnail with X */}
                  <div className="h-[113px] overflow-clip relative rounded-[20px] shrink-0 w-[112px]">
                    <div className="absolute h-[113px] left-[-41px] top-0 w-[194px]">
                      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgResAttach} />
                    </div>
                    {/* X button */}
                    <button
                      onClick={() => setPostAttached(false)}
                      className="absolute left-[90px] size-[13px] top-[7px]"
                      title="Remove"
                    >
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
                        <rect fill="white" height="13" rx="6.5" width="13" />
                        <path d={svgWellResFill.p11434fc0} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.85" />
                      </svg>
                    </button>
                  </div>
                  {/* Orange circle add more */}
                  <div className="overflow-clip relative shrink-0 size-[47px]">
                    <div className="absolute inset-[12.5%]">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.25 35.25">
                        <path d={svgWellResFill.p2e367c00} fill="#F77F00" fillOpacity="0.2" />
                        <path d={svgWellResFill.pa4ae8c0} stroke="#F77F00" strokeLinecap="square" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Cancel / Post Article buttons */}
              <div className="flex gap-[16px] items-center w-[337px]">
                <button
                  onClick={() => { setShowPostModal(false); setPostTitle(''); setPostContent(''); setPostAttached(false); }}
                  className="relative flex flex-1 h-[42px] items-center justify-center rounded-[20px] hover:bg-[#fff0f0] transition-colors"
                >
                  <div aria-hidden="true" className="absolute border border-[#cc3636] border-solid inset-[-0.5px] pointer-events-none rounded-[20.5px]" />
                  <p className="font-['Poppins'] font-medium leading-normal text-[#cc3636] text-[14px]">Cancel</p>
                </button>
                <button
                  onClick={handlePostArticle}
                  className="bg-blue-600 flex flex-1 h-[42px] items-center justify-center rounded-[20px] dark:hover:bg-blue-700 light:hover:bg-blue-700 transition-colors"
                >
                  <p className="font-['Poppins'] font-medium leading-normal text-[14px] text-white">Post Article</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ─── World Chat sub-view ─── */
  if (activeCard === 'chat') {
    return (
      <React.Suspense fallback={<RouteLoader fullscreen={false} label="Loading world chat..." />}>
        <SharedWorldChatView onBack={() => setActiveCard(null)} />
      </React.Suspense>
    );
  }

  /* ─── Motivation Corner sub-view ─── */
  if (activeCard === 'motivation') {
    const card = cards[3];

    /* Reusable like / dislike icons (same SVG paths as Wellness Resources) */
    const McThumbUp = () => (
      <div className="overflow-clip relative shrink-0 size-[24px]">
        <div className="absolute inset-[8.33%_12.5%_8.33%_25.5%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.8805 20">
            <path d={svgWellRes.p3e7c7e00} fill="#F77F00" />
          </svg>
        </div>
        <div className="absolute inset-[39.52%_80.32%_5.15%_9.37%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.474 13.2796">
            <path clipRule="evenodd" d={svgWellRes.p8514000} fill="#F77F00" fillRule="evenodd" />
          </svg>
        </div>
      </div>
    );
    const McThumbDown = () => (
      <div className="flex items-center justify-center relative shrink-0">
        <div className="-scale-y-100 flex-none">
          <div className="overflow-clip relative size-[24px]">
            <div className="absolute inset-[5.21%_9.38%]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.4996 21.4997">
                <path d={svgWellRes.p3779a540} fill="#F77F00" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );

    /* Dropdown chevron */
    const Chevron = () => (
      <svg className="shrink-0 size-[24px]" fill="none" viewBox="0 0 24 24">
        <path d="M7 10L12 15L17 10" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.5" />
      </svg>
    );

    /* Whether Post button is active */
    const mcCanPost = mcPostType !== '' && mcPostContent.trim() !== '';

    return (
      <div className="flex flex-col h-full min-h-0">
        {/* Header row */}
        <div className="flex items-end justify-between shrink-0 pb-[6px]">
          <SubHeader card={card} />
          <button
            onClick={() => setMcShowPostModal(true)}
            className="relative flex gap-[6px] h-[42px] items-center px-[16px] rounded-[10px] hover:bg-[#f0f6ff] transition-colors"
          >
            <div aria-hidden="true" className="absolute border-2 border-[#003566] border-solid inset-[-1px] pointer-events-none rounded-[11px]" />
            <p className="font-['Poppins'] font-medium leading-normal text-[#003566] text-[14px]">Post</p>
            <svg fill="none" viewBox="0 0 24 24" className="w-6 h-6 shrink-0">
              <path d="M12 5V19M5 12H19" stroke="#003566" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
        </div>

        {/* Scrollable post list */}
        <div
          className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-6 py-2 pr-1"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#003566 rgba(0,53,102,0.15)' }}
        >
          {mcPosts.map(post => (
            <div key={post.id} className="dark:bg-[#2b2c2f] light:bg-white flex flex-col gap-[16px] sm:gap-[24px] items-start p-[16px] sm:p-[24px] rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] shrink-0 min-w-[280px] sm:min-w-[320px]">
              {/* Thumbnail — only for story type */}
              {post.type === 'story' && (
                <div className="bg-[#9f9f9f] h-[127px] overflow-clip relative rounded-[20px] shrink-0 w-[249px]">
                  <div className="absolute left-[-2px] size-[251px] top-[-63px]">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgResThumb} />
                  </div>
                </div>
              )}

              {/* Title + body */}
              <div className="flex flex-col gap-[4px] items-start w-full">
                <p className="font-['Poppins'] font-medium leading-normal text-[#003566] text-[24px] w-full">{post.title}</p>
                {post.body && (
                  <p className="font-['Poppins'] leading-[21px] text-[16px] text-[rgba(0,0,0,0.7)] w-full">{post.body}</p>
                )}
              </div>

              {/* Author row + like/dislike */}
              <div className="flex items-center justify-between w-full">
                <div className="flex gap-[10px] items-center">
                  <div className="relative rounded-[100px] shrink-0 size-[55px]">
                    <div className="absolute bg-[#cacaca] inset-0 rounded-[100px]" />
                    <div className="absolute inset-0 overflow-hidden rounded-[100px]">
                      <img alt="" className="absolute h-full left-0 max-w-none top-0 w-full object-cover" src={imgResAuthor} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-[10px]">
                    <p className="font-['Poppins'] font-medium leading-[21px] text-[14px] text-[rgba(0,0,0,0.7)]">Jack Sparrow</p>
                    <p className="font-['Poppins'] font-medium leading-[21px] text-[12px] text-[rgba(0,0,0,0.6)]">July 15, 2024</p>
                  </div>
                </div>
                <div className="flex gap-[24px] items-center">
                  <button onClick={() => toggleMcLike(post.id, 'like')} className={`transition-transform hover:scale-110 ${mcMotivLikes[post.id] === 'like' ? 'scale-110' : ''}`} title="Like">
                    <McThumbUp />
                  </button>
                  <button onClick={() => toggleMcLike(post.id, 'dislike')} className={`transition-transform hover:scale-110 ${mcMotivLikes[post.id] === 'dislike' ? 'scale-110' : ''}`} title="Dislike">
                    <McThumbDown />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Post Motivational Quote/Story Modal ── */}
        {mcShowPostModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
            onClick={e => { if (e.target === e.currentTarget) { mcResetModal(); } }}
          >
            <div className="bg-white flex flex-col gap-[24px] items-end p-[24px] rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)] w-[618px]">
              {/* Heading */}
              <p className="font-['Poppins'] font-semibold leading-normal min-w-full text-[24px] text-black">Post Motivational Quote/Story</p>

              {/* Post Type dropdown */}
              <div className="flex flex-col gap-[4px] w-full relative">
                {/* Dropdown trigger */}
                <button
                  onClick={() => setMcTypeDropOpen(v => !v)}
                  className="dark:bg-[#3a3b3f] light:bg-white relative rounded-[10px] shadow-[0px_4px_29.4px_0px_rgba(0,0,0,0.1)] w-full flex items-start justify-between p-[16px] dark:hover:bg-[#444649] light:hover:bg-[#fafafa] transition-colors"
                >
                  <p className="font-['Poppins'] font-medium leading-normal text-[16px] dark:text-white light:text-[rgba(0,0,0,0.8)]">
                    {mcPostType || 'Post Type'}
                  </p>
                  <Chevron />
                </button>

                {/* Dropdown panel */}
                {mcTypeDropOpen && (
                  <div className="absolute top-[calc(100%+4px)] left-0 right-0 dark:bg-[#3a3b3f] light:bg-white rounded-[10px] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.1)] z-40 flex flex-col gap-[4px]">
                    {(['Quote', 'Story'] as const).map(opt => (
                      <button
                        key={opt}
                        onClick={() => { setMcPostType(opt); setMcTypeDropOpen(false); setMcPostContent(''); setMcPostAttached(false); }}
                        className="dark:bg-[#3a3b3f] dark:text-white dark:hover:bg-[#444649] light:bg-white light:text-[rgba(0,0,0,0.8)] light:hover:bg-[#f0f6ff] text-left px-[16px] py-[14px] rounded-[10px] transition-colors"
                      >
                        <p className="font-['Poppins'] font-medium text-[14px]">{opt}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Content area — only shown once type is selected */}
                {mcPostType && (
                  <textarea
                    value={mcPostContent}
                    onChange={e => setMcPostContent(e.target.value)}
                    placeholder={mcPostType === 'Quote' ? 'Type your quote here' : 'Type in your story here'}
                    className={`bg-white w-full rounded-[10px] shadow-[0px_4px_29.4px_0px_rgba(0,0,0,0.1)] p-[16px] font-['Poppins'] font-medium text-[16px] text-[rgba(0,0,0,0.7)] placeholder:text-[rgba(0,0,0,0.6)] outline-none resize-none ${mcPostType === 'Quote' ? 'h-[111px]' : 'h-[327px]'}`}
                  />
                )}
              </div>

              {/* Attach section — only for Story type */}
              {mcPostType === 'Story' && (
                !mcPostAttached ? (
                  <div className="relative h-[40px] w-full">
                    <button
                      onClick={() => setMcPostAttached(true)}
                      className="absolute flex gap-[10px] items-center justify-center left-0 p-[10px] rounded-[10px] top-0 hover:bg-[#fff7f0] transition-colors"
                    >
                      <div aria-hidden="true" className="absolute border border-[#f77f00] border-solid inset-0 pointer-events-none rounded-[10px] shadow-[0px_4px_29.4px_0px_rgba(0,0,0,0.1)]" />
                      <svg fill="none" viewBox="0 0 20 20" className="relative shrink-0 size-[20px]">
                        <path d={svgWellResFill.pa4ae8c0} stroke="#F77F00" strokeLinecap="square" strokeWidth="2" />
                      </svg>
                      <p className="font-['Poppins'] font-medium leading-normal text-[#f77f00] text-[12px] relative">Attach Image, Video</p>
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-[24px] items-center w-full">
                    {/* Attached image thumbnail */}
                    <div className="h-[113px] overflow-clip relative rounded-[20px] shrink-0 w-[112px]">
                      <div className="absolute h-[113px] left-[-41px] top-0 w-[194px]">
                        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgResAttach} />
                      </div>
                      <button onClick={() => setMcPostAttached(false)} className="absolute left-[90px] size-[13px] top-[7px]" title="Remove">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
                          <rect fill="white" height="13" rx="6.5" width="13" />
                          <path d={svgWellResFill.p11434fc0} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.85" />
                        </svg>
                      </button>
                    </div>
                    {/* Orange circle add more */}
                    <div className="overflow-clip relative shrink-0 size-[47px]">
                      <div className="absolute inset-[12.5%]">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.25 35.25">
                          <path d={svgWellResFill.p2e367c00} fill="#F77F00" fillOpacity="0.2" />
                          <path d={svgWellResFill.pa4ae8c0} stroke="#F77F00" strokeLinecap="square" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )
              )}

              {/* Cancel / Post buttons */}
              <div className="flex gap-[16px] items-center w-[337px]">
                <button
                  onClick={mcResetModal}
                  className="relative flex flex-1 h-[42px] items-center justify-center rounded-[20px] hover:bg-[#fff0f0] transition-colors"
                >
                  <div aria-hidden="true" className="absolute border border-[#cc3636] border-solid inset-[-0.5px] pointer-events-none rounded-[20.5px]" />
                  <p className="font-['Poppins'] font-medium leading-normal text-[#cc3636] text-[14px]">Cancel</p>
                </button>
                <button
                  onClick={mcSubmitPost}
                  disabled={!mcCanPost}
                  className={`flex flex-1 h-[42px] items-center justify-center rounded-[20px] transition-colors ${mcCanPost ? 'bg-blue-600 dark:hover:bg-blue-700 light:hover:bg-blue-700' : 'bg-[#a6a6a6] cursor-not-allowed'}`}
                >
                  <p className="font-['Poppins'] font-medium leading-normal text-[14px] text-white">
                    {mcPostType === 'Story' ? 'Post Story' : 'Post'}
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ─── Main card grid (default) ─── */
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-['Poppins'] font-medium text-[40px] text-foreground leading-tight">Emotional Wellness</p>
        <p className="font-['Poppins'] text-[14px] text-muted-foreground">Everything you need to manage your mental health journey</p>
      </div>

      <div className="grid grid-cols-2 gap-[25px]">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => setActiveCard(card.id)}
            className={`bg-gradient-to-r ${card.gradient} h-[308px] rounded-[20px] p-[24px] flex flex-col justify-between overflow-hidden hover:scale-[1.015] hover:shadow-xl transition-all text-left`}
          >
            {/* Header */}
            <div className="flex flex-col gap-[6px] w-full">
              <div className="flex gap-[6px] items-center w-full">
                {card.icon}
                <p className="font-['Poppins'] font-semibold text-[24px] text-white">{card.title}</p>
              </div>
              <p className="font-['Poppins'] font-medium text-[16px] text-white whitespace-pre-wrap">{card.subtitle}</p>
            </div>

            {/* CTA */}
            <div className="flex gap-[6px] items-center">
              <p className="font-['Poppins'] font-medium text-[14px] text-white">{card.cta}</p>
              <ArrowRight />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Coming Soon placeholder
// ────────────────────────────────────────────────────────────────────────────────

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="font-['Poppins'] font-medium text-[40px] text-foreground leading-tight">{title}</p>
      </div>
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="w-[80px] h-[80px] bg-secondary rounded-full flex items-center justify-center">
          <svg fill="none" viewBox="0 0 24 24" className="w-9 h-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--brand)' }}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
        <p className="font-['Poppins'] font-medium text-[20px] text-muted-foreground">Coming Soon</p>
        <p className="font-['Poppins'] text-[14px] text-muted-foreground/70 max-w-[300px]">This section is under development and will be available soon.</p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Sidebar
// ────────────────────────────────────────────────────────────────────────────────

interface SidebarProps {
  active: NavItem;
  onNav: (item: NavItem) => void;
  onLogoClick?: () => void;
}

const NAV_ITEMS: { id: NavItem; label: string; icon: React.ReactNode }[] = [
  { id: 'create-session', label: 'AI Mentor', icon: <CreateSessionIcon /> },
  { id: 'study-room', label: 'Study Rooms', icon: <StudyRoomIcon /> },
  { id: 'wellness', label: 'World Chat', icon: <WellnessIcon /> },
  { id: 'community', label: 'Community', icon: <CommunityIcon /> },
];

function Sidebar({ active, onNav, onLogoClick }: SidebarProps) {
  return (
    <div className="flex h-full flex-col border-r border-border/70 bg-card pt-[32px] pb-6 shadow-sm">
      {/* Logo */}
      <div className="px-[32px] mb-[36px]">
        <ElmOrbitLogo onClick={onLogoClick} />
      </div>

      {/* Menu label */}
      <p className="px-[32px] font-['Poppins'] text-[14px] dark:text-white/60 light:text-[rgba(0,0,0,0.6)] mb-3">Main Menu</p>

      {/* Nav items */}
      <nav className="flex flex-col gap-1.5 px-[16px]">
        {NAV_ITEMS.map(item => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              type="button"
              className={`appearance-none flex items-center gap-[6px] h-[42px] px-[16px] rounded-[10px] w-full text-left transition-colors border-0 ${
                isActive 
                  ? 'dark:!bg-blue-600/30 light:!bg-blue-100 dark:text-blue-300 light:text-blue-700 [&_path]:dark:fill-blue-300 [&_path]:light:fill-blue-700 [&_path]:dark:stroke-blue-300 [&_path]:light:stroke-blue-700' 
                  : '!bg-[transparent] dark:text-white/60 light:text-gray-600 dark:hover:!bg-white/5 light:hover:!bg-gray-100 [&_path]:dark:fill-white/50 [&_path]:light:fill-gray-600 [&_path]:dark:stroke-white/50 [&_path]:light:stroke-gray-600'
              }`}
            >
              <span>
                {item.icon}
              </span>
              <span className="font-['Poppins'] text-[14px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Mentor badge */}
      <div className="px-[16px]">
        <div className="dark:bg-blue-600/20 light:bg-blue-100 rounded-[12px] p-4 flex flex-col gap-1 border dark:border-blue-600/30 light:border-blue-200">
          <p className="font-['Poppins'] text-[12px] dark:text-blue-300 light:text-blue-600">Logged in as</p>
          <p className="font-['Poppins'] font-medium text-[14px] dark:text-blue-100 light:text-blue-700">Mentor Account</p>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Profile dropdown
// ────────────────────────────────────────────────────────────────────────────────

interface ProfileDropdownProps {
  onLogout: () => void;
  onClose: () => void;
  onNavigate: (nav: NavItem) => void;
}

function ProfileDropdown({ onLogout, onClose, onNavigate }: ProfileDropdownProps) {
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute top-[52px] right-0 z-40 w-[180px] overflow-hidden rounded-[12px] border border-border/70 dark:bg-[#3a3b3f] light:bg-card py-2 shadow-[0px_4px_20px_rgba(0,0,0,0.15)]">
        <button
          className="w-full px-4 py-2.5 text-left font-['Poppins'] text-[14px] dark:text-white light:text-foreground transition-colors dark:hover:bg-[#444649] light:hover:bg-muted"
          onClick={() => { onNavigate('profile'); onClose(); }}
        >
          Profile Settings
        </button>
        <div className="my-1 dark:border-white/10 light:border-border/70" />
        <button
          className="w-full px-4 py-2.5 text-left font-['Poppins'] text-[14px] text-red-600 dark:hover:bg-red-500/10 light:hover:bg-red-50 transition-colors"
          onClick={onLogout}
        >
          Log Out
        </button>
      </div>
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// Main Mentor Dashboard
// ────────────────────────────────────────────────────────────────────────────────

export function MentorDashboard({ onLogout }: MentorDashboardProps) {
  const navigate = useNavigate();
  const cachedUser = React.useMemo(() => getCurrentUser(), []);
  const [activeNav, setActiveNav] = useState<NavItem>('create-session');
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(() => shouldShowPendingOnboarding(cachedUser?.id, 'mentor'));
  const [mentorStats, setMentorStats] = useState<MentorStats>({
    totalSessions: 0,
    completedSessions: 0,
    totalEarnings: 0,
    averageRating: null,
  });
  const [mentorStatsLoading, setMentorStatsLoading] = useState(true);
  const sectionLoader = <RouteLoader fullscreen={false} label="Loading mentor workspace..." />;
  const [userProfile, setUserProfileState] = useState<{ name: string; role: string; avatar?: string | null }>(() => {
    const cached = cachedUser;
    return {
      name: cached?.name || 'User',
      role: cached?.role || 'mentor',
      avatar: cached?.avatar || cached?.avatar_url || null,
    };
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const items = await notificationsApi.list();
        setNotifications(items);
        setUnreadCount(items.filter(item => !item.read).length);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();

    const unsubscribe = notificationsApi.subscribe((items) => {
      setNotifications(items);
      setUnreadCount(items.filter(item => !item.read).length);
    });

    return () => {
      // This is not a function, so we can't call it.
      // supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const prof = await profileApi.get();
        if (!mounted || !prof) return;
        setUserProfileState({
          name: prof.name || 'User',
          role: prof.role || 'mentor',
          avatar: prof.avatar || prof.avatar_url || null,
        });
        setCurrentUser(prof);
      } catch {
        // Keep cached profile if fetch fails.
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stats = await mentorDashboard.getStats();
        if (!mounted) return;
        setMentorStats(stats);
      } catch {
        if (!mounted) return;
        setMentorStats({
          totalSessions: 0,
          completedSessions: 0,
          totalEarnings: 0,
          averageRating: null,
        });
      } finally {
        if (mounted) setMentorStatsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const displayName = userProfile.name || 'User';
  const displayRole = userProfile.role === 'mentor' ? 'Mentor' : 'Student';
  const displayAvatar = userProfile.avatar || imgUserAvatar;
  const currentUserId = cachedUser?.id;

  const closeOnboarding = React.useCallback(() => {
    completePendingOnboarding(currentUserId);
    setShowOnboarding(false);
  }, [currentUserId]);

  const handleOnboardingAction = React.useCallback((index: number) => {
    if (index === 0) {
      setActiveNav('create-session');
      return;
    }
    if (index === 1) {
      setActiveNav('wellness');
      return;
    }
    setActiveNav('profile');
  }, []);

  const handleLogoClick = React.useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleToggleNotifications = async () => {
    if (!showNotifications) {
      try {
        await notificationsApi.markAllRead();
        const items = await notificationsApi.list();
        setNotifications(items);
        setUnreadCount(0);
      } catch (error) {
        console.error('Failed to mark notifications as read:', error);
      }
    }
    setShowNotifications(!showNotifications);
    setShowProfile(false);
  };

  const renderContent = () => {
    switch (activeNav) {
      case 'create-session': return <CreateSessionView stats={mentorStats} loadingStats={mentorStatsLoading} mentorName={displayName} />;
      case 'study-room': return <CreateStudyRoomView />;
      case 'wellness': return <EmotionalWellnessView />;
      case 'community':
        return (
          <React.Suspense fallback={sectionLoader}>
            <MentorCommunityView />
          </React.Suspense>
        );
      case 'profile':
        return (
          <React.Suspense fallback={sectionLoader}>
            <MentorProfileSettings onBack={() => setActiveNav('create-session')} />
          </React.Suspense>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <React.Suspense fallback={null}>
        <OnboardingWalkthrough
          open={showOnboarding}
          role="mentor"
          userName={displayName}
          onOpenChange={(open) => {
            if (!open) {
              closeOnboarding();
              return;
            }
            setShowOnboarding(true);
          }}
          onFinish={closeOnboarding}
          onStepAction={handleOnboardingAction}
        />
      </React.Suspense>
      {/* Sidebar — hidden when profile settings is open (it has its own sidebar) */}
      {activeNav !== 'profile' && (
        <div className="w-[278px] shrink-0 h-full overflow-y-auto hidden md:block">
          <Sidebar active={activeNav} onNav={setActiveNav} onLogoClick={handleLogoClick} />
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-background">
        {/* Top bar — hidden in profile view which has its own */}
        <div className={`flex shrink-0 items-center justify-end gap-6 border-b border-border/70 bg-card px-10 py-[22px] backdrop-blur-xl ${activeNav === 'profile' ? 'hidden' : ''}`}>
          {/* Bell */}
          <div className="relative bg-transparent">
            <button
              className="appearance-none border-0 !bg-transparent relative p-1 hover:opacity-70 transition-opacity"
              type="button"
              onClick={handleToggleNotifications}
            >
            <BellIcon />
            {unreadCount > 0 && (
              <div className="absolute top-0 right-0 size-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                {unreadCount}
              </div>
            )}
            {showNotifications && (
              <div
                className="absolute top-[44px] right-0 z-40 flex w-[380px] flex-col gap-[24px] rounded-[20px] border border-border/70 dark:bg-[#3a3b3f] light:bg-card p-[32px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <p className="font-['Poppins'] font-medium text-[16px] dark:text-white light:text-black">Notifications</p>
                  <p className="font-['Poppins'] text-[12px] dark:text-white/70 light:text-[rgba(0,0,0,0.7)] underline cursor-pointer">View All</p>
                </div>

                {/* Scrollable body */}
                <div className="flex flex-col gap-[16px] max-h-[520px] overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-center text-gray-500">No notifications</p>
                  ) : (
                    notifications.map(notification => (
                      <div key={notification.id} className="flex gap-[10px] items-start">
                        <div className="bg-[#2295ff] flex items-center justify-center rounded-[5px] shrink-0 size-[44px]">
                          {/* You can add icons based on notification type */}
                        </div>
                        <div className="flex flex-col font-['Poppins'] text-[12px]">
                          <p className="text-[14px] dark:text-white light:text-black leading-normal">{notification.title}</p>
                          <p className="dark:text-white/70 light:text-[rgba(0,0,0,0.7)] leading-normal">{notification.message}</p>
                          <p className="dark:text-white/50 light:text-[rgba(0,0,0,0.5)] text-xs mt-1">{new Date(notification.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            </button>
          </div>

          {/* Profile */}
          <div className="relative bg-transparent">
            <button
              type="button"
              className="appearance-none border-0 !bg-transparent flex items-center gap-[10px] hover:opacity-80 transition-opacity"
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            >
              <ImageWithFallback
                src={displayAvatar}
                alt={displayName}
                className="w-[38px] h-[38px] rounded-full object-cover"
              />
              <div className="flex flex-col items-start leading-tight">
                <span className="font-['Poppins'] text-[15px] dark:text-white light:text-black">{displayName}</span>
                <span className="font-['Poppins'] text-[11px] dark:text-white/50 light:text-[rgba(0,0,0,0.5)]">{displayRole}</span>
              </div>
            </button>

            {showProfile && (
              <ProfileDropdown
                onLogout={onLogout}
                onClose={() => setShowProfile(false)}
                onNavigate={(nav) => { setActiveNav(nav); setShowProfile(false); }}
              />
            )}
          </div>
        </div>

        {/* Page content */}
        <div className={`flex-1 ${activeNav === 'wellness' ? 'overflow-hidden flex flex-col p-10' : activeNav === 'profile' ? 'overflow-hidden flex flex-col' : 'overflow-y-auto p-10'}`}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}



