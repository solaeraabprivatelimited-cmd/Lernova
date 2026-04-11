import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import imgEllipse1 from "figma:asset/798eac6e288222603807db12d070c52d1a145785.png";
import svgPaths from "../../../imports/svg-r9h2tu6cre";
import { LaunchingRoomLoader } from "./LaunchingRoomLoader";
import { roomAPI } from '@/utils/api/roomAPI';

interface CreateCustomRoomProps {
  onBack: () => void;
  onLaunchRoom: (roomData: RoomData) => void;
}

interface RoomData {
  roomName: string;
  subject: string;
  roomType: 'private' | 'public';
  roomId: string;
  roomCode: string;
  maxParticipants?: number;
}

export function CreateCustomRoom({ onBack, onLaunchRoom }: CreateCustomRoomProps) {
  const [roomName, setRoomName] = useState('');
  const [subject, setSubject] = useState('');
  const [roomType, setRoomType] = useState<'private' | 'public'>('private');
  const [maxParticipants, setMaxParticipants] = useState(6);
  const [isLaunching, setIsLaunching] = useState(false);
  const roomCodePreview = 'STUDY-XXXXXX';

  const handleLaunchRoom = async () => {
    if (roomName.trim() && subject.trim()) {
      setIsLaunching(true);
      
      try {
        // Create room in database
        const createdRoom = await roomAPI.createRoom({
          name: roomName,
          subject: subject,
          mode: 'collaborative',
          description: `${roomType} study room`,
          maxParticipants: maxParticipants,
        });

        // Launch room with real database ID while exposing the shareable room code in UI
        onLaunchRoom({
          roomName: createdRoom.name,
          subject: createdRoom.subject || subject,
          roomType,
          roomId: createdRoom.id,
          roomCode: createdRoom.code,
          maxParticipants: createdRoom.max_participants,
        });
      } catch (error) {
        console.error('Failed to create room:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        alert(`Failed to create room: ${message}`);
        setIsLaunching(false);
      }
    }
  };

  // Show launching loader
  if (isLaunching) {
    return <LaunchingRoomLoader />;
  }

  return (
    <>
      {/* Breadcrumb & Title */}
      <div className="px-20 pb-10">
        <button 
          onClick={onBack}
          className="text-[16px] text-black/70 mb-6 hover:text-black transition-colors"
        >
          &lt; Back
        </button>
          
        <div className="mb-12">
          <h1 className="text-[40px] font-medium text-black mb-1.5">Create Custom Room</h1>
          <p className="text-[14px] text-black/60">Build your own space to learn your way.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] p-6 w-[515px]">
          <div className="flex flex-col gap-6">
            {/* Room Name */}
            <div className="flex flex-col gap-2.5">
              <label className="text-[16px] text-black">Room Name</label>
              <div className="h-[39px] rounded-[10px] border border-black/40 flex items-center gap-2.5 px-2.5">
                <svg width="27" height="27" viewBox="0 0 27 27" fill="none">
                  <path d={svgPaths.p6efe00} fill="black" />
                    <path d={svgPaths.p1e94b00} fill="black" />
                  </svg>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Name your study space"
                    className="flex-1 outline-none text-[14px] text-black placeholder:text-black/60 bg-transparent"
                  />
                </div>
              </div>

              {/* Subject/Topic */}
              <div className="flex flex-col gap-2.5">
                <label className="text-[16px] text-black">Subject/Topic</label>
                <div className="h-[39px] rounded-[10px] border border-black/40 flex items-center gap-2.5 px-2.5">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d={svgPaths.p2ea8b700} fill="black" />
                  </svg>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter Subject/Topic"
                    className="flex-1 outline-none text-[14px] text-black placeholder:text-black/60 bg-transparent"
                  />
                </div>
              </div>

              {/* Max Participants */}
              <div className="flex flex-col gap-2.5">
                <label className="text-[16px] text-black">Max Participants</label>
                <div className="flex gap-2.5 items-center">
                  <input
                    type="range"
                    min="2"
                    max="20"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#003566]"
                  />
                  <div className="bg-[#003566] text-white rounded-[8px] px-3 py-1.5 min-w-[50px] text-center text-[14px] font-medium">
                    {maxParticipants}
                  </div>
                </div>
                <p className="text-[12px] text-black/60">2–50 participants (recommended: 4–8)</p>
              </div>

              {/* Select Room Type */}
              <div className="flex flex-col gap-2.5">
                <label className="text-[16px] text-black">Select Room Type</label>
                <div className="flex gap-2.5">
                  {/* Private */}
                  <button
                    onClick={() => setRoomType('private')}
                    className={`flex-1 rounded-[10px] p-2.5 text-left transition-all ${
                      roomType === 'private' 
                        ? 'bg-[#c9e5ff] border-0' 
                        : 'border border-black/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="w-[24px] h-[24px] overflow-clip relative">
                        <div className="absolute inset-[8.33%_12.5%]">
                          <div className="absolute inset-[-3.75%_-4.17%]">
                            <svg className="block size-full" fill="none" viewBox="0 0 19.5002 21.5">
                              <g>
                                <path d={svgPaths.p28b4a900} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                                <path d={svgPaths.p24cceb00} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                                <path d={svgPaths.p2baa9800} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                              </g>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <span className={`text-[14px] font-medium ${
                        roomType === 'private' ? 'text-black/80' : 'text-black/80'
                      }`}>Private</span>
                    </div>
                    <p className={`text-[12px] leading-relaxed ${
                      roomType === 'private' ? 'text-black/80' : 'text-black/60'
                    }`}>
                      Accessible only through a<br />
                      Room Code or invitation link.
                    </p>
                  </button>

                  {/* Public */}
                  <button
                    onClick={() => setRoomType('public')}
                    className={`flex-1 rounded-[10px] p-2.5 text-left transition-all ${
                      roomType === 'public' 
                        ? 'bg-[#c9e5ff] border-0' 
                        : 'border border-black/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d={svgPaths.p39fda200} fill="black" />
                      </svg>
                      <span className={`text-[14px] font-medium ${
                        roomType === 'public' ? 'text-black/80' : 'text-black/80'
                      }`}>Public</span>
                    </div>
                    <p className={`text-[12px] leading-relaxed ${
                      roomType === 'public' ? 'text-black/80' : 'text-black/60'
                    }`}>
                      Open to all learners and listed<br />
                      in Join Random Room Page.
                    </p>
                  </button>
                </div>
              </div>

              {/* Your Room Code */}
              <div className="flex flex-col gap-2.5">
                <label className="text-[16px] text-black">Your Room Code</label>
                <div className="h-[39px] rounded-[10px] border border-black/40 flex items-center gap-2.5 px-2.5 bg-gray-50">
                  <div className="w-[20px] h-[20px] overflow-clip relative">
                    <div className="absolute inset-[3.83%_3.74%_3.82%_3.73%]">
                      <div className="absolute inset-[-4.06%_-4.05%_-4.05%_-4.05%]">
                        <svg className="block size-full" fill="none" viewBox="0 0 20.0064 19.9685">
                          <g>
                            <path d={svgPaths.p13b8b400} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                            <path d={svgPaths.p2cf36200} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                            <path d={svgPaths.p267f9b00} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                          </g>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <span className="text-[14px] font-medium text-gray-500">{roomCodePreview}</span>
                </div>
                <p className="text-[12px] text-black/60">A real room code is generated on launch and can be pasted into Join Custom Room.</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-6 items-center w-[299px] ml-auto">
                <button
                  disabled
                  className="flex-1 h-[42px] rounded-[20px] border-2 border-gray-300 text-[14px] font-medium text-gray-400 cursor-not-allowed opacity-50"
                  title="Room code will be available after launching"
                >
                  Share Room
                </button>
                <button
                  onClick={handleLaunchRoom}
                  disabled={!roomName.trim() || !subject.trim() || isLaunching}
                  className="flex-1 h-[42px] rounded-[20px] bg-[#003566] text-[14px] font-medium text-white hover:bg-[#002849] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLaunching ? 'Creating...' : 'Launch Room'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
