import { useEffect } from 'react';
import './home.css';
import AffiliationSection from './components/AffiliationSection.jsx';
import Contests from './components/Contests.jsx';
import EventsPreviewSection from './components/EventsPreviewSection.jsx';
import GeneralCsSection from './components/GeneralCsSection.jsx';
import Hero from './components/Hero.jsx';
import JoinSection from './components/JoinSection.jsx';
import OfficersSection from './components/OfficersSection.jsx';
import ProgramSection from './components/ProgramSection.jsx';
import ClubTracksSection from './components/ClubTracksSection.jsx';

export default function App () {
  useEffect(() => {
    let disposed = false;
    let cleanupAnimations;
    // Decorative motion starts after content is visible and never blocks rendering.
    import('./lib/animations.js').then(({ initializeAnimations }) => {
      if (!disposed) cleanupAnimations = initializeAnimations();
    }).catch((error) => console.error('Could not load homepage animations', error));
    const scrollToHash = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;

      document.getElementById(decodeURIComponent(id))?.scrollIntoView();
    };
    const scrollFrame = window.requestAnimationFrame(scrollToHash);

    window.addEventListener('hashchange', scrollToHash);

    return () => {
      disposed = true;
      cleanupAnimations?.();
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
    </main>
  );

  return content;
}
