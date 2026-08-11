const meetingSteps = [
  {
    title: "Quick lesson",
    description: "Start with a focused walkthrough of an algorithm, tool, or computer science topic.",
  },
  {
    title: "Choose your session",
    description: "Practice UIL problems with the competitive team or join the general CS lesson and activity.",
  },
  {
    title: "Work together",
    description: "Solve problems, test ideas, and get help from officers and other members before the meeting ends.",
  },
];

export default function ProgramSection() {
  return (
    <section className="section-shell program-section" aria-labelledby="program-heading">
      <div className="section-inner program-layout">
        <div className="program-heading">
          <h2 className="section-heading" id="program-heading">A Monday, in three parts.</h2>
          <p className="section-intro">
            Meetings are structured enough to get started quickly and flexible enough to follow what you care about.
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
