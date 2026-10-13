// Drawn from the two programs and past guest speaker talks.
const marqueeTopics = [
  'AI / machine learning',
  'Dynamic programming',
  'Cybersecurity',
  'Transformers',
  'Computer vision',
  'UIL Computer Science',
  'Data science',
  'Graph algorithms',
  'Computer graphics',
  'Quantum computing',
  'Game development',
  'Java',
  'Web development',
  'Code tracing',
  'Systems & hardware',
  'Computer architecture'
];

function TopicMarquee () {
  const renderTopics = (hidden) => (
    <ul
      className='topic-marquee-list'
      aria-label={hidden ? undefined : 'Topics we cover'}
      aria-hidden={hidden || undefined}
    >
      {marqueeTopics.map((topic) => <li key={topic}>{topic}</li>)}
    </ul>
  );

  // The duplicate list makes the loop seamless; assistive tech reads the first copy only.
  return (
    <div className='topic-marquee'>
      <div className='topic-marquee-viewport'>
        <div className='topic-marquee-track'>
          {renderTopics(false)}
          {renderTopics(true)}
        </div>
      </div>
    </div>
  );
}

export default function ProgramsSection () {
  return (
    <section
      className='section-shell programs-section'
      id='programs'
      aria-labelledby='programs-heading'
    >
      <div className='section-inner split-heading'>
        <h2 className='section-heading' id='programs-heading'>
          What we do.
        </h2>
        <p className='section-intro'>
          Computer Science and Competitive Programming meet at the same time
          every Monday in Room 291A. Pick the one that matches your goals and
          build on it each week.
        </p>
      </div>

      <TopicMarquee />

      <div className='section-inner programs-tracks'>
        <article className='program-track program-track-cs'>
          <header className='program-track-head'>
            <p className='program-code' aria-hidden='true'>CS</p>
            <h3>Computer Science</h3>
          </header>
          <p className='program-track-summary'>
            Follow a lesson and hands-on activity in AI/ML, cybersecurity,
            computer graphics, games, web development, data science, and more.
          </p>
          <p className='program-track-summary'>
            We’re affiliated with Hack Club, which brings projects, hackathons,
            and free merch, and with EN4AC (Enrichment For A Cause), where
            student teams build projects for nonprofits.
          </p>
          <div className='program-track-links'>
            <a className='text-action' href='https://hackclub.com/'>
              <img className='affiliate-logo' src='/hack-club-icon.svg' alt='' width='22' height='22' />
              Hack Club
              <span className='action-arrow' aria-hidden='true'>↗</span>
            </a>
            <a className='text-action' href='https://en4ac.org/'>
              <img className='affiliate-logo' src='/en4ac-icon.svg' alt='' width='22' height='22' />
              EN4AC
              <span className='action-arrow' aria-hidden='true'>↗</span>
            </a>
          </div>
        </article>

        <article className='program-track program-track-cp'>
          <header className='program-track-head'>
            <p className='program-code' aria-hidden='true'>CP</p>
            <h3>Competitive Programming</h3>
          </header>
          <p className='program-track-summary'>
            Practice advanced algorithms, data structures, Java, and UIL-style
            problems with the contest team.
          </p>
          <div className='program-track-links'>
            <a className='text-action' href='#tracks'>
              Inside competitive programming
              <span className='action-arrow' aria-hidden='true'>↓</span>
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
