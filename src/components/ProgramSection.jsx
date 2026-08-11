const meetingTracks = [
  {
    code: 'CS',
    title: 'General Computer Science',
    description: 'Follow a lesson and hands-on activity in AI/ML, cybersecurity, computer graphics, games, web development, data science, and more.'
  },
  {
    code: 'CP',
    title: 'Competitive Programming',
    description: 'Practice advanced algorithms, data structures, Java, and UIL-style problems with the contest team.'
  }
]

export default function ProgramSection () {
  return (
    <section className='section-shell program-section' id='programs' aria-labelledby='program-heading'>
      <div className='section-inner program-layout'>
        <div className='program-heading'>
          <h2 className='section-heading' id='program-heading'>Mondays split in two.</h2>
          <p className='section-intro'>
            Students head straight to General CS or Competitive Programming after school. Both meet in Room 291A.
          </p>
        </div>
        <div className='program-choices'>
          {meetingTracks.map((track) => (
            <article className={`program-choice program-choice-${track.code.toLowerCase()}`} key={track.code}>
              <p className='program-code' aria-hidden='true'>{track.code}</p>
              <div>
                <h3>{track.title}</h3>
                <p>{track.description}</p>
              </div>
            </article>
          ))}
        </div>
        <p className='program-note'>Choose the program that matches your goals, then build on it each Monday.</p>
      </div>
    </section>
  )
}
