export default function AboutSection() {
  return (
    <section className="section-shell about-section" id="about" aria-labelledby="about-heading">
      <div className="section-inner about-layout">
        <div className="about-heading">
          <h2 className="section-heading" id="about-heading">Start curious. Leave capable.</h2>
          <p className="section-intro">
            We make room for beginners, ambitious builders, and everyone still figuring out which one they are.
          </p>
        </div>
        <div className="about-copy">
          <p className="about-principle">
            The club is less about knowing the answer and more about learning how to find it.
          </p>
          <p>
            Members work at their own level, pair up when a problem gets stubborn, and share the reasoning behind what they build.
          </p>
          <p>
            We care about readable code, useful feedback, and projects that teach something beyond the tutorial.
          </p>
        </div>
      </div>
    </section>
  );
}
