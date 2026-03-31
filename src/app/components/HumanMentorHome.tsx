import React from 'react';
import { ArrowLeft, Search, Star, GraduationCap, Briefcase, Loader2, ArrowRight, Users, Clock, X, CheckCircle, XCircle } from 'lucide-react';
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { getCurrentUser, mentors as mentorsApi } from '@/app/lib/api';
import { saveMentorBooking, sendBookingConfirmation } from '@/utils/supabase/mentorBooking';
import { toast } from 'sonner';
import imgRavi from "figma:asset/ee75b3f7fd75b317c92ab5dcaa912db9eddbf3e7.png";
import imgRiya from "figma:asset/0aaa9a026db3fff583a4d805f37def4bf33531fe.png";
import imgSarah from "figma:asset/1febea968fb6ef6c5fe4a446aa07bfe8857031ea.png";
import imgPhonePe from "figma:asset/68a29cc3e202d7b0aeb6edd06b3ee07b4bb5a8cd.png";
import imgAmazonPay from "figma:asset/4653de0e1c461ac1033869badee2bf8229548fac.png";

// Unique SVG for Flask/Chemistry icon
const FlaskIcon = ({ className = "" }: { className?: string }) => (
  <svg width="18" height="18" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10.8333 2.16667V5.5M10.8333 2.16667H6.66667M10.8333 2.16667H15M6.66667 5.5H15M8.70583 5.5L4.54583 13.5183C3.96333 14.6417 3.67167 15.2033 3.75417 15.6883C3.82667 16.115 4.07 16.4858 4.4175 16.7C4.81167 16.9433 5.44333 16.9433 6.70833 16.9433H15.0417C16.3067 16.9433 16.9383 16.9433 17.3325 16.7C17.68 16.4858 17.9233 16.115 17.9958 15.6883C18.0783 15.2033 17.7867 14.6417 17.2042 13.5183L13.0442 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Payment Icons
const IconGooglePay = () => (
  <svg width="43" height="16" viewBox="0 0 43 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.3376 7.81655V12.5067H18.7497V0.924161H22.9612C23.4639 0.914322 23.9637 0.997863 24.4318 1.16996C24.8999 1.34206 25.3269 1.59932 25.6884 1.92688C26.0534 2.23455 26.3439 2.61187 26.5404 3.0335C26.7369 3.45512 26.8348 3.91127 26.8275 4.37128C26.838 4.83376 26.7416 5.29289 26.545 5.71719C26.3483 6.1415 26.0561 6.52096 25.6884 6.82955C24.9519 7.48755 24.0429 7.81625 22.9612 7.81563H20.3376V7.81655ZM20.3376 2.35014V6.39335H23.0007C23.2926 6.40145 23.5832 6.35238 23.8537 6.24926C24.1242 6.14614 24.3688 5.99125 24.5719 5.79449C24.7738 5.61052 24.9343 5.39048 25.0439 5.14738C25.1536 4.90428 25.21 4.64305 25.21 4.37914C25.21 4.11523 25.1536 3.854 25.0439 3.61089C24.9343 3.36779 24.7738 3.14775 24.5719 2.96378C24.3714 2.76288 24.1276 2.60419 23.8568 2.49824C23.5859 2.39229 23.2941 2.34149 23.0007 2.34922H20.3376V2.35014Z" fill="#5F6368"/>
    <path d="M30.4867 4.32323C31.6604 4.32323 32.5869 4.61711 33.2661 5.20488C33.9454 5.79264 34.2847 6.59851 34.284 7.62248V12.5067H32.7651V11.4069H32.6961C32.0385 12.3126 31.164 12.7654 30.0725 12.7654C29.1407 12.7654 28.3612 12.5067 27.7339 11.9891C27.4329 11.7516 27.1922 11.4541 27.0294 11.1184C26.8667 10.7826 26.7859 10.4171 26.793 10.0484C26.793 9.22836 27.1238 8.57621 27.7852 8.09195C28.4467 7.60769 29.3298 7.36495 30.4345 7.36372C31.3774 7.36372 32.1539 7.52544 32.7641 7.8489V7.50881C32.7659 7.25745 32.708 7.00887 32.5945 6.78109C32.4811 6.55331 32.315 6.35204 32.1082 6.19188C31.6883 5.83689 31.141 5.64319 30.5755 5.6494C29.6885 5.6494 28.9866 5.99996 28.4697 6.70109L27.0711 5.87582C27.8405 4.84076 28.979 4.32323 30.4867 4.32323ZM28.4323 10.0807C28.4312 10.2701 28.4784 10.457 28.57 10.6258C28.6617 10.7946 28.795 10.9404 28.9589 11.0511C29.3101 11.31 29.7461 11.4471 30.1928 11.4393C30.8629 11.4382 31.5052 11.1883 31.979 10.7443C32.505 10.2804 32.7681 9.73604 32.7681 9.1113C32.2729 8.74164 31.5825 8.55681 30.6968 8.55681C30.0518 8.55681 29.5139 8.70252 29.0832 8.99394C28.6483 9.28967 28.4323 9.64917 28.4323 10.0807Z" fill="#5F6368"/>
    <path d="M43.003 4.58199L37.7006 16H36.0613L38.029 12.0049L34.5424 4.58199H36.2685L38.7885 10.2748H38.823L41.274 4.58199H43.003Z" fill="#5F6368"/>
    <path d="M13.9207 6.80552C13.9213 6.35208 13.8804 5.89943 13.7984 5.45255H7.10141V8.01525H10.9372C10.8587 8.42455 10.6925 8.81472 10.4488 9.16224C10.205 9.50976 9.88869 9.80743 9.51884 10.0373V11.7008H11.8081C13.1485 10.5428 13.9207 8.83036 13.9207 6.80552Z" fill="#4285F4"/>
    <path d="M7.10141 13.3079C9.0178 13.3079 10.6314 12.7183 11.8081 11.7017L9.51884 10.0382C8.88169 10.443 8.06108 10.6741 7.10141 10.6741C5.24912 10.6741 3.67695 9.50407 3.11476 7.92745H0.756497V9.64177C1.34756 10.7438 2.25389 11.6702 3.37429 12.3176C4.4947 12.965 5.78509 13.3079 7.10141 13.3079Z" fill="#34A853"/>
    <path d="M3.11476 7.92745C2.81754 7.10129 2.81754 6.20662 3.11476 5.38047V3.66615H0.756497C0.259276 4.59322 0.00032365 5.6164 0.00032365 6.65396C0.00032365 7.69152 0.259276 8.7147 0.756497 9.64177L3.11476 7.92745Z" fill="#FBBC04"/>
    <path d="M7.10141 2.63386C8.11413 2.61836 9.0927 2.97689 9.82558 3.63195L11.8524 1.7328C10.5672 0.601699 8.86455 -0.0192956 7.10141 0C5.78509 5.62122e-05 4.4947 0.342914 3.37429 0.990296C2.25389 1.63768 1.34756 2.5641 0.756497 3.66615L3.11476 5.38047C3.67695 3.80385 5.24912 2.63386 7.10141 2.63386Z" fill="#EA4335"/>
  </svg>
);

const IconPaytm = () => (
  <svg width="43" height="16" viewBox="0 0 43 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(13, 2) scale(1.2)">
      <path d="M4.13468 0.922819C4.3793 0.79109 4.50161 0.725226 4.62392 0.659361C6.32401 -0.312142 8.5011 -0.205112 9.95658 0.947519C10.1033 1.06278 10.1767 1.07102 10.3235 0.972218C10.4214 0.898121 10.5314 0.840489 10.6293 0.766391C11.7667 0.0171811 13.2711 -0.205112 14.6777 0.214775C16.1576 0.659362 16.9526 1.4415 16.9649 2.5365C16.9893 4.8994 16.9771 7.25406 16.9771 9.61695C16.9771 10.4567 16.2066 10.9836 14.9712 10.9836C14.482 10.9836 13.9928 10.9589 13.5035 10.9919C13.0021 11.0248 12.8553 10.9178 12.8553 10.5638C12.8798 8.2585 12.8675 5.95323 12.8675 3.64797C12.8675 3.54917 12.8675 3.45861 12.8675 3.35981C12.8553 2.82466 12.5373 2.60237 11.779 2.57767C11.094 2.55297 10.617 2.8329 10.5437 3.30218C10.5314 3.40921 10.5437 3.52447 10.5437 3.6315C10.5437 5.62391 10.5437 7.60808 10.5437 9.60049C10.5437 10.4732 9.79758 10.9836 8.50111 10.9754C7.84064 10.9672 6.94779 11.173 6.56863 10.8848C6.23839 10.6379 6.45855 10.0533 6.45855 9.61695C6.45855 7.57515 6.45855 5.52511 6.45855 3.48331C6.45855 2.7588 5.76139 2.38831 4.85631 2.6353C4.29369 2.79173 4.11022 3.09635 4.11022 3.49154C4.12245 5.40162 4.11022 7.30346 4.11022 9.21353C4.11022 9.36173 4.11022 9.51816 4.11022 9.66635C4.07353 10.465 3.31521 10.9672 2.14105 10.9754C1.65181 10.9836 1.16258 10.9507 0.673345 10.9836C0.147417 11.0166 -0.0115843 10.9178 0.000646573 10.5391C0.0251083 7.30346 0.0128782 4.06786 0.0128782 0.824023C0.0128782 0.68406 0.0251091 0.552331 0.0128782 0.412369C-0.0115836 0.231241 0.0984936 0.17361 0.367573 0.17361C1.49281 0.181843 2.60582 0.181843 3.73106 0.17361C4.01237 0.17361 4.14691 0.223008 4.12245 0.428835C4.09799 0.57703 4.12245 0.708759 4.13468 0.922819Z" fill="#02B9EF"/>
      <path d="M9.7117 5.22299C9.7117 6.35092 9.7117 7.47062 9.7117 8.59855C9.69947 10.064 8.56199 10.8215 6.3849 10.8297C5.43089 10.8297 4.46465 10.838 3.51064 10.8297C1.57816 10.8133 0.159382 9.94878 0.0615347 8.64795C-0.0118505 7.71761 -0.0240812 6.77904 0.0493041 5.8487C0.147151 4.51494 1.66378 3.57637 3.66964 3.55991C4.19557 3.55167 4.73373 3.55991 5.25966 3.55991C5.77335 3.55167 5.96905 3.35408 5.95682 3.02475C5.95682 2.69543 5.73666 2.54724 5.24743 2.5637C4.69704 2.57194 4.14665 2.57194 3.59626 2.5637C2.25086 2.54724 1.50478 2.05325 1.51701 1.16408C1.51701 0.801823 1.27239 0.316071 1.62709 0.102011C1.93286 -0.079117 2.63002 0.0361471 3.15595 0.0361471C4.5258 0.027914 5.88343 0.0361471 7.25329 0.0361471C8.70876 0.0361471 9.69947 0.703026 9.7117 1.691C9.72393 2.86009 9.7117 4.04566 9.7117 5.22299ZM5.96905 7.0919C5.96905 6.95193 5.96905 6.8202 5.96905 6.68024C5.96905 5.84047 5.96905 5.84047 4.7215 5.8734C4.09772 5.88987 3.75526 6.10393 3.74303 6.54028C3.7308 6.88607 3.7308 7.22363 3.74303 7.56942C3.75526 8.1622 4.14665 8.31863 5.41866 8.34333C6.36044 8.35979 5.88343 7.9152 5.96905 7.66821C6.01797 7.48708 5.95682 7.28126 5.96905 7.0919Z" fill="#06306F"/>
      <path d="M9.69165 4.29088C9.69165 5.55054 9.71611 6.81844 9.67942 8.0781C9.65496 9.0496 9.31249 9.93054 7.91817 10.4492C7.35555 10.6551 6.74401 10.7703 6.108 10.7786C4.70145 10.795 3.2949 10.7786 1.88835 10.795C1.54589 10.795 1.4725 10.7127 1.48473 10.5069C1.50919 10.1611 1.4725 9.82351 1.49696 9.47772C1.52143 8.81908 2.26751 8.31686 3.24598 8.29216C3.88199 8.27569 4.50576 8.28393 5.14177 8.29216C5.65546 8.29216 5.93677 8.1522 5.93677 7.78171C5.93677 7.40299 5.66769 7.27126 5.154 7.26302C4.29783 7.24656 3.44167 7.32889 2.59774 7.16423C1.14227 6.87607 0.0781816 6.06099 0.041489 5.04833C-0.0318963 3.44287 0.0170287 1.83742 0.00479783 0.231973C0.00479783 0.0508454 0.0904132 -0.00678516 0.359492 0.00144792C1.36242 0.009681 2.35313 0.0179141 3.35606 0.00144792C3.79637 -0.00678516 3.73521 0.157876 3.73521 0.339003C3.73521 1.54927 3.73521 2.7513 3.73521 3.96156C3.73521 4.48848 4.10214 4.7684 4.78707 4.78487C5.59431 4.80133 5.949 4.57904 5.949 4.02742C5.949 2.80893 5.96123 1.5822 5.93677 0.363703C5.93677 0.0755452 6.04685 -0.00678516 6.47493 0.00144792C7.36778 0.0261472 8.27287 0.0343802 9.16572 0.00144792C9.65496 -0.0150182 9.72834 0.108477 9.71611 0.396635C9.67942 1.68923 9.69165 2.99006 9.69165 4.29088Z" fill="#06306F"/>
    </g>
  </svg>
);

interface HumanMentorHomeProps {
  onBack: () => void;
}

interface Mentor {
  id?: string;
  name: string;
  description: string;
  image: string;
  rating: string;
  studentsHelped: string;
  subject: string;
  experience: string;
  hourlyRate?: number;
  verified?: boolean;
  availableSlots: string[];
  availableSlotOptions: Array<{
    id: string;
    raw: string;
    label: string;
    durationMins: number;
  }>;
  availableSessionCount: number;
  isAvailable: boolean;
}

const fallbackMentorImages = [imgRavi, imgRiya, imgSarah];

function formatMentorRating(rating: number | null | undefined): string {
  if (rating == null || Number.isNaN(rating)) return '--';
  return rating.toFixed(1);
}

function formatStudentsHelped(sessionCount: number): string {
  if (!sessionCount || sessionCount <= 0) return 'New mentor';
  if (sessionCount >= 1000) return `${(sessionCount / 1000).toFixed(1)}K+ sessions`;
  return `${sessionCount}+ sessions`;
}

function formatMentorExperience(totalHours: number, verified: boolean, isAvailable: boolean): string {
  if (!isAvailable) return 'Currently unavailable';
  if (totalHours > 0) return `${totalHours}+ hrs taught`;
  return verified ? 'Verified mentor' : 'Available now';
}

function formatRupees(amount: number): string {
  return `₹${Math.max(0, Math.round(amount)).toLocaleString('en-IN')}`;
}

function formatBookingSlot(date: Date): string {
  const datePart = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).replace(/\//g, '-');
  const timePart = date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).toUpperCase();
  return `${datePart} | ${timePart}`;
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

function normalizeMentorSlot(slot: string): string {
  if (slot.includes('|')) return slot;
  const parsed = parseDatabaseDateTime(slot);
  if (!parsed || Number.isNaN(parsed.getTime())) return slot;
  return formatBookingSlot(parsed);
}

function parseDurationHours(value: string): number {
  const hours = Number.parseInt(value, 10);
  return Number.isFinite(hours) && hours > 0 ? hours : 1;
}

function buildDurationOptions(durationMins: number): string[] {
  const wholeHours = Math.max(1, Math.floor(durationMins / 60));
  return Array.from({ length: wholeHours }, (_, index) => {
    const hours = index + 1;
    return `${hours} hour${hours === 1 ? '' : 's'}`;
  });
}

const MentorCard = ({
  name,
  description,
  image,
  rating,
  studentsHelped,
  subject,
  experience,
  isAvailable,
  availableSessionCount,
  onBook,
}: Mentor & { onBook: () => void }) => {
  return (
    <div className="group bg-white rounded-[20px] overflow-hidden flex flex-col h-full border border-gray-100/60 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Image Section */}
      <div className="relative h-[220px] w-full shrink-0 overflow-hidden">
        <ImageWithFallback src={image} alt={name} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.15) 100%)' }} />

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg"
          style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}>
          <Star className="w-3.5 h-3.5 fill-[#f77f00] text-[#f77f00]" />
          <span className="text-[12px] font-bold text-[#003566]">{rating}</span>
        </div>

        {/* Subject badge */}
        <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full flex items-center gap-1.5"
          style={{ background: 'rgba(0,53,102,0.8)', backdropFilter: 'blur(8px)' }}>
          <FlaskIcon className="text-white/80" />
          <span className="text-[11px] font-semibold text-white">{subject}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="text-[20px] font-bold text-[#003566] mb-1.5"
            style={{ fontFamily: "'DM Serif Display', serif" }}>
            {name}
          </h3>
          <p className="text-[13px] text-[#5a7089] leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Info Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px]"
            style={{ background: 'rgba(9,103,189,0.06)' }}>
            <GraduationCap className="w-3.5 h-3.5 text-[#0967bd]" />
            <span className="text-[11px] font-medium text-[#0967bd]">{studentsHelped}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px]"
            style={{ background: isAvailable ? 'rgba(52,177,97,0.08)' : 'rgba(204,54,54,0.08)' }}>
            <Clock className={`w-3.5 h-3.5 ${isAvailable ? 'text-[#34b161]' : 'text-[#cc3636]'}`} />
            <span className={`text-[11px] font-medium ${isAvailable ? 'text-[#34b161]' : 'text-[#cc3636]'}`}>
              {isAvailable ? `${availableSessionCount} slot${availableSessionCount === 1 ? '' : 's'} open` : 'Unavailable'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px]"
            style={{ background: 'rgba(247,127,0,0.06)' }}>
            <Briefcase className="w-3.5 h-3.5 text-[#f77f00]" />
            <span className="text-[11px] font-medium text-[#f77f00]">{experience}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onBook}
          disabled={!isAvailable}
          className="w-full h-[44px] mt-2 rounded-[14px] font-bold text-[13px] transition-all duration-300 flex items-center justify-center gap-2 group/btn disabled:cursor-not-allowed disabled:shadow-none"
          style={isAvailable
            ? { background: 'linear-gradient(135deg, #003566, #0967bd)', color: 'white', boxShadow: '0 4px 16px rgba(0,53,102,0.2)' }
            : { background: '#e2e8f0', color: '#64748b' }}
        >
          {isAvailable ? 'Book a Session' : 'Mentor Unavailable'}
          {isAvailable && <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />}
        </button>
      </div>
    </div>
  );
};

export function HumanMentorHome({ onBack }: HumanMentorHomeProps) {
  const [selectedMentor, setSelectedMentor] = React.useState<Mentor | null>(null);
  const [mentors, setMentors] = React.useState<Mentor[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [loadingMentors, setLoadingMentors] = React.useState(true);
  const [selectedSlot, setSelectedSlot] = React.useState<string>('');
  const [selectedSlotId, setSelectedSlotId] = React.useState<string>('');
  const [selectedDuration, setSelectedDuration] = React.useState<string>("1 hour");

  // Payment Modal States
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [showProcessingModal, setShowProcessingModal] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [showFailedModal, setShowFailedModal] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState<'UPI' | 'Bank'>('UPI');
  const [selectedApp, setSelectedApp] = React.useState<string | null>('Google Pay');
  const [upiId, setUpiId] = React.useState<string>("");

  React.useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const rows = await mentorsApi.list();
        if (!mounted) return;

        setMentors(
          (rows ?? []).map((mentor: any, index: number) => ({
            id: mentor.id,
            name: mentor.name,
            description: mentor.bio?.trim() || 'Experienced mentor ready to guide students through focused, personalized sessions.',
            image: mentor.avatarUrl || fallbackMentorImages[index % fallbackMentorImages.length],
            rating: formatMentorRating(mentor.rating),
            studentsHelped: formatStudentsHelped(mentor.sessionCount),
            subject: mentor.specializations?.[0] || 'General Mentoring',
            availableSlots: (mentor.availableSlots ?? []).map((slot: any) => normalizeMentorSlot(slot.scheduledAt ?? slot)),
            availableSlotOptions: (mentor.availableSlots ?? []).map((slot: any) => ({
              id: String(slot.id),
              raw: String(slot.scheduledAt ?? ''),
              label: normalizeMentorSlot(slot.scheduledAt ?? ''),
              durationMins: Math.max(60, Number(slot.durationMins) || 60),
            })),
            availableSessionCount: Number(mentor.availableSessionCount ?? 0),
            isAvailable: Boolean(mentor.isAvailable),
            experience: formatMentorExperience(mentor.totalHours, mentor.verified, Boolean(mentor.isAvailable)),
            hourlyRate: mentor.hourlyRate,
            verified: mentor.verified,
          }))
        );
      } catch (error) {
        if (!mounted) return;
        console.error('[HumanMentorHome] Mentor load error:', error);
        setMentors([]);
        toast.error('Unable to load mentors right now.');
      } finally {
        if (mounted) setLoadingMentors(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredMentors = mentors.filter((mentor) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return [
      mentor.name,
      mentor.subject,
      mentor.description,
      mentor.experience,
    ].some((value) => value.toLowerCase().includes(q));
  });
  const averageRatingValue = mentors.length > 0
    ? (mentors.reduce((sum, mentor) => sum + (Number.parseFloat(mentor.rating) || 0), 0) / mentors.length).toFixed(1)
    : '--';
  const totalHelpedValue = mentors.reduce((sum, mentor) => {
    const count = Number.parseInt(mentor.studentsHelped.replace(/[^\d]/g, ''), 10);
    return sum + (Number.isFinite(count) ? count : 0);
  }, 0);
  const selectedSlotOption = React.useMemo(
    () => selectedMentor?.availableSlotOptions.find((slot) => slot.id === selectedSlotId) ?? null,
    [selectedMentor, selectedSlotId],
  );
  const durationOptions = React.useMemo(
    () => buildDurationOptions(selectedSlotOption?.durationMins ?? 60),
    [selectedSlotOption],
  );
  const selectedMentorPrice = (selectedMentor?.hourlyRate ? selectedMentor.hourlyRate / 100 : 500) * parseDurationHours(selectedDuration);

  React.useEffect(() => {
    if (!selectedMentor) return;
    const nextSlot = selectedMentor.availableSlotOptions.find((slot) => slot.id === selectedSlotId) ?? selectedMentor.availableSlotOptions[0] ?? null;
    if (!nextSlot) return;

    if (nextSlot.id !== selectedSlotId) {
      setSelectedSlotId(nextSlot.id);
    }
    if (nextSlot.label !== selectedSlot) {
      setSelectedSlot(nextSlot.label);
    }

    const allowedDurations = buildDurationOptions(nextSlot.durationMins);
    if (!allowedDurations.includes(selectedDuration)) {
      setSelectedDuration(allowedDurations[0] ?? '1 hour');
    }
  }, [selectedDuration, selectedMentor, selectedSlot, selectedSlotId]);

  const handleBookClick = (mentor: Mentor) => {
    if (!mentor.isAvailable || mentor.availableSlots.length === 0) {
      toast.error(`${mentor.name} has no available sessions right now.`);
      return;
    }
    setSelectedMentor(mentor);
    setSelectedSlotId(mentor.availableSlotOptions[0]?.id ?? '');
    setSelectedSlot(mentor.availableSlotOptions[0]?.label ?? '');
    setSelectedDuration(buildDurationOptions(mentor.availableSlotOptions[0]?.durationMins ?? 60)[0] ?? "1 hour");
    setShowPaymentModal(false);
    setShowProcessingModal(false);
    setShowSuccessModal(false);
    setShowFailedModal(false);
    setUpiId("");
  };

  const handleBookingConfirm = () => {
    if (!selectedSlot) {
      toast.error('No available session slot selected.');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = async () => {
    if (!selectedMentor) return;
    if (!selectedSlotOption) {
      toast.error('No available session slot selected.');
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser?.id) {
      toast.error('User not authenticated');
      return;
    }

    setShowPaymentModal(false);
    setShowProcessingModal(true);

    try {
      // Prepare booking data
      const bookingData: any = {
        availability_session_id: selectedSlotOption.id,
        availability_session_duration_mins: parseDurationHours(selectedDuration) * 60,
        mentor_id: selectedMentor.id,
        mentor_name: selectedMentor.name,
        mentor_subject: selectedMentor.subject,
        selected_date_time: selectedSlotOption.raw,
        duration: selectedDuration,
        status: 'pending',
        payment_method: paymentMethod,
        booking_price: selectedMentorPrice,
      };

      // Add payment-specific fields
      if (paymentMethod === 'UPI') {
        bookingData.payment_app = selectedApp;
        bookingData.upi_id = upiId;
      } else if (paymentMethod === 'Bank') {
        bookingData.bank_account_holder = (document.querySelector('input[placeholder="Enter your name"]') as HTMLInputElement)?.value || '';
        bookingData.bank_name = (document.querySelector('input[placeholder="Enter your bank name"]') as HTMLInputElement)?.value || '';
        bookingData.bank_account_number = (document.querySelector('input[placeholder="Enter your bank account number"]') as HTMLInputElement)?.value || '';
        bookingData.bank_ifsc_code = (document.querySelector('input[placeholder="Enter your bank IFSC code"]') as HTMLInputElement)?.value || '';
      }

      // Save booking to database
      const { success, bookingId, error } = await saveMentorBooking(currentUser.id, bookingData);

      if (!success) {
        throw new Error(error || 'Failed to save booking');
      }

      // Notification should not block booking success while payment/email is in progress.
      try {
        await sendBookingConfirmation(
          currentUser.id,
          bookingData,
          currentUser.name || 'Student',
          currentUser.email || ''
        );
      } catch (notifyErr) {
        console.warn('[HumanMentorHome] Confirmation notification skipped:', notifyErr);
      }

      console.log('[HumanMentorHome] Booking confirmed:', { bookingId, ...bookingData });

      // Temporary bypass: treat this as a confirmed booking without payment gateway integration.
      setTimeout(() => {
        setMentors((current) => current.map((mentor) => {
          if (mentor.id !== selectedMentor.id) return mentor;
          const remainingSlots = mentor.availableSlotOptions
            .map((slot) => {
              if (slot.id !== selectedSlotOption.id) return slot;
              const remainingMinutes = slot.durationMins - parseDurationHours(selectedDuration) * 60;
              if (remainingMinutes < 60) return null;

              const startDate = parseDatabaseDateTime(slot.raw);
              if (!startDate) return null;
              startDate.setMinutes(startDate.getMinutes() + parseDurationHours(selectedDuration) * 60);
              const nextRaw = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')} ${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}:${String(startDate.getSeconds()).padStart(2, '0')}`;

              return {
                ...slot,
                raw: nextRaw,
                label: normalizeMentorSlot(nextRaw),
                durationMins: remainingMinutes,
              };
            })
            .filter(Boolean) as Mentor['availableSlotOptions'];

          return {
            ...mentor,
            availableSlotOptions: remainingSlots,
            availableSlots: remainingSlots.map((slot) => slot.label),
            availableSessionCount: remainingSlots.length,
            isAvailable: remainingSlots.length > 0,
            experience: remainingSlots.length > 0 ? mentor.experience : 'Currently unavailable',
          };
        }));
        setShowProcessingModal(false);
        setShowSuccessModal(true);
        toast.success('Session request sent successfully!');
      }, 2000);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('[HumanMentorHome] Booking error:', error);
      
      setShowProcessingModal(false);
      setShowFailedModal(true);
      toast.error('Booking failed: ' + error.message);
    }
  };

  const handleTryAgain = () => {
    setShowFailedModal(false);
    setShowPaymentModal(true);
  };

  const handleCloseModal = () => {
    setSelectedMentor(null);
    setSelectedSlotId('');
    setShowPaymentModal(false);
    setShowProcessingModal(false);
    setShowSuccessModal(false);
    setShowFailedModal(false);
  };

  return (
    <div className="w-full animate-in fade-in duration-300 relative" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Back Breadcrumb */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#5a7089] hover:text-[#003566] mb-6 transition-colors group w-fit cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-[13px] font-medium">Mentor Support</span>
      </button>

      {/* Hero Header */}
      <div className="relative rounded-[24px] overflow-hidden mb-8"
        style={{ background: 'linear-gradient(135deg, #001d3d 0%, #003566 50%, #0967bd 100%)' }}>
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, white, transparent 70%)' }} />

        <div className="relative z-10 px-6 md:px-10 py-8 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
              style={{ background: 'rgba(247,127,0,0.15)', border: '1px solid rgba(247,127,0,0.25)' }}>
              <Users className="w-3.5 h-3.5 text-[#f77f00]" />
              <span className="text-[12px] font-semibold text-[#f77f00]">Verified Human Experts</span>
            </div>
            <h1 className="text-[28px] md:text-[36px] text-white mb-3 leading-[1.1]"
              style={{ fontFamily: "'DM Serif Display', serif" }}>
              Human Mentors
            </h1>
            <p className="text-[14px] text-white/50 max-w-[420px] leading-relaxed">
              Learn directly from real mentors who guide, motivate, and inspire — book 1:1 or group sessions.
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex gap-3 shrink-0">
            {[
              { value: String(mentors.length), label: "Mentors" },
              { value: averageRatingValue, label: "Avg Rating" },
              { value: totalHelpedValue > 0 ? `${totalHelpedValue}+` : "--", label: "Sessions" },
            ].map((stat) => (
              <div key={stat.label}
                className="flex flex-col items-center px-5 py-4 rounded-[18px] min-w-[80px]"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
                <span className="text-[22px] font-bold text-white leading-none mb-1"
                  style={{ fontFamily: "'DM Serif Display', serif" }}>
                  {stat.value}
                </span>
                <span className="text-[10px] font-semibold text-white/35 uppercase tracking-[0.12em]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 px-5 h-[50px] rounded-[16px] bg-white border border-[#e2e8f0] mb-8 shadow-sm hover:border-[#c9ddf0] transition-all group">
        <Search className="w-4 h-4 text-[#94a3b8] group-focus-within:text-[#0967bd] transition-colors shrink-0" />
        <input
          type="text"
          placeholder="Search by Name, Subject, Exam, or Language..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-[13px] text-[#1e293b] placeholder:text-[#94a3b8] font-medium"
        />
      </div>

      {/* Section Label */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-5 rounded-full bg-[#f77f00]" />
        <h2 className="text-[16px] font-bold text-[#003566]">Available Mentors</h2>
        <span className="text-[12px] font-medium text-[#94a3b8] ml-auto">{filteredMentors.length} mentors</span>
      </div>

      {/* Mentors Grid */}
      {loadingMentors ? (
        <div className="rounded-[20px] border border-[#e2e8f0] bg-white py-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#0967bd]" />
          <p className="text-[14px] font-medium text-[#003566]">Loading mentors...</p>
        </div>
      ) : filteredMentors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMentors.map((mentor) => (
            <MentorCard
              key={mentor.id ?? mentor.name}
              {...mentor}
              onBook={() => handleBookClick(mentor)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[20px] border border-[#e2e8f0] bg-white py-16 px-6 text-center">
          <p className="text-[16px] font-semibold text-[#003566]">No mentors found</p>
          <p className="text-[13px] text-[#5a7089] mt-2">Try a different search or add mentor profiles in Supabase.</p>
        </div>
      )}

      {/* ── Modal Overlay ── */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001d3d]/55" onClick={handleCloseModal} />

          {showSuccessModal ? (
            /* ── SUCCESS MODAL ── */
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[480px] p-8 z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ background: 'rgba(34,197,94,0.1)' }}>
                <CheckCircle className="w-10 h-10 text-[#22c55e]" />
              </div>

              <h2 className="text-[24px] font-bold text-[#003566] mb-2"
                style={{ fontFamily: "'DM Serif Display', serif" }}>
                Payment Successful
              </h2>
              <p className="text-[14px] text-[#5a7089] leading-relaxed mb-8 max-w-[360px]">
                Your session with <strong className="text-[#003566]">{selectedMentor.name}</strong> has been booked. You'll receive a notification 10 minutes before your scheduled time.
              </p>

              <button
                onClick={handleCloseModal}
                className="px-8 h-[44px] rounded-[14px] font-bold text-[13px] text-white transition-all hover:shadow-xl cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}
              >
                Go to Dashboard
              </button>
            </div>

          ) : showFailedModal ? (
            /* ── FAILED MODAL ── */
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[480px] p-8 z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ background: 'rgba(204,54,54,0.1)' }}>
                <XCircle className="w-10 h-10 text-[#cc3636]" />
              </div>

              <h2 className="text-[24px] font-bold text-[#003566] mb-2"
                style={{ fontFamily: "'DM Serif Display', serif" }}>
                Payment Failed
              </h2>
              <p className="text-[14px] text-[#5a7089] leading-relaxed mb-8 max-w-[360px]">
                Something went wrong while processing your payment. Please try again or use a different payment method.
              </p>

              <button
                onClick={handleTryAgain}
                className="px-8 h-[44px] rounded-[14px] font-bold text-[13px] text-white transition-all hover:shadow-xl cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}
              >
                Try Again
              </button>
            </div>

          ) : showProcessingModal ? (
            /* ── PROCESSING MODAL ── */
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[480px] p-8 z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ background: 'rgba(9,103,189,0.08)' }}>
                <Loader2 className="w-8 h-8 text-[#0967bd] animate-spin" />
              </div>

              <h2 className="text-[20px] font-bold text-[#003566] mb-2"
                style={{ fontFamily: "'DM Serif Display', serif" }}>
                {paymentMethod === 'Bank' ? 'Redirecting to Bank' : 'Processing Payment'}
              </h2>
              <p className="text-[14px] text-[#5a7089] leading-relaxed max-w-[340px]">
                {paymentMethod === 'Bank'
                  ? 'Heading towards the payment gateway...'
                  : <>A payment request has been sent to <strong className="text-[#003566]">{upiId || "andrew@sbiybl"}</strong></>
                }
              </p>
            </div>

          ) : showPaymentModal ? (
            /* ── PAYMENT MODAL ── */
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[560px] p-7 z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              {/* Close button */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[22px] font-bold text-[#003566]"
                  style={{ fontFamily: "'DM Serif Display', serif" }}>
                  Payment Method
                </h2>
                <button onClick={handleCloseModal} className="w-8 h-8 rounded-[10px] hover:bg-[#f5f7fa] flex items-center justify-center text-[#94a3b8] hover:text-[#003566] transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Payment Method Toggle */}
              <div className="p-1 rounded-[14px] flex mb-6" style={{ background: '#f5f7fa' }}>
                <button
                  onClick={() => setPaymentMethod('UPI')}
                  className={`flex-1 h-[42px] rounded-[12px] font-bold text-[13px] transition-all cursor-pointer ${
                    paymentMethod === 'UPI'
                      ? 'bg-white text-[#003566] shadow-sm'
                      : 'bg-transparent text-[#94a3b8] hover:text-[#5a7089]'
                  }`}
                >
                  UPI
                </button>
                <button
                  onClick={() => setPaymentMethod('Bank')}
                  className={`flex-1 h-[42px] rounded-[12px] font-bold text-[13px] transition-all cursor-pointer ${
                    paymentMethod === 'Bank'
                      ? 'bg-white text-[#003566] shadow-sm'
                      : 'bg-transparent text-[#94a3b8] hover:text-[#5a7089]'
                  }`}
                >
                  Bank Account
                </button>
              </div>

              {/* UPI Options */}
              {paymentMethod === 'UPI' && (
                <div className="flex flex-col gap-5">
                  <div>
                    <p className="text-[13px] font-semibold text-[#003566] mb-3">Choose App</p>
                    <div className="flex gap-3">
                      {[
                        { name: 'Google Pay', icon: <IconGooglePay /> },
                        { name: 'Paytm', icon: <IconPaytm /> },
                        { name: 'PhonePe', img: imgPhonePe },
                        { name: 'Amazon Pay', img: imgAmazonPay }
                      ].map((app) => (
                        <button
                          key={app.name}
                          onClick={() => setSelectedApp(app.name)}
                          className={`w-[72px] h-[48px] rounded-[12px] flex items-center justify-center transition-all cursor-pointer ${
                            selectedApp === app.name
                              ? 'border-2 border-[#0967bd] bg-[rgba(9,103,189,0.04)]'
                              : 'border border-[#e2e8f0] hover:border-[#94a3b8]'
                          }`}
                        >
                          {app.icon ? app.icon : <img src={app.img} alt={app.name} className="w-[22px] h-[22px]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#e2e8f0]"></div>
                    </div>
                    <span className="relative bg-white px-4 text-[12px] font-semibold text-[#94a3b8]">OR</span>
                  </div>

                  <div>
                    <p className="text-[13px] font-semibold text-[#003566] mb-2">Enter UPI ID</p>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="example@ybl"
                      className="w-full h-[44px] border border-[#e2e8f0] rounded-[12px] px-4 text-[13px] outline-none focus:border-[#0967bd] focus:ring-1 focus:ring-[#0967bd]/20 transition-all text-[#1e293b] placeholder:text-[#94a3b8]"
                    />
                  </div>
                </div>
              )}

              {/* Bank Account Form */}
              {paymentMethod === 'Bank' && (
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Account Holder Name", placeholder: "Enter your name" },
                    { label: "Bank Name", placeholder: "Enter your bank name" },
                    { label: "Account Number", placeholder: "Enter your bank account number" },
                    { label: "Re-Enter Account Number", placeholder: "Re-enter your bank account number" },
                    { label: "Bank IFSC Code", placeholder: "Enter your bank IFSC code" },
                  ].map((field) => (
                    <div key={field.label}>
                      <p className="text-[13px] font-semibold text-[#003566] mb-2">{field.label}</p>
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        className="w-full h-[44px] border border-[#e2e8f0] rounded-[12px] px-4 text-[13px] outline-none focus:border-[#0967bd] focus:ring-1 focus:ring-[#0967bd]/20 transition-all text-[#1e293b] placeholder:text-[#94a3b8]"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Amount Display */}
              <div className="rounded-[14px] px-5 py-4 flex items-center justify-between mt-6 mb-6"
                style={{ background: 'rgba(9,103,189,0.04)', border: '1px solid rgba(9,103,189,0.08)' }}>
                <span className="text-[13px] font-semibold text-[#5a7089]">Total Amount</span>
                <span className="text-[28px] font-bold text-[#003566]" style={{ fontFamily: "'DM Serif Display', serif" }}>{formatRupees(selectedMentorPrice)}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 h-[44px] rounded-[14px] border border-[#cc3636] text-[#cc3636] font-bold text-[13px] hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePaymentConfirm}
                  className="flex-1 h-[44px] rounded-[14px] font-bold text-[13px] text-white transition-all hover:shadow-xl cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #003566, #0967bd)' }}
                >
                  {`Pay ${formatRupees(selectedMentorPrice)}`}
                </button>
              </div>
            </div>

          ) : (
            /* ── BOOKING DETAILS MODAL ── */
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[860px] overflow-hidden flex animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] z-10 relative">
              {/* Left Side - Image */}
              <div className="w-[300px] relative shrink-0 hidden md:block">
                <ImageWithFallback src={selectedMentor.image} alt={selectedMentor.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(0,29,61,0.6) 100%)' }} />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full w-fit mb-2"
                    style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                    <Star className="w-3.5 h-3.5 fill-[#f77f00] text-[#f77f00]" />
                    <span className="text-[12px] font-bold text-white">{selectedMentor.rating}</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="flex-1 p-7 flex flex-col overflow-y-auto">
                {/* Close */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-[26px] font-bold text-[#003566] mb-1"
                      style={{ fontFamily: "'DM Serif Display', serif" }}>
                      {selectedMentor.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <FlaskIcon className="text-[#0967bd]" />
                      <span className="text-[13px] text-[#5a7089]">{selectedMentor.subject}</span>
                    </div>
                  </div>
                  <button onClick={handleCloseModal} className="w-8 h-8 rounded-[10px] hover:bg-[#f5f7fa] flex items-center justify-center text-[#94a3b8] hover:text-[#003566] transition-colors cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-6 flex-1">
                  {/* Time Slots */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-[#0967bd]" />
                      <h3 className="text-[14px] font-bold text-[#003566]">Available Slots</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedMentor.availableSlotOptions.length > 0 ? selectedMentor.availableSlotOptions.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => {
                            setSelectedSlotId(slot.id);
                            setSelectedSlot(slot.label);
                          }}
                          className={`px-4 py-2.5 rounded-[12px] text-[13px] font-medium transition-all cursor-pointer ${
                            selectedSlotId === slot.id
                              ? 'text-white shadow-md'
                              : 'bg-[#f5f7fa] text-[#5a7089] border border-transparent hover:border-[#e2e8f0]'
                          }`}
                          style={selectedSlotId === slot.id ? { background: 'linear-gradient(135deg, #003566, #0967bd)' } : {}}
                        >
                          {slot.label}
                          <span className="ml-2 text-[11px] opacity-80">
                            {Math.round(slot.durationMins / 60)}h open
                          </span>
                        </button>
                      )) : (
                        <div className="w-full rounded-[12px] border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3">
                          <p className="text-[13px] font-medium text-[#64748b]">This mentor has no available sessions right now.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-[#f77f00]" />
                      <h3 className="text-[14px] font-bold text-[#003566]">Duration</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {durationOptions.map((duration) => (
                        <button
                          key={duration}
                          onClick={() => setSelectedDuration(duration)}
                          className={`px-4 py-2.5 rounded-[12px] text-[13px] font-medium transition-all cursor-pointer ${
                            selectedDuration === duration
                              ? 'text-white shadow-md'
                              : 'bg-[#f5f7fa] text-[#5a7089] border border-transparent hover:border-[#e2e8f0]'
                          }`}
                          style={selectedDuration === duration ? { background: 'linear-gradient(135deg, #003566, #0967bd)' } : {}}
                        >
                          {duration}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-6 pt-6 border-t border-[#f0f2f5] flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider">Total Amount</p>
                    <p className="text-[24px] font-bold text-[#003566]" style={{ fontFamily: "'DM Serif Display', serif" }}>{formatRupees(selectedMentorPrice)}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleCloseModal}
                      className="px-6 h-[44px] rounded-[14px] border border-[#cc3636] text-[#cc3636] font-bold text-[13px] hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBookingConfirm}
                      disabled={selectedMentor.availableSlotOptions.length === 0 || !selectedSlotId}
                      className="px-6 h-[44px] rounded-[14px] font-bold text-[13px] text-white transition-all hover:shadow-xl cursor-pointer flex items-center gap-2"
                      style={selectedMentor.availableSlotOptions.length === 0 || !selectedSlotId
                        ? { background: '#cbd5e1', color: '#64748b' }
                        : { background: 'linear-gradient(135deg, #003566, #0967bd)' }}
                    >
                      {selectedMentor.availableSlotOptions.length === 0 ? 'Unavailable' : 'Proceed to Pay'}
                      {selectedMentor.availableSlotOptions.length > 0 && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
