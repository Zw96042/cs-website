import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { contests } from "../lib/contests.js";

export default function Contests() {
  return (
    <div className="section-inner contests-page-layout">
      <header className="contests-page-heading">
        <h1 className="section-heading" id="contests-heading">
          Contests.
        </h1>
        <p>Tryouts for contests will commence September 14.</p>
      </header>

      <div className="contest-ledger">
        {contests.map((contest) => (
          <article
            className="contest-ledger-item"
            key={`${contest.dateLabel}-${contest.title}`}
          >
            <time className="contest-date" dateTime={contest.date ?? undefined}>
              {contest.dateLabel}
            </time>
            <div className="contest-details">
              <h2>{contest.title}</h2>
              <p className="contest-type">{contest.type}</p>
              <p className="contest-description">
                {contest.location && (
                  <strong className="contest-location">
                    {contest.location}
                  </strong>
                )}
                {contest.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
