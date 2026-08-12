window.heroVariants.push({
  name: 'Commons',
  axis: 'A field of interests replaces the single centerpiece and makes breadth the invitation.',
  render: () => window.prototypeSceneMarkup('concept-commons', `
    <div class="commons-copy">
      <h1 class="prototype-title" id="hero-title">There is room for the thing you care about.</h1>
      ${window.prototypeActionsMarkup({ modifier: 'commons-actions', primary: 'Bring your curiosity', secondary: 'Meet the community', secondaryHref: '../../#officers' })}
    </div>
    <div class="commons-visual">
      <div class="commons-field">
        <span>Web</span><span>Robotics</span><span>Algorithms</span><span>Games</span><span>AI</span><span>Security</span><span>Design</span><span>Hardware</span><span>Graphics</span><span>Data</span><span>Systems</span><span>Compete</span>
      </div>
      <button class="concept-replay-control" type="button" data-replay>Replay interests <span aria-hidden="true">↻</span></button>
    </div>
  `)
});
