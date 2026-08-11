const meetingSteps = [
  {
    title: "Learn one useful idea.",
    description: "A short explanation gives everyone enough context to start, without taking over the meeting.",
  },
  {
    title: "Build while help is nearby.",
    description: "Use the rest of the session to work, ask questions, review code, and make visible progress.",
  },
  {
    title: "Share how it works.",
    description: "Explain the decisions, the failure, and the fix. Understanding grows when it can be communicated.",
  },
];

export default function ProgramSection() {
  return (
    <section className="section-shell program-section" aria-labelledby="program-heading">
      <div className="section-inner program-layout">
        <div className="program-heading">
          <h2 className="section-heading" id="program-heading">What happens in the room.</h2>
          <p className="section-intro">
            Each meeting creates a clear next step without turning curiosity into homework.
          </p>
        </div>
        <ol className="program-list">
          {meetingSteps.map((step) => (
            <li className="program-item" key={step.title}>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
