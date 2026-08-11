window.heroVariants.push({
  name: 'Constellation',
  axis: "Breadth-first search reveals the club's name inside a fixed dense graph.",
  render: () => window.prototypeSceneMarkup('concept-constellation', `
    <div class="constellation-intro">
      <h1 class="prototype-title" id="hero-title">A path through the noise.</h1>
      <div class="constellation-support">
        ${window.prototypeLedeMarkup('Breadth-first search explores a fixed field one layer at a time. The retained path reveals CS CLUB without moving a single node.')}
        ${window.prototypeActionsMarkup({ modifier: 'constellation-actions', primary: 'Join the club', secondary: 'See member projects' })}
      </div>
    </div>
    <button class="letter-graph-media" type="button" aria-label="Replay breadth-first search across a fixed graph that reveals CS CLUB">
      <canvas class="letter-graph-canvas" aria-hidden="true"></canvas>
    </button>
  `)
})
