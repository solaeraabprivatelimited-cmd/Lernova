import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';

import { ThemeToggle } from '@/app/components/ThemeToggle';
import '/src/styles/landing.css';

const HERO_IMG = 'https://images.unsplash.com/photo-1758611971329-94fa9d6aa8a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBsYXB0b3AlMjBmb2N1c2VkfGVufDF8fHx8MTc3MjAzNDMyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
const MENTOR_IMG = 'https://images.unsplash.com/photo-1758685845906-6f705cde4fb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtZW50b3IlMjB0ZWFjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcyMTEyMDUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

interface LandingPageProps {
  onLogin: () => void;
  onSignUp: () => void;
}

export function LandingPage({ onLogin, onSignUp }: LandingPageProps) {
  const navRef = useRef<HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      navRef.current?.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const reveals = document.querySelectorAll('.lp-reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { id: 'lp-study-rooms', label: 'Study Rooms' },
    { id: 'lp-mentor', label: 'Mentor Support' },
    { id: 'lp-testimonials', label: 'Testimonials' },
    { id: 'lp-community', label: 'Community' },
  ];

  const tickerItems = [
    'Focus Mode', 'Silent Mode', 'Collaborative Mode', 'Live Mode',
    'AI Mentor Chat', '1:1 Human Mentors', 'Productivity Tools', 'Wellness Check-In',
  ];

  return (
    <div className="landing-page">
      {/* ── NAVBAR ── */}
      <nav className="lp-nav" ref={navRef}>
        <button
          type="button"
          className="lp-nav-logo"
          onClick={() => {
            setMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <img src="/Blue Png.png" alt="Elm Origin" className="lp-nav-logo-img" draggable={false} />
          <span className="lp-nav-logo-text">Elm Origin</span>
        </button>
        <ul className="lp-nav-links">
          {navItems.map((item) => (
            <li key={item.id}>
              <button type="button" className="lp-nav-link" onClick={() => scrollTo(item.id)}>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="lp-nav-cta">
          <ThemeToggle className="lp-theme-toggle" />
          <button className="lp-btn-ghost" type="button" onClick={onLogin}>Log in</button>
          <button className="lp-btn-primary" type="button" onClick={onSignUp}>Get Started &rarr;</button>
          <button
            type="button"
            className="lp-mobile-menu-btn"
            onClick={() => setMobileMenuOpen((value) => !value)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <div className={`lp-mobile-menu${mobileMenuOpen ? ' open' : ''}`}>
          <div className="lp-mobile-menu-links">
            {navItems.map((item) => (
              <button key={item.id} type="button" className="lp-mobile-link" onClick={() => scrollTo(item.id)}>
                {item.label}
              </button>
            ))}
          </div>
          <div className="lp-mobile-menu-actions">
            <button className="lp-btn-ghost" type="button" onClick={() => { setMobileMenuOpen(false); onLogin(); }}>
              Log in
            </button>
            <button className="lp-btn-primary" type="button" onClick={() => { setMobileMenuOpen(false); onSignUp(); }}>
              Get Started &rarr;
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="lp-hero">
        <div className="lp-hero-blob" />
        <div className="lp-hero-content">
          <div className="lp-hero-badge">
            <span className="lp-dot" />
            Now live &mdash; Studying together
          </div>
          <h1 className="lp-hero-headline">
            Where <em>Focus</em><br />
            Meets <span className="lp-accent-word">Growth</span>
          </h1>
          <p className="lp-hero-sub">
            Personalized study spaces, real mentor guidance, and a vibrant learning community &mdash; all in one platform designed to keep you consistent, focused, and inspired.
          </p>
          <div className="lp-hero-actions">
            <button className="lp-btn-hero-primary" onClick={onSignUp}>
              Start Learning Free
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button className="lp-btn-hero-secondary" onClick={() => scrollTo('lp-study-rooms')}>
              <span className="lp-play-icon">
                <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </span>
              See how it works
            </button>
          </div>
          <div className="lp-hero-stats">
            <div className="lp-stat">
              <div className="lp-stat-num">5K<span>+</span></div>
              <div className="lp-stat-label">Active Learners</div>
            </div>
            <div className="lp-stat-divider" />
            <div className="lp-stat">
              <div className="lp-stat-num">200<span>+</span></div>
              <div className="lp-stat-label">Verified Mentors</div>
            </div>
            <div className="lp-stat-divider" />
            <div className="lp-stat">
              <div className="lp-stat-num">100<span>+</span></div>
              <div className="lp-stat-label">Rooms Live</div>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="lp-hero-visual">
          <div className="lp-floating-card lp-card-main">
            <img src={HERO_IMG} alt="Study session" loading="eager" decoding="async" />
          </div>
          <div className="lp-floating-card lp-card-timer">
            <div className="lp-timer-label">&#9201; Focus Session</div>
            <div className="lp-timer-display">25:00</div>
            <div className="lp-timer-bar"><div className="lp-timer-bar-fill" /></div>
            <div className="lp-timer-mode">
              <span className="lp-mode-chip active">Focus</span>
              <span className="lp-mode-chip">Silent</span>
              <span className="lp-mode-chip">Collab</span>
            </div>
          </div>
          <div className="lp-floating-card lp-card-users">
            <div className="lp-users-label">
              <span className="lp-live-dot" />
              Live in room
            </div>
            <div className="lp-users-avatars">
              <div className="lp-avatar lp-avatar-logo"><img src="/Blue Png.png" alt="" draggable={false} /></div>
              <div className="lp-avatar lp-avatar-logo" style={{background:'rgba(0,53,102,0.85)'}}><img src="/Black Png.png" alt="" draggable={false} style={{filter:'brightness(0) invert(1)'}} /></div>
              <div className="lp-avatar lp-avatar-logo"><img src="/elm origin logo.svg" alt="" draggable={false} style={{filter:'brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(185deg)'}} /></div>
              <div className="lp-avatar lp-avatar-logo" style={{background:'rgba(9,103,189,0.85)'}}><img src="/Blue Png.png" alt="" draggable={false} style={{filter:'brightness(0) invert(1)'}} /></div>
              <div className="lp-avatar more">+12</div>
            </div>
            <div className="lp-users-count"><span>16 people</span> studying now</div>
          </div>
          <div className="lp-floating-card lp-card-mentor">
            <div className="lp-mentor-row">
              <div className="lp-mentor-avatar lp-mentor-avatar-logo">
                <img src="/Blue Png.png" alt="Elm Origin" draggable={false} />
              </div>
              <div>
                <div className="lp-mentor-name">Dr. Singh</div>
                <div className="lp-mentor-title">IIT Mentor</div>
              </div>
            </div>
            <div className="lp-mentor-rating">
              <span className="lp-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
              <span>4.9</span>
            </div>
            <button className="lp-btn-book" type="button" onClick={onSignUp}>Book Session &rarr;</button>
          </div>
        </div>
      </section>

      {/* ── TICKER BAND ── */}
      <div className="lp-ticker-band">
        <div className="lp-ticker-track">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span className="lp-ticker-item" key={i}>
              <span className="lp-ticker-dot" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── STUDY ROOMS ── */}
      <section className="lp-study-section" id="lp-study-rooms">
        <div className="lp-deco-circle lp-deco-1" />
        <div className="lp-deco-circle lp-deco-2" />
        <div className="lp-study-grid">
          <div className="lp-reveal">
            <div className="lp-section-label">
              <div className="lp-icon">
                <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
              </div>
              Study Rooms
            </div>
            <h2 className="lp-section-title">
              Designed to help you<br /><em>focus and grow.</em>
            </h2>
            <p className="lp-section-sub">
              Four distinct room modes tailored to every learning style &mdash; whether you need silence, collaboration, or live instruction.
            </p>
              <button className="lp-study-cta" type="button" onClick={onSignUp}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
              </svg>
              Join a Study Room
            </button>
            <div className="flex items-center gap-3 md:gap-4 mt-8">
              <div className="lp-users-avatars">
                <div className="lp-avatar lp-avatar-logo"><img src="/Blue Png.png" alt="" draggable={false} style={{filter:'brightness(0) invert(1)'}} /></div>
                <div className="lp-avatar lp-avatar-logo" style={{background:'rgba(9,103,189,0.85)'}}><img src="/Black Png.png" alt="" draggable={false} style={{filter:'brightness(0) invert(1)'}} /></div>
              </div>
              <span className="lp-guided-text">Guided by experienced mentors</span>
            </div>
          </div>

          <div className="lp-room-modes lp-reveal lp-reveal-delay-2">
            <div className="lp-room-card featured">
              <div className="lp-room-num">01</div>
              <div className="lp-room-icon">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" /></svg>
              </div>
              <div className="lp-room-name">Focus Mode</div>
              <div className="lp-room-desc">Stay distraction-free with Pomodoro timers, note tools, and soothing background ambience. Your personal study sanctuary.</div>
              <span className="lp-room-tag">Most Popular</span>
            </div>
            <div className="lp-room-card">
              <div className="lp-room-num">02</div>
              <div className="lp-room-icon">
                <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" /></svg>
              </div>
              <div className="lp-room-name">Silent Mode</div>
              <div className="lp-room-desc">Study with peers for shared accountability &mdash; no noise, just presence and motivation.</div>
            </div>
            <div className="lp-room-card">
              <div className="lp-room-num">03</div>
              <div className="lp-room-icon">
                <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
              </div>
              <div className="lp-room-name">Collaborative Mode</div>
              <div className="lp-room-desc">Work together with your study group &mdash; share notes, ideas, and resources in real time.</div>
            </div>
            <div className="lp-room-card">
              <div className="lp-room-num">04</div>
              <div className="lp-room-icon">
                <svg viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" /></svg>
              </div>
              <div className="lp-room-name">Live Mode</div>
              <div className="lp-room-desc">Interactive study jams or mentor-led live sessions with real-time video and Q&amp;A.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MENTOR SUPPORT ── */}
      <section className="lp-mentor-section" id="lp-mentor">
        <div className="lp-mentor-grid">
          <div className="lp-mentor-visual lp-reveal">
            <div className="lp-mentor-ring" />
            <div className="lp-mentor-img-placeholder">
              <img src={MENTOR_IMG} alt="Mentor" loading="lazy" decoding="async" />
            </div>
            <div className="lp-mentor-stat-card card-sessions">
              <div className="lp-stat-big">10K<span>+</span></div>
              <div className="lp-stat-small">Sessions Completed</div>
            </div>
            <div className="lp-mentor-stat-card card-rating">
              <div className="lp-stat-big">4.9<span>&#9733;</span></div>
              <div className="lp-stat-small">Average Mentor Rating</div>
            </div>
          </div>

          <div className="lp-reveal lp-reveal-delay-2">
            <div className="lp-section-label">
              <div className="lp-icon lp-icon-orange">
                <svg viewBox="0 0 24 24"><path d="M12 2L1 7l11 6 9-4.91V17h2V9L12 2zm0 12.54L4.38 11 12 6.46 19.62 11 12 15.54zM1 17v2l11 6 11-6v-2l-11 6L1 17z" /></svg>
              </div>
              Premium Mentorship
            </div>
            <h2 className="lp-section-title">
              Empowering learners through <em className="accent-blue">expert mentors.</em>
            </h2>
            <p className="lp-section-sub">
              Web-based mentorship sessions tailored to your goals &mdash; learn at your own pace through 1:1 interactive sessions with verified professionals.
            </p>

            <div className="lp-features-list">
              <div className="lp-feature-item">
                <div className="lp-feature-icon">
                  <svg viewBox="0 0 24 24"><path d="M12 2L1 7l11 6 9-4.91V17h2V9L12 2zm0 12.54L4.38 11 12 6.46 19.62 11 12 15.54zM1 17v2l11 6 11-6v-2l-11 6L1 17z" /></svg>
                </div>
                <div className="lp-feature-text">
                  <h4>AI Mentor &mdash; Always Available</h4>
                  <p>Get instant answers, explanations, and study guidance from our AI mentor 24/7 via text or voice chat.</p>
                </div>
              </div>
              <div className="lp-feature-item">
                <div className="lp-feature-icon">
                  <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                </div>
                <div className="lp-feature-text">
                  <h4>200+ Verified Human Mentors</h4>
                  <p>Book 1:1 sessions with IIT alumni, industry experts, and experienced educators across every subject.</p>
                </div>
              </div>
              <div className="lp-feature-item">
                <div className="lp-feature-icon">
                  <svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z" /></svg>
                </div>
                <div className="lp-feature-text">
                  <h4>Flexible Scheduling &amp; Payments</h4>
                  <p>Book sessions on your schedule. Pay via UPI or bank transfer &mdash; straightforward and secure.</p>
                </div>
              </div>
            </div>

            <button className="lp-mentor-cta" type="button" onClick={onSignUp}>
              Find Your Mentor
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="lp-testimonials-section" id="lp-testimonials">
        <div className="lp-testimonials-grid">
          <div className="lp-reveal">
            <div className="lp-section-label">
              <div className="lp-icon">
                <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" /></svg>
              </div>
              Student Feedback
            </div>
            <h2 className="lp-section-title">Trusted by dedicated<br />learners worldwide.</h2>
            <p className="lp-section-sub">
              Our mentors and tools have helped thousands of students stay consistent, confident, and focused on their goals.
            </p>

              <div className="flex items-center gap-3 md:gap-4 mt-7">
                <div className="lp-mentor-avatar-stat">
                  99<span>%</span>
                </div>
                <div className="lp-mentor-avatar-desc">
                Learners reported visible improvement in focus and productivity.
              </div>
            </div>

            <div className="lp-t-stats">
              <div className="lp-t-stat">
                <div className="lp-t-stat-num">10K<span>+</span></div>
                <div className="lp-t-stat-label">Mentor Sessions<br />Completed</div>
              </div>
              <div className="lp-t-stat">
                <div className="lp-t-stat-num">2M<span>+</span></div>
                <div className="lp-t-stat-label">Study Hours<br />Logged</div>
              </div>
              <div className="lp-t-stat">
                <div className="lp-t-stat-num">50<span>+</span></div>
                <div className="lp-t-stat-label">Countries<br />Reached</div>
              </div>
            </div>
          </div>

          <div className="lp-testimonials-cards lp-reveal lp-reveal-delay-2">
            <div className="lp-t-card featured">
              <div className="lp-stars-row">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <p className="lp-t-text lp-testimonial-text">
                &ldquo;Elm Origin completely changed the way I study. My mentor guided me through every step, and the focus sessions helped me stay on track. I&rsquo;ve become more confident and disciplined.&rdquo;
              </p>
              <div className="lp-t-author">
                <div className="lp-t-avatar lp-testimonial-avatar lp-avatar-logo"><img src="/Blue Png.png" alt="" draggable={false} style={{filter:'brightness(0) invert(1)'}} /></div>
                <div>
                  <div className="lp-t-name lp-testimonial-name">Aarav Mehta</div>
                  <div className="lp-t-role lp-testimonial-role">Computer Science Student</div>
                </div>
              </div>
            </div>

            <div className="lp-t-card">
              <div className="lp-stars-orange">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <p className="lp-t-text">
                &ldquo;The collaborative rooms are amazing &mdash; I finally found a study group that keeps me accountable. The AI mentor is like having a tutor available 24/7.&rdquo;
              </p>
              <div className="lp-t-author">
                <div className="lp-t-avatar lp-testimonial-avatar lp-avatar-logo" style={{background:'rgba(247,127,0,0.85)'}}><img src="/Black Png.png" alt="" draggable={false} style={{filter:'brightness(0) invert(1)'}} /></div>
                <div>
                  <div className="lp-t-name">Priya Kumar</div>
                  <div className="lp-t-role">UPSC Aspirant</div>
                </div>
              </div>
            </div>

            <div className="lp-t-card">
              <div className="lp-stars-orange">&#9733;&#9733;&#9733;&#9733;&#9734;</div>
              <p className="lp-t-text">
                &ldquo;Booked my first mentor session and it was a game changer. The payment was smooth and the session quality was excellent. Highly recommend!&rdquo;
              </p>
              <div className="lp-t-author">
                <div className="lp-t-avatar lp-testimonial-avatar lp-avatar-logo" style={{background:'rgba(9,103,189,0.85)'}}><img src="/Blue Png.png" alt="" draggable={false} style={{filter:'brightness(0) invert(1)'}} /></div>
                <div>
                  <div className="lp-t-name">Rahul Sharma</div>
                  <div className="lp-t-role">Engineering Student</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section className="lp-cta-strip" id="lp-community">
        <h2>New learners welcome!<br />Start your journey today.</h2>
        <p>Join our community of dedicated learners using Elm Origin to study smarter.</p>
        <div className="lp-cta-strip-actions">
          <button className="lp-btn-cta-white" type="button" onClick={onSignUp}>
            &#128077; Get Started Free
          </button>
          <button className="lp-btn-cta-outline" type="button" onClick={() => scrollTo('lp-study-rooms')}>
            Explore Study Rooms &rarr;
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-footer-grid">
          <div className="lp-footer-brand">
            <button
              type="button"
              className="lp-nav-logo"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img src="/Blue Png.png" alt="Elm Origin" className="lp-nav-logo-img" draggable={false} />
              <span className="lp-nav-logo-text">Elm Origin</span>
            </button>
            <p>Empowering learners worldwide with expert-led, interactive, and goal-driven education.</p>
          </div>

          <div className="lp-footer-col">
            <h4>Platform</h4>
            <ul>
              <li><button type="button" className="lp-footer-link" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button></li>
              <li><button type="button" className="lp-footer-link" onClick={() => scrollTo('lp-study-rooms')}>Study Rooms</button></li>
              <li><button type="button" className="lp-footer-link" onClick={() => scrollTo('lp-mentor')}>Mentor Support</button></li>
              <li><button type="button" className="lp-footer-link" onClick={() => scrollTo('lp-community')}>Community</button></li>
              <li><button type="button" className="lp-footer-link">Wellness</button></li>
            </ul>
          </div>

          <div className="lp-footer-col">
            <h4>Need Help?</h4>
            <ul>
              <li><button type="button" className="lp-footer-link">+1 234 567 8910</button></li>
              <li><button type="button" className="lp-footer-link">support@elmorbit.co.in</button></li>
              <li><button type="button" className="lp-footer-link">Help Center</button></li>
              <li><button type="button" className="lp-footer-link">Report Issue</button></li>
            </ul>
          </div>

          <div className="lp-footer-col">
            <h4>Subscribe to Newsletter</h4>
            <p className="lp-newsletter-label">Get learning tips and platform updates.</p>
            <div className="lp-newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="button">Submit &rarr;</button>
            </div>
          </div>
        </div>

        <div className="lp-footer-bottom">
          <p>&copy; 2026 Elm Origin. All rights reserved.</p>
          <div className="lp-footer-legal">
            <button type="button" className="lp-footer-link">Disclaimer</button>
            <button type="button" className="lp-footer-link">Privacy Policy</button>
            <button type="button" className="lp-footer-link">Terms of Service</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
