const learningFlow = [
  {
    title: "Understand the idea",
    description: "Start with the system underneath the topic, including what it can do, how it works, and where it breaks.",
  },
  {
    title: "Run an experiment",
    description: "Change an input, test an assumption, and use the result to see the concept directly instead of only hearing about it.",
  },
  {
    title: "Apply what worked",
    description: "Turn the experiment into a small build, Hack Club project, analysis, or demonstration that can be explained and extended.",
  },
];

const focusAreas = [
  {
    title: "Artificial intelligence",
    description: "Models, training data, predictions, and practical experiments with how AI succeeds and fails.",
  },
  {
    title: "Cybersecurity",
    description: "Secure code, cryptography, system vulnerabilities, and controlled challenges built around defense.",
  },
  {
    title: "Computer vision",
    description: "Images as data, classification, detection, and the limits of what a computer can recognize.",
  },
  {
    title: "Data science",
    description: "Statistics, visualization, and the process of finding evidence without mistaking noise for a pattern.",
  },
];

export default function GeneralCsSection() {
  return (
    <section className="section-shell general-section" id="general-cs" aria-labelledby="general-heading">
      <div className="section-inner general-layout">
        <div className="general-copy">
          <h2 className="section-heading" id="general-heading">Inside general computer science.</h2>
          <p className="section-intro">
            General CS rotates through modern computing topics. Each session turns one big field into something members can inspect, test, and use.
          </p>
          <ol className="general-flow">
            {learningFlow.map((item) => (
              <li key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="topic-index">
          <div className="topic-index-head">
            <p>General CS / rotating topics</p>
            <p>Four core areas</p>
          </div>
          <ol>
            {focusAreas.map((area, index) => (
              <li key={area.title}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="topic-index-note">Additional topics follow member interest and new developments in computing.</p>
        </div>
      </div>
    </section>
  );
}
