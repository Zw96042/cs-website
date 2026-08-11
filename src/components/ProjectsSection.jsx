const projects = [
  {
    name: "Community event finder",
    description: "A fast, accessible site that makes local student events easier to discover.",
  },
  {
    name: "Classroom air monitor",
    description: "A small sensor project that turns environmental readings into clear, useful feedback.",
  },
  {
    name: "Study group scheduler",
    description: "A simple coordination tool designed around the way students actually plan together.",
  },
];

export default function ProjectsSection() {
  return (
    <section className="section-shell projects-section" id="projects" aria-labelledby="projects-heading">
      <div className="section-inner projects-layout">
        <div className="logic-lab" data-sort-lab>
          <div className="logic-lab-head">
            <p className="logic-lab-title">Insertion sort / 8 values</p>
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

        <div className="project-copy">
          <h2 className="section-heading" id="projects-heading">Projects with a reason to exist.</h2>
          <p className="section-intro">
            The best work solves a real problem, teaches a new concept, or makes someone want to ask how it works.
          </p>
          <ul className="project-list">
            {projects.map((project) => (
              <li key={project.name}>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
