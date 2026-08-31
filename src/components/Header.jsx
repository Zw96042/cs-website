import { useEffect, useState } from 'react';

export default function Header ({ currentPage }) {
  const [isCondensed, setIsCondensed] = useState(false);

  useEffect(() => {
    let scrollFrame = 0;
    const updateHeader = () => {
      setIsCondensed(window.scrollY > 48);
      scrollFrame = 0;
    };
    const handleScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateHeader);
    };

    updateHeader();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.cancelAnimationFrame(scrollFrame);
    };
  }, []);

  return (
    <header className='site-header' data-condensed={isCondensed ? '' : undefined}>
      <div className='header-inner'>
        <a className='brand' href='/' aria-label='Westlake High School CS home'>
          <span className='brand-name'>Westlake Computer Science Club</span>
        </a>
        <nav className='site-nav' aria-label='Main navigation'>
          <a className='nav-link' href='/events/' aria-current={currentPage === 'events' ? 'page' : undefined}>Events</a>
          <a className='nav-link' href='/#programs'>Programs</a>
          <a className='nav-link' href='/#hack-club'>
            Hack Club<span className='nav-copyright'>©</span>
          </a>
          <a className='nav-link' href='/#officers'>Officers</a>
          <a className='nav-join' href='/#join'>
            Join us <span className='action-arrow' aria-hidden='true'>→</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
