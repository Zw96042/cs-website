window.heroVariants.push({
  name: "Offset",
  axis: "A warm editorial composition with the graph leading and search expanding from its center.",
  render: () => window.prototypeSceneMarkup("concept-offset", `
    <button class="letter-graph-media offset-graph" type="button" data-graph-style="offset" data-traversal="center" data-graph-label="BFS / CENTER-OUT" aria-label="Replay a center-out breadth-first traversal revealing CS CLUB">
      <canvas class="letter-graph-canvas" aria-hidden="true"></canvas>
    </button>
    <div class="offset-copy">
      <h1 class="prototype-title" id="hero-title">Code travels further together.</h1>
      ${window.prototypeLedeMarkup("Start anywhere. Follow the strongest route. Share what you learn with the people building beside you.")}
      ${window.prototypeActionsMarkup({ modifier: "offset-actions", primary: "Find a meeting", secondary: "See member projects" })}
    </div>
  `),
});
