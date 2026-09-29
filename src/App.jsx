import { useEffect } from 'react';
import { initializeAnimations } from './lib/animations.js';
import AffiliationSection from './components/AffiliationSection.jsx';
import Contests from './components/Contests.jsx';
import Footer from './components/Footer.jsx';
import EventsPreviewSection from './components/EventsPreviewSection.jsx';
import GeneralCsSection from './components/GeneralCsSection.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import JoinSection from './components/JoinSection.jsx';
import OfficersSection from './components/OfficersSection.jsx';
import ProgramSection from './components/ProgramSection.jsx';
import ClubTracksSection from './components/ClubTracksSection.jsx';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App ({ embedded = false }) {
  useEffect(() => {
    const cleanupAnimations = initializeAnimations();
    const scrollToHash = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;

      document.getElementById(decodeURIComponent(id))?.scrollIntoView();
    };
    const scrollFrame = window.requestAnimationFrame(scrollToHash);

    window.addEventListener('hashchange', scrollToHash);

    return () => {
      cleanupAnimations();
      window.cancelAnimationFrame(scrollFrame);
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, []);

  const content = (
    <main className='club-main' id='club-content'>
      <Hero />
      <EventsPreviewSection />
      <Contests />
      <ProgramSection />
      <GeneralCsSection />
      <ClubTracksSection />
      <AffiliationSection />
      <OfficersSection />
      <JoinSection />
      {!embedded && <Analytics />}
      {!embedded && <SpeedInsights />}
    </main>
  );

  if (embedded) return content;

  return (
    <div className='site-page'>
      <a className='skip-link' href='#club-content'>Skip to content</a>
      <Header />
      {content}
      <Footer />
    </div>
  );
}
