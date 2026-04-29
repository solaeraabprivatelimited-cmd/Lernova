import React, { useState, useEffect } from "react";
import { mentors as mentorsApi, getCurrentUser } from "@/app/lib/api";
import {
  Search, Star, Clock, DollarSign, ChevronRight, BookOpen, 
  ArrowLeft, Filter, Sparkles, Users, Award
} from "lucide-react";

/* ── Types ── */

interface Mentor {
  id: string;
  userId: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  educationDetails?: string;
  qualifications?: string[];
  hourlyRate: number;
  subjects: string[];
  avgRating: number;
  totalSessions: number;
  isVerified: boolean;
  responseTimeHours: number;
}

interface Availability {
  id: string;
  dateFrom: string;
  dateTo: string;
  timeStart: string;
  timeEnd: string;
  maxSessionsPerDay: number;
  bookedSessions: number;
}

/* ── Mentor Card ── */

function MentorCard({ 
  mentor, 
  onViewProfile 
}: { 
  mentor: Mentor;
  onViewProfile: (mentorId: string) => void;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-[18px] shadow-md hover:shadow-xl transition-all duration-300 p-5 border border-slate-100 dark:border-slate-700">
      {/* Header: Avatar + Basic Info */}
      <div className="flex gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0967bd] to-[#003566] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {mentor.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[16px] font-bold text-[#003566] dark:text-white truncate">
              {mentor.name}
            </h3>
            {mentor.isVerified && (
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <Award className="w-3 h-3 text-green-600" />
              </div>
            )}
          </div>
          <p className="text-[12px] text-slate-500 dark:text-slate-400">
            {mentor.totalSessions} sessions • {mentor.responseTimeHours}h response
          </p>
        </div>
      </div>

      {/* Bio */}
      {mentor.bio && (
        <p className="text-[13px] text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
          {mentor.bio}
        </p>
      )}

      {mentor.educationDetails && (
        <p className="text-[12px] text-slate-500 dark:text-slate-400 mb-4 line-clamp-1">
          {mentor.educationDetails}
        </p>
      )}

      {/* Subjects Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {mentor.subjects.slice(0, 3).map((subject, idx) => (
          <span key={idx} className="text-[11px] px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#0967bd] dark:text-blue-300 font-medium">
            {subject}
          </span>
        ))}
        {mentor.subjects.length > 3 && (
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            +{mentor.subjects.length - 3}
          </span>
        )}
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between mb-4 pb-4 border-t border-slate-100 dark:border-slate-700 pt-4">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-[14px] font-bold text-[#003566] dark:text-white">
            {mentor.avgRating.toFixed(1)}
          </span>
          <span className="text-[12px] text-slate-500 dark:text-slate-400">
            ({mentor.totalSessions})
          </span>
        </div>
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="text-[14px] font-bold text-green-600">
            ${mentor.hourlyRate}/hr
          </span>
        </div>
      </div>

      {/* View Profile Button */}
      <button
        onClick={() => onViewProfile(mentor.id)}
        className="w-full py-2.5 rounded-[12px] bg-gradient-to-r from-[#0967bd] to-[#003566] text-white text-[13px] font-bold hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
      >
        View Profile
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ── Main Component ── */

export function MentorDiscoveryView({ 
  onBack
}: { 
  onBack: () => void;
}) {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedAvailability, setSelectedAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [maxRate, setMaxRate] = useState(200);

  // Fetch mentors on mount and when filters change
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const response = await mentorsApi.browse({
          subject: selectedSubject || undefined,
          minRating: minRating || undefined,
          maxRate: maxRate || undefined,
        });
        setMentors(response || []);
      } catch (error) {
        console.error("Failed to fetch mentors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [selectedSubject, minRating, maxRate]);

  // Apply search filter
  useEffect(() => {
    let filtered = mentors;

    if (searchQuery) {
      filtered = filtered.filter(
        m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             m.bio?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMentors(filtered);
  }, [searchQuery, mentors]);

  // Fetch availability when mentor is selected
  useEffect(() => {
    if (selectedMentor) {
      const fetchAvailability = async () => {
        try {
          const today = new Date();
          const futureDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
          
          const response = await mentorsApi.getAvailability(
            selectedMentor.id,
            today.toISOString().split("T")[0],
            futureDate.toISOString().split("T")[0]
          );
          setSelectedAvailability(response || []);
        } catch (error) {
          console.error("Failed to fetch availability:", error);
        }
      };

      fetchAvailability();
    }
  }, [selectedMentor]);

  // If viewing mentor profile
  if (selectedMentor) {
    return (
      <div className="animate-in fade-in duration-300">
        {/* Back Button */}
        <button
          onClick={() => setSelectedMentor(null)}
          className="flex items-center gap-2 text-[#003566] dark:text-blue-300 hover:opacity-70 mb-6 text-[14px] font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Mentors
        </button>

        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-800 rounded-[20px] shadow-lg p-8 mb-8">
          <div className="flex gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0967bd] to-[#003566] flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
              {selectedMentor.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-[28px] font-bold text-white">
                  {selectedMentor.name}
                </h2>
                {selectedMentor.isVerified && (
                  <div className="px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center gap-1">
                    <Award className="w-4 h-4 text-green-600" />
                    <span className="text-[12px] font-bold text-green-600">Verified</span>
                  </div>
                )}
              </div>
              <p className="text-[16px] text-slate-600 dark:text-slate-300 mb-4">
                {selectedMentor.totalSessions} sessions completed
              </p>
              {selectedMentor.bio && (
                <p className="text-[14px] text-slate-700 dark:text-slate-400 leading-relaxed">
                  {selectedMentor.bio}
                </p>
              )}
              {selectedMentor.educationDetails && (
                <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed mt-3">
                  {selectedMentor.educationDetails}
                </p>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 pb-8 border-b border-slate-200 dark:border-slate-700">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-[14px] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-[12px] text-slate-600 dark:text-slate-300 font-medium">Rating</span>
              </div>
              <p className="text-[22px] font-bold text-[#003566] dark:text-white">
                {selectedMentor.avgRating.toFixed(1)}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-[14px] p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-[12px] text-slate-600 dark:text-slate-300 font-medium">Hourly Rate</span>
              </div>
              <p className="text-[22px] font-bold text-green-600">
                ${selectedMentor.hourlyRate}
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-[14px] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="text-[12px] text-slate-600 dark:text-slate-300 font-medium">Response</span>
              </div>
              <p className="text-[22px] font-bold text-orange-600">
                {selectedMentor.responseTimeHours}h
              </p>
            </div>
          </div>

          {/* Qualifications */}
          {selectedMentor.qualifications && selectedMentor.qualifications.length > 0 && (
            <div className="mt-8">
              <h3 className="text-[14px] font-bold text-[#003566] dark:text-white mb-4">Qualifications</h3>
              <div className="flex flex-wrap gap-3">
                {selectedMentor.qualifications.map((qual, idx) => (
                  <div key={idx} className="px-4 py-2.5 rounded-[12px] bg-slate-100 dark:bg-slate-700 text-[13px] text-slate-700 dark:text-slate-300 font-medium">
                    {qual}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Available Slots */}
        {selectedAvailability.length > 0 ? (
          <div>
            <h3 className="text-[18px] font-bold text-[#003566] dark:text-white mb-4">Available Slots</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {selectedAvailability.map((slot) => (
                <div key={slot.id} className="bg-white dark:bg-slate-800 rounded-[14px] border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-all">
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium mb-2">
                    {new Date(slot.dateFrom).toLocaleDateString()} - {new Date(slot.dateTo).toLocaleDateString()}
                  </p>
                  <p className="text-[16px] font-bold text-[#003566] dark:text-white mb-3">
                    {slot.timeStart} - {slot.timeEnd}
                  </p>
                  <p className="text-[12px] text-slate-600 dark:text-slate-300 mb-4">
                    {slot.maxSessionsPerDay - slot.bookedSessions} slots available
                  </p>
                  <button className="w-full py-2 rounded-[10px] bg-[#0967bd] text-white text-[12px] font-bold hover:bg-[#003566] transition-colors">
                    Book Slot
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-[14px] border border-blue-200 dark:border-blue-800 p-6 text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <p className="text-[14px] text-blue-700 dark:text-blue-300">
              No availability in the next 30 days. Check back soon!
            </p>
          </div>
        )}
      </div>
    );
  }

  // Main discovery view
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="relative rounded-[24px] overflow-hidden mb-8"
        style={{ background: 'linear-gradient(135deg, #001d3d 0%, #003566 50%, #0967bd 100%)' }}>
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, white, transparent 70%)' }} />
        <div className="relative z-10 px-6 md:px-10 py-8 md:py-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(9,103,189,0.15)', border: '1px solid rgba(9,103,189,0.25)' }}>
            <Sparkles className="w-3.5 h-3.5 text-[#0967bd]" />
            <span className="text-[12px] font-semibold text-[#0967bd]">Expert Mentorship</span>
          </div>
          <h1 className="text-[28px] md:text-[36px] lg:text-[40px] text-white mb-3 leading-[1.1]"
            style={{ fontFamily: "'DM Serif Display', serif" }}>
            Find Your Perfect Mentor
          </h1>
          <p className="text-[14px] text-white/50 max-w-[460px] leading-relaxed">
            Connect with verified mentors who can guide your learning journey
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-[18px] shadow-md p-6 mb-8 border border-slate-100 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-[10px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:border-[#0967bd] transition-colors"
            />
          </div>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2.5 rounded-[10px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:border-[#0967bd] transition-colors"
          >
            <option value="">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="Programming">Programming</option>
            <option value="Languages">Languages</option>
          </select>

          {/* Rating Filter */}
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="px-4 py-2.5 rounded-[10px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[13px] outline-none focus:border-[#0967bd] transition-colors"
          >
            <option value={0}>All Ratings</option>
            <option value={4}>4.0+</option>
            <option value={4.5}>4.5+</option>
            <option value={5}>5.0</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-4 h-4 text-[#0967bd]" />
        <p className="text-[14px] text-slate-600 dark:text-slate-400">
          {loading ? "Loading mentors..." : `${filteredMentors.length} mentor${filteredMentors.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Mentor Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-slate-200 dark:bg-slate-700 rounded-[18px] h-80 animate-pulse" />
          ))}
        </div>
      ) : filteredMentors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMentors.map((mentor) => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              onViewProfile={() => setSelectedMentor(mentor)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-900 rounded-[18px] border-2 border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-[16px] font-bold text-slate-700 dark:text-slate-300 mb-2">
            No mentors found
          </p>
          <p className="text-[13px] text-slate-600 dark:text-slate-400">
            Try adjusting your filters or check back later
          </p>
        </div>
      )}
    </div>
  );
}
