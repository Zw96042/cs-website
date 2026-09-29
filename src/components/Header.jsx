import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { formatEventDate, getScheduledEvents } from '../lib/events.js';
import { getPracticeTypeHref } from '../lib/navigation.js';

// Homepage section ids from the components rendered by App.jsx.
const homeSections = [
  { label: 'Contests', href: '/#contests-heading' },
  { label: 'Meetings', href: '/#programs' },
  { label: 'Computer science', href: '/#general-cs' },
  { label: 'Competitive programming', href: '/#tracks' },
  { label: 'Hack Club', href: '/#hack-club' },
  { label: 'Officers', href: '/#officers' },
  { label: 'Join', href: '/#join' }
];

// Each link sets the practice archive's Type filter and clears Year and Round.
const practiceArchives = [
  { type: 'all', label: 'All contests', detail: 'Every past UIL test, latest first' },
  { type: 'mc', label: 'Multiple choice', detail: 'Check as you go or take a 45-minute exam' },
  { type: 'frq', label: 'Programming FRQ', detail: 'Write Java and compare with the judge' }
];

// The page link itself is the Radix trigger: hover opens its panel, a click still
// follows the link, and ArrowDown opens the panel (a second ArrowDown enters it).
function MenuItem ({ value, href, label, current, open, onOpen, panelClassName, children }) {
  return (
    <NavigationMenu.Item className='site-nav-item' value={value}>
      <NavigationMenu.Trigger
        asChild
        onKeyDown={(event) => {
          if (event.key !== 'ArrowDown' || open) return;
          event.preventDefault();
          onOpen(value);
        }}
      >
        <a className='nav-link site-nav-trigger' href={href} aria-current={current ? 'page' : undefined}>
          {label}
        </a>
      </NavigationMenu.Trigger>
      <NavigationMenu.Content className={`site-nav-panel ${panelClassName}`}>
        {children}
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  );
}

function PanelLink ({ href, children }) {
  return (
    <NavigationMenu.Link asChild>
      <a className='site-nav-panel-link' href={href}>{children}</a>
    </NavigationMenu.Link>
  );
}

function EventsPanel () {
  const upcoming = getScheduledEvents().slice(0, 3);

  return (
    <>
      {upcoming.length > 0
        ? (
          <ul className='site-nav-events'>
            {upcoming.map((event) => {
              const date = formatEventDate(event);
              return (
                <li key={`${event.date}-${event.title}`}>
                  {/* Matches the month section ids rendered by EventsPage. */}
                  <PanelLink href={`/events/#${date.monthLabel.toLowerCase()}-events`}>
                    <time className='site-nav-event-date' dateTime={event.date}>
                      {date.startDateLabel}{date.endDateLabel ? `–${date.endDateLabel}` : ''}
                    </time>
                    <span className='site-nav-event-title'>{event.title}</span>
                  </PanelLink>
                </li>
              );
            })}
          </ul>
          )
        : <p className='site-nav-empty'>No dated events on the calendar yet.</p>}
      <div className='site-nav-panel-foot'>
        <PanelLink href='/events/'>
          All events <span className='action-arrow' aria-hidden='true'>→</span>
        </PanelLink>
      </div>
    </>
  );
}

export default function Header ({ currentPage = 'home' }) {
  const [openMenu, setOpenMenu] = useState('');
  const navList = useRef(null);
  const [selection, setSelection] = useState(null);

  // Share one highlight across links so route changes slide it to the new page.
  // Remeasure when fonts or the viewport change the navigation's dimensions.
  useLayoutEffect(() => {
    const list = navList.current;
    const updateSelection = () => {
      const link = list.querySelector('[aria-current="page"]');
      if (link) setSelection({ left: link.offsetLeft, width: link.offsetWidth });
    };
    updateSelection();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateSelection);
    observer?.observe(list);
    window.addEventListener('resize', updateSelection);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateSelection);
    };
  }, [currentPage]);

  // The header stays mounted across routes, so close any panel after navigation.
  useEffect(() => { setOpenMenu(''); }, [currentPage]);

  const item = (value) => ({ value, current: currentPage === value, open: openMenu === value, onOpen: setOpenMenu });

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
        <NavigationMenu.Root
          className='site-nav'
          aria-label='Main navigation'
          value={openMenu}
          onValueChange={setOpenMenu}
          delayDuration={120}
        >
          <NavigationMenu.List className='site-nav-list' ref={navList}>
            {selection && (
              <li
                className='site-nav-selection'
                aria-hidden='true'
                style={{ width: selection.width, transform: `translateX(${selection.left}px)` }}
              />
            )}
            <MenuItem {...item('home')} href='/' label='Home' panelClassName='site-nav-panel-home'>
              <ul className='site-nav-sections'>
                {homeSections.map((section) => (
                  <li key={section.href}>
                    <PanelLink href={section.href}>{section.label}</PanelLink>
                  </li>
                ))}
              </ul>
            </MenuItem>
            <MenuItem {...item('events')} href='/events/' label='Events' panelClassName='site-nav-panel-events'>
              <EventsPanel />
            </MenuItem>
            <MenuItem {...item('practice')} href='/practice/' label='Practice' panelClassName='site-nav-panel-practice'>
              <ul className='site-nav-practice'>
                {practiceArchives.map((archive) => (
                  <li key={archive.type}>
                    <PanelLink href={getPracticeTypeHref(archive.type)}>
                      <span className='site-nav-practice-label'>{archive.label}</span>
                      <span className='site-nav-practice-detail'>{archive.detail}</span>
                    </PanelLink>
                  </li>
                ))}
              </ul>
            </MenuItem>
            {/* Radix measures the open trigger's offsetLeft against the List's wrapper,
                so nothing between the trigger and that wrapper may be positioned. */}
            <NavigationMenu.Indicator className='site-nav-indicator' forceMount>
              <span className='site-nav-arrow' />
            </NavigationMenu.Indicator>
          </NavigationMenu.List>
          <div className='site-nav-viewport-position'>
            {/* Kept mounted so opening and closing are interruptible CSS transitions. */}
            <NavigationMenu.Viewport className='site-nav-viewport' forceMount />
          </div>
        </NavigationMenu.Root>
      </div>
    </header>
  );
}
