const questions = [
  {
    question: 'Can I join if I am new to coding?',
    answer:
      'Yes. Computer Science sessions explain the foundation before the activity starts, and officers can help you get set up.'
  },
  {
    question: 'Do I have to choose one program?',
    answer:
      'Choose the program that best matches your goals. Sticking with one track lets each week build on the last.'
  },
  {
    question: 'Do you run competitions or hackathons?',
    answer:
      'Occasionally. We host UIL mock competitions for contest practice and hackathons for longer collaborative builds.'
  }
];

export default function JoinSection () {
  return (
    <section
      className='section-shell join-section'
      id='join'
      aria-labelledby='join-heading'
    >
      <div className='section-inner join-layout'>
        <div className='join-copy'>
          <h2 className='section-heading' id='join-heading'>
            Mondays, 4:30–5:30
          </h2>
          <p className='section-intro'>Room 291A at Westlake High School</p>
          <div className='join-actions'>
            <a
              className='canvas-action'
              href='https://eanes.instructure.com/enroll/CEEGDH'
              target='_blank'
              rel='noreferrer'
            >
              <img className='canvas-action-logo' src='/canvas-logo.svg' alt='' width='21' height='21' />
              Join Canvas
            </a>
            <a
              className='text-action'
              href='https://www.youtube.com/@WestlakeComputerScienceClub'
              target='_blank'
              rel='noreferrer'
            >
              <img className='canvas-action-logo' src='/yt-logo.svg' alt='' width='21' height='21' />
              Watch on YouTube
            </a>
          </div>
        </div>
        <div className='join-details'>
          {questions.map((item) => (
            <details
              className='meeting-details'
              name='club-faq'
              key={item.question}
            >
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
