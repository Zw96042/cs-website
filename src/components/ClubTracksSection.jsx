import { sortValues } from '../lib/visualData.js';

const competitionAreas = [
  {
    name: 'Algorithms & data structures',
    description: 'Graphs, sorting, searching, recursion, dynamic programming, and efficient data structures.'
  },
  {
    name: 'UIL Computer Science',
    description: 'Java, code tracing, language rules, written tests, hands-on programming, and team strategy.'
  },
  {
    name: 'Contest training',
    description: 'Timed problem sets, solution reviews, and practice focused on speed, clarity, and correctness.'
  },
  {
    name: 'Mock meets & hackathons',
    description: 'Occasional events for longer problems, team competition, and building beyond a weekly lesson.'
  }
];

export default function ClubTracksSection () {
  return (
    <section className='section-shell tracks-section' id='tracks' aria-labelledby='tracks-heading'>
      <div className='section-inner tracks-layout'>
        <div className='logic-lab' data-sort-lab>
          <div className='logic-lab-head'>
            <p className='logic-lab-title'>Insertion sort</p>
            <button className='sort-trigger' type='button' aria-describedby='sort-status'>
              <svg className='sort-restart-icon' viewBox='0 0 24 24' aria-hidden='true'>
                <path d='M20 11a8 8 0 1 0-2.34 5.66' />
                <path d='M20 5v6h-6' />
              </svg>
              <span className='sr-only'>Replay the insertion sort animation</span>
            </button>
          </div>
          <svg className='sort-visual' aria-hidden='true' focusable='false'>
            <line className='sort-baseline' data-sort-baseline />
            <line className='sort-progress' data-sort-progress />
            {sortValues.map((value, id) => (
              <g className='sort-item' data-sort-item={id} data-value={value} key={id}>
                <rect />
                <text>{value}</text>
              </g>
            ))}
          </svg>
          <div className='logic-lab-foot'>
            <p className='logic-lab-status' id='sort-status' aria-live='polite'>Ready / starts when in view</p>
            <p className='logic-lab-status'>O(n²) time / O(1) space</p>
          </div>
        </div>

        <div className='tracks-copy'>
          <h2 className='section-heading' id='tracks-heading'>
            <span>Inside competitive</span>{' '}
            <span>programming.</span>
          </h2>
          <p className='section-intro'>
            Practice algorithms, Java, and code tracing for programming contests and UIL Computer Science.
          </p>
          <ul className='competition-list'>
            {competitionAreas.map((item) => (
              <li key={item.name}>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
