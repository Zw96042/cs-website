const programs = [
  {
    name: "UIL Computer Science",
    description: "Advanced algorithms, data structures, Java, timed practice, and the strategy behind programming contests.",
  },
  {
    name: "General computer science",
    description: "Artificial intelligence, cybersecurity, computer vision, data science, and rotating topics requested by members.",
  },
];

export default function ClubTracksSection() {
  return (
    <section className="section-shell tracks-section" id="tracks" aria-labelledby="tracks-heading">
      <div className="section-inner tracks-layout">
        <div className="logic-lab" data-sort-lab>
          <div className="logic-lab-head">
            <p className="logic-lab-title">UIL algorithm lab / insertion sort</p>
            <p className="logic-lab-hint">Click to replay</p>
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
          <h2 className="section-heading" id="tracks-heading">Competitive CS and general CS, side by side.</h2>
          <p className="section-intro">
            Pick the session that fits what you want to learn that week. Switching between them is encouraged.
          </p>
          <ul className="track-list">
            {programs.map((program) => (
              <li key={program.name}>
                <h3>{program.name}</h3>
                <p>{program.description}</p>
              </li>
            ))}
          </ul>
          <div className="track-event">
            <h3>Beyond weekly meetings</h3>
            <p>We occasionally host UIL mock competitions and hackathons for focused practice and longer-form building.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
