window.heroVariants.push({
  name: 'Semester',
  axis: 'The hero is a semester plan rather than a slogan, making momentum the message.',
  render: () => window.prototypeSceneMarkup('concept-semester', `
    <div class="semester-intro">
      <h1 class="prototype-title" id="hero-title">Fourteen weeks. One thing worth shipping.</h1>
      ${window.prototypeLedeMarkup('Start wherever you are. By demo night, you will have something real to show.')}
    </div>
    <div class="semester-track">
      <span class="semester-progress" aria-hidden="true"></span>
      <span class="semester-stop"><b>01</b><strong>Explore</strong><small>Choose a problem</small></span>
      <span class="semester-stop"><b>05</b><strong>Prototype</strong><small>Make the first version</small></span>
      <span class="semester-stop"><b>09</b><strong>Test</strong><small>Learn from real use</small></span>
      <span class="semester-stop"><b>14</b><strong>Demo</strong><small>Show what changed</small></span>
      <button class="concept-replay-control" type="button" data-replay>Replay timeline <span aria-hidden="true">↻</span></button>
    </div>
    ${window.prototypeActionsMarkup({ modifier: 'semester-actions', primary: 'Start this semester', secondary: 'How meetings work', secondaryHref: '../../#about' })}
  `)
})
