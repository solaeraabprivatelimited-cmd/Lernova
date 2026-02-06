import React, { useState } from 'react';
import { StudyRoomDashboard } from '@/app/components/dashboard/StudyRoomDashboard';

// Landing Page Components
import { Navbar } from '@/app/components/Navbar';
import { Hero } from '@/app/components/Hero';
import { StudyRooms } from '@/app/components/StudyRooms';
import { MentorSupport } from '@/app/components/MentorSupport';
import { Testimonials } from '@/app/components/Testimonials';
import { Footer } from '@/app/components/Footer';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-white w-full overflow-x-hidden">
        <StudyRoomDashboard onLogout={() => setIsLoggedIn(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden">
      <Navbar onLogin={() => setIsLoggedIn(true)} />
      <Hero />
      <div id="study-rooms"><StudyRooms /></div>
      <div id="mentor-support"><MentorSupport /></div>
      <div id="testimonials"><Testimonials /></div>
      <Footer />
    </div>
  );
}
