export default function AffiliationSection () {
  return (
    <section className='section-shell affiliation-section' id='hack-club' aria-labelledby='affiliation-heading'>
      <div className='section-inner affiliation-layout'>
        <h2 className='section-heading' id='affiliation-heading'>
          Affiliated with Hack Club<span className='affiliation-heading-copyright'>©</span>
        </h2>
        <div className='affiliation-copy'>
          <p>
            Westlake CS is part of Hack Club’s international network of student-led coding clubs. The affiliation connects members with a wider community, project resources, and events beyond Westlake, and provides us with innumerable opportunities for free merch, hackathons, and events.
          </p>
          <a className='text-action affiliation-link' href='https://hackclub.com/'>
            <img className='hack-club-logo' src='/hack-club-icon.svg' alt='' />
            Visit Hack Club <span className='hack-club-copyright'>©</span>
            <span className='action-arrow' aria-hidden='true'>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
