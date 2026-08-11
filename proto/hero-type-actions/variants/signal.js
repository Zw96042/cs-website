window.heroVariants.push({
  name: "Signal",
  axis: "A hardware-first hero where a live signal becomes the visual language.",
  render: () => window.prototypeSceneMarkup("concept-signal", `
    <div class="signal-copy">
      <h1 class="prototype-title" id="hero-title">Software is only half the story.</h1>
      ${window.prototypeLedeMarkup("Write the code, wire the sensor, and see your idea leave the screen.")}
      ${window.prototypeActionsMarkup({ modifier: "signal-actions", primary: "Explore hardware", secondary: "Join a build night", secondaryHref: "../../#join" })}
    </div>
    <div class="signal-field">
      <svg viewBox="0 0 720 480" aria-hidden="true">
        <path class="signal-trace signal-trace-faint" d="M40 238H170L228 134H360L416 322H548L680 176" />
        <path class="signal-trace signal-trace-live" d="M40 238H170L228 134H360L416 322H548L680 176" />
        <g class="signal-points"><circle cx="40" cy="238" r="7"/><circle cx="170" cy="238" r="7"/><circle cx="228" cy="134" r="7"/><circle cx="360" cy="134" r="7"/><circle cx="416" cy="322" r="7"/><circle cx="548" cy="322" r="7"/><circle cx="680" cy="176" r="7"/></g>
        <text x="40" y="278">INPUT</text><text x="328" y="104">LOGIC</text><text x="620" y="214">OUTPUT</text>
      </svg>
      <button class="concept-replay-control" type="button" data-replay>Replay signal <span aria-hidden="true">↻</span></button>
    </div>
  `),
});
