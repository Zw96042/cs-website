window.heroVariants.push({
  name: "Meridian",
  axis: "A deep navy split composition with two traversals meeting in the middle.",
  render: () => window.prototypeSceneMarkup("concept-meridian", `
    <div class="meridian-copy">
      <h1 class="prototype-title" id="hero-title">Meet in the middle.</h1>
      ${window.prototypeLedeMarkup("Two search fronts. One shared result. Work alongside people who turn difficult problems into things you can see and use.")}
      ${window.prototypeActionsMarkup({ modifier: "meridian-actions", primary: "Build with us", secondary: "Meet the officers", secondaryHref: "../../#officers" })}
    </div>
    <button class="letter-graph-media meridian-graph" type="button" data-graph-style="meridian" data-traversal="ends" data-graph-label="BIDIRECTIONAL BFS / TWO SOURCES" aria-label="Replay two breadth-first traversals meeting to reveal CS CLUB">
      <canvas class="letter-graph-canvas" aria-hidden="true"></canvas>
    </button>
  `),
});
