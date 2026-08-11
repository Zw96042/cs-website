export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#club-content" aria-label="Westlake High School CS home">
          <span className="brand-name">Westlake CS</span>
        </a>
        <nav className="site-nav" aria-label="Main navigation">
          <a className="nav-link" href="#about">About</a>
          <a className="nav-link" href="#projects">Projects</a>
          <a className="nav-link" href="#officers">Officers</a>
          <a className="nav-join" href="#join">
            Join us <span className="action-arrow" aria-hidden="true">→</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
