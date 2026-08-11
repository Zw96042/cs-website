window.heroVariants.push({
  name: "Pathfinder",
  axis: "A full-width algorithm lesson where the working graph is the hero.",
  render: () => window.prototypeSceneMarkup("concept-pathfinder", `
    <div class="pathfinder-intro">
      <h1 class="prototype-title" id="hero-title">Learn the idea. Then watch it move.</h1>
      ${window.prototypeLedeMarkup("We study fundamentals by turning them into systems you can see, question, and rebuild.")}
    </div>
    ${window.heroGraphMarkup("pathfinder-graph")}
    ${window.prototypeActionsMarkup({ modifier: "pathfinder-actions", primary: "Join the next lesson", secondary: "See member projects" })}
  `),
});
