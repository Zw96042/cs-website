window.prototypeHeaderMarkup = function prototypeHeaderMarkup () {
  return `
    <header class="prototype-header">
      <div class="prototype-header-inner">
        <a class="prototype-brand" href="../../" aria-label="Westlake Computer Science Club home">
          <span class="prototype-brand-mark" aria-hidden="true">{ }</span>
          <span class="prototype-brand-full">Westlake Computer Science Club</span>
          <span class="prototype-brand-short">Westlake CS Club</span>
        </a>
        <nav class="prototype-nav" aria-label="Main navigation">
          <a href="../../#about">About</a>
          <a href="../../#projects">Projects</a>
          <a href="../../#officers">Officers</a>
          <a class="prototype-nav-join" href="../../#join">Join us <span aria-hidden="true">→</span></a>
        </nav>
      </div>
    </header>
  `
}

window.heroGraphMarkup = function heroGraphMarkup (modifier = '') {
  return `
    <button
      class="hero-media ${modifier}"
      type="button"
      aria-label="Replay Dijkstra’s shortest-path animation from A to G"
    >
      <canvas class="hero-canvas" aria-hidden="true"></canvas>
    </button>
  `
}

window.prototypeLedeMarkup = function prototypeLedeMarkup (text) {
  return `
    <p class="prototype-lede">
      ${text}
    </p>
  `
}

window.prototypeActionsMarkup = function prototypeActionsMarkup ({
  modifier = '',
  primary = 'Join a meeting',
  secondary = 'See what we build',
  primaryHref = '../../#join',
  secondaryHref = '../../#projects'
} = {}) {
  return `
    <div class="prototype-actions ${modifier}">
      <a class="prototype-action prototype-action-primary" href="${primaryHref}">${primary} <span aria-hidden="true">→</span></a>
      <a class="prototype-action prototype-action-secondary" href="${secondaryHref}">${secondary} <span aria-hidden="true">→</span></a>
    </div>
  `
}

window.prototypeSceneMarkup = function prototypeSceneMarkup (modifier, heroMarkup) {
  return `
    <div class="site-page proto-scene is-replaying ${modifier}">
      ${window.prototypeHeaderMarkup()}
      <main class="prototype-main" id="club-content">
        <section class="prototype-hero" aria-labelledby="hero-title">
          ${heroMarkup}
        </section>
      </main>
    </div>
  `
}
