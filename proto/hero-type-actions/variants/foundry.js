window.heroVariants.push({
  name: 'Foundry',
  axis: 'The restrained anchor: a poster-scale invitation beside a real algorithm at work.',
  render: () => window.prototypeSceneMarkup('concept-foundry', `
    <div class="foundry-type">
      <h1 class="prototype-title" id="hero-title"><span class="foundry-major">Computer</span><span class="foundry-minor">Science Club</span></h1>
      ${window.prototypeLedeMarkup('We write software, wire hardware, and figure out what the computer is actually doing.')}
      ${window.prototypeActionsMarkup({ modifier: 'foundry-actions' })}
    </div>
    ${window.heroGraphMarkup('foundry-graph')}
  `)
})
