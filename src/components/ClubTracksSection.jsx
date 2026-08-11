const programs = [
  {
    name: "Competitive UIL CS",
    description: "Prepare for UIL Computer Science with advanced algorithms, data structures, Java, and competition strategy.",
  },
  {
    name: "General CS",
    description: "Explore artificial intelligence, cybersecurity, computer vision, data science, and other fields through lessons and hands-on work.",
  },
  {
    name: "Mock competitions + hackathons",
    description: "We occasionally host UIL mock competitions and hackathons to practice under pressure, collaborate, and build something new.",
  },
];

export default function ClubTracksSection() {
  return (
    <section className="section-shell tracks-section" id="tracks" aria-labelledby="tracks-heading">
      <div className="section-inner tracks-layout">
        <div className="logic-lab" data-sort-lab>
          <div className="logic-lab-head">
            <p className="logic-lab-title">UIL algorithm lab / insertion sort</p>
          </div>
          <button className="sort-trigger" type="button" aria-describedby="sort-status">
            <canvas className="sort-canvas" aria-hidden="true" />
            <span className="sr-only">Replay the insertion sort animation</span>
          </button>
          <div className="logic-lab-foot">
            <p className="logic-lab-status" id="sort-status" aria-live="polite">Ready / starts when in view</p>
            <p className="logic-lab-status">O(n²) time / O(1) space</p>
          </div>
        </div>

        <div className="tracks-copy">
          <h2 className="section-heading" id="tracks-heading">Competition and everything beyond it.</h2>
          <p className="section-intro">
            Train for UIL Computer Science or explore the parts of computing that rarely fit in a class. Many members do both.
          </p>
          <ul className="track-list">
            {programs.map((program) => (
              <li key={program.name}>
                <h3>{program.name}</h3>
                <p>{program.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
