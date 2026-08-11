const questions = [
  {
    question: "Can I join if I am new to coding?",
    answer: "Yes. General CS sessions explain the foundation before the activity starts, and officers can help you get set up.",
  },
  {
    question: "Do I have to choose one program?",
    answer: "No. You can move between UIL practice and general CS whenever your goals or interests change.",
  },
  {
    question: "What does the UIL group study?",
    answer: "The competitive group focuses on Java, algorithms, data structures, contest strategy, and timed programming practice.",
  },
  {
    question: "What does the general group study?",
    answer: "Topics rotate through AI, cybersecurity, computer vision, data science, and other areas members want to explore.",
  },
  {
    question: "Do you run competitions or hackathons?",
    answer: "Occasionally. We host UIL mock competitions for contest practice and hackathons for longer collaborative builds.",
  },
];

export default function JoinSection() {
  return (
    <section className="section-shell join-section" id="join" aria-labelledby="join-heading">
      <div className="section-inner join-layout">
        <div className="join-copy">
          <h2 className="section-heading" id="join-heading">Mondays after school.</h2>
          <p className="section-intro">
            Room 198A · Westlake High School
          </p>
        </div>
        <div className="join-details">
          {questions.map((item) => (
            <details className="meeting-details" name="club-faq" key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
