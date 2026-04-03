import React, { useState } from 'react';
import { LiveModeRoom } from './LiveModeRoom';

interface LiveModeViewProps {
  onLeave: () => void;
}

export function LiveModeView({ onLeave }: LiveModeViewProps) {
  const [hasJoinedRoom] = useState(true); // Auto-join for now

  if (hasJoinedRoom) {
    return <LiveModeRoom onLeaveRoom={onLeave} />;
  }

  // Could add room selection UI here later
  return null;
}
