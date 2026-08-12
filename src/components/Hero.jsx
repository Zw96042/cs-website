import { graphEdges, graphNodes } from '../lib/visualData.js'

export default function Hero () {
  return (
    <section className='club-hero' aria-labelledby='hero-title'>
      <div className='hero-copy'>
        <h1 className='hero-title' id='hero-title'>
          <span>Build what you</span>
          <span>wish existed.</span>
        </h1>
        <p className='hero-lede'>
          Explore computer science through hands-on lessons, collaborative projects, and competition practice in everything from AI to algorithms.
        </p>
        <dl className='hero-meeting' aria-label='Meeting details'>
          <div>
            <dt>Date</dt>
            <dd>Every Monday</dd>
          </div>
          <div>
            <dt>Time</dt>
            <dd>4:30-5:30</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>Room 291A</dd>
          </div>
        </dl>
        <ul className='hero-benefits' aria-label='What meetings include'>
          <li>Guest speakers</li>
          <li>Free food and drinks</li>
          <li>Free swag</li>
          <li>Free admission</li>
        </ul>
        <div className='hero-actions'>
          <a className='text-action primary-action' href='#join'>
            Join a meeting <span className='action-arrow' aria-hidden='true'>→</span>
          </a>
          <a className='text-action secondary-action' href='#programs'>
            Explore the programs <span className='action-arrow' aria-hidden='true'>→</span>
          </a>
        </div>
      </div>

      <button
        className='hero-media'
        type='button'
        aria-label='Replay Dijkstra’s shortest-path animation from A to G'
      >
        <svg className='hero-visual' aria-hidden='true' focusable='false'>
          <text className='graph-kicker' data-graph-kicker>DIJKSTRA / RECONSTRUCT</text>
          <g data-graph-edges>
            {graphEdges.map((edge, index) => (
              <g data-graph-edge={index} key={index}>
                <line className='graph-edge graph-edge-base' data-edge-base />
                <line className='graph-edge graph-edge-tree' data-edge-tree />
              </g>
            ))}
          </g>
          <path className='graph-edge graph-edge-path' data-graph-path />
          <g data-graph-weights>
            {graphEdges.map((edge, index) => (
              <text className='graph-weight' data-edge-weight={index} key={`${edge.from}-${edge.to}`} />
            ))}
          </g>
          <circle
            className='graph-path-head'
            data-graph-path-head
            r='4.5'
            opacity='0'
            transform='translate(-100 -100)'
          />
          <g data-graph-nodes>
            {graphNodes.map((node) => (
              <g className='graph-node' data-graph-node={node.id} key={node.id}>
                <circle />
                <text>{node.id}</text>
              </g>
            ))}
          </g>
          <text className='graph-status' data-graph-status />
        </svg>
      </button>
    </section>
  )
}
