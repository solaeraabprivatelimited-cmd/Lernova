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

const DEFAULT_ROOM_CONTEXT: RoomContextType = {
  roomId: '',
  roomName: '',
  subject: '',
  participants: [],
  isHost: false,
  currentUserId: null,
  elapsedTime: 0,
  maxParticipants: undefined,
};

export function useRoom() {
  const context = useContext(RoomContext);
  // Return safe defaults instead of throwing — lets mode views render standalone
  return context ?? DEFAULT_ROOM_CONTEXT;
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
