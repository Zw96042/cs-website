window.heroVariants.push({
  name: "Gridline",
  axis: "A graphite data field with four-corner traversal and a bottom-anchored typographic lockup.",
  render: () => window.prototypeSceneMarkup("concept-gridline", `
    <button class="letter-graph-media gridline-graph" type="button" data-graph-style="gridline" data-traversal="corners" data-graph-label="MULTI-SOURCE BFS / FOUR CORNERS" aria-label="Replay four breadth-first traversals converging to reveal CS CLUB">
      <canvas class="letter-graph-canvas" aria-hidden="true"></canvas>
    </button>
    <div class="gridline-copy">
      <h1 class="prototype-title" id="hero-title">Build something real.</h1>
      <div class="gridline-support">
        ${window.prototypeLedeMarkup("Algorithms, interfaces, hardware, and whatever comes next. Bring your curiosity; leave with something that works.")}
        ${window.prototypeActionsMarkup({ modifier: "gridline-actions", primary: "Start building", secondary: "How the club works", secondaryHref: "../../#about" })}
      </div>
    </div>
  `),
});
