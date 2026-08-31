import { graphEdges, graphNodes, sortValues } from './src/lib/visualData.js';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const prefersLightMode = window.matchMedia('(prefers-color-scheme: light)');

function clamp (value, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function easeOutCubic (value) {
  return 1 - Math.pow(1 - value, 3);
}

function cubicBezierProgress (value, x1, y1, x2, y2) {
  const sample = (time, first, second) =>
    3 * Math.pow(1 - time, 2) * time * first +
    3 * (1 - time) * time * time * second +
    time * time * time;
  const slope = (time, first, second) =>
    3 * Math.pow(1 - time, 2) * first +
    6 * (1 - time) * time * (second - first) +
    3 * time * time * (1 - second);
  let time = clamp(value);

  for (let iteration = 0; iteration < 5; iteration += 1) {
    const currentSlope = slope(time, x1, x2);
    if (Math.abs(currentSlope) < 0.000001) break;
    time = clamp(time - (sample(time, x1, x2) - value) / currentSlope);
  }
  return sample(time, y1, y2);
}

function easeInOutMotion (value) {
  return cubicBezierProgress(value, 0.77, 0, 0.175, 1);
}

function easeInOutSine (value) {
  return -(Math.cos(Math.PI * value) - 1) / 2;
}

function svgFrame (svg) {
  const rect = svg.getBoundingClientRect();
  const width = Math.max(1, rect.width);
  const height = Math.max(1, rect.height);
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  return { width, height };
}

function setAttributes (element, attributes) {
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, String(value)));
}

function setBooleanAttribute (element, name, enabled) {
  if (enabled && !element.hasAttribute(name)) element.setAttribute(name, 'true');
  if (!enabled && element.hasAttribute(name)) element.removeAttribute(name);
}

function setLine (line, from, to, progress = 1) {
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  const amount = easeOutCubic(clamp(progress));
  setAttributes(line, {
    x1: from.x,
    y1: from.y,
    x2: to.x,
    y2: to.y,
    'stroke-dasharray': length,
    'stroke-dashoffset': length * (1 - amount),
    opacity: amount > 0 ? 1 : 0
  });
}

const graph = {
  source: 'A',
  target: 'G',
  nodes: graphNodes,
  edges: graphEdges
};

function edgeKey (from, to) {
  return [from, to].sort().join(':');
}

function solveDijkstra (weightedGraph) {
  const distances = Object.fromEntries(weightedGraph.nodes.map(({ id }) => [id, Number.POSITIVE_INFINITY]));
  const previous = Object.fromEntries(weightedGraph.nodes.map(({ id }) => [id, null]));
  const settled = new Set();
  const steps = [];
  distances[weightedGraph.source] = 0;

  while (settled.size < weightedGraph.nodes.length) {
    const current = weightedGraph.nodes
      .map(({ id }) => id)
      .filter((id) => !settled.has(id))
      .sort((left, right) => distances[left] - distances[right])[0];
    if (!current || !Number.isFinite(distances[current])) break;

    settled.add(current);
    const updates = [];
    weightedGraph.edges.forEach((edge) => {
      const neighbor = edge.from === current ? edge.to : edge.to === current ? edge.from : null;
      if (!neighbor || settled.has(neighbor)) return;
      const candidate = distances[current] + edge.weight;
      if (candidate >= distances[neighbor]) return;
      distances[neighbor] = candidate;
      previous[neighbor] = current;
      updates.push({ from: current, to: neighbor });
    });

    steps.push({
      current,
      settled: [...settled],
      distances: { ...distances },
      previous: { ...previous },
      updates
    });
    if (current === weightedGraph.target) break;
  }

  const path = [];
  let cursor = weightedGraph.target;
  while (cursor) {
    path.unshift(cursor);
    if (cursor === weightedGraph.source) break;
    cursor = previous[cursor];
  }

  return { steps, path, distance: distances[weightedGraph.target] };
}

const solution = solveDijkstra(graph);

function positionEdgeWeight (label, edge, positions, alpha) {
  const from = positions.get(edge.from);
  const to = positions.get(edge.to);
  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;
  const length = Math.hypot(deltaX, deltaY) || 1;
  const offset = edge.from === 'B' && edge.to === 'C' ? 15 : 12;
  const x = (from.x + to.x) / 2 - (deltaY / length) * offset;
  const y = (from.y + to.y) / 2 + (deltaX / length) * offset;

  setAttributes(label, { x, y, opacity: alpha });
  label.textContent = String(edge.weight);
}

function drawDijkstra (svg, progress = 1) {
  const { width, height } = svgFrame(svg);
  const revealProgress = clamp(progress / 0.12);
  const solveProgress = clamp((progress - 0.12) / 0.46);
  const reconstructProgress = clamp((progress - 0.58) / 0.34);
  const positions = new Map(
    graph.nodes.map((node) => [node.id, { x: width * node.x, y: height * 0.88 * node.y }])
  );
  const scaledStep = solveProgress * solution.steps.length;
  const stepIndex = Math.min(solution.steps.length - 1, Math.floor(scaledStep));
  const snapshot = solveProgress > 0 ? solution.steps[stepIndex] : { current: null, settled: [], previous: {} };
  const treeEdges = new Set(
    Object.entries(snapshot.previous || {})
      .filter(([, previous]) => previous)
      .map(([node, previous]) => edgeKey(node, previous))
  );
  const reversePath = [...solution.path].reverse();
  let pathLength = 0;
  const segmentEnds = reversePath.slice(0, -1).map((node, index) => {
    const from = positions.get(node);
    const to = positions.get(reversePath[index + 1]);
    pathLength += Math.hypot(to.x - from.x, to.y - from.y);
    return pathLength;
  });
  const traveledDistance = pathLength * easeInOutSine(reconstructProgress);
  const completeSegments = segmentEnds.filter((end) => traveledDistance >= end).length;

  const kicker = svg.querySelector('[data-graph-kicker]');
  setAttributes(kicker, { x: width / 2, y: 18, opacity: revealProgress });

  graph.edges.forEach((edge, index) => {
    const group = svg.querySelector(`[data-graph-edge="${index}"]`);
    const from = positions.get(edge.from);
    const to = positions.get(edge.to);
    setLine(group.querySelector('[data-edge-base]'), from, to, revealProgress);
    setLine(group.querySelector('[data-edge-tree]'), from, to, treeEdges.has(edgeKey(edge.from, edge.to)) ? 1 : 0);
    positionEdgeWeight(svg.querySelector(`[data-edge-weight="${index}"]`), edge, positions, revealProgress * 0.8);
  });

  const solutionPath = svg.querySelector('[data-graph-path]');
  const pathData = reversePath
    .map((node, index) => {
      const position = positions.get(node);
      return `${index === 0 ? 'M' : 'L'} ${position.x} ${position.y}`;
    })
    .join(' ');
  setAttributes(solutionPath, {
    d: pathData,
    'stroke-dasharray': pathLength,
    'stroke-dashoffset': pathLength - traveledDistance,
    opacity: traveledDistance > 0 ? 1 : 0
  });

  const pathHead = svg.querySelector('[data-graph-path-head]');
  if (reconstructProgress > 0 && reconstructProgress < 1) {
    const point = solutionPath.getPointAtLength(traveledDistance);
    setAttributes(pathHead, {
      transform: `translate(${point.x} ${point.y})`,
      opacity: 1
    });
  } else {
    const restingPosition = reconstructProgress >= 1
      ? positions.get(reversePath[reversePath.length - 1])
      : positions.get(reversePath[0]);
    setAttributes(pathHead, {
      transform: `translate(${restingPosition.x} ${restingPosition.y})`,
      opacity: 0
    });
  }

  const visitedReverse = new Set(
    reversePath.slice(0, Math.min(reversePath.length, completeSegments + 1))
  );
  graph.nodes.forEach((node) => {
    const group = svg.querySelector(`[data-graph-node="${node.id}"]`);
    const position = positions.get(node.id);
    const scale = easeOutCubic(revealProgress);
    const current = reconstructProgress > 0 &&
      reversePath[Math.min(completeSegments, reversePath.length - 1)] === node.id;
    setAttributes(group, { transform: `translate(${position.x} ${position.y}) scale(${scale})` });
    group.querySelector('circle').setAttribute('r', String(Math.min(23, Math.max(16, width * 0.043))));
    setBooleanAttribute(group, 'data-current', current);
    setBooleanAttribute(group, 'data-settled', snapshot.settled.includes(node.id));
    setBooleanAttribute(group, 'data-path', visitedReverse.has(node.id));
  });

  const visibleNodes = reconstructProgress > 0
    ? Math.min(reversePath.length, completeSegments + 1)
    : 0;
  const routeText = reversePath.slice(0, visibleNodes).join(' ← ');
  let status = '';
  if (reconstructProgress > 0) status = routeText;
  const statusLabel = svg.querySelector('[data-graph-status]');
  setAttributes(statusLabel, { x: width / 2, y: height - 8, opacity: revealProgress });
  setBooleanAttribute(statusLabel, 'data-path-active', reconstructProgress > 0);
  statusLabel.style.fontSize = `${width < 420 ? 9 : 10}px`;
  statusLabel.textContent = status;

  svg._graphProgress = progress;
}

let graphAnimation = 0;

function markGraphSeen () {
  try {
    sessionStorage.setItem('cs-club-dijkstra-seen', 'seen');
  } catch {
    // The animation still works when storage is unavailable.
  }
}

function playGraph ({ includeReveal = false } = {}) {
  const svg = document.querySelector('.hero-visual');
  if (!svg) return;
  cancelAnimationFrame(graphAnimation);

  if (prefersReducedMotion.matches) {
    drawDijkstra(svg, 1);
    markGraphSeen();
    return;
  }

  const startProgress = includeReveal ? 0 : 0.12;
  drawDijkstra(svg, startProgress);
  const start = performance.now();
  const duration = includeReveal ? 2500 : 2200;
  const tick = (now) => {
    const elapsedProgress = clamp((now - start) / duration);
    const progress = startProgress + elapsedProgress * (1 - startProgress);
    drawDijkstra(svg, progress);
    if (progress < 1) graphAnimation = requestAnimationFrame(tick);
    else {
      graphAnimation = 0;
      markGraphSeen();
    }
  };
  graphAnimation = requestAnimationFrame(tick);
}

function initializeGraph () {
  const trigger = document.querySelector('.hero-media');
  const svg = document.querySelector('.hero-visual');
  if (!trigger || !svg) return () => {};

  const replayGraph = () => playGraph({ includeReveal: false });
  trigger.addEventListener('click', replayGraph);
  let hasSeenGraph = false;
  try {
    hasSeenGraph = sessionStorage.getItem('cs-club-dijkstra-seen') === 'seen';
  } catch {
    hasSeenGraph = false;
  }

  if (hasSeenGraph || prefersReducedMotion.matches) drawDijkstra(svg, 1);
  else playGraph({ includeReveal: true });

  return () => {
    trigger.removeEventListener('click', replayGraph);
    cancelAnimationFrame(graphAnimation);
    graphAnimation = 0;
  };
}

function insertionFrames (values) {
  const working = values.map((value, id) => ({ id, value }));
  const frames = [
    {
      items: working.map((item) => ({ ...item })),
      activeId: null,
      sortedThrough: 0,
      status: 'Ready / first value is sorted'
    }
  ];

  for (let index = 1; index < working.length; index += 1) {
    const key = working[index];
    let insertionIndex = index;
    while (insertionIndex > 0 && working[insertionIndex - 1].value > key.value) insertionIndex -= 1;
    working.splice(index, 1);
    working.splice(insertionIndex, 0, key);
    frames.push({
      items: working.map((item) => ({ ...item })),
      activeId: key.id,
      sortedThrough: index,
      status: `Pass ${index} / move ${key.value} to slot ${insertionIndex + 1}`
    });
  }
  return frames;
}

const sortFrames = insertionFrames(sortValues);
const completeSortStatus = 'Complete / 8 values sorted';
let sortObserver = null;
let sortAnimation = 0;

function sortVisualMetrics (state = {}) {
  const items = state.items || sortFrames[0].items;
  const previousItems = state.previousItems || items;
  const transition = easeInOutMotion(state.transition ?? 1);
  const previousPositions = state.fromPositions instanceof Map
    ? state.fromPositions
    : new Map(previousItems.map((item, index) => [item.id, index]));
  const positions = new Map(
    items.map((item, index) => {
      const previousIndex = previousPositions.get(item.id) ?? index;
      return [item.id, previousIndex + (index - previousIndex) * transition];
    })
  );
  const targetSortedUnits = (state.activeId ?? null) === null
    ? (state.sortedThrough ?? 0) + 1
    : (state.sortedThrough ?? 0) + transition;
  const previousSortedUnits = state.fromSortedUnits ?? targetSortedUnits;

  return {
    positions,
    sortedUnits: previousSortedUnits + (targetSortedUnits - previousSortedUnits) * transition
  };
}

function drawSortVisual (svg, state = {}) {
  const { width, height } = svgFrame(svg);
  const items = state.items || sortFrames[0].items;
  const transition = easeInOutMotion(state.transition ?? 1);
  const activeId = state.activeId ?? null;
  const sidePadding = Math.min(34, width * 0.055);
  const topPadding = 28;
  const bottomPadding = 42;
  const availableWidth = width - sidePadding * 2;
  const gap = Math.max(5, availableWidth * 0.018);
  const barWidth = (availableWidth - gap * (items.length - 1)) / items.length;
  const chartHeight = height - topPadding - bottomPadding;
  const maximum = Math.max(...sortValues);
  const baseline = topPadding + chartHeight;
  const { positions, sortedUnits } = sortVisualMetrics(state);
  const sortedItems = activeId === null
    ? items.slice(0, (state.sortedThrough ?? 0) + 1)
    : (state.previousItems || items).slice(0, state.sortedThrough ?? 0);
  const sortedIds = new Set(sortedItems.map(({ id }) => id));

  setAttributes(svg.querySelector('[data-sort-baseline]'), {
    x1: sidePadding,
    y1: baseline + 0.5,
    x2: width - sidePadding,
    y2: baseline + 0.5
  });

  const sortedWidth = sortedUnits * barWidth + Math.max(0, sortedUnits - 1) * gap;
  setAttributes(svg.querySelector('[data-sort-progress]'), {
    x1: sidePadding,
    y1: baseline + 8.5,
    x2: sidePadding + sortedWidth,
    y2: baseline + 8.5
  });

  items.forEach((item) => {
    const index = items.findIndex(({ id }) => id === item.id);
    const position = positions.get(item.id) ?? index;
    const previousIndex = (state.previousItems || items).findIndex(({ id }) => id === item.id);
    const pickedUp = item.id === activeId && previousIndex !== index;
    const pickupProgress = pickedUp ? Math.sin(Math.PI * transition) : 0;
    const lift = pickupProgress * Math.min(22, height * 0.06);
    const barHeight = (item.value / maximum) * chartHeight;
    const x = sidePadding + position * (barWidth + gap);
    const y = baseline - barHeight - lift;
    const sorted = sortedIds.has(item.id);
    const active = item.id === activeId;
    const widthScale = 1 - pickupProgress * 0.24;
    const group = svg.querySelector(`[data-sort-item="${item.id}"]`);
    const rect = group.querySelector('rect');
    const label = group.querySelector('text');
    const restingLabelY = height - 17 - y;

    setAttributes(group, { transform: `translate(${x} ${y})` });
    setAttributes(rect, {
      x: 0,
      y: 0,
      width: barWidth,
      height: barHeight,
      transform: `translate(${barWidth / 2} 0) scale(${widthScale} 1) translate(${-barWidth / 2} 0)`
    });
    setAttributes(label, {
      x: barWidth / 2,
      y: restingLabelY
    });
    setBooleanAttribute(group, 'data-active', active);
    setBooleanAttribute(group, 'data-sorted', sorted);
  });
  svg._sortState = state;
}

function initializeSortLab () {
  const lab = document.querySelector('[data-sort-lab]');
  if (!lab) return () => {};
  const trigger = lab.querySelector('.sort-trigger');
  const svg = lab.querySelector('.sort-visual');
  const status = lab.querySelector('.logic-lab-status');
  const initialFrame = sortFrames[0];
  drawSortVisual(svg, { ...initialFrame, previousItems: initialFrame.items, transition: 1 });

  const runSort = ({ reset = true } = {}) => {
    const currentMetrics = sortVisualMetrics(svg._sortState || initialFrame);
    cancelAnimationFrame(sortAnimation);
    sortAnimation = 0;
    sortObserver?.disconnect();
    sortObserver = null;
    lab.setAttribute('aria-busy', 'true');
    status.textContent = reset ? 'Resetting / returning to start' : initialFrame.status;

    if (prefersReducedMotion.matches) {
      const finalFrame = sortFrames[sortFrames.length - 1];
      drawSortVisual(svg, { ...finalFrame, activeId: null, previousItems: finalFrame.items, transition: 1 });
      status.textContent = completeSortStatus;
      lab.removeAttribute('aria-busy');
      return;
    }

    const resetDuration = reset ? 280 : 0;
    const resetPause = reset ? 90 : 0;
    const durationPerFrame = 490;
    const segmentCount = sortFrames.length - 1;
    const totalDuration = segmentCount * durationPerFrame;
    let start = null;
    let lastSegment = -1;
    let sortStarted = false;

    const tick = (now) => {
      if (start === null) start = now;
      const elapsed = now - start;

      if (elapsed < resetDuration) {
        drawSortVisual(svg, {
          ...initialFrame,
          fromPositions: currentMetrics.positions,
          fromSortedUnits: currentMetrics.sortedUnits,
          transition: elapsed / resetDuration
        });
        sortAnimation = requestAnimationFrame(tick);
        return;
      }

      if (!sortStarted) {
        drawSortVisual(svg, { ...initialFrame, previousItems: initialFrame.items, transition: 1 });
        status.textContent = initialFrame.status;
        sortStarted = true;
      }

      if (elapsed < resetDuration + resetPause) {
        sortAnimation = requestAnimationFrame(tick);
        return;
      }

      const sortElapsed = elapsed - resetDuration - resetPause;
      const segment = Math.min(segmentCount - 1, Math.floor(sortElapsed / durationPerFrame));
      const previousFrame = sortFrames[segment];
      const currentFrame = sortFrames[segment + 1];
      const transition = clamp((sortElapsed - segment * durationPerFrame) / durationPerFrame);

      drawSortVisual(svg, { ...currentFrame, previousItems: previousFrame.items, transition });
      if (segment !== lastSegment) {
        status.textContent = currentFrame.status;
        lastSegment = segment;
      }

      if (sortElapsed < totalDuration) {
        sortAnimation = requestAnimationFrame(tick);
        return;
      }

      drawSortVisual(svg, { ...currentFrame, activeId: null, previousItems: currentFrame.items, transition: 1 });
      status.textContent = completeSortStatus;
      lab.removeAttribute('aria-busy');
      sortAnimation = 0;
    };

    sortAnimation = requestAnimationFrame(tick);
  };

  const replaySort = () => runSort({ reset: true });
  trigger.addEventListener('click', replaySort);
  if ('IntersectionObserver' in window) {
    sortObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.25)) runSort({ reset: false });
      },
      { threshold: [0.25], rootMargin: '0px 0px -10%' }
    );
    sortObserver.observe(lab);
  } else {
    sortAnimation = requestAnimationFrame(() => runSort({ reset: false }));
  }

  return () => {
    trigger.removeEventListener('click', replaySort);
    sortObserver?.disconnect();
    sortObserver = null;
    cancelAnimationFrame(sortAnimation);
    sortAnimation = 0;
    lab.removeAttribute('aria-busy');
  };
}

function redrawVisuals () {
  const graphVisual = document.querySelector('.hero-visual');
  if (graphVisual) drawDijkstra(graphVisual, graphVisual._graphProgress ?? 1);
  const sortVisual = document.querySelector('.sort-visual');
  if (sortVisual) drawSortVisual(sortVisual, sortVisual._sortState);
}

function initializeAnimations () {
  let disposed = false;
  let resizeFrame = 0;
  const handleResize = () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(redrawVisuals);
  };
  const handleThemeChange = () => requestAnimationFrame(redrawVisuals);

  window.addEventListener('resize', handleResize);
  prefersLightMode.addEventListener('change', handleThemeChange);
  document.fonts.ready.then(() => {
    if (!disposed) redrawVisuals();
  });

  const cleanupGraph = initializeGraph();
  const cleanupSort = initializeSortLab();

  return () => {
    disposed = true;
    cleanupGraph();
    cleanupSort();
    window.removeEventListener('resize', handleResize);
    prefersLightMode.removeEventListener('change', handleThemeChange);
    cancelAnimationFrame(resizeFrame);
  };
}

window.initializeAnimations = initializeAnimations;
