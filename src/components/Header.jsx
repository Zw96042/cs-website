const pageLinks = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'events', label: 'Events', href: '/events/' },
  { id: 'practice', label: 'Practice', href: '/practice/' }
];

export default function Header ({ currentPage = 'home' }) {
  return (
    <header className='site-header'>
      <div className='header-inner'>
        <a
          className='brand'
          href='/'
          aria-label='Westlake High School CS home'
          aria-current={currentPage === 'home' ? 'page' : undefined}
        >
          <span className='brand-name brand-name-full'>Westlake Computer Science Club</span>
          <span className='brand-name brand-name-compact' aria-hidden='true'>Westlake CS Club</span>
        </a>
        <nav className='site-nav' aria-label='Main navigation'>
          {pageLinks.map((link) => (
            <a
              className={link.id === currentPage ? 'nav-current-page' : 'nav-link'}
              href={link.href}
              aria-current={link.id === currentPage ? 'page' : undefined}
              key={link.id}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
