import React, { useState, useEffect } from "react";
import imgFrame1171275609 from "figma:asset/d0b5e8618139abd2e6c665600d3134442c6ea4a3.png";
import imgImage27 from "figma:asset/f0a250ad1361e9247b086e20f69a2980c11fcc14.png";
import { community as communityApi, getCurrentUser } from "@/app/lib/api";

/* ── Types ── */

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  details: string[];
  authorName?: string;
  author?: string;
  authorId?: string;
  date?: string;
  createdAt?: string;
  isUpcoming?: boolean;
  eventDate?: string;
}

/* ── Event Card ── */

function EventCard({ event }: { event: CommunityEvent }) {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[20px] shadow-[0px_4px_50px_0px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col gap-[24px] items-start p-[24px] w-full h-full">

        {/* Thumbnail — Figma-matched: 249×127 with absolute positioned 251px square image */}
        <div className="bg-[#9f9f9f] h-[127px] overflow-hidden relative rounded-[20px] shrink-0 w-[249px]">
          <div className="absolute left-[-2px] size-[251px] top-[-63px]">
            <img
              alt={event.title}
              className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
              src={imgImage27}
            />
          </div>
        </div>

        {/* Title + Description + Bullets */}
        <div className="flex flex-col gap-[24px] items-start w-full">
          {/* Title + description block */}
          <div className="flex flex-col gap-[10px] items-start w-full">
            <p className="font-['Poppins'] font-medium leading-normal text-[#003566] text-[24px] w-full whitespace-pre-wrap">
              {event.title}
            </p>
            <p className="font-['Poppins'] leading-[21px] text-[16px] text-[rgba(0,0,0,0.7)] dark:text-slate-300 w-full">
              {event.description}
            </p>
          </div>

          {/* Bullet detail list */}
          <ul className="font-['Poppins'] text-[16px] text-[rgba(0,0,0,0.7)] dark:text-slate-300 w-full">
            {event.details.map((detail, i) => (
              <li key={i} className="list-disc ms-[24px] leading-[24px] whitespace-pre-wrap">
                {detail}
              </li>
            ))}
          </ul>
        </div>

        {/* Author row */}
        <div className="flex gap-[10px] items-center shrink-0">
          <div className="relative rounded-[100px] shrink-0 size-[55px]">
            <div className="absolute bg-[#cacaca] inset-0 rounded-[100px]" />
            <div className="absolute inset-0 overflow-hidden rounded-[100px]">
              <img
                alt={event.author}
                className="absolute h-[99.96%] left-0 max-w-none top-[0.02%] w-full object-cover"
                src={imgFrame1171275609}
              />
            </div>
          </div>
          <div className="flex flex-col font-['Poppins'] font-medium gap-[10px] items-start">
            <p className="leading-[21px] text-[14px] text-[rgba(0,0,0,0.7)] dark:text-slate-300 whitespace-nowrap">
              {event.author}
            </p>
            <p className="leading-[21px] text-[12px] text-[rgba(0,0,0,0.6)] dark:text-slate-400 whitespace-pre-wrap">
              {event.date}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Events Row (2 cards side-by-side) ── */

function EventRow({ events }: { events: CommunityEvent[] }) {
  return (
    <div className="flex gap-[40px] items-stretch w-full">
      {events.map((event) => (
        <div key={event.id} className="flex flex-[1_0_0] flex-row items-center self-stretch">
          <EventCard event={event} />
        </div>
      ))}
      {/* If odd number, fill the second column with an invisible placeholder */}
      {events.length === 1 && (
        <div className="flex-[1_0_0]" />
      )}
    </div>
  );
}

/* ── Section Header ── */

function SectionHeader({
  title,
  expanded,
  onToggle,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-start justify-between leading-normal w-full">
      <p className="font-['Poppins'] font-medium text-[20px] text-black dark:text-white">{title}</p>
      <button
        type="button"
        onClick={onToggle}
        className="font-['Poppins'] text-[16px] text-[rgba(0,0,0,0.6)] dark:text-slate-400 underline decoration-solid hover:text-[rgba(0,0,0,0.8)] dark:hover:text-slate-200 transition-colors cursor-pointer"
      >
        {expanded ? "View Less" : "View All"}
      </button>
    </div>
  );
}

/* ── Chunk array into pairs ── */

function chunkPairs<T>(arr: T[]): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += 2) result.push(arr.slice(i, i + 2));
  return result;
}

/* ── Main Component ── */

export function CommunityView() {
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showAllRecent,   setShowAllRecent]   = useState(false);
  const [allEvents, setAllEvents] = useState<CommunityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = getCurrentUser();

  const loadEvents = async () => {
    try {
      const evts = await communityApi.getEvents();
      setAllEvents(evts);
    } catch (e) {
      console.log("Community events load error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadEvents(); }, []);

  const upcomingEvents = allEvents.filter((e) => e.isUpcoming !== false);
  const recentEvents = allEvents.filter((e) => e.isUpcoming === false);

  const visibleUpcoming = showAllUpcoming ? upcomingEvents : upcomingEvents.slice(0, 2);
  const visibleRecent   = showAllRecent   ? recentEvents   : recentEvents.slice(0, 2);

  const upcomingRows = chunkPairs(visibleUpcoming);
  const recentRows   = chunkPairs(visibleRecent);

  // Normalize event for display
  const normalizeEvent = (e: CommunityEvent): CommunityEvent => ({
    ...e,
    author: e.authorName || e.author || "Elm Origin Team",
    date: e.createdAt ? new Date(e.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : (e.date || ""),
  });

  return (
    <div className="w-full flex flex-col gap-0">
      {/* ── Page Header ── */}
      <div className="flex flex-col items-start pb-[6px] mb-[60px]">
        <p className="font-['Poppins'] font-medium text-[40px] text-black dark:text-white leading-normal">Community</p>
        <p className="font-['Poppins'] text-[14px] text-[rgba(0,0,0,0.6)] dark:text-slate-400 leading-normal">
          Discover upcoming and recent events from the Elm Origin community.
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#003566] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && (
        <>
          {/* ── Upcoming Events ── */}
          <div className="flex flex-col gap-[16px] items-start w-full mb-[48px]">
            <SectionHeader
              title="Upcoming Events"
              expanded={showAllUpcoming}
              onToggle={() => setShowAllUpcoming((v) => !v)}
            />
            {upcomingRows.length === 0 ? (
              <p className="font-['Poppins'] text-[14px] text-black/40 dark:text-slate-500 py-4">No upcoming events yet.</p>
            ) : (
              upcomingRows.map((pair, i) => (
                <EventRow key={i} events={pair.map(normalizeEvent)} />
              ))
            )}
          </div>

          {/* ── Recent Events ── */}
          <div className="flex flex-col gap-[16px] items-start w-full">
            <SectionHeader
              title="Recent Events"
              expanded={showAllRecent}
              onToggle={() => setShowAllRecent((v) => !v)}
            />
            {recentRows.length === 0 ? (
              <p className="font-['Poppins'] text-[14px] text-black/40 dark:text-slate-500 py-4">No recent events.</p>
            ) : (
              recentRows.map((pair, i) => (
                <EventRow key={i} events={pair.map(normalizeEvent)} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}