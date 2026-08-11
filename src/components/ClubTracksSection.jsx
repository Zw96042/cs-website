const practice = [
  {
    name: "Learn the pattern",
    description: "Trace algorithms and data structures until every step and tradeoff makes sense.",
  },
  {
    name: "Code the solution",
    description: "Turn the idea into clear Java and learn the details that matter in UIL Computer Science.",
  },
  {
    name: "Test it under time",
    description: "Work through contest sets, compare approaches, and prepare with timed practice and mock competitions.",
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
          <h2 className="section-heading" id="tracks-heading">Inside competitive programming.</h2>
          <p className="section-intro">
            Insertion sort is one example of how CP studies an algorithm: trace each step, understand the tradeoffs, then implement it under contest constraints.
          </p>
          <ol className="competition-list">
            {practice.map((item) => (
              <li key={item.name}>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </li>
            ))}
          </ol>
          <div className="track-event">
            <h3>More than weekly practice</h3>
            <p>The club also hosts occasional UIL mock competitions and hackathons.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
