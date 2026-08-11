const variants = window.heroVariants
const stage = document.getElementById('stage')
const picker = document.querySelector('.proto-picker')
const highlight = picker.querySelector('.proto-picker-highlight')
const items = [...picker.querySelectorAll('.proto-picker-item:not(.proto-picker-replay)')]
let current = 0

function moveHighlight () {
  const el = items[current]
  highlight.style.width = `${el.offsetWidth}px`
  highlight.style.transform = `translateX(${el.offsetLeft}px)`
  if (picker.scrollWidth > picker.clientWidth) {
    const minimum = picker.scrollLeft + 4
    const maximum = picker.scrollLeft + picker.clientWidth - 4
    if (el.offsetLeft < minimum) picker.scrollLeft = Math.max(0, el.offsetLeft - 4)
    else if (el.offsetLeft + el.offsetWidth > maximum) {
      picker.scrollLeft = el.offsetLeft + el.offsetWidth - picker.clientWidth + 4
    }
  }
}

function mount (i) {
  cancelAnimationFrame(graphAnimation)
  graphAnimation = 0
  if (typeof cancelLetterGraph === 'function') cancelLetterGraph()
  stage.innerHTML = ''
  stage.innerHTML = variants[i].render()
  const graphTrigger = stage.querySelector('.hero-media')
  const graphCanvas = stage.querySelector('.hero-canvas')
  if (graphTrigger && graphCanvas) {
    drawDijkstra(graphCanvas, 1)
    graphTrigger.addEventListener('click', playGraph)
  }
  const letterGraphTrigger = stage.querySelector('.letter-graph-media')
  const letterGraphCanvas = stage.querySelector('.letter-graph-canvas')
  if (letterGraphTrigger && letterGraphCanvas) {
    letterGraphTrigger.addEventListener('click', playLetterGraph)
    playLetterGraph()
  }
  stage.querySelectorAll('[data-replay]').forEach((trigger) => {
    trigger.addEventListener('click', replayConcept)
  })
  document.title = `${variants[i].name} - hero composition prototype`
}

function replayConcept () {
  const scene = stage.querySelector('.proto-scene')
  if (!scene) return
  scene.classList.remove('is-replaying')
  void scene.offsetWidth
  scene.classList.add('is-replaying')
}

function setActive (i) {
  if (i < 0 || i >= variants.length) return
  current = i
  items.forEach((el, j) => {
    el.toggleAttribute('data-active', j === i)
    if (j === i) el.setAttribute('aria-current', 'true')
    else el.removeAttribute('aria-current')
  })
  moveHighlight()
  const url = new URL(location)
  url.searchParams.set('v', i + 1)
  history.replaceState(null, '', url)
  mount(i)
}

items.forEach((el, i) => el.addEventListener('click', () => setActive(i)))
window.addEventListener('resize', moveHighlight)

document.addEventListener('keydown', (event) => {
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName) || event.target.isContentEditable) return
  if (event.metaKey || event.ctrlKey || event.altKey) return
  const number = parseInt(event.key, 10)
  if (number >= 1 && number <= Math.min(variants.length, 9)) setActive(number - 1)
  else if (event.key === '0' && variants.length >= 10) setActive(9)
  else if (event.key === '-' && variants.length >= 11) setActive(10)
  else if (event.key === '=' && variants.length >= 12) setActive(11)
  else if (event.key === '[' && variants.length >= 13) setActive(12)
  else if (event.key === ']' && variants.length >= 14) setActive(13)
  else if (event.key === '\\' && variants.length >= 15) setActive(14)
  else if (event.key === 'ArrowRight') setActive((current + 1) % variants.length)
  else if (event.key === 'ArrowLeft') setActive((current - 1 + variants.length) % variants.length)
  else if (event.key === 'r' || event.key === 'R') {
    if (stage.querySelector('.hero-canvas')) playGraph()
    else if (stage.querySelector('.letter-graph-canvas')) playLetterGraph()
    else replayConcept()
  }
})

const requestedVariant = parseInt(new URLSearchParams(location.search).get('v'), 10)
setActive(requestedVariant >= 1 && requestedVariant <= variants.length ? requestedVariant - 1 : 0)
requestAnimationFrame(() => requestAnimationFrame(() => picker.setAttribute('data-ready', '')))
