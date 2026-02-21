import React, { useEffect, useRef } from "react";

interface ProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileSettings: () => void;
  onLogout: () => void;
}

export function ProfilePopup({
  isOpen,
  onClose,
  onProfileSettings,
  onLogout,
}: ProfilePopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popupRef}
      className="absolute top-full right-0 mt-2 z-50 bg-white rounded-[20px] shadow-[0px_4px_50px_5px_rgba(0,0,0,0.1)] p-[32px] flex flex-col gap-[24px] items-start overflow-hidden"
    >
      <button
        type="button"
        onClick={() => {
          onProfileSettings();
          onClose();
        }}
        className="flex items-center cursor-pointer hover:opacity-70 transition-opacity"
      >
        <span className="font-['Poppins'] font-medium text-[16px] text-black whitespace-nowrap">
          Profile Settings
        </span>
      </button>
      <button
        type="button"
        onClick={() => {
          onLogout();
          onClose();
        }}
        className="flex items-center cursor-pointer hover:opacity-70 transition-opacity"
      >
        <span className="font-['Poppins'] font-medium text-[16px] text-[#dc2626] whitespace-nowrap">
          Log Out
        </span>
      </button>
    </div>
  );
}
