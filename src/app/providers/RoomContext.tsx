import React, { createContext, useContext, ReactNode } from 'react';

export interface Participant {
  id: number;
  name: string;
  avatar?: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isPinned?: boolean;
}

export interface RoomContextType {
  roomId: string;
  roomName: string;
  subject: string;
  participants: Participant[];
  isHost: boolean;
  currentUserId: string | null;
  elapsedTime: number;
  maxParticipants?: number;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function useRoom() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within RoomProvider');
  }
  return context;
}

interface RoomProviderProps {
  children: ReactNode;
  value: RoomContextType;
}

export function RoomProvider({ children, value }: RoomProviderProps) {
  return (
    <RoomContext.Provider value={value}>
      {children}
    </RoomContext.Provider>
  );
}
