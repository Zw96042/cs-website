const events = [
  {
    code: "Lecture",
    date: "August 31, 2026",
    description:
      "Join Joseph Zhang, Westlake alumnus and current Stanford student majoring in Math and Computer Science, as he discusses transformer architecture and answers questions about university CS research.",
  },
  {
    code: "Hack Club",
    date: "September 7, 2026",
    description:
      "Join the CS Club officers as we teach how to build a website. You will learn about HTML, CSS, and JavaScript, and will be able to build a website from scratch. Free boba tea will be provided on completion!",
  },
  {
    code: "Lecture",
    date: "TBD",
    description:
      "Join Dr. Calvin Lin, University Distinguished Teaching Professor at UT Austin with research interests in computer architecture, compilers, and security, leader of UT's NSF-funded effort to improve high school CS curricula, director of the Turing Scholars Honors Program, and the longtime coach of UT's Men's Ultimate Frisbee team, as he discusses computer architecture, CS at UT, and the Turing program.",
  },
];
export default function EventsSection() {
  return (
    <section
      className="section-shell event-section"
      id="events"
      aria-labelledby="event-heading"
    >
      <div className="section-inner event-layout">
        <div className="event-heading">
          <h2 className="section-heading" id="event-heading">
            Events.
          </h2>
        </div>
        <div className="event-choices">
          {events.map((track) => (
            <article
              className={`event-choice event-choice-${track.code.toLowerCase()}`}
              key={track.code}
            >
              <div>
                <h3>
                  {track.code}: {track.date}
                </h3>
                <p>{track.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
