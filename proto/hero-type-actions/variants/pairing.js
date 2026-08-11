window.heroVariants.push({
  name: "Pairing",
  axis: "A collaboration map makes the people between disciplines the central visual.",
  render: () => window.prototypeSceneMarkup("concept-pairing", `
    <div class="pairing-copy">
      <h1 class="prototype-title" id="hero-title">Nobody ships alone.</h1>
      ${window.prototypeLedeMarkup("A designer sharpens the engineer. A hardware builder changes what the software can become.")}
      ${window.prototypeActionsMarkup({ modifier: "pairing-actions", primary: "Find a collaborator", secondary: "Meet the officers", secondaryHref: "../../#officers" })}
    </div>
    <div class="pairing-map">
      <svg viewBox="0 0 700 500" aria-hidden="true"><path d="M110 130L350 250L575 104M350 250L590 390M350 250L116 398"/><path d="M110 130L590 390M575 104L116 398"/></svg>
      <span class="pair-node pair-node-a"><b>Web</b><small>interfaces</small></span>
      <span class="pair-node pair-node-b"><b>Systems</b><small>architecture</small></span>
      <span class="pair-node pair-node-c"><b>Hardware</b><small>signals</small></span>
      <span class="pair-node pair-node-d"><b>Design</b><small>clarity</small></span>
      <span class="pair-node pair-node-core"><b>Build team</b><small>one shared problem</small></span>
      <button class="concept-replay-control" type="button" data-replay>Replay connections <span aria-hidden="true">↻</span></button>
    </div>
  `),
});
