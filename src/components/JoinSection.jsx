const questions = [
  {
    question: "Do I need experience?",
    answer: "No. The first session is designed to give you a useful place to start, even if you have never written code.",
  },
  {
    question: "What should I bring?",
    answer: "A laptop is useful but not required. We can pair you with another member for the meeting.",
  },
  {
    question: "Can I bring my own project?",
    answer: "Yes. Bring the project, the problem, or the half-formed idea. Someone can help you find the next step.",
  },
];

export default function JoinSection() {
  return (
    <section className="section-shell join-section" id="join" aria-labelledby="join-heading">
      <div className="section-inner join-layout">
        <div className="join-copy">
          <h2 className="section-heading" id="join-heading">Mondays after school.</h2>
          <p className="section-intro">
            Find us in Room 198A at Westlake High School.
          </p>
        </div>
        <div className="join-details">
          {questions.map((item) => (
            <details className="meeting-details" key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
