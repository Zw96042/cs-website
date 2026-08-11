const questions = [
  {
    question: 'Can I join if I am new to coding?',
    answer: 'Yes. General CS sessions explain the foundation before the activity starts, and officers can help you get set up.'
  },
  {
    question: 'Do I have to choose one program?',
    answer: 'Choose the program that best matches your goals. Sticking with one track lets each week build on the last.'
  },
  {
    question: 'What does Competitive Programming cover?',
    answer: 'CP focuses on Java, algorithms, data structures, UIL contest strategy, and timed programming practice.'
  },
  {
    question: 'What does General CS cover?',
    answer: 'Topics rotate through AI and machine learning, cybersecurity, computer vision, data science, computer graphics, game development, web development, and other areas members want to explore.'
  },
  {
    question: 'Do you run competitions or hackathons?',
    answer: 'Occasionally. We host UIL mock competitions for contest practice and hackathons for longer collaborative builds.'
  }
]

export default function JoinSection () {
  return (
    <section className='section-shell join-section' id='join' aria-labelledby='join-heading'>
      <div className='section-inner join-layout'>
        <div className='join-copy'>
          <h2 className='section-heading' id='join-heading'>Mondays after school.</h2>
          <p className='section-intro'>
            Room 291A · Westlake High School
          </p>
        </div>
        <div className='join-details'>
          {questions.map((item) => (
            <details className='meeting-details' name='club-faq' key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
