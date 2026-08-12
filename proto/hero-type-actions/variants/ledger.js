window.heroVariants.push({
  name: 'Ledger',
  axis: 'A contribution ledger makes member work, not club marketing, the proof.',
  render: () => window.prototypeSceneMarkup('concept-ledger', `
    <div class="ledger-heading">
      <h1 class="prototype-title" id="hero-title">The club is what its members commit.</h1>
      ${window.prototypeLedeMarkup('Small contributions compound into useful software, ambitious experiments, and better engineers.')}
    </div>
    <div class="ledger-list">
      <span class="ledger-row"><code>7c2a</code><strong>route planner</strong><small>pathfinding · web</small></span>
      <span class="ledger-row"><code>91bf</code><strong>sensor mesh</strong><small>firmware · hardware</small></span>
      <span class="ledger-row"><code>24de</code><strong>study tool</strong><small>product · data</small></span>
      <span class="ledger-row"><code>a508</code><strong>game engine</strong><small>graphics · systems</small></span>
      <button class="concept-replay-control" type="button" data-replay>Replay ledger <span aria-hidden="true">↻</span></button>
    </div>
    ${window.prototypeActionsMarkup({ modifier: 'ledger-actions', primary: 'Add your first commit', secondary: 'Browse projects' })}
  `)
});
