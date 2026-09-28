export const events = [
  {
    type: 'Hack Club',
    track: 'hack-club',
    date: '2026-09-07',
    title: 'Build a website from scratch',
    description: 'Learn the basics of HTML, CSS, and JavaScript with the CS Club officers. Finish the site and get free boba.'
  },
  {
    type: 'Guest Speaker',
    track: 'guest-speaker',
    date: '2026-09-29',
    title: 'Computer architecture and CS at UT',
    credential: 'Director of UT Austin’s Turing Scholars Honors Program',
    location: 'Room 301 · Ms. Chong’s room',
    description: 'Dr. Calvin Lin shares an expert perspective on computer architecture, university research, and studying computer science at UT Austin.'
  },
  {
    type: 'Competitive Programming',
    track: 'competitive-programming',
    date: '2026-10-05',
    endDate: '2026-10-11',
    title: 'Code Bash',
    description: 'Competitive programming competition running October 5–11.',
    signupNote: 'Email the officers for signup.'
  },
  {
    type: 'Competitive Programming',
    track: 'competitive-programming',
    date: '2026-10-17',
    title: 'Seven Lakes',
    description: 'Competitive programming competition on October 17.',
    signupNote: 'Email the officers for signup.'
  },
  {
    type: 'Guest Speaker',
    track: 'guest-speaker',
    date: null,
    title: 'Inside the Turing Scholars program',
    description: 'Westlake alumni Ruiqi Li and Autumn Liu share their research, work, and experience as Turing Scholars at UT Austin.'
  }
];

const clubTimeZone = 'America/Chicago';
const utcTimeZone = 'UTC';
const dayFormatter = new Intl.DateTimeFormat('en-US', { day: '2-digit', timeZone: utcTimeZone });
const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: utcTimeZone });
const shortMonthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: utcTimeZone });
const weekdayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: utcTimeZone });
const yearFormatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', timeZone: utcTimeZone });

function parseDateKey (dateKey) {
  return new Date(`${dateKey}T12:00:00Z`);
}

function getClubDateKey (date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: clubTimeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);

  const dateParts = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
}

export function formatEventDate (event) {
  if (event.date === null) {
    return {
      dayLabel: 'Date to come',
      endDateLabel: null,
      monthLabel: null,
      startDateLabel: 'TBD'
    };
  }

  const startDate = parseDateKey(event.date);
  const startMonth = shortMonthFormatter.format(startDate);
  const startYear = yearFormatter.format(startDate);
  const display = {
    dayLabel: `${weekdayFormatter.format(startDate)}, ${startYear}`,
    endDateLabel: null,
    monthLabel: monthFormatter.format(startDate),
    startDateLabel: `${startMonth} ${dayFormatter.format(startDate)}`
  };

  if (!event.endDate) return display;

  const endDate = parseDateKey(event.endDate);
  const endMonth = shortMonthFormatter.format(endDate);
  const endYear = yearFormatter.format(endDate);
  const isSameMonth = startMonth === endMonth && startYear === endYear;
  const yearLabel = startYear === endYear ? startYear : `${startYear}–${endYear}`;

  return {
    ...display,
    dayLabel: `${weekdayFormatter.format(startDate)}–${weekdayFormatter.format(endDate)}, ${yearLabel}`,
    endDateLabel: isSameMonth
      ? dayFormatter.format(endDate)
      : `${endMonth} ${dayFormatter.format(endDate)}`
  };
}

/** Returns every dated event from the club's current day forward. */
export function getScheduledEvents (now = new Date()) {
  const today = getClubDateKey(now);
  return events
    .filter((event) => event.date !== null && (event.endDate ?? event.date) >= today)
    .sort((first, second) => first.date.localeCompare(second.date));
}

export function getEventPreview (now = new Date()) {
  return getScheduledEvents(now).slice(0, 2);
}

export function getUnscheduledEvents () {
  return events.filter((event) => event.date === null);
}
