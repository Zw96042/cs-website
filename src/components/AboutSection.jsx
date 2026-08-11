export default function AboutSection() {
  return (
    <section className="section-shell about-section" id="about" aria-labelledby="about-heading">
      <div className="section-inner about-layout">
        <div className="about-heading">
          <h2 className="section-heading" id="about-heading">Different starting points. Same room.</h2>
          <p className="section-intro">
            Some students are opening an editor for the first time. Others are already training for UIL. The club is designed for both.
          </p>
        </div>
        <div className="about-copy">
          <p className="about-principle">
            Start at your level and work on something that actually challenges you.
          </p>
          <p>
            Officers explain the foundation before the room splits into competitive and general CS work.
          </p>
          <p>
            Members ask questions, debug together, and share the reasoning behind a solution—not just the finished answer.
          </p>
        </div>
      </div>
    </section>
  );
}
