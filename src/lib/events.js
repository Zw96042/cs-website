export const events = [
  {
    type: "Guest Speaker",
    date: "2026-08-31",
    dateLabel: "Aug 31",
    dayLabel: "Monday, 2026",
    title: "Transformer architecture with Joseph Zhang",
    description:
      "A Westlake alumnus and Stanford Math and CS student explains transformer architecture, university research, and life in computer science.",
  },
  {
    type: "Hack Club",
    date: "2026-09-07",
    dateLabel: "Sep 07",
    dayLabel: "Monday, 2026",
    title: "Build a website from scratch",
    description:
      "Learn the basics of HTML, CSS, and JavaScript with the CS Club officers. Finish the site and get free boba.",
  },
  {
    type: "Guest Speaker",
    date: "2026-09-29",
    dateLabel: "Sep 29",
    dayLabel: "Tuesday, 2026",
    title: "Computer architecture and CS at UT",
    location: "Room 301, Ms. Chong's room.",
    description:
      "Dr. Calvin Lin discusses computer architecture, the Turing Scholars program, and studying computer science at UT Austin.",
  },
];

const clubTimeZone = "America/Chicago";

function getClubDateKey(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: clubTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const dateParts = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );
  return `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
}

/** Returns the next two dated events from the club's current day forward. */
export function getUpcomingEvents(now = new Date()) {
  const today = getClubDateKey(now);
  return events
    .filter((event) => event.date !== null && event.date >= today)
    .slice(0, 2);
}
