window.heroVariants.push({
  name: "Compiler",
  axis: "An idea is treated as source material and compiled into a working project.",
  render: () => window.prototypeSceneMarkup("concept-compiler", `
    <div class="compiler-copy">
      <h1 class="prototype-title" id="hero-title">Turn an idea into something that runs.</h1>
      ${window.prototypeActionsMarkup({ modifier: "compiler-actions", primary: "Bring an idea", secondary: "See the process", secondaryHref: "../../#about" })}
    </div>
    <div class="compiler-program">
      <span class="compiler-line compiler-line-1"><b>idea</b>(<i>"make school easier"</i>)</span>
      <span class="compiler-line compiler-line-2">question → sketch → prototype</span>
      <span class="compiler-line compiler-line-3"><b>build</b>.with(people_who_care)</span>
      <span class="compiler-result">project.status = <strong>"shipped"</strong></span>
      <button class="concept-replay-control" type="button" data-replay>Replay compile <span aria-hidden="true">↻</span></button>
    </div>
  `),
});
