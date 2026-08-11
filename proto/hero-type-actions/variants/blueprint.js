window.heroVariants.push({
  name: 'Blueprint',
  axis: 'A pale technical field with restrained type and a single-source traversal.',
  render: () => window.prototypeSceneMarkup('concept-blueprint', `
    <div class="blueprint-copy">
      <h1 class="prototype-title" id="hero-title">See the whole system.</h1>
      <div class="blueprint-support">
        ${window.prototypeLedeMarkup('Trace an idea from first node to final output. We learn computer science by making the system visible—and then changing it.')}
        ${window.prototypeActionsMarkup({ modifier: 'blueprint-actions', primary: 'Join the next build', secondary: 'Explore our work' })}
      </div>
    </div>
    <button class="letter-graph-media blueprint-graph" type="button" data-graph-style="blueprint" data-traversal="left" data-graph-label="BFS / SYSTEM BLUEPRINT" aria-label="Replay a left-to-right breadth-first traversal revealing CS CLUB">
      <canvas class="letter-graph-canvas" aria-hidden="true"></canvas>
    </button>
  `)
})
