const focusAreas = [
  'AI / machine learning',
  'Cybersecurity',
  'Computer vision',
  'Data science',
  'Computer graphics',
  'Game development',
  'Web development',
  'Systems & hardware'
]

export default function GeneralCsSection () {
  return (
    <section className='section-shell general-section' id='general-cs' aria-labelledby='general-heading'>
      <div className='section-inner general-layout'>
        <div className='general-heading'>
          <h2 className='section-heading' id='general-heading'>
            <span>Inside</span>
            <span>computer science.</span>
          </h2>
          <p className='section-intro'>
            Each meeting focuses on one area. Officers introduce the idea, then members test it through a demo, experiment, or Hack Club project.
          </p>
        </div>

        <div className='topic-index'>
          <div className='topic-index-head'>
            <h3>What we cover.</h3>
            <p>Topics rotate throughout the year based on what members want to learn.</p>
          </div>
          <ul className='topic-grid'>
            {focusAreas.map((area) => (
              <li key={area}>
                <h4>{area}</h4>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
