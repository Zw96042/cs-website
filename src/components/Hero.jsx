export default function Hero() {
  return (
    <section className="club-hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 className="hero-title" id="hero-title">
          <span>Build what you</span>
          <span>wish existed.</span>
        </h1>
        <p className="hero-lede">
          Learn by shipping software, exploring hardware, and solving real problems with people who care how things work.
        </p>
        <div className="hero-actions">
          <a className="text-action primary-action" href="#join">
            Join a meeting <span className="action-arrow" aria-hidden="true">→</span>
          </a>
          <a className="text-action secondary-action" href="#projects">
            See what we build <span className="action-arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <button
        className="hero-media"
        type="button"
        aria-label="Replay Dijkstra’s shortest-path animation from A to G"
      >
        <canvas className="hero-canvas" aria-hidden="true" />
      </button>
    </section>
  );
}
