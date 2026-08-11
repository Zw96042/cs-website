const letterGraphPatterns = {
  C: ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
};

const letterGraphFieldColumns = 48;
const letterGraphFieldRows = 18;

function createSeededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function createLetterGraphModel() {
  const random = createSeededRandom(8142026);
  const nodes = [];
  const edges = [];
  const edgeKeys = new Set();
  const glyphEdges = [];

  const addEdge = (from, to, kind, letterIndex = -1) => {
    if (from === to) return -1;
    const key = [from, to].sort((left, right) => left - right).join(":");
    if (edgeKeys.has(key)) return -1;
    edgeKeys.add(key);
    const index = edges.length;
    edges.push({ from, to, kind, letterIndex, index, level: 0 });
    return index;
  };

  for (let row = 0; row < letterGraphFieldRows; row += 1) {
    for (let column = 0; column < letterGraphFieldColumns; column += 1) {
      nodes.push({
        kind: "field",
        column,
        row,
        x: 0.025 + (column / (letterGraphFieldColumns - 1)) * 0.95 + (random() - 0.5) * 0.008,
        y: 0.105 + (row / (letterGraphFieldRows - 1)) * 0.73 + (random() - 0.5) * 0.016,
      });
    }
  }

  const fieldIndex = (column, row) => row * letterGraphFieldColumns + column;
  for (let row = 0; row < letterGraphFieldRows; row += 1) {
    for (let column = 0; column < letterGraphFieldColumns; column += 1) {
      const current = fieldIndex(column, row);
      if (column + 1 < letterGraphFieldColumns) addEdge(current, fieldIndex(column + 1, row), "field");
      if (row + 1 < letterGraphFieldRows) addEdge(current, fieldIndex(column, row + 1), "field");
      if (row + 1 < letterGraphFieldRows && column + 1 < letterGraphFieldColumns && (column + row * 2) % 3 === 0) {
        addEdge(current, fieldIndex(column + 1, row + 1), "field");
      }
      if (row + 1 < letterGraphFieldRows && column > 0 && (column * 2 + row) % 5 === 0) {
        addEdge(current, fieldIndex(column - 1, row + 1), "field");
      }
    }
  }

  const phrase = ["C", "S", " ", "C", "L", "U", "B"];
  const glyphOffset = nodes.length;
  let cursor = 0;
  let letterIndex = 0;

  phrase.forEach((character) => {
    if (character === " ") {
      cursor += 2.5;
      return;
    }

    const nodeByCell = new Map();
    letterGraphPatterns[character].forEach((row, gridY) => {
      [...row].forEach((cell, gridX) => {
        if (cell !== "1") return;
        const nodeIndex = nodes.length;
        nodes.push({ kind: "glyph", gridX: cursor + gridX, gridY, letterIndex });
        nodeByCell.set(`${gridX}:${gridY}`, nodeIndex);
      });
    });

    nodeByCell.forEach((nodeIndex, key) => {
      const [gridX, gridY] = key.split(":").map(Number);
      [
        [gridX + 1, gridY],
        [gridX, gridY + 1],
        [gridX - 1, gridY + 1],
        [gridX + 1, gridY + 1],
      ].forEach(([nextX, nextY]) => {
        const next = nodeByCell.get(`${nextX}:${nextY}`);
        if (next === undefined) return;
        const edgeIndex = addEdge(nodeIndex, next, "glyph", letterIndex);
        if (edgeIndex >= 0) glyphEdges.push(edgeIndex);
      });
    });

    cursor += 6;
    letterIndex += 1;
  });

  const totalColumns = cursor - 1;
  nodes.slice(glyphOffset).forEach((node, localIndex) => {
    const normalizedX = 0.06 + (node.gridX / totalColumns) * 0.88;
    const normalizedY = 0.27 + (node.gridY / 6) * 0.46;
    const column = Math.round(((normalizedX - 0.025) / 0.95) * (letterGraphFieldColumns - 1));
    const row = Math.round(((normalizedY - 0.105) / 0.73) * (letterGraphFieldRows - 1));
    addEdge(glyphOffset + localIndex, fieldIndex(clamp(column, 0, letterGraphFieldColumns - 1), clamp(row, 0, letterGraphFieldRows - 1)), "bridge");
  });

  const adjacency = Array.from({ length: nodes.length }, () => []);
  edges.forEach((edge) => {
    adjacency[edge.from].push(edge.index);
    adjacency[edge.to].push(edge.index);
  });

  const createTraversal = (startNodes) => {
    const distances = new Array(nodes.length).fill(Infinity);
    const parentEdges = new Array(nodes.length).fill(-1);
    const queue = [...new Set(startNodes)];
    queue.forEach((nodeIndex) => { distances[nodeIndex] = 0; });

    for (let cursorIndex = 0; cursorIndex < queue.length; cursorIndex += 1) {
      const nodeIndex = queue[cursorIndex];
      adjacency[nodeIndex].forEach((edgeIndex) => {
        const edge = edges[edgeIndex];
        const neighbor = edge.from === nodeIndex ? edge.to : edge.from;
        if (distances[neighbor] !== Infinity) return;
        distances[neighbor] = distances[nodeIndex] + 1;
        parentEdges[neighbor] = edgeIndex;
        queue.push(neighbor);
      });
    }

    return {
      distances,
      levels: edges.map((edge) => Math.max(distances[edge.from], distances[edge.to])),
      parentEdgeSet: new Set(parentEdges.filter((edgeIndex) => edgeIndex >= 0)),
      maxDistance: Math.max(...distances),
      startNodes: queue.slice(0, startNodes.length),
    };
  };

  const middleRow = Math.floor(letterGraphFieldRows / 2);
  const middleColumn = Math.floor(letterGraphFieldColumns / 2);
  const traversals = {
    left: createTraversal([fieldIndex(0, middleRow)]),
    center: createTraversal([fieldIndex(middleColumn, middleRow)]),
    ends: createTraversal([
      fieldIndex(0, middleRow),
      fieldIndex(letterGraphFieldColumns - 1, middleRow),
    ]),
    corners: createTraversal([
      fieldIndex(0, 0),
      fieldIndex(letterGraphFieldColumns - 1, 0),
      fieldIndex(0, letterGraphFieldRows - 1),
      fieldIndex(letterGraphFieldColumns - 1, letterGraphFieldRows - 1),
    ]),
  };

  return {
    nodes,
    edges,
    glyphEdges,
    glyphOffset,
    traversals,
    totalColumns,
  };
}

const letterGraphModel = createLetterGraphModel();
let letterGraphAnimation = 0;
let letterGraphPositionCache = { key: "", positions: [] };

function currentLetterGraphPositions(width, height) {
  const key = `${width}:${height}`;
  if (letterGraphPositionCache.key === key) return letterGraphPositionCache.positions;

  const compact = width < 520;
  const glyphLeft = width * (compact ? 0.03 : 0.06);
  const glyphRight = width * (compact ? 0.97 : 0.94);
  const glyphTop = height * (compact ? 0.35 : 0.27);
  const glyphBottom = height * (compact ? 0.65 : 0.73);
  const positions = letterGraphModel.nodes.map((node) => {
    if (node.kind === "field") return { x: node.x * width, y: node.y * height };
    return {
      x: glyphLeft + (node.gridX / letterGraphModel.totalColumns) * (glyphRight - glyphLeft),
      y: glyphTop + (node.gridY / 6) * (glyphBottom - glyphTop),
    };
  });

  letterGraphPositionCache = { key, positions };
  return positions;
}

function drawEdgeBatch(context, edges, positions, color, alpha, lineWidth) {
  if (!edges.length || alpha <= 0) return;
  context.save();
  context.globalAlpha = alpha;
  context.beginPath();
  edges.forEach((edge) => {
    const from = positions[edge.from];
    const to = positions[edge.to];
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
  });
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.stroke();
  context.restore();
}

function drawLetterGraph(canvas, progress = 1) {
  const { context, width, height, colors } = canvasFrame(canvas);
  const media = canvas.closest(".letter-graph-media");
  const graphStyles = getComputedStyle(media);
  const graphColor = (property, fallback) => graphStyles.getPropertyValue(property).trim() || fallback;
  const graphStyle = media.dataset.graphStyle || "constellation";
  const visualStyles = {
    constellation: { edgeAlpha: 0.18, edgeWidth: 0.62, nodeAlpha: 0.62, nodeRadius: 0.84, glyphWidth: 1.55, frontierWidth: 1.05, pointShape: "circle" },
    blueprint: { edgeAlpha: 0.26, edgeWidth: 0.58, nodeAlpha: 0.7, nodeRadius: 0.7, glyphWidth: 1.45, frontierWidth: 1, pointShape: "circle" },
    meridian: { edgeAlpha: 0.15, edgeWidth: 0.66, nodeAlpha: 0.72, nodeRadius: 0.78, glyphWidth: 1.7, frontierWidth: 1.15, pointShape: "circle" },
    offset: { edgeAlpha: 0.2, edgeWidth: 0.56, nodeAlpha: 0.58, nodeRadius: 0.72, glyphWidth: 1.65, frontierWidth: 1, pointShape: "square" },
    gridline: { edgeAlpha: 0.22, edgeWidth: 0.52, nodeAlpha: 0.76, nodeRadius: 0.68, glyphWidth: 1.4, frontierWidth: 0.95, pointShape: "square" },
  };
  const visuals = visualStyles[graphStyle] || visualStyles.constellation;
  const palette = {
    line: graphColor("--graph-line", colors.line),
    node: graphColor("--graph-node", colors.faint),
    accent: graphColor("--graph-accent", colors.accent),
    label: graphColor("--graph-label", colors.faint),
    muted: graphColor("--graph-muted", colors.muted),
  };
  const traversalModel = letterGraphModel.traversals[media.dataset.traversal || "left"] || letterGraphModel.traversals.left;
  const positions = currentLetterGraphPositions(width, height);
  const traversal = clamp(progress / 0.9);
  const level = traversal * (traversalModel.maxDistance + 1);
  const frontierFade = 1 - easeOutCubic(clamp((progress - 0.86) / 0.14));
  const compact = width < 520;
  const activeTreeEdges = [];
  let visitedCount = 0;
  let queueCount = 0;

  traversalModel.distances.forEach((distance) => {
    if (distance <= level) visitedCount += 1;
    else if (distance <= level + 1.5) queueCount += 1;
  });

  letterGraphModel.edges.forEach((edge) => {
    if (edge.kind === "glyph" || !traversalModel.parentEdgeSet.has(edge.index)) return;
    const age = level - traversalModel.levels[edge.index];
    if (age >= 0 && age <= 2.6) activeTreeEdges.push(edge);
  });

  drawEdgeBatch(context, letterGraphModel.edges, positions, palette.line, compact ? visuals.edgeAlpha * 1.18 : visuals.edgeAlpha, compact ? visuals.edgeWidth * 0.8 : visuals.edgeWidth);
  drawEdgeBatch(context, activeTreeEdges, positions, palette.accent, 0.76 * frontierFade, compact ? visuals.frontierWidth * 0.8 : visuals.frontierWidth);

  letterGraphModel.glyphEdges.forEach((edgeIndex) => {
    const edge = letterGraphModel.edges[edgeIndex];
    const edgeProgress = easeOutCubic(clamp(level - traversalModel.levels[edgeIndex]));
    if (edgeProgress <= 0) return;
    traceLine(context, positions[edge.from], positions[edge.to], edgeProgress, palette.accent, compact ? visuals.glyphWidth * 0.76 : visuals.glyphWidth);
  });

  context.save();
  const nodeRadius = compact ? visuals.nodeRadius * 0.75 : visuals.nodeRadius;
  context.globalAlpha = compact ? Math.min(1, visuals.nodeAlpha * 1.08) : visuals.nodeAlpha;
  context.fillStyle = palette.node;
  if (visuals.pointShape === "square") {
    positions.forEach((position) => {
      context.fillRect(position.x - nodeRadius, position.y - nodeRadius, nodeRadius * 2, nodeRadius * 2);
    });
  } else {
    context.beginPath();
    positions.forEach((position) => {
      context.moveTo(position.x + nodeRadius, position.y);
      context.arc(position.x, position.y, nodeRadius, 0, Math.PI * 2);
    });
    context.fill();
  }
  context.restore();

  letterGraphModel.nodes.forEach((node, nodeIndex) => {
    const distance = traversalModel.distances[nodeIndex];
    if (distance > level) return;
    const position = positions[nodeIndex];
    const frontier = level - distance < 1.7 && frontierFade > 0;
    if (!frontier && node.kind !== "glyph") return;
    context.beginPath();
    context.arc(position.x, position.y, frontier ? (compact ? 1.35 : 1.75) : (compact ? 0.95 : 1.25), 0, Math.PI * 2);
    context.globalAlpha = frontier ? 0.95 * frontierFade : 0.82;
    context.fillStyle = palette.accent;
    context.fill();
  });
  context.globalAlpha = 1;

  traversalModel.startNodes.forEach((nodeIndex, index) => {
    const start = positions[nodeIndex];
    context.beginPath();
    context.arc(start.x, start.y, compact ? 2.6 : 3.4, 0, Math.PI * 2);
    context.fillStyle = palette.accent;
    context.fill();
    if (traversalModel.startNodes.length <= 2) {
      const alignRight = start.x > width * 0.7;
      drawLabel(
        context,
        traversalModel.startNodes.length === 1 ? "START" : `START ${index + 1}`,
        alignRight ? start.x - 7 : Math.max(22, start.x + 7),
        start.y - 8,
        palette.muted,
        { align: alignRight ? "right" : "left", size: compact ? 8 : 9 },
      );
    }
  });

  const graphLabel = media.dataset.graphLabel || "BREADTH-FIRST SEARCH / FIXED GRAPH";
  if (graphLabel !== "none") drawLabel(context, graphLabel, 10, 18, palette.label, { size: 10 });
  const status = traversal >= 1
    ? compact
      ? `${letterGraphModel.nodes.length} nodes / found: CS CLUB / replay`
      : `${letterGraphModel.nodes.length} fixed nodes / path found: CS CLUB / click to replay`
    : `visited ${visitedCount}/${letterGraphModel.nodes.length} / queue ${queueCount}`;
  drawLabel(context, status, width / 2, height - 44, traversal >= 1 ? palette.accent : palette.muted, {
    align: "center",
    size: compact ? 8 : 10,
  });

  canvas._letterGraphProgress = progress;
}

function cancelLetterGraph() {
  cancelAnimationFrame(letterGraphAnimation);
  letterGraphAnimation = 0;
}

function playLetterGraph() {
  const canvas = document.querySelector(".letter-graph-canvas");
  if (!canvas) return;
  cancelLetterGraph();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    drawLetterGraph(canvas, 1);
    return;
  }

  drawLetterGraph(canvas, 0);
  const start = performance.now();
  const duration = 2500;
  const tick = (now) => {
    const progress = clamp((now - start) / duration);
    drawLetterGraph(canvas, progress);
    if (progress < 1) letterGraphAnimation = requestAnimationFrame(tick);
    else letterGraphAnimation = 0;
  };
  letterGraphAnimation = requestAnimationFrame(tick);
}

window.addEventListener("resize", () => {
  letterGraphPositionCache = { key: "", positions: [] };
  const canvas = document.querySelector(".letter-graph-canvas");
  if (canvas) drawLetterGraph(canvas, canvas._letterGraphProgress ?? 1);
});
