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
            General CS explores a new topic through a lesson and hands-on activity. Competitive Programming works through algorithms, contest problems, and UIL preparation.
          </p>
          <p>
            Members ask questions, debug together, and explain how they reached a solution, not just what they submitted.
          </p>
        </div>
      </div>
    </section>
  );
}
