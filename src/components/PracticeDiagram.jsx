import { useEffect, useId, useRef, useState } from 'react';
import '../practice-diagrams.css';

// Native SVG rendering of a source diagram (trees, weighted graphs). Geometry
// is in source PDF points with the origin at the diagram's top-left corner.

const FILLS = new Set(['none', 'ink', 'surface', 'muted']);
const STROKES = new Set(['none', 'ink', 'muted']);
const ANCHORS = new Set(['start', 'middle', 'end']);
const LABEL_COLORS = new Set(['ink', 'surface']);

// Smallest on-screen label size before the diagram scrolls instead of shrinking.
const MIN_LABEL_PX = 11;
const MAX_WIDTH_PX = 700;
const MAX_UPSCALE = 1.5;

function finite (value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalize (block) {
  const width = finite(block?.width, 0);
  const height = finite(block?.height, 0);
  if (width <= 0 || height <= 0) return null;

  const paths = (Array.isArray(block.paths) ? block.paths : [])
    .filter((path) => typeof path?.d === 'string' && path.d.trim())
    .map((path) => ({
      d: path.d,
      fill: FILLS.has(path.fill) ? path.fill : 'none',
      stroke: STROKES.has(path.stroke) ? path.stroke : 'ink',
      strokeWidth: Math.max(0, finite(path.strokeWidth, 1))
    }));

  const labels = (Array.isArray(block.labels) ? block.labels : [])
    .filter((label) => String(label?.text ?? '') !== '')
    .map((label) => ({
      text: String(label.text),
      x: finite(label.x, 0),
      y: finite(label.y, 0),
      size: Math.max(1, finite(label.size, 10)),
      bold: Boolean(label.bold),
      italic: Boolean(label.italic),
      anchor: ANCHORS.has(label.anchor) ? label.anchor : 'start',
      color: LABEL_COLORS.has(label.color) ? label.color : 'ink'
    }));

  const title = String(block.title ?? '').trim() || 'Diagram';
  const description = String(block.description ?? '').trim() ||
    (labels.length > 0 ? `Labels: ${labels.map((label) => label.text).join(', ')}.` : '');

  return { width, height, paths, labels, title, description };
}

export default function PracticeDiagram ({ block, inline = false }) {
  const id = useId();
  const scrollerRef = useRef(null);
  const [overflowing, setOverflowing] = useState(false);
  const diagram = normalize(block);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node || inline || typeof ResizeObserver === 'undefined') return undefined;
    const measure = () => setOverflowing(node.scrollWidth > node.clientWidth + 1);
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    measure();
    return () => observer.disconnect();
  }, [inline, diagram?.width]);

  if (!diagram) return null;

  const { width, height, paths, labels, title, description } = diagram;
  const titleId = `${id}-title`;
  const descId = `${id}-desc`;

  // Never scale below the size where the smallest label stays readable; past
  // that point the frame scrolls horizontally. Upscale small diagrams modestly.
  const smallest = labels.length > 0 ? Math.min(...labels.map((label) => label.size)) : MIN_LABEL_PX;
  const minScale = Math.min(1.25, Math.max(0.6, MIN_LABEL_PX / smallest));
  const minWidth = width * minScale;
  const maxWidth = Math.max(minWidth, Math.min(width * MAX_UPSCALE, MAX_WIDTH_PX));

  // Inside an answer <label>, the radio's name is built from content, so the
  // description joins the name rather than sitting in aria-describedby.
  const hasDesc = description !== '';
  const labelledBy = inline && hasDesc ? `${titleId} ${descId}` : titleId;

  return (
    <span className='pr-diagram' data-inline={inline ? '' : undefined}>
      <span
        className='pr-diagram-scroll'
        ref={scrollerRef}
        tabIndex={!inline && overflowing ? 0 : undefined}
        role={!inline && overflowing ? 'group' : undefined}
        aria-labelledby={!inline && overflowing ? titleId : undefined}
        style={{
          '--pr-dg-min': `${minWidth}px`,
          '--pr-dg-max': `${maxWidth}px`,
          '--pr-dg-ratio': `${width} / ${height}`
        }}
      >
        <svg
          className='pr-diagram-svg'
          viewBox={`0 0 ${width} ${height}`}
          role='img'
          aria-labelledby={labelledBy}
          aria-describedby={!inline && hasDesc ? descId : undefined}
          focusable='false'
        >
          <title id={titleId}>{title}</title>
          {hasDesc ? <desc id={descId}>{description}</desc> : null}
          {paths.map((path, index) => (
            <path
              key={index}
              d={path.d}
              className={`pr-dg-fill-${path.fill} pr-dg-stroke-${path.stroke}`}
              strokeWidth={path.stroke === 'none' ? undefined : path.strokeWidth}
            />
          ))}
          {labels.map((label, index) => (
            <text
              key={index}
              x={label.x}
              y={label.y}
              fontSize={label.size}
              textAnchor={label.anchor}
              className={[
                'pr-dg-label',
                `pr-dg-text-${label.color}`,
                label.bold ? 'pr-dg-bold' : '',
                label.italic ? 'pr-dg-italic' : ''
              ].filter(Boolean).join(' ')}
            >
              {label.text}
            </text>
          ))}
        </svg>
      </span>
    </span>
  );
}
