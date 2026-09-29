export const PROGRESS_KEY = 'westlake-uil-practice-v1';

// PDF cell padding is not part of a code sample; keep indentation and
// deliberate blank lines within the sample intact.
export function trimCodePadding (value) {
  return String(value ?? '').replace(/\r\n?/g, '\n')
    .replace(/^(?:[\t ]*\n)+|(?:\n[\t ]*)+$/g, '');
}

export function normalizeAnswer (value) {
  return String(value ?? '').normalize('NFKC').replace(/[−–]/g, '-').trim().replace(/\s+/g, ' ').toUpperCase();
}

export function isCorrect (answer, expected, acceptedAnswers = []) {
  const actual = normalizeAnswer(answer);
  const target = normalizeAnswer(expected);
  if (!actual || !target) return false;
  const alternatives = [...target.split(/\s+(?:OR|ALSO)\s+/), ...(Array.isArray(acceptedAnswers) ? acceptedAnswers.map(normalizeAnswer) : [])];
  return alternatives.some(option => {
    // Ignore typesetting space in parenthesized expressions, while keeping
    // whitespace significant in printed strings, paths and postfix tokens.
    if (option.includes('(')) return actual.replace(/\s/g, '') === option.replace(/\s/g, '');
    return actual === option;
  });
}

export function scoreAnswers (questions, answers = {}) {
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;
  for (const question of questions) {
    const answer = answers[question.id];
    if (!normalizeAnswer(answer)) unanswered++;
    else if (isCorrect(answer, question.answer, question.acceptedAnswers)) correct++;
    else incorrect++;
  }
  return { correct, incorrect, unanswered, score: correct * 6 - incorrect * 2, maxScore: questions.length * 6 };
}

// UIL artwork and columnar output can depend on leading spaces. Only ignore
// line-ending differences, trailing horizontal space, and final blank lines.
export function normalizeOutput (value) {
  return String(value ?? '').replace(/\r\n?/g, '\n').split('\n')
    .map(line => line.replace(/[\t ]+$/g, '')).join('\n').replace(/\n+$/g, '');
}

export function compareOutputs (actual, expected, limit = 25) {
  const mine = normalizeOutput(actual);
  const judge = normalizeOutput(expected);
  const mineLines = mine === '' ? [] : mine.split('\n');
  const judgeLines = judge === '' ? [] : judge.split('\n');
  if (mine === '' && judge !== '') return { status: 'empty' };
  if (mine === judge) return { status: 'match', lineCount: judgeLines.length };
  const differences = [];
  let differenceCount = 0;
  for (let index = 0; index < Math.max(mineLines.length, judgeLines.length); index++) {
    if (mineLines[index] === judgeLines[index]) continue;
    differenceCount++;
    if (differences.length < limit) differences.push({ line: index + 1, judge: judgeLines[index], mine: mineLines[index] });
  }
  return { status: 'mismatch', differences, differenceCount, mineCount: mineLines.length, judgeCount: judgeLines.length };
}

export function hasExpired (session, now = Date.now()) {
  return session?.mode === 'exam' && !session.submitted && (!Number.isFinite(session.deadline) || session.deadline <= now);
}

function emptyProgress () {
  return { version: 1, sessions: {}, drafts: {} };
}

export function loadProgress () {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PROGRESS_KEY));
    if (!parsed || parsed.version !== 1 || typeof parsed !== 'object') return emptyProgress();
    const result = emptyProgress();
    for (const key of ['sessions', 'drafts']) {
      if (parsed[key] && typeof parsed[key] === 'object' && !Array.isArray(parsed[key])) result[key] = parsed[key];
    }
    result.drafts = Object.fromEntries(Object.entries(result.drafts).filter(([key, value]) => key.endsWith(':java') && typeof value === 'string'));
    // Treat storage as untrusted: a malformed saved session must not crash
    // navigation or disclose exam answers by accidentally resuming review.
    for (const [id, session] of Object.entries(result.sessions)) {
      if (!session || typeof session !== 'object' || Array.isArray(session)) { delete result.sessions[id]; continue; }
      session.answers = session.answers && typeof session.answers === 'object' && !Array.isArray(session.answers) ? Object.fromEntries(Object.entries(session.answers).filter(([, value]) => typeof value === 'string')) : {};
      session.checked = session.checked && typeof session.checked === 'object' && !Array.isArray(session.checked) ? session.checked : {};
      session.currentIndex = Number.isInteger(session.currentIndex) && session.currentIndex >= 0 ? session.currentIndex : 0;
      session.mode = session.mode === 'exam' ? 'exam' : 'practice';
      session.submitted = session.submitted === true;
      session.deadline = Number.isFinite(session.deadline) ? session.deadline : null;
    }
    return result;
  } catch {
    return emptyProgress();
  }
}

export function saveProgress (progress) {
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}
