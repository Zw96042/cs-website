const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const prefersLightMode = window.matchMedia('(prefers-color-scheme: light)')

function clamp (value, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value))
}

function easeOutCubic (value) {
  return 1 - Math.pow(1 - value, 3)
}

function cubicBezierProgress (value, x1, y1, x2, y2) {
  const sample = (time, first, second) =>
    3 * Math.pow(1 - time, 2) * time * first +
    3 * (1 - time) * time * time * second +
    time * time * time
  const slope = (time, first, second) =>
    3 * Math.pow(1 - time, 2) * first +
    6 * (1 - time) * time * (second - first) +
    3 * time * time * (1 - second)
  let time = clamp(value)

  for (let iteration = 0; iteration < 5; iteration += 1) {
    const currentSlope = slope(time, x1, x2)
    if (Math.abs(currentSlope) < 0.000001) break
    time = clamp(time - (sample(time, x1, x2) - value) / currentSlope)
  }
  return sample(time, y1, y2)
}

function easeInOutMotion (value) {
  return cubicBezierProgress(value, 0.77, 0, 0.175, 1)
}

function canvasFrame (canvas) {
  const rect = canvas.getBoundingClientRect()
  const width = Math.max(1, rect.width)
  const height = Math.max(1, rect.height)
  const ratio = Math.min(window.devicePixelRatio || 1, 2)
  const pixelWidth = Math.round(width * ratio)
  const pixelHeight = Math.round(height * ratio)

  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth
    canvas.height = pixelHeight
  }

  const context = canvas.getContext('2d')
  context.setTransform(ratio, 0, 0, ratio, 0, 0)
  context.clearRect(0, 0, width, height)
  context.lineCap = 'round'
  context.lineJoin = 'round'

  const pageStyles = getComputedStyle(canvas.closest('.site-page'))
  return {
    context,
    width,
    height,
    colors: {
      background: pageStyles.getPropertyValue('--bg').trim(),
      surface: pageStyles.getPropertyValue('--surface').trim(),
      ink: pageStyles.getPropertyValue('--ink').trim(),
      muted: pageStyles.getPropertyValue('--muted').trim(),
      faint: pageStyles.getPropertyValue('--faint').trim(),
      line: pageStyles.getPropertyValue('--line').trim(),
      accent: pageStyles.getPropertyValue('--accent').trim()
    }
  }
}

function traceLine (context, from, to, progress, color, width = 1) {
  const amount = easeOutCubic(clamp(progress))
  context.beginPath()
  context.moveTo(from.x, from.y)
  context.lineTo(from.x + (to.x - from.x) * amount, from.y + (to.y - from.y) * amount)
  context.strokeStyle = color
  context.lineWidth = width
  context.stroke()
}

function drawLabel (context, text, x, y, color, options = {}) {
  context.save()
  context.globalAlpha = options.alpha ?? 1
  context.fillStyle = color
  context.font = `${options.weight || 480} ${options.size || 11}px "Geist Mono", monospace`
  context.textAlign = options.align || 'left'
  context.textBaseline = options.baseline || 'alphabetic'
  context.fillText(text, x, y)
  context.restore()
}

const graph = {
  source: 'A',
  target: 'G',
  nodes: [
    { id: 'A', x: 0.11, y: 0.5 },
    { id: 'B', x: 0.31, y: 0.2 },
    { id: 'C', x: 0.3, y: 0.75 },
    { id: 'D', x: 0.53, y: 0.37 },
    { id: 'E', x: 0.55, y: 0.78 },
    { id: 'F', x: 0.77, y: 0.58 },
    { id: 'G', x: 0.89, y: 0.23 }
  ],
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'D', weight: 8 },
    { from: 'C', to: 'E', weight: 10 },
    { from: 'D', to: 'E', weight: 2 },
    { from: 'D', to: 'F', weight: 6 },
    { from: 'E', to: 'F', weight: 3 },
    { from: 'F', to: 'G', weight: 1 }
  ]
}

function edgeKey (from, to) {
  return [from, to].sort().join(':')
}

function solveDijkstra (weightedGraph) {
  const distances = Object.fromEntries(weightedGraph.nodes.map(({ id }) => [id, Number.POSITIVE_INFINITY]))
  const previous = Object.fromEntries(weightedGraph.nodes.map(({ id }) => [id, null]))
  const settled = new Set()
  const steps = []
  distances[weightedGraph.source] = 0

  while (settled.size < weightedGraph.nodes.length) {
    const current = weightedGraph.nodes
      .map(({ id }) => id)
      .filter((id) => !settled.has(id))
      .sort((left, right) => distances[left] - distances[right])[0]
    if (!current || !Number.isFinite(distances[current])) break

    settled.add(current)
    const updates = []
    weightedGraph.edges.forEach((edge) => {
      const neighbor = edge.from === current ? edge.to : edge.to === current ? edge.from : null
      if (!neighbor || settled.has(neighbor)) return
      const candidate = distances[current] + edge.weight
      if (candidate >= distances[neighbor]) return
      distances[neighbor] = candidate
      previous[neighbor] = current
      updates.push({ from: current, to: neighbor })
    })

    steps.push({
      current,
      settled: [...settled],
      distances: { ...distances },
      previous: { ...previous },
      updates
    })
    if (current === weightedGraph.target) break
  }

  const path = []
  let cursor = weightedGraph.target
  while (cursor) {
    path.unshift(cursor)
    if (cursor === weightedGraph.source) break
    cursor = previous[cursor]
  }

  return { steps, path, distance: distances[weightedGraph.target] }
}

const solution = solveDijkstra(graph)

function drawEdgeWeight (context, edge, positions, colors, alpha) {
  const from = positions.get(edge.from)
  const to = positions.get(edge.to)
  const deltaX = to.x - from.x
  const deltaY = to.y - from.y
  const length = Math.hypot(deltaX, deltaY) || 1
  const offset = edge.from === 'B' && edge.to === 'C' ? 11 : 8
  const x = (from.x + to.x) / 2 - (deltaY / length) * offset
  const y = (from.y + to.y) / 2 + (deltaX / length) * offset
  const text = String(edge.weight)

  context.save()
  context.globalAlpha = alpha
  context.font = '480 9px "Geist Mono", monospace'
  const width = context.measureText(text).width + 8
  context.fillStyle = colors.background
  context.fillRect(x - width / 2, y - 7, width, 14)
  context.fillStyle = colors.faint
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(text, x, y)
  context.restore()
}

function drawDijkstraNode (context, position, id, colors, options = {}) {
  const radius = options.radius || 22
  const scale = easeOutCubic(clamp(options.reveal ?? 1))
  if (scale <= 0) return

  context.save()
  context.translate(position.x, position.y)
  context.scale(scale, scale)
  context.beginPath()
  context.arc(0, 0, radius, 0, Math.PI * 2)
  context.fillStyle = options.current ? colors.accent : options.settled ? colors.surface : colors.background
  context.fill()
  context.strokeStyle = options.path ? colors.accent : options.settled ? colors.ink : colors.muted
  context.lineWidth = options.current || options.path ? 2 : 1
  context.stroke()
  context.fillStyle = options.current ? colors.background : colors.ink
  context.font = `${options.fontSize || 10}px "Geist Mono", monospace`
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(id, 0, 0)
  context.restore()
}

function drawDijkstra (canvas, progress = 1) {
  const { context, width, height, colors } = canvasFrame(canvas)
  const revealProgress = clamp(progress / 0.12)
  const solveProgress = clamp((progress - 0.12) / 0.46)
  const reconstructProgress = clamp((progress - 0.58) / 0.34)
  const positions = new Map(
    graph.nodes.map((node) => [node.id, { x: width * node.x, y: height * 0.88 * node.y }])
  )
  const scaledStep = solveProgress * solution.steps.length
  const stepIndex = Math.min(solution.steps.length - 1, Math.floor(scaledStep))
  const snapshot = solveProgress > 0 ? solution.steps[stepIndex] : { current: null, settled: [], previous: {} }
  const treeEdges = new Set(
    Object.entries(snapshot.previous || {})
      .filter(([, previous]) => previous)
      .map(([node, previous]) => edgeKey(node, previous))
  )
  const reversePath = [...solution.path].reverse()
  const segmentProgress = reconstructProgress * (reversePath.length - 1)
  const completeSegments = Math.floor(segmentProgress)
  const partialSegment = segmentProgress - completeSegments

  drawLabel(context, 'DIJKSTRA / RECONSTRUCT', 10, 18, colors.faint, { alpha: revealProgress, size: 10 })

  graph.edges.forEach((edge) => {
    const from = positions.get(edge.from)
    const to = positions.get(edge.to)
    traceLine(context, from, to, revealProgress, colors.line, 1)
    if (treeEdges.has(edgeKey(edge.from, edge.to))) traceLine(context, from, to, 1, colors.muted, 1.25)
    drawEdgeWeight(context, edge, positions, colors, revealProgress * 0.8)
  })

  reversePath.slice(0, -1).forEach((node, index) => {
    const from = positions.get(node)
    const to = positions.get(reversePath[index + 1])
    const amount = index < completeSegments ? 1 : index === completeSegments ? partialSegment : 0
    if (amount > 0) traceLine(context, from, to, amount, colors.accent, 2.7)
    if (index === completeSegments && amount > 0 && amount < 1) {
      const easedAmount = easeOutCubic(amount)
      const x = from.x + (to.x - from.x) * easedAmount
      const y = from.y + (to.y - from.y) * easedAmount
      context.beginPath()
      context.arc(x, y, 4.5, 0, Math.PI * 2)
      context.fillStyle = colors.accent
      context.fill()
    }
  })

  const visitedReverse = new Set(
    reversePath.slice(0, Math.min(reversePath.length, completeSegments + 1))
  )
  graph.nodes.forEach((node) => {
    drawDijkstraNode(context, positions.get(node.id), node.id, colors, {
      radius: Math.min(23, Math.max(16, width * 0.043)),
      reveal: revealProgress,
      current:
        reconstructProgress > 0 &&
        reversePath[Math.min(completeSegments, reversePath.length - 1)] === node.id,
      settled: snapshot.settled.includes(node.id),
      path: visitedReverse.has(node.id)
    })
  })

  const visibleNodes = Math.min(reversePath.length, Math.ceil(segmentProgress + 1))
  const routeText = reversePath.slice(0, visibleNodes).join(' ← ')
  let status = snapshot.current ? `search / settle ${snapshot.current}` : 'search / source A'
  if (solveProgress >= 1) status = 'target G reached / follow previous pointers'
  if (reconstructProgress > 0) status = routeText
  if (reconstructProgress >= 1) status = `${solution.path.join(' → ')} / distance ${solution.distance}`
  drawLabel(context, status, width / 2, height - 8, reconstructProgress > 0 ? colors.accent : colors.muted, {
    align: 'center',
    alpha: revealProgress,
    size: width < 420 ? 9 : 10
  })

  canvas._graphProgress = progress
}

let graphAnimation = 0

function markGraphSeen () {
  try {
    sessionStorage.setItem('cs-club-dijkstra-seen', 'seen')
  } catch {
    // The animation still works when storage is unavailable.
  }
}

function playGraph () {
  const canvas = document.querySelector('.hero-canvas')
  if (!canvas) return
  cancelAnimationFrame(graphAnimation)

  if (prefersReducedMotion.matches) {
    drawDijkstra(canvas, 1)
    markGraphSeen()
    return
  }

  drawDijkstra(canvas, 0)
  const start = performance.now()
  const duration = 2500
  const tick = (now) => {
    const progress = clamp((now - start) / duration)
    drawDijkstra(canvas, progress)
    if (progress < 1) graphAnimation = requestAnimationFrame(tick)
    else {
      graphAnimation = 0
      markGraphSeen()
    }
  }
  graphAnimation = requestAnimationFrame(tick)
}

function initializeGraph () {
  const trigger = document.querySelector('.hero-media')
  const canvas = document.querySelector('.hero-canvas')
  if (!trigger || !canvas) return () => {}

  trigger.addEventListener('click', playGraph)
  let hasSeenGraph = false
  try {
    hasSeenGraph = sessionStorage.getItem('cs-club-dijkstra-seen') === 'seen'
  } catch {
    hasSeenGraph = false
  }

  if (hasSeenGraph || prefersReducedMotion.matches) drawDijkstra(canvas, 1)
  else playGraph()

  return () => {
    trigger.removeEventListener('click', playGraph)
    cancelAnimationFrame(graphAnimation)
    graphAnimation = 0
  }
}

const sortValues = [72, 28, 91, 44, 63, 17, 55, 36]

function insertionFrames (values) {
  const working = values.map((value, id) => ({ id, value }))
  const frames = [
    {
      items: working.map((item) => ({ ...item })),
      activeId: null,
      sortedThrough: 0,
      status: 'Ready / first value is sorted'
    }
  ]

  for (let index = 1; index < working.length; index += 1) {
    const key = working[index]
    let insertionIndex = index
    while (insertionIndex > 0 && working[insertionIndex - 1].value > key.value) insertionIndex -= 1
    working.splice(index, 1)
    working.splice(insertionIndex, 0, key)
    frames.push({
      items: working.map((item) => ({ ...item })),
      activeId: key.id,
      sortedThrough: index,
      status: `Pass ${index} / move ${key.value} to slot ${insertionIndex + 1}`
    })
  }
  return frames
}

const sortFrames = insertionFrames(sortValues)
const completeSortStatus = 'Complete / 8 values sorted'
let sortObserver = null
let sortAnimation = 0

function sortVisualMetrics (state = {}) {
  const items = state.items || sortFrames[0].items
  const previousItems = state.previousItems || items
  const transition = easeInOutMotion(state.transition ?? 1)
  const previousPositions = state.fromPositions instanceof Map
    ? state.fromPositions
    : new Map(previousItems.map((item, index) => [item.id, index]))
  const positions = new Map(
    items.map((item, index) => {
      const previousIndex = previousPositions.get(item.id) ?? index
      return [item.id, previousIndex + (index - previousIndex) * transition]
    })
  )
  const targetSortedUnits = (state.activeId ?? null) === null
    ? (state.sortedThrough ?? 0) + 1
    : (state.sortedThrough ?? 0) + transition
  const previousSortedUnits = state.fromSortedUnits ?? targetSortedUnits

  return {
    positions,
    sortedUnits: previousSortedUnits + (targetSortedUnits - previousSortedUnits) * transition
  }
}

function drawSortCanvas (canvas, state = {}) {
  const { context, width, height, colors } = canvasFrame(canvas)
  const items = state.items || sortFrames[0].items
  const transition = easeInOutMotion(state.transition ?? 1)
  const activeId = state.activeId ?? null
  const sidePadding = Math.min(34, width * 0.055)
  const topPadding = 28
  const bottomPadding = 42
  const availableWidth = width - sidePadding * 2
  const gap = Math.max(5, availableWidth * 0.018)
  const barWidth = (availableWidth - gap * (items.length - 1)) / items.length
  const chartHeight = height - topPadding - bottomPadding
  const maximum = Math.max(...sortValues)
  const baseline = topPadding + chartHeight
  const { positions, sortedUnits } = sortVisualMetrics(state)

  context.save()
  context.globalAlpha = 0.72
  context.beginPath()
  context.moveTo(sidePadding, baseline + 0.5)
  context.lineTo(width - sidePadding, baseline + 0.5)
  context.strokeStyle = colors.line
  context.lineWidth = 1
  context.stroke()

  const sortedWidth = sortedUnits * barWidth + Math.max(0, sortedUnits - 1) * gap
  context.beginPath()
  context.moveTo(sidePadding, baseline + 8.5)
  context.lineTo(sidePadding + sortedWidth, baseline + 8.5)
  context.strokeStyle = colors.accent
  context.lineWidth = 1.5
  context.stroke()
  context.restore()

  const renderItems = [...items].sort((left, right) => Number(left.id === activeId) - Number(right.id === activeId))
  renderItems.forEach((item) => {
    const index = items.findIndex(({ id }) => id === item.id)
    const position = positions.get(item.id) ?? index
    const moving = item.id === activeId && Math.abs(position - index) > 0.001
    const lift = moving ? Math.sin(Math.PI * transition) * Math.min(22, height * 0.06) : 0
    const barHeight = (item.value / maximum) * chartHeight
    const x = sidePadding + position * (barWidth + gap)
    const y = baseline - barHeight - lift
    const sorted = index + 1 <= sortedUnits + 0.001
    const active = item.id === activeId
    const renderedWidth = active ? barWidth * 0.76 : barWidth
    const renderedX = x + (barWidth - renderedWidth) / 2

    context.save()
    context.globalAlpha = active ? 1 : sorted ? 0.74 : 1
    context.fillStyle = active ? colors.accent : sorted ? colors.muted : colors.line
    context.fillRect(renderedX, y, renderedWidth, barHeight)
    context.restore()

    drawLabel(context, String(item.value), x + barWidth / 2, moving ? y - 10 : height - 17, active ? colors.ink : colors.muted, {
      align: 'center',
      size: 10
    })
  })
  canvas._sortState = state
}

function initializeSortLab () {
  const lab = document.querySelector('[data-sort-lab]')
  if (!lab) return () => {}
  const trigger = lab.querySelector('.sort-trigger')
  const canvas = lab.querySelector('.sort-canvas')
  const status = lab.querySelector('.logic-lab-status')
  const hint = lab.querySelector('.logic-lab-hint')
  const initialFrame = sortFrames[0]
  drawSortCanvas(canvas, { ...initialFrame, previousItems: initialFrame.items, transition: 1 })

  const runSort = ({ reset = true } = {}) => {
    const currentMetrics = sortVisualMetrics(canvas._sortState || initialFrame)
    cancelAnimationFrame(sortAnimation)
    sortAnimation = 0
    sortObserver?.disconnect()
    sortObserver = null
    lab.setAttribute('aria-busy', 'true')
    hint.textContent = 'Click to restart'
    status.textContent = reset ? 'Resetting / returning to start' : initialFrame.status

    if (prefersReducedMotion.matches) {
      const finalFrame = sortFrames[sortFrames.length - 1]
      drawSortCanvas(canvas, { ...finalFrame, activeId: null, previousItems: finalFrame.items, transition: 1 })
      status.textContent = completeSortStatus
      hint.textContent = 'Click to replay'
      lab.removeAttribute('aria-busy')
      return
    }

    const resetDuration = reset ? 280 : 0
    const resetPause = reset ? 90 : 0
    const durationPerFrame = 490
    const segmentCount = sortFrames.length - 1
    const totalDuration = segmentCount * durationPerFrame
    let start = null
    let lastSegment = -1
    let sortStarted = false

    const tick = (now) => {
      if (start === null) start = now
      const elapsed = now - start

      if (elapsed < resetDuration) {
        drawSortCanvas(canvas, {
          ...initialFrame,
          fromPositions: currentMetrics.positions,
          fromSortedUnits: currentMetrics.sortedUnits,
          transition: elapsed / resetDuration
        })
        sortAnimation = requestAnimationFrame(tick)
        return
      }

      if (!sortStarted) {
        drawSortCanvas(canvas, { ...initialFrame, previousItems: initialFrame.items, transition: 1 })
        status.textContent = initialFrame.status
        sortStarted = true
      }

      if (elapsed < resetDuration + resetPause) {
        sortAnimation = requestAnimationFrame(tick)
        return
      }

      const sortElapsed = elapsed - resetDuration - resetPause
      const segment = Math.min(segmentCount - 1, Math.floor(sortElapsed / durationPerFrame))
      const previousFrame = sortFrames[segment]
      const currentFrame = sortFrames[segment + 1]
      const transition = clamp((sortElapsed - segment * durationPerFrame) / durationPerFrame)

      drawSortCanvas(canvas, { ...currentFrame, previousItems: previousFrame.items, transition })
      if (segment !== lastSegment) {
        status.textContent = currentFrame.status
        lastSegment = segment
      }

      if (sortElapsed < totalDuration) {
        sortAnimation = requestAnimationFrame(tick)
        return
      }

      drawSortCanvas(canvas, { ...currentFrame, activeId: null, previousItems: currentFrame.items, transition: 1 })
      status.textContent = completeSortStatus
      hint.textContent = 'Click to replay'
      lab.removeAttribute('aria-busy')
      sortAnimation = 0
    }

    sortAnimation = requestAnimationFrame(tick)
  }

  const replaySort = () => runSort({ reset: true })
  trigger.addEventListener('click', replaySort)
  if ('IntersectionObserver' in window) {
    sortObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.25)) runSort({ reset: false })
      },
      { threshold: [0.25], rootMargin: '0px 0px -10%' }
    )
    sortObserver.observe(lab)
  } else {
    sortAnimation = requestAnimationFrame(() => runSort({ reset: false }))
  }

  return () => {
    trigger.removeEventListener('click', replaySort)
    sortObserver?.disconnect()
    sortObserver = null
    cancelAnimationFrame(sortAnimation)
    sortAnimation = 0
    lab.removeAttribute('aria-busy')
    hint.textContent = 'Click to replay'
  }
}

function redrawVisuals () {
  const graphCanvas = document.querySelector('.hero-canvas')
  if (graphCanvas) drawDijkstra(graphCanvas, graphCanvas._graphProgress ?? 1)
  const sortCanvas = document.querySelector('.sort-canvas')
  if (sortCanvas) drawSortCanvas(sortCanvas, sortCanvas._sortState)
}

function initializeAnimations () {
  let disposed = false
  let resizeFrame = 0
  const handleResize = () => {
    cancelAnimationFrame(resizeFrame)
    resizeFrame = requestAnimationFrame(redrawVisuals)
  }
  const handleThemeChange = () => requestAnimationFrame(redrawVisuals)

  window.addEventListener('resize', handleResize)
  prefersLightMode.addEventListener('change', handleThemeChange)
  document.fonts.ready.then(() => {
    if (!disposed) redrawVisuals()
  })

  const cleanupGraph = initializeGraph()
  const cleanupSort = initializeSortLab()

  return () => {
    disposed = true
    cleanupGraph()
    cleanupSort()
    window.removeEventListener('resize', handleResize)
    prefersLightMode.removeEventListener('change', handleThemeChange)
    cancelAnimationFrame(resizeFrame)
  }
}

window.initializeAnimations = initializeAnimations
