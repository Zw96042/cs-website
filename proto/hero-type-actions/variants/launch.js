window.heroVariants.push({
  name: 'Launch',
  axis: 'A process-first typographic sequence makes repetition feel like forward motion.',
  render: () => window.prototypeSceneMarkup('concept-launch', `
    <div class="launch-sequence" aria-labelledby="hero-title">
      <h1 class="prototype-title" id="hero-title"><span>Question.</span><span>Prototype.</span><span>Ship.</span></h1>
      <button class="launch-loop" type="button" data-replay><span aria-hidden="true">↻</span> Repeat with better questions</button>
    </div>
    <div class="launch-support">
      ${window.prototypeLedeMarkup('The goal is not to finish learning. It is to build a practice that keeps getting sharper.')}
      ${window.prototypeActionsMarkup({ modifier: 'launch-actions', primary: 'Enter the loop', secondary: 'See member work' })}
    </div>
  `)
})
