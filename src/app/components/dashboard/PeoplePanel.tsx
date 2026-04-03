import React, { useState } from 'react';
import { X, Pin, MoreVertical, Mic } from 'lucide-react';
import { ReportReasonModal } from './ReportReasonModal';
import { ReportSuccessNotification } from './ReportSuccessNotification';
import { KickMemberModal } from './KickMemberModal';

interface Participant {
  id: number;
  name: string;
  image: string;
  isMuted: boolean;
  isVideoOff: boolean;
}

interface PeoplePanelProps {
  onClose: () => void;
  participants: Participant[];
  onPinParticipant: (id: number) => void;
  pinnedParticipantId: number | null;
  isAdmin?: boolean;
  currentUserId?: number;
  mode?: 'collaborative' | 'live'; // Add mode prop
}

export function PeoplePanel({ 
  onClose, 
  participants, 
  onPinParticipant,
  pinnedParticipantId,
  isAdmin = false,
  currentUserId = 0,
  mode = 'collaborative'
}: PeoplePanelProps) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [reportingParticipant, setReportingParticipant] = useState<{ id: number; name: string } | null>(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [kickingParticipant, setKickingParticipant] = useState<{ id: number; name: string } | null>(null);

  const handleReport = (participantId: number, participantName: string) => {
    setReportingParticipant({ id: participantId, name: participantName });
    setOpenMenuId(null);
  };

  const handleKick = (participantId: number, participantName: string) => {
    setKickingParticipant({ id: participantId, name: participantName });
    setOpenMenuId(null);
  };

  const handleReportSubmit = (reason: string, description: string) => {
    console.log('Report submitted:', {
      participantId: reportingParticipant?.id,
      participantName: reportingParticipant?.name,
      reason,
      description
    });
    // Here you would send the report to the backend
    setReportingParticipant(null);
    setShowSuccessNotification(true);
  };

  const handleReportCancel = () => {
    setReportingParticipant(null);
  };

  const handleKickSubmit = () => {
    console.log('Kick submitted:', {
      participantId: kickingParticipant?.id,
      participantName: kickingParticipant?.name
    });
    // Here you would send the kick to the backend
    setKickingParticipant(null);
    setShowSuccessNotification(true);
  };

  const handleKickCancel = () => {
    setKickingParticipant(null);
  };

  const toggleMenu = (participantId: number) => {
    setOpenMenuId(openMenuId === participantId ? null : participantId);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`fixed right-8 top-1/2 transform -translate-y-1/2 rounded-[20px] w-[320px] max-h-[600px] flex flex-col font-['Poppins'] z-50 ${
        mode === 'live' ? 'bg-[#5a5a5a]' : 'bg-[#3a3a3a]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-[24px] font-medium text-white">People</h2>
          <button
            onClick={onClose}
            type="button"
            className="text-white/70 hover:text-white transition-colors cursor-pointer relative z-50"
            aria-label="Close"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Section Label */}
        <div className="px-6 pb-3">
          <p className="text-[14px] text-white/60">In Room</p>
        </div>

        {/* Participant List */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 people-scrollbar">
          <div className="flex flex-col gap-3">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className={`rounded-[20px] flex flex-col transition-colors relative ${
                  mode === 'live' 
                    ? 'bg-white/10 hover:bg-white/15' 
                    : 'bg-[#4a4a4a] hover:bg-[#525252]'
                } ${
                  openMenuId === participant.id && mode === 'live' 
                    ? 'px-6 py-3 gap-3' 
                    : 'px-6 py-[9px]'
                }`}
              >
                {/* Top Row - Avatar, Name, and Icons */}
                <div className="flex items-center justify-between">
                  {/* Left Side - Avatar and Name */}
                  <div className="flex items-center gap-4">
                    <div className="w-[30px] h-[30px] rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={participant.image} 
                        alt={participant.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[16px] text-white font-normal">{participant.name}</span>
                  </div>

                  {/* Right Side - Controls */}
                  <div className="flex items-center gap-4 relative">
                    {/* Pin Button */}
                    <button
                      onClick={() => onPinParticipant(participant.id)}
                      className={`transition-colors ${
                        mode === 'live'
                          ? pinnedParticipantId === participant.id
                            ? 'text-white'
                            : 'text-[#ff5e5e] hover:text-[#ff7e7e]'
                          : pinnedParticipantId === participant.id 
                            ? 'text-blue-400' 
                            : 'text-white/70 hover:text-white'
                      }`}
                    >
                      <Pin className={mode === 'live' ? 'w-[25px] h-[25px]' : 'w-4 h-4'} />
                    </button>

                    {/* Mic Icon - Always visible in Live Mode */}
                    {mode === 'live' && (
                      <div className="text-white">
                        <Mic className="w-7 h-7" />
                      </div>
                    )}

                    {/* Mute Indicator - Only for Collaborative Mode */}
                    {mode === 'collaborative' && participant.isMuted && (
                      <div className="text-red-500">
                        <Mic className="w-4 h-4" />
                      </div>
                    )}

                    {/* More Options - Only show for other participants (not yourself) */}
                    {participant.id !== currentUserId && (
                      <button
                        onClick={() => toggleMenu(participant.id)}
                        className={`transition-colors ${
                          mode === 'live' 
                            ? 'text-white/70 hover:text-white' 
                            : 'text-white/70 hover:text-white'
                        }`}
                      >
                        <MoreVertical className={mode === 'live' ? 'w-6 h-6' : 'w-4 h-4'} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Report Button - Shown inline below when menu is open (Live Mode) */}
                {openMenuId === participant.id && mode === 'live' && (
                  <button
                    onClick={() => handleReport(participant.id, participant.name)}
                    className="bg-[#ff5e5e] hover:bg-[#ff4545] text-white rounded-[20px] px-6 py-3 text-[14px] font-semibold transition-colors w-full"
                  >
                    Report
                  </button>
                )}

                {/* Admin Options Menu - Collaborative Mode (shown when menu is open) */}
                {openMenuId === participant.id && mode === 'collaborative' && isAdmin && participant.id !== currentUserId && (
                  <div className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-[#3a3a3a] rounded-[12px] p-2 flex flex-col gap-2 shadow-2xl z-10 min-w-[140px]">
                    <button
                      onClick={() => handleReport(participant.id, participant.name)}
                      className="bg-transparent border border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444]/10 rounded-full px-5 py-1.5 text-[14px] font-medium transition-colors whitespace-nowrap"
                    >
                      Report Member
                    </button>
                    <button
                      onClick={() => handleKick(participant.id, participant.name)}
                      className="bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-full px-5 py-1.5 text-[14px] font-medium transition-colors whitespace-nowrap"
                    >
                      Kick Member
                    </button>
                  </div>
                )}

                {/* Regular Report Button - Collaborative Mode (shown when menu is open for non-admin) */}
                {openMenuId === participant.id && mode === 'collaborative' && !isAdmin && (
                  <button
                    onClick={() => handleReport(participant.id, participant.name)}
                    className="bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-full px-6 py-1.5 text-[14px] font-medium transition-colors"
                  >
                    Report
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Reason Modal */}
      {reportingParticipant && (
        <ReportReasonModal
          participantId={reportingParticipant.id}
          participantName={reportingParticipant.name}
          onSubmit={handleReportSubmit}
          onCancel={handleReportCancel}
          isAdmin={isAdmin}
          mode={mode}
        />
      )}

      {/* Report Success Notification */}
      {showSuccessNotification && (
        <ReportSuccessNotification
          onClose={() => setShowSuccessNotification(false)}
        />
      )}

      {/* Kick Member Modal */}
      {kickingParticipant && (
        <KickMemberModal
          participantName={kickingParticipant.name}
          onConfirm={handleKickSubmit}
          onCancel={handleKickCancel}
        />
      )}
    </>
  );
}