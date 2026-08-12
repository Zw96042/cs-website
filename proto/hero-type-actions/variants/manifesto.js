window.heroVariants.push({
  name: 'Manifesto',
  axis: 'A nearly text-only hero trusts a precise point of view instead of a centerpiece visual.',
  render: () => window.prototypeSceneMarkup('concept-manifesto', `
    <div class="manifesto-statement">
      <h1 class="prototype-title" id="hero-title"><span>Curiosity is enough to start.</span><span>Consistency turns it into craft.</span></h1>
      <p>Westlake Computer Science Club is a place to think rigorously, make useful things, and become the kind of person who can finish what they begin.</p>
    </div>
    <div class="manifesto-invitation">
      <span class="manifesto-rule" aria-hidden="true"></span>
      ${window.prototypeActionsMarkup({ modifier: 'manifesto-actions', primary: 'Come as you are', secondary: 'Leave with something real' })}
    </div>
  `)
});
