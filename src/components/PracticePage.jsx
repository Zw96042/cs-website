import { getNavigationTarget } from '../lib/navigation.js';
import { useEffect, useId, useRef, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Footer from './Footer.jsx';
import Header from './Header.jsx';
import PracticeDiagram from './PracticeDiagram.jsx';
import {
  isCorrect,
  loadProgress,
  normalizeAnswer,
  compareOutputs,
  hasExpired,
  saveProgress,
  scoreAnswers,
  trimCodePadding,
  coalesceChoiceCodeBlocks
} from '../lib/practice.js';

const MANIFEST_URL = '/practice-data/manifest.json';
const EXAM_DURATION_MS = 45 * 60 * 1000;
const ROUNDS = ['Invitational A', 'Invitational B', 'District', 'District 1', 'District 2', 'District A', 'District B', 'Regional', 'State', 'UTCS Invitational', 'Practice test'];
const MODE_LABELS = { mc: 'Multiple choice', frq: 'Programming FRQ' };
const QUESTION_STATE_LABELS = {
  open: 'not answered',
  answered: 'answered',
  correct: 'correct',
  incorrect: 'incorrect',
  skipped: 'skipped'
};
const QUESTION_MARKS = { correct: '✓', incorrect: '✕', skipped: '–' };
const MAX_DIFF_LINES = 25;

const isRecord = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const hasAnswer = (value) => typeof value === 'string' && normalizeAnswer(value) !== '';
const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;
const clampIndex = (value, length) => Math.min(Math.max(Number(value) || 0, 0), Math.max(length - 1, 0));
const draftKey = (problemId) => `${problemId}:java`;
const answerIsCorrect = (answer, question) => isCorrect(answer, question.answer, question.acceptedAnswers);

function readProgress () {
  let stored = null;
  try {
    stored = loadProgress();
  } catch {
    stored = null;
  }
  const source = isRecord(stored) ? stored : {};

  return {
    version: 1,
    sessions: isRecord(source.sessions) ? source.sessions : {},
    drafts: isRecord(source.drafts) ? source.drafts : {}
  };
}

function writeProgress (progress) {
  try {
    return saveProgress(progress) !== false;
  } catch {
    return false;
  }
}

function readTestParam () {
  try {
    return new URLSearchParams(window.location.search).get('test') || null;
  } catch {
    return null;
  }
}

async function fetchJson (url, signal) {
  const response = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function roundRank (contest) {
  const rank = ROUNDS.indexOf(contest);
  return rank === -1 ? ROUNDS.length : rank;
}

function compareRounds (a, b) {
  return (roundRank(a) - roundRank(b)) || String(a).localeCompare(String(b));
}

function sortTests (tests) {
  return [...tests].sort((a, b) =>
    (Number(b.year) - Number(a.year)) ||
    compareRounds(a.contest, b.contest) ||
    (a.mode === b.mode ? 0 : a.mode === 'mc' ? -1 : 1)
  );
}

function countLabel (test) {
  const count = Number(test.questionCount) || 0;
  return plural(count, test.mode === 'frq' ? 'problem' : 'question');
}

function normalizeTest (manifestTest, data) {
  const source = isRecord(data) ? data : {};
  const questions = Array.isArray(source.questions) ? source.questions : [];

  return {
    ...manifestTest,
    ...source,
    referenceImages: Array.isArray(source.referenceImages) ? source.referenceImages : [],
    questions: questions
      .filter(isRecord)
      .map((question) => ({
        ...question,
        content: Array.isArray(question.content) ? question.content.filter(isRecord) : [],
        choices: Array.isArray(question.choices) ? question.choices : [],
        choiceContent: Array.isArray(question.choiceContent) ? question.choiceContent.filter(isRecord) : [],
        acceptedAnswers: Array.isArray(question.acceptedAnswers) ? question.acceptedAnswers : [],
        files: Array.isArray(question.files) ? question.files : []
      }))
      .sort((a, b) => Number(a.number) - Number(b.number))
  };
}

function newSession (mode) {
  return {
    answers: {},
    checked: {},
    currentIndex: 0,
    submitted: false,
    mode,
    deadline: mode === 'exam' ? Date.now() + EXAM_DURATION_MS : null,
    finishedAt: null
  };
}

function summarizeTest (test, progress, now) {
  const count = Number(test.questionCount) || 0;
  const session = isRecord(progress.sessions[test.id]) ? progress.sessions[test.id] : null;

  if (test.mode === 'frq') {
    const prefix = `${test.id}-`;
    const hasDraft = Object.keys(progress.drafts).some((key) =>
      key.startsWith(prefix) && key.endsWith(':java') && String(progress.drafts[key]).trim() !== ''
    );
    return hasDraft
      ? { state: 'progress', label: 'Draft saved', action: 'Resume' }
      : { state: 'new', label: 'Not started', action: 'Open' };
  }

  if (!session) return { state: 'new', label: 'Not started', action: 'Start' };

  if (session.submitted) {
    const result = session.result;
    return {
      state: 'done',
      label: isRecord(result) ? `Scored ${result.score} of ${result.maxScore}` : 'Finished',
      action: 'Review'
    };
  }

  const answered = Object.values(session.answers || {}).filter(hasAnswer).length;

  if (session.mode === 'exam') {
    if (!(Number(session.deadline) > now)) {
      return { state: 'progress', label: 'Time is up · open to see your score', action: 'Score' };
    }
    const minutes = Math.ceil((session.deadline - now) / 60000);
    return {
      state: 'progress',
      label: `Timed exam · ${answered} of ${count} answered · ${minutes} min left`,
      action: 'Resume'
    };
  }

  const checked = Object.values(session.checked || {}).filter(Boolean).length;
  return { state: 'progress', label: `Practice · ${checked} of ${count} checked`, action: 'Resume' };
}

function findResume (tests, progress) {
  let best = null;

  tests.forEach((test) => {
    const session = progress.sessions[test.id];
    if (!isRecord(session) || session.submitted) return;
    if (test.mode === 'frq' && summarizeTest(test, progress, 0).state === 'new') return;
    const updated = Number(session.updatedAt) || 0;
    if (!best || updated > best.updated) best = { test, updated };
  });

  return best ? best.test : null;
}

function questionState (question, session) {
  const answer = session.answers?.[question.id];
  const answered = hasAnswer(answer);
  const revealed = session.submitted || Boolean(session.checked?.[question.id]);

  if (!revealed) return answered ? 'answered' : 'open';
  if (!answered) return 'skipped';
  return answerIsCorrect(answer, question) ? 'correct' : 'incorrect';
}

function useNow (active) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) return undefined;
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [active]);

  return now;
}

function downloadText (fileName, text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function solutionFileName (problem) {
  const canonical = String(problem.programName || '').replace(/\.java$/i, '');
  if (/^[A-Za-z_$][\w$]*$/.test(canonical)) return `${canonical}.java`;
  const words = String(problem.programName || problem.title || '').replace(/\.java$/i, '').match(/[A-Za-z0-9]+/g) || [];
  let base = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  if (!base || /^[0-9]/.test(base)) base = `Problem${problem.number}${base}`;
  return `${base}.java`;
}

export default function PracticePage ({ embedded = false, onReady }) {
  const [progress, setProgress] = useState(readProgress);
  const [saveFailed, setSaveFailed] = useState(false);
  const [manifest, setManifest] = useState({ status: 'loading', tests: [], resources: [], error: '' });
  const [manifestAttempt, setManifestAttempt] = useState(0);
  const [selectedId, setSelectedId] = useState(readTestParam);
  const [testLoad, setTestLoad] = useState({ id: null, status: 'idle', data: null, error: '' });
  const [testAttempt, setTestAttempt] = useState(0);
  const [archiveMode, setArchiveMode] = useState('all');
  const [archiveYear, setArchiveYear] = useState('all');
  const [archiveRound, setArchiveRound] = useState('all');
  const progressRef = useRef(progress);
  const testCache = useRef(new Map());
  const navigated = useRef(false);

  useEffect(() => {
    progressRef.current = progress;
    const timer = window.setTimeout(() => setSaveFailed(!writeProgress(progress)), 250);
    return () => window.clearTimeout(timer);
  }, [progress]);

  useEffect(() => {
    const flush = () => writeProgress(progressRef.current);
    const syncFromUrl = () => {
      navigated.current = true;
      setSelectedId(readTestParam());
    };

    window.addEventListener('pagehide', flush);
    window.addEventListener('popstate', syncFromUrl);
    return () => {
      flush();
      window.removeEventListener('pagehide', flush);
      window.removeEventListener('popstate', syncFromUrl);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setManifest((current) => ({ ...current, status: 'loading', error: '' }));

    fetchJson(MANIFEST_URL, controller.signal)
      .then((data) => {
        const tests = Array.isArray(data?.tests)
          ? data.tests.filter((test) => isRecord(test) && test.id && test.dataUrl)
          : [];
        const resources = Array.isArray(data?.resources)
          ? data.resources.filter((resource) => isRecord(resource) && resource.url)
          : [];
        setManifest({ status: 'ready', tests: sortTests(tests), resources, error: '' });
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setManifest({ status: 'error', tests: [], resources: [], error: error.message });
      });

    return () => controller.abort();
  }, [manifestAttempt]);

  const selectedTest = manifest.tests.find((test) => test.id === selectedId) || null;

  useEffect(() => {
    if (!selectedTest) return undefined;

    const cached = testCache.current.get(selectedTest.id);
    if (cached) {
      setTestLoad({ id: selectedTest.id, status: 'ready', data: cached, error: '' });
      return undefined;
    }

    const controller = new AbortController();
    setTestLoad({ id: selectedTest.id, status: 'loading', data: null, error: '' });

    fetchJson(selectedTest.dataUrl, controller.signal)
      .then((data) => {
        const test = normalizeTest(selectedTest, data);
        testCache.current.set(selectedTest.id, test);
        setTestLoad({ id: selectedTest.id, status: 'ready', data: test, error: '' });
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setTestLoad({ id: selectedTest.id, status: 'error', data: null, error: error.message });
      });

    return () => controller.abort();
  }, [selectedTest, testAttempt]);

  useEffect(() => {
    const base = 'Practice | Westlake Computer Science Club';
    document.title = selectedTest
      ? `${selectedTest.title} ${MODE_LABELS[selectedTest.mode] || ''} | ${base}`
      : base;
  }, [selectedTest]);

  // Restore cross-page history only after the archive or test has its full layout.
  const contentReady = manifest.status === 'error' || (manifest.status === 'ready' && (
    !selectedId || !selectedTest || (testLoad.id === selectedId && ['ready', 'error'].includes(testLoad.status))
  ));
  useEffect(() => {
    if (contentReady) onReady?.();
  }, [contentReady, onReady, selectedId]);

  const navigate = (testId) => {
    const url = new URL(window.location.href);
    if (testId) url.searchParams.set('test', testId);
    else url.searchParams.delete('test');
    url.hash = '';
    window.history.pushState({}, '', url);
    navigated.current = true;
    setSelectedId(testId);
    window.scrollTo({ left: 0, top: 0, behavior: 'instant' });
  };

  const updateSession = (testId, change) => setProgress((current) => {
    const previous = isRecord(current.sessions[testId]) ? current.sessions[testId] : null;
    const next = change(previous);
    if (next === previous) return current;

    const sessions = { ...current.sessions };
    if (next) sessions[testId] = { ...next, updatedAt: Date.now() };
    else delete sessions[testId];
    return { ...current, sessions };
  });

  // The hero's mode links filter the archive, then move focus to it.
  const browseArchive = (mode) => {
    setArchiveMode(mode);
    setArchiveYear('all');
    setArchiveRound('all');
    const heading = document.getElementById('library-heading');
    heading?.focus({ preventScroll: true });
    heading?.scrollIntoView({ block: 'start' });
  };

  const setDraft = (problemId, value) => setProgress((current) => {
    const drafts = { ...current.drafts };
    if (value === '') delete drafts[draftKey(problemId)];
    else drafts[draftKey(problemId)] = value;
    return { ...current, drafts };
  });

  let content;
  if (!selectedId) {
    content = (
      <>
        <PracticeHero
          tests={manifest.tests}
          progress={progress}
          onOpen={navigate}
          onBrowse={browseArchive}
          autoFocus={navigated.current}
        />
        <Library
          manifest={manifest}
          progress={progress}
          mode={archiveMode}
          onModeChange={setArchiveMode}
          year={archiveYear}
          onYearChange={setArchiveYear}
          round={archiveRound}
          onRoundChange={setArchiveRound}
          onOpen={navigate}
          onRetry={() => setManifestAttempt((attempt) => attempt + 1)}
        />
      </>
    );
  } else if (manifest.status !== 'ready') {
    content = (
      <div className='pr-wide pr-shell'>
        <BackLink onBack={() => navigate(null)} />
        <LoadState
          status={manifest.status}
          error={manifest.error}
          loadingLabel='Loading the contest archive…'
          errorLabel='The contest archive didn’t load.'
          onRetry={() => setManifestAttempt((attempt) => attempt + 1)}
        />
      </div>
    );
  } else if (!selectedTest) {
    content = (
      <div className='pr-wide pr-shell'>
        <BackLink onBack={() => navigate(null)} />
        <div className='pr-state'>
          <h1 className='pr-state-title'>That test isn’t in the archive.</h1>
          <p className='pr-state-detail'>The link may be out of date. Every available contest is listed in the library.</p>
          <button className='pr-button' type='button' onClick={() => navigate(null)}>Browse all contests</button>
        </div>
      </div>
    );
  } else if (testLoad.id !== selectedTest.id || testLoad.status !== 'ready') {
    content = (
      <div className='pr-wide pr-shell'>
        <BackLink onBack={() => navigate(null)} />
        <h1 className='pr-ws-heading'>{selectedTest.title}</h1>
        <p className='pr-ws-sub'>{MODE_LABELS[selectedTest.mode]} · {countLabel(selectedTest)}</p>
        <LoadState
          status={testLoad.id === selectedTest.id && testLoad.status === 'error' ? 'error' : 'loading'}
          error={testLoad.error}
          loadingLabel='Loading questions…'
          errorLabel='This test didn’t load.'
          onRetry={() => setTestAttempt((attempt) => attempt + 1)}
        />
      </div>
    );
  } else {
    const test = testLoad.data;
    const session = isRecord(progress.sessions[test.id]) ? progress.sessions[test.id] : null;
    const shared = {
      test,
      session,
      onUpdateSession: updateSession,
      onBack: () => navigate(null),
      autoFocus: navigated.current
    };

    content = test.mode === 'frq'
      ? <ProgrammingWorkspace {...shared} key={test.id} drafts={progress.drafts} onDraft={setDraft} />
      : <WrittenWorkspace {...shared} key={test.id} />;
  }

  const main = (
    <main className='practice-main' id='practice-content' tabIndex={-1}>
      {saveFailed
        ? (
          <p className='pr-wide pr-save-warning' role='status'>
            Progress can’t be saved in this browser right now; storage may be full or turned off. Keep this tab open to continue where you are.
          </p>
          )
        : null}
      {content}
      {!embedded && <><Analytics /><SpeedInsights /></>}
    </main>
  );

  if (embedded) return main;

  return (
    <div className='site-page practice-page'>
      <a className='skip-link' href='#practice-content'>Skip to practice</a>
      <Header currentPage='practice' />
      {main}
      <Footer />
    </div>
  );
}

function BackLink ({ onBack }) {
  return (
    <a
      className='pr-back'
      href={window.location.pathname}
      onClick={(event) => {
        if (!getNavigationTarget(event, event.currentTarget, window.location.href)) return;
        event.preventDefault();
        onBack();
      }}
    >
      <span aria-hidden='true'>←</span> All contests
    </a>
  );
}

function LoadState ({ status, error, loadingLabel, errorLabel, onRetry }) {
  if (status === 'error') {
    return (
      <div className='pr-state' role='alert'>
        <p className='pr-state-title'>{errorLabel}</p>
        <p className='pr-state-detail'>
          Check your connection and try again.{error ? ` (${error})` : ''}
        </p>
        <button className='pr-button' type='button' onClick={onRetry}>Try again</button>
      </div>
    );
  }

  return (
    <div className='pr-state' role='status'>
      <p className='pr-state-title pr-state-loading'>{loadingLabel}</p>
    </div>
  );
}

// A button + listbox select. The menu is styled with the page instead of the
// operating system, and follows the WAI-ARIA select-only combobox keys.
function Select ({ label, value, options, onChange, className = '' }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const labelId = useId();
  const listId = useId();
  const valueId = useId();
  const selectedIndex = Math.max(options.findIndex((option) => option.value === value), 0);
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return undefined;
    const closeOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  const show = (index = selectedIndex) => {
    setActive(index);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  const choose = (index) => {
    const option = options[index];
    if (option && option.value !== value) onChange(option.value);
    close();
  };

  const handleButtonKey = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      show();
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      show(event.key === 'Home' ? 0 : options.length - 1);
    }
  };

  const handleListKey = (event) => {
    const moves = {
      ArrowDown: Math.min(active + 1, options.length - 1),
      ArrowUp: Math.max(active - 1, 0),
      Home: 0,
      End: options.length - 1
    };
    if (event.key in moves) {
      event.preventDefault();
      setActive(moves[event.key]);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      choose(active);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (event.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <div className={`pr-select ${className}`} ref={rootRef}>
      <span className='pr-select-label' id={labelId}>{label}</span>
      <div className='pr-select-control'>
        <button
          className='pr-select-button'
          type='button'
          ref={buttonRef}
          aria-haspopup='listbox'
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-labelledby={`${labelId} ${valueId}`}
          onClick={() => (open ? close() : show())}
          onKeyDown={handleButtonKey}
        >
          <span className='pr-select-value' id={valueId}>{selected?.label}</span>
          <span className='pr-select-caret' aria-hidden='true' />
        </button>
        {open
          ? (
            <ul
              className='pr-select-menu'
              id={listId}
              ref={listRef}
              role='listbox'
              tabIndex={-1}
              aria-labelledby={labelId}
              aria-activedescendant={`${listId}-${active}`}
              onKeyDown={handleListKey}
            >
              {options.map((option, index) => (
                <li
                  key={option.value}
                  id={`${listId}-${index}`}
                  role='option'
                  aria-selected={index === selectedIndex}
                  data-active={index === active ? '' : undefined}
                  onPointerMove={() => setActive(index)}
                  onClick={() => choose(index)}
                >
                  <span>{option.label}</span>
                </li>
              ))}
            </ul>
            )
          : null}
      </div>
    </div>
  );
}

/* Native question content */

function Runs ({ runs }) {
  return (Array.isArray(runs) ? runs : []).map((run, index) => {
    if (run?.style === 'overline') return <span className='pr-overline' key={index}><Runs runs={run.runs} /></span>;
    const text = String(run?.text ?? '');
    if (run?.style === 'code') return <code key={index}>{text}</code>;
    if (run?.style === 'sub') return <sub key={index}>{text}</sub>;
    if (run?.style === 'sup') return <sup key={index}>{text}</sup>;
    if (run?.style === 'bold') return <strong key={index}>{text}</strong>;
    if (run?.style === 'italic') return <i key={index}>{text}</i>;
    return <span key={index}>{text}</span>;
  });
}

// `inline` renders with phrasing elements only, so blocks can sit inside a
// <label> for the answer choices without producing invalid markup.
function ContentBlocks ({ blocks, inline = false }) {
  return blocks.map((block, index) => {
    if (block.type === 'diagram') return <PracticeDiagram block={block} inline={inline} key={index} />;
    if (block.type === 'code') {
      return inline
        ? <code className='pr-code-block' key={index}>{trimCodePadding(block.text)}</code>
        : <pre className='pr-code-block' key={index}><code>{trimCodePadding(block.text)}</code></pre>;
    }
    if (block.type === 'figure') {
      if (!block.url) return null;
      const image = <img src={block.url} alt={block.alt || ''} loading='lazy' decoding='async' />;
      return inline
        ? <span className='pr-figure' key={index}>{image}</span>
        : <figure className='pr-figure' key={index}>{image}</figure>;
    }
    const Tag = inline ? 'span' : 'p';
    return <Tag className='pr-para' key={index}><Runs runs={block.runs} /></Tag>;
  });
}

function Prompt ({ item }) {
  if (item.content.length > 0) {
    return <div className='pr-prompt'><ContentBlocks blocks={item.content} /></div>;
  }
  const text = String(item.text || '').trim();
  return (
    <div className='pr-prompt'>
      {text
        ? <p className='pr-para pr-plain'>{text}</p>
        : <p className='pr-para pr-muted'>The text for this item isn’t available. Use the original PDF linked above.</p>}
    </div>
  );
}

// Schematic figures for the two modes. They illustrate the workflow, not real
// questions, so they're hidden from assistive tech; the copy carries the meaning.
const SHEET_ROWS = [
  { marked: 1, mark: '✓' },
  { marked: 3, mark: '✓' },
  { marked: 0, mark: '×' },
  { marked: -1, mark: '' }
];

function AnswerSheetFigure () {
  return (
    <div className='pr-fig pr-fig-sheet' aria-hidden='true'>
      <div className='pr-fig-bar'>
        <span>answer sheet</span>
        <span className='pr-fig-clock'>45:00</span>
      </div>
      <ol className='pr-sheet'>
        {SHEET_ROWS.map((row, index) => (
          <li key={index}>
            <span className='pr-sheet-num'>{index + 1}</span>
            {['A', 'B', 'C', 'D', 'E'].map((letter, choice) => (
              <span className='pr-bubble' data-marked={choice === row.marked ? '' : undefined} key={letter}>{letter}</span>
            ))}
            <span className='pr-sheet-mark'>{row.mark}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function JudgeRunFigure () {
  return (
    <div className='pr-fig pr-fig-term' aria-hidden='true'>
      <div className='pr-fig-bar'>
        <span>your terminal</span>
        <span>Java</span>
      </div>
      <pre className='pr-term'>
        <span className='pr-term-prompt'>$ </span>javac Solution.java{'\n'}
        <span className='pr-term-prompt'>$ </span>java Solution{'\n'}
        <span className='pr-term-dim'>paste output → compare with judge</span>
      </pre>
    </div>
  );
}

const HERO_MODES = [
  {
    mode: 'mc',
    Figure: AnswerSheetFigure,
    description: 'Practice checks each answer with the key’s explanation. Exam runs the full test on a 45-minute clock.'
  },
  {
    mode: 'frq',
    Figure: JudgeRunFigure,
    description: 'Write Java here, run it on your own machine, then paste its output to compare with the judge’s.'
  }
];

function PracticeHero ({ tests, progress, onOpen, onBrowse, autoFocus }) {
  const headingRef = useRef(null);
  const resumeTest = findResume(tests, progress);
  const resumeSummary = resumeTest ? summarizeTest(resumeTest, progress, Date.now()) : null;

  useEffect(() => {
    if (autoFocus) headingRef.current?.focus();
  }, []);

  return (
    <section className='pr-hero' aria-labelledby='practice-heading'>
      <div className='section-inner'>
        <div className='pr-hero-top'>
          <h1 className='section-heading pr-hero-title' id='practice-heading' ref={headingRef} tabIndex={-1}>
            Practice
          </h1>

          <div className='pr-hero-side'>
            <p className='pr-hero-intro'>
              Past UIL computer science contests, set as readable questions. Your answers and code stay saved in this browser.
            </p>

            {resumeTest
              ? (
                <div className='pr-resume'>
                  <div className='pr-resume-copy'>
                    <p className='pr-resume-label'>Pick up where you left off</p>
                    <p className='pr-resume-title'>
                      {resumeTest.title} · {MODE_LABELS[resumeTest.mode]}
                    </p>
                    <p className='pr-resume-status'>{resumeSummary.label}</p>
                  </div>
                  <a
                    className='pr-button'
                    data-variant='primary'
                    href={`?test=${encodeURIComponent(resumeTest.id)}`}
                    onClick={(event) => {
                      if (!getNavigationTarget(event, event.currentTarget, window.location.href)) return;
                      event.preventDefault();
                      onOpen(resumeTest.id);
                    }}
                  >
                    Resume <span className='action-arrow' aria-hidden='true'>→</span>
                  </a>
                </div>
                )
              : (
                <button className='pr-button' data-variant='primary' type='button' onClick={() => onBrowse('all')}>
                  {tests.length ? `Browse all ${plural(tests.length, 'test')}` : 'Browse the archive'}
                  <span className='action-arrow' aria-hidden='true'>↓</span>
                </button>
                )}
          </div>
        </div>

        <ul className='pr-modes'>
          {HERO_MODES.map(({ mode, Figure, description }) => {
            const count = tests.filter((test) => test.mode === mode).length;
            return (
              <li className='pr-mode' key={mode}>
                <Figure />
                <div className='pr-mode-body'>
                  <h2 className='pr-mode-name'>{MODE_LABELS[mode]}</h2>
                  <p className='pr-mode-copy'>{description}</p>
                  <button className='pr-button' type='button' onClick={() => onBrowse(mode)}>
                    {count ? `Browse ${plural(count, 'test')}` : 'Browse the archive'}
                    <span className='sr-only'> of {MODE_LABELS[mode]}</span>
                    <span className='action-arrow' aria-hidden='true'>↓</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Library ({ manifest, progress, mode, onModeChange: setMode, year, onYearChange: setYear, round, onRoundChange: setRound, onOpen, onRetry }) {
  const tests = manifest.tests;
  const resources = manifest.resources || [];
  const now = Date.now();

  const years = [...new Set([...tests, ...resources].map((item) => String(item.year)))]
    .sort((a, b) => Number(b) - Number(a));
  const rounds = [...new Set([...tests, ...resources].map((item) => item.contest))].sort(compareRounds);
  const matchesPlace = (item) =>
    (year === 'all' || String(item.year) === year) &&
    (round === 'all' || item.contest === round);
  // Type counts follow the Year/Round choice, so each option says what it would show.
  const placeTests = tests.filter(matchesPlace);
  const filtered = placeTests.filter((test) => mode === 'all' || test.mode === mode);
  // Supplementary files are all programming material.
  const filteredResources = resources.filter(resource => (mode === 'all' || mode === (resource.mode || 'frq')) && matchesPlace(resource));
  const filtersActive = mode !== 'all' || year !== 'all' || round !== 'all';

  const groups = [];
  const contestFor = (item) => {
    let yearGroup = groups.find((group) => group.year === String(item.year));
    if (!yearGroup) {
      yearGroup = { year: String(item.year), contests: [] };
      groups.push(yearGroup);
    }
    let contest = yearGroup.contests.find((entry) => entry.name === item.contest);
    if (!contest) {
      contest = { name: item.contest, tests: [], resources: [] };
      yearGroup.contests.push(contest);
    }
    return contest;
  };
  filtered.forEach((test) => contestFor(test).tests.push(test));
  filteredResources.forEach((resource) => contestFor(resource).resources.push(resource));
  groups.sort((a, b) => Number(b.year) - Number(a.year));
  groups.forEach((group) => group.contests.sort((a, b) => compareRounds(a.name, b.name)));

  const clearFilters = () => {
    setMode('all');
    setYear('all');
    setRound('all');
  };

  let body;
  if (manifest.status !== 'ready') {
    body = (
      <LoadState
        status={manifest.status}
        error={manifest.error}
        loadingLabel='Loading the contest archive…'
        errorLabel='The contest archive didn’t load.'
        onRetry={onRetry}
      />
    );
  } else if (tests.length === 0) {
    body = (
      <div className='pr-state'>
        <p className='pr-state-title'>No contests have been added yet.</p>
        <p className='pr-state-detail'>Past UIL tests will appear here once they’re imported.</p>
      </div>
    );
  } else {
    body = (
      <>
        <div className='pr-filters'>
          <fieldset className='pr-type-filter pr-filter-type'>
            <legend className='sr-only'>Test type</legend>
            {[['all', 'All types'], ['mc', MODE_LABELS.mc], ['frq', MODE_LABELS.frq]].map(([value, label]) => (
              <label className='pr-type-option' key={value}>
                <input
                  type='radio'
                  name='practice-mode-filter'
                  value={value}
                  checked={mode === value}
                  onChange={() => setMode(value)}
                />
                <span className='pr-type-label'>
                  {label}
                  <span className='pr-type-count'>
                    <span className='sr-only'>, </span>
                    {value === 'all' ? placeTests.length : placeTests.filter((test) => test.mode === value).length}
                    <span className='sr-only'> tests</span>
                  </span>
                </span>
              </label>
            ))}
          </fieldset>

          <div className='pr-filter-selects'>
            <Select
              label='Year'
              value={year}
              options={[{ value: 'all', label: 'All years' }, ...years.map((value) => ({ value, label: value }))]}
              onChange={setYear}
            />
            <Select
              label='Round'
              value={round}
              options={[{ value: 'all', label: 'All rounds' }, ...rounds.map((value) => ({ value, label: value }))]}
              onChange={setRound}
            />
          </div>

          <div className='pr-filter-summary'>
            <p className='pr-count' role='status'>
              {filtersActive ? `${filtered.length} of ${plural(tests.length, 'test')}` : plural(tests.length, 'test')}
            </p>
            {filtersActive
              ? <button className='pr-link-button' type='button' onClick={clearFilters}>Clear filters</button>
              : null}
          </div>
        </div>

        {groups.length === 0
          ? (
            <div className='pr-state'>
              <p className='pr-state-title'>No tests match these filters.</p>
              <button className='pr-button' type='button' onClick={clearFilters}>Clear filters</button>
            </div>
            )
          : (
            <div className='pr-archive' data-mode-filter={mode}>
              {groups.map((group) => (
                <section className='pr-year' aria-labelledby={`practice-year-${group.year}`} key={group.year}>
                  <h3 className='pr-year-heading' id={`practice-year-${group.year}`}>{group.year}</h3>
                  <ul className='pr-contest-list'>
                    {group.contests.map((contest) => (
                      <li className='pr-contest' key={contest.name}>
                        <h4 className='pr-contest-name'>{contest.name}</h4>
                        {contest.tests.map((test) => (
                          <TestEntry
                            key={test.id}
                            test={test}
                            summary={summarizeTest(test, progress, now)}
                            onOpen={onOpen}
                          />
                        ))}
                        {contest.resources.length
                          ? (
                            <ul className='pr-resources' aria-label={`${group.year} ${contest.name} supplementary files`}>
                              {contest.resources.map((resource) => (
                                <li key={resource.url}>
                                  <a className='pr-resource-link' href={resource.url} download>
                                    {resource.title}<span className='sr-only'> (download)</span>
                                    <span className='action-arrow' aria-hidden='true'>↓</span>
                                  </a>
                                  {resource.note ? <p className='pr-resource-note'>{resource.note}</p> : null}
                                </li>
                              ))}
                            </ul>
                            )
                          : null}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
            )}
      </>
    );
  }

  return (
    <section className='pr-library' aria-labelledby='library-heading'>
      <div className='section-inner'>
        <header className='pr-library-head'>
          <h2 id='library-heading' tabIndex={-1}>Contest archive</h2>
          <p>Latest contests first. Original packets are available as PDF downloads.</p>
        </header>
        {body}
      </div>
    </section>
  );
}

function TestEntry ({ test, summary, onOpen }) {
  const name = `${test.title} ${MODE_LABELS[test.mode] || ''}`;

  return (
    <article className='pr-entry' data-mode={test.mode} data-state={summary.state}>
      <p className='pr-entry-mode'>{MODE_LABELS[test.mode] || test.mode}</p>
      <p className='pr-entry-meta'>{countLabel(test)}</p>
      <p className='pr-entry-status'>{summary.label}</p>
      <div className='pr-entry-actions'>
        <a
          className='pr-button'
          href={`?test=${encodeURIComponent(test.id)}`}
          onClick={(event) => {
            if (!getNavigationTarget(event, event.currentTarget, window.location.href)) return;
            event.preventDefault();
            onOpen(test.id);
          }}
        >
          {summary.action}<span className='sr-only'> {name}</span>
          <span className='action-arrow' aria-hidden='true'>→</span>
        </a>
        {test.pdfUrl
          ? (
            <a className='pr-link-button' href={test.pdfUrl} download>
              PDF<span className='sr-only'> of {name} (download)</span>
            </a>
            )
          : null}
      </div>
    </article>
  );
}

function WorkspaceHeader ({ test, headingRef, onBack, status }) {
  const reference = test.referenceImages[0];
  const referenceUrl = reference
    ? (test.pdfUrl && reference.page ? `${test.pdfUrl}#page=${reference.page}` : reference.url)
    : null;

  return (
    <header className='pr-ws-head'>
      <div className='pr-ws-title'>
        <BackLink onBack={onBack} />
        <h1 className='pr-ws-heading' ref={headingRef} tabIndex={-1}>{test.title}</h1>
        <p className='pr-ws-sub'>
          {MODE_LABELS[test.mode]} · {countLabel(test)}{status ? ` · ${status}` : ''}
        </p>
      </div>
      <div className='pr-ws-meta'>
        {referenceUrl
          ? (
            <a className='text-action secondary-action' href={referenceUrl} target='_blank' rel='noreferrer'>
              Reference sheet<span className='sr-only'> (opens in a new tab)</span>
              <span className='action-arrow' aria-hidden='true'>↗</span>
            </a>
            )
          : null}
        {test.pdfUrl
          ? (
            <a className='text-action secondary-action' href={test.pdfUrl} download>
              Download PDF
              <span className='action-arrow' aria-hidden='true'>↓</span>
            </a>
            )
          : null}
        {test.documentUrl ? <a className='text-action secondary-action' href={test.documentUrl} download>Original Word file<span className='action-arrow' aria-hidden='true'>↓</span></a> : null}
      </div>
    </header>
  );
}

function ConfirmDialog ({ open, title, children, confirmLabel, cancelLabel = 'Cancel', onConfirm, onClose }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    } else if (!open && dialog.open) {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    }
  }, [open]);

  return (
    <dialog
      className='pr-dialog'
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      {open
        ? (
          <>
            <h2 className='pr-dialog-title' id={titleId}>{title}</h2>
            <div className='pr-dialog-body'>{children}</div>
            <div className='pr-dialog-actions'>
              <button className='pr-button' type='button' onClick={onClose}>{cancelLabel}</button>
              <button className='pr-button' data-variant='primary' type='button' onClick={onConfirm}>{confirmLabel}</button>
            </div>
          </>
          )
        : null}
    </dialog>
  );
}

function ExamClock ({ remaining }) {
  const seconds = Math.max(0, Math.ceil(remaining / 1000));
  const minutes = Math.floor(seconds / 60);
  const announcement = seconds <= 60
    ? 'One minute remaining.'
    : seconds <= 300
      ? 'Five minutes remaining.'
      : seconds <= 600 ? 'Ten minutes remaining.' : '';

  return (
    <div className='pr-clock' data-urgent={seconds <= 300 ? '' : undefined}>
      <span className='pr-clock-label'>Time left</span>
      <span className='pr-clock-time' role='timer'>
        {minutes}:{String(seconds % 60).padStart(2, '0')}
      </span>
      <span className='sr-only' aria-live='polite'>{announcement}</span>
    </div>
  );
}

function StartPanel ({ test, onStart }) {
  return (
    <section className='pr-start' aria-labelledby='practice-start-heading'>
      <h2 className='pr-start-heading' id='practice-start-heading'>Choose how to take it.</h2>
      <div className='pr-start-options'>
        <div className='pr-start-option'>
          <h3>Practice</h3>
          <p className='pr-start-meta'>No clock</p>
          <p>Answer at your own pace and check each question against the key when you’re ready. The explanation appears as soon as you check.</p>
          <button className='pr-button' data-variant='primary' type='button' onClick={() => onStart('practice')}>
            Start practice
          </button>
        </div>
        <div className='pr-start-option'>
          <h3>Timed exam</h3>
          <p className='pr-start-meta'>45 minutes</p>
          <p>Contest conditions. Nothing is graded until you finish or time runs out, then you’ll see your score and every answer. The clock keeps running if you leave the page.</p>
          <button className='pr-button' data-variant='primary' type='button' onClick={() => onStart('exam')}>
            Start 45-minute exam
          </button>
        </div>
      </div>
      <p className='pr-start-foot'>
        {countLabel(test)} · +6 correct, −2 incorrect, 0 blank.
      </p>
    </section>
  );
}

function WrittenWorkspace ({ test, session, onUpdateSession, onBack, autoFocus }) {
  const questions = test.questions;
  const [dialog, setDialog] = useState(null);
  const headingRef = useRef(null);
  const resultsRef = useRef(null);
  const questionRef = useRef(null);
  const feedbackRef = useRef(null);
  const railRef = useRef(null);
  const pendingFocus = useRef(null);
  const wasSubmitted = useRef(Boolean(session?.submitted));
  const previousIndex = useRef(null);

  const inExam = Boolean(session && session.mode === 'exam' && !session.submitted);
  const now = useNow(inExam);
  const remaining = inExam
    ? (Number.isFinite(session.deadline) ? Math.min(session.deadline - now, EXAM_DURATION_MS) : 0)
    : null;
  const expired = inExam && remaining <= 0;
  const index = session ? clampIndex(session.currentIndex, questions.length) : 0;
  const question = questions[index];

  const update = (change) => onUpdateSession(test.id, change);

  const finish = (reason) => update((current) => {
    if (!current || current.submitted) return current;
    const result = scoreAnswers(questions, current.answers || {});
    return {
      ...current,
      submitted: true,
      timeExpired: reason === 'expired',
      finishedAt: reason === 'expired' && Number.isFinite(current.deadline) ? current.deadline : Date.now(),
      result: {
        correct: result.correct,
        incorrect: result.incorrect,
        unanswered: result.unanswered,
        score: result.score,
        maxScore: result.maxScore
      }
    };
  });

  useEffect(() => {
    if (autoFocus) headingRef.current?.focus();
  }, []);

  useEffect(() => {
    if (expired) finish('expired');
  }, [expired]);

  useEffect(() => {
    const submitted = Boolean(session?.submitted);
    if (submitted && !wasSubmitted.current) {
      pendingFocus.current = 'results';
      setDialog(null);
    }
    wasSubmitted.current = submitted;
  }, [session?.submitted]);

  useEffect(() => {
    const strip = railRef.current;
    const current = strip?.querySelector('[aria-current]');
    if (strip && current && strip.scrollWidth > strip.clientWidth) {
      strip.scrollLeft = current.offsetLeft - (strip.clientWidth - current.offsetWidth) / 2;
    }

    const panel = questionRef.current?.closest('.pr-question');
    if (previousIndex.current !== null && previousIndex.current !== index && panel && panel.getBoundingClientRect().top < 0) {
      panel.scrollIntoView({ block: 'start' });
    }
    previousIndex.current = index;
  }, [index, Boolean(session)]);

  useEffect(() => {
    const targets = { heading: headingRef, results: resultsRef, question: questionRef, feedback: feedbackRef };
    const target = targets[pendingFocus.current];
    if (!target) return;
    pendingFocus.current = null;
    target.current?.focus();
  });

  const modeStatus = session
    ? (session.submitted ? 'Finished' : session.mode === 'exam' ? 'Timed exam' : 'Practice')
    : null;

  if (questions.length === 0) {
    return (
      <div className='pr-wide pr-shell'>
        <WorkspaceHeader test={test} headingRef={headingRef} onBack={onBack} />
        <div className='pr-state'>
          <p className='pr-state-title'>This test doesn’t have any questions yet.</p>
          <p className='pr-state-detail'>Try the original PDF instead, or pick another contest.</p>
        </div>
      </div>
    );
  }

  const goTo = (nextIndex) => update((current) => current && { ...current, currentIndex: clampIndex(nextIndex, questions.length) });

  const setAnswer = (target, value) => update((current) => {
    if (!current || current.submitted || hasExpired(current) || current.checked?.[target.id]) return current;
    const answers = { ...current.answers };
    if (value === '') delete answers[target.id];
    else answers[target.id] = value;
    return { ...current, answers };
  });

  const check = (target) => {
    if (!hasAnswer(session.answers?.[target.id])) return;
    pendingFocus.current = 'feedback';
    update((current) => ({ ...current, checked: { ...current.checked, [target.id]: true } }));
  };

  const retryMissed = () => update((current) => {
    const answers = {};
    const checked = {};
    questions.forEach((item) => {
      if (answerIsCorrect(current.answers?.[item.id], item)) {
        answers[item.id] = current.answers[item.id];
        checked[item.id] = true;
      }
    });
    const firstOpen = questions.findIndex((item) => !checked[item.id]);
    return {
      ...newSession('practice'),
      answers,
      checked,
      currentIndex: Math.max(firstOpen, 0)
    };
  });

  const confirm = () => {
    if (dialog === 'finish') finish('manual');
    if (dialog === 'reset') {
      pendingFocus.current = 'heading';
      update(() => null);
    }
    if (dialog === 'retry') {
      pendingFocus.current = 'question';
      retryMissed();
    }
    setDialog(null);
  };

  const workspaceHeader = <WorkspaceHeader test={test} headingRef={headingRef} onBack={onBack} status={modeStatus} />;

  if (!session) {
    return (
      <div className='pr-wide pr-shell'>
        {workspaceHeader}
        <StartPanel test={test} onStart={(mode) => update(() => newSession(mode))} />
      </div>
    );
  }

  const answers = session.answers || {};
  const states = questions.map((item) => questionState(item, session));
  const answeredCount = questions.filter((item) => hasAnswer(answers[item.id])).length;
  const unansweredCount = questions.length - answeredCount;
  const checkedQuestions = questions.filter((item) => session.checked?.[item.id]);
  const running = scoreAnswers(checkedQuestions, answers);
  const final = session.submitted ? scoreAnswers(questions, answers) : null;
  const missedCount = final ? final.incorrect + final.unanswered : 0;
  const firstMissed = states.findIndex((state) => state === 'incorrect' || state === 'skipped');

  const progressText = session.submitted
    ? `Score ${final.score} of ${final.maxScore}`
    : session.mode === 'exam'
      ? `${answeredCount} of ${questions.length} answered`
      : `${checkedQuestions.length} of ${questions.length} checked · ${running.correct} correct`;

  return (
    <div className='pr-wide pr-shell'>
      {workspaceHeader}

      {session.submitted
        ? (
          <section className='pr-results' aria-labelledby='practice-results-heading'>
            <div className='pr-results-score'>
              <p className='pr-results-label'>{session.timeExpired ? 'Time ran out' : 'Final score'}</p>
              <h2 id='practice-results-heading' ref={resultsRef} tabIndex={-1}>
                <span className='sr-only'>Score: </span>
                {final.score}
                <span className='pr-results-max'> of {final.maxScore}</span>
              </h2>
            </div>
            <dl className='pr-results-counts'>
              <div data-result='correct'><dt>Correct</dt><dd>{final.correct}</dd></div>
              <div data-result='incorrect'><dt>Incorrect</dt><dd>{final.incorrect}</dd></div>
              <div><dt>Skipped</dt><dd>{final.unanswered}</dd></div>
            </dl>
            <div className='pr-results-actions'>
              {firstMissed !== -1
                ? (
                  <button className='pr-button' type='button' onClick={() => goTo(firstMissed)}>
                    Review first miss
                  </button>
                  )
                : null}
              {missedCount > 0
                ? (
                  <button className='pr-button' data-variant='primary' type='button' onClick={() => setDialog('retry')}>
                    Retry {plural(missedCount, 'missed question')}
                  </button>
                  )
                : null}
            </div>
          </section>
          )
        : null}

      <div className='pr-workspace' data-kind='written'>
        <div className='pr-sidebar'>
          <div className='pr-rail'>
            <div className='pr-rail-status'>
              <p className='pr-rail-progress'>{progressText}</p>
              {inExam ? <ExamClock remaining={remaining} /> : null}
            </div>
            <nav aria-label='Questions'>
              <ol className='pr-qnav' ref={railRef}>
                {questions.map((item, itemIndex) => (
                  <li key={item.id}>
                    <button
                      className='pr-qbtn'
                      type='button'
                      data-state={states[itemIndex]}
                      aria-current={itemIndex === index ? 'step' : undefined}
                      aria-label={`Question ${item.number}, ${QUESTION_STATE_LABELS[states[itemIndex]]}`}
                      onClick={() => goTo(itemIndex)}
                    >
                      {item.number}
                      {QUESTION_MARKS[states[itemIndex]]
                        ? <span className='pr-qmark' aria-hidden='true'>{QUESTION_MARKS[states[itemIndex]]}</span>
                        : null}
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
            <ul className='pr-legend' aria-hidden='true'>
              {session.submitted || checkedQuestions.length
                ? (
                  <>
                    <li data-state='correct'>✓ Correct</li>
                    <li data-state='incorrect'>✕ Incorrect</li>
                    {session.submitted ? <li>– Skipped</li> : null}
                  </>
                  )
                : <li data-state='answered'>Answered</li>}
            </ul>
          </div>

          <div className='pr-sidebar-actions'>
            {!session.submitted
              ? (
                <button className='pr-button' type='button' onClick={() => setDialog('finish')}>
                  Finish and score
                </button>
                )
              : null}
            <button className='pr-link-button' type='button' onClick={() => setDialog('reset')}>
              Start over
            </button>
          </div>
        </div>

        <QuestionPanel
          key={question.id}
          question={question}
          index={index}
          total={questions.length}
          session={session}
          headingRef={questionRef}
          feedbackRef={feedbackRef}
          onAnswer={(value) => setAnswer(question, value)}
          onCheck={() => check(question)}
          onGo={goTo}
          onFinish={() => setDialog('finish')}
        />
      </div>

      <ConfirmDialog
        open={dialog === 'finish'}
        title='Finish and score this test?'
        confirmLabel='Finish and score'
        cancelLabel='Keep working'
        onConfirm={confirm}
        onClose={() => setDialog(null)}
      >
        <p>
          {unansweredCount > 0
            ? `${plural(unansweredCount, 'question')} ${unansweredCount === 1 ? 'is' : 'are'} still unanswered. Blank answers score 0.`
            : 'Every question has an answer.'}
          {inExam && remaining > 60000 ? ` You still have ${Math.floor(remaining / 60000)} minutes.` : ''}
        </p>
        <p>Answers and explanations appear after you finish.</p>
      </ConfirmDialog>

      <ConfirmDialog
        open={dialog === 'reset'}
        title='Start this test over?'
        confirmLabel='Start over'
        onConfirm={confirm}
        onClose={() => setDialog(null)}
      >
        <p>This clears your answers{session.submitted ? ' and score' : ', checked results, and timer'} for {test.title}. It can’t be undone.</p>
      </ConfirmDialog>

      <ConfirmDialog
        open={dialog === 'retry'}
        title='Retry the questions you missed?'
        confirmLabel='Retry missed'
        onConfirm={confirm}
        onClose={() => setDialog(null)}
      >
        <p>
          Your correct answers stay. The {plural(missedCount, 'missed question')} {missedCount === 1 ? 'is' : 'are'} cleared and you’ll continue in practice mode. This replaces your final score.
        </p>
      </ConfirmDialog>
    </div>
  );
}

function QuestionPanel ({ question, index, total, session, headingRef, feedbackRef, onAnswer, onCheck, onGo, onFinish }) {
  const inputId = useId();
  const legendId = useId();
  const answer = session.answers?.[question.id] ?? '';
  const revealed = session.submitted || Boolean(session.checked?.[question.id]);
  const isShort = question.kind === 'short' || question.choices.length === 0;
  const answered = hasAnswer(answer);
  const chosen = answered ? normalizeAnswer(answer) : null;
  const key = normalizeAnswer(String(question.answer ?? ''));
  const result = !answered ? 'skipped' : answerIsCorrect(answer, question) ? 'correct' : 'incorrect';
  const isLast = index === total - 1;
  const choiceBlocks = (letter) => {
    const match = question.choiceContent.find((item) => normalizeAnswer(item.label) === normalizeAnswer(letter));
    return Array.isArray(match?.content) ? coalesceChoiceCodeBlocks(match.content.filter(isRecord)) : [];
  };

  return (
    <section className='pr-question' aria-labelledby='practice-question-heading'>
      <div className='pr-question-head'>
        <h2 id='practice-question-heading' ref={headingRef} tabIndex={-1}>
          Question {question.number}
        </h2>
        <p>{index + 1} of {total}</p>
      </div>

      <Prompt item={question} />

      {isShort
        ? (
          <div className='pr-short'>
            <label htmlFor={inputId}>Your answer</label>
            <input
              id={inputId}
              type='text'
              value={answer}
              disabled={revealed}
              autoComplete='off'
              autoCapitalize='off'
              autoCorrect='off'
              spellCheck={false}
              onChange={(event) => onAnswer(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && session.mode === 'practice') onCheck();
              }}
            />
          </div>
          )
        : (
          <fieldset className='pr-choices' aria-labelledby={legendId}>
            <legend className='sr-only' id={legendId}>Answer choices for question {question.number}</legend>
            {question.choices.map((letter) => {
              const normalized = normalizeAnswer(letter);
              const isKey = revealed && normalized === key;
              const isWrongPick = revealed && normalized === chosen && !isKey;
              const blocks = choiceBlocks(letter);

              return (
                <label
                  className='pr-choice'
                  key={letter}
                  data-selected={chosen === normalized ? '' : undefined}
                  data-state={isKey ? 'key' : isWrongPick ? 'wrong' : undefined}
                >
                  <input
                    className='pr-choice-input'
                    type='radio'
                    name={`answer-${question.id}`}
                    value={letter}
                    checked={chosen === normalized}
                    disabled={revealed}
                    onChange={() => onAnswer(letter)}
                  />
                  <span className='pr-choice-letter' aria-hidden={blocks.length ? undefined : 'true'}>{letter}</span>
                  <span className='pr-choice-body'>
                    {blocks.length ? <ContentBlocks blocks={blocks} inline /> : <span className='sr-only'>Choice {letter}</span>}
                  </span>
                  {isKey
                    ? <span className='pr-choice-mark'><span aria-hidden='true'>✓</span><span className='sr-only'>, correct answer</span></span>
                    : null}
                  {isWrongPick
                    ? <span className='pr-choice-mark'><span aria-hidden='true'>✕</span><span className='sr-only'>, your answer</span></span>
                    : null}
                </label>
              );
            })}
          </fieldset>
          )}

      {!revealed
        ? (
          <div className='pr-answer-actions'>
            {session.mode === 'practice'
              ? (
                <button className='pr-button' data-variant='primary' type='button' disabled={!answered} onClick={onCheck}>
                  Check answer
                </button>
                )
              : <p className='pr-field-hint'>Scored when you finish.</p>}
            {answered
              ? <button className='pr-link-button' type='button' onClick={() => onAnswer('')}>Clear answer</button>
              : null}
          </div>
          )
        : (
          <div className='pr-feedback' data-result={result} ref={feedbackRef} tabIndex={-1}>
            <p className='pr-feedback-title'>
              {result === 'correct' ? 'Correct' : result === 'incorrect' ? 'Incorrect' : 'Not answered'}
            </p>
            <dl className='pr-feedback-answers'>
              <div><dt>Answer key</dt><dd>{question.answer}</dd></div>
              {answered ? <div><dt>Your answer</dt><dd>{answer.trim()}</dd></div> : null}
            </dl>
            <div className='pr-explanation'>
              <h3>Explanation</h3>
              {String(question.explanation || '').trim()
                ? <p>{question.explanation}</p>
                : <p className='pr-muted'>The answer key doesn’t include an explanation for this question.</p>}
            </div>
          </div>
          )}

      <div className='pr-stepper'>
        <button className='pr-button' type='button' disabled={index === 0} onClick={() => onGo(index - 1)}>
          <span aria-hidden='true'>←</span> Previous
        </button>
        {isLast && !session.submitted
          ? <button className='pr-button' type='button' onClick={onFinish}>Finish and score</button>
          : (
            <button className='pr-button' type='button' disabled={isLast} onClick={() => onGo(index + 1)}>
              Next <span aria-hidden='true'>→</span>
            </button>
            )}
      </div>
    </section>
  );
}

function ProgrammingWorkspace ({ test, session, drafts, onUpdateSession, onDraft, onBack, autoFocus }) {
  const problems = test.questions;
  const headingRef = useRef(null);
  const railRef = useRef(null);
  const statementRef = useRef(null);
  const index = clampIndex(session?.currentIndex, problems.length);
  const problem = problems[index];

  useEffect(() => {
    if (autoFocus) headingRef.current?.focus();
  }, []);

  useEffect(() => {
    const strip = railRef.current;
    const current = strip?.querySelector('[aria-current]');
    if (strip && current && strip.scrollWidth > strip.clientWidth) {
      strip.scrollLeft = current.offsetLeft - (strip.clientWidth - current.offsetWidth) / 2;
    }
    const statement = statementRef.current;
    if (statement && statement.getBoundingClientRect().top < 0) statement.scrollIntoView({ block: 'start' });
  }, [index]);

  if (!problem) {
    return (
      <div className='pr-wide pr-shell'>
        <WorkspaceHeader test={test} headingRef={headingRef} onBack={onBack} />
        <div className='pr-state'>
          <p className='pr-state-title'>This packet doesn’t have any problems yet.</p>
          <p className='pr-state-detail'>Try the original PDF instead, or pick another contest.</p>
        </div>
      </div>
    );
  }

  const goTo = (nextIndex) => onUpdateSession(test.id, (current) => ({
    ...(current || newSession('practice')),
    currentIndex: clampIndex(nextIndex, problems.length)
  }));
  const problemTitle = problem.title || `Problem ${problem.number}`;

  return (
    <div className='pr-wide pr-shell'>
      <WorkspaceHeader test={test} headingRef={headingRef} onBack={onBack} status='Java' />

      <div className='pr-workspace' data-kind='programming'>
        <div className='pr-sidebar'>
          <div className='pr-rail'>
            <nav aria-label='Problems'>
              <ol className='pr-plist' ref={railRef}>
                {problems.map((item, itemIndex) => (
                  <li key={item.id}>
                    <button
                      className='pr-pbtn'
                      type='button'
                      aria-current={itemIndex === index ? 'step' : undefined}
                      onClick={() => goTo(itemIndex)}
                    >
                      <span className='pr-pnum'>{item.number}</span>
                      <span className='pr-ptitle'>{item.title || `Problem ${item.number}`}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>

        <section className='pr-question pr-statement' ref={statementRef} aria-labelledby='practice-problem-heading'>
          <div className='pr-question-head'>
            <h2 id='practice-problem-heading'>{problemTitle}</h2>
            <p>Problem {problem.number} of {problems.length}</p>
          </div>
          <Prompt item={problem} />
          <div className='pr-stepper'>
            <button className='pr-button' type='button' disabled={index === 0} onClick={() => goTo(index - 1)}>
              <span aria-hidden='true'>←</span> Previous
            </button>
            <button className='pr-button' type='button' disabled={index === problems.length - 1} onClick={() => goTo(index + 1)}>
              Next <span aria-hidden='true'>→</span>
            </button>
          </div>
        </section>

        <CodePanel
          key={problem.id}
          problem={problem}
          problemTitle={problemTitle}
          judgePdfUrl={test.judgePdfUrl}
          draft={drafts[draftKey(problem.id)] || ''}
          onDraft={(value) => onDraft(problem.id, value)}
        />
      </div>
    </div>
  );
}

function JudgePdfLink ({ url }) {
  if (!url) return null;
  return (
    <a className='pr-inline-link' href={url} target='_blank' rel='noreferrer'>
      Judge packet PDF<span className='sr-only'> (opens in a new tab)</span>
    </a>
  );
}

function CodePanel ({ problem, problemTitle, judgePdfUrl, draft, onDraft }) {
  const editorId = useId();
  const editorHintId = useId();
  const escaped = useRef(false);
  const inputs = problem.files.filter((file) => file.role === 'input');
  const outputs = problem.files.filter((file) => file.role === 'output');
  const solutions = problem.files.filter((file) => file.role === 'solution' && /\.java$/i.test(String(file.name)));
  const fileName = solutionFileName(problem);

  const handleEditorKey = (event) => {
    if (event.key === 'Escape') {
      escaped.current = true;
      return;
    }
    if (event.key !== 'Tab' || event.shiftKey || event.altKey || event.ctrlKey || event.metaKey || escaped.current) {
      escaped.current = false;
      return;
    }

    event.preventDefault();
    const editor = event.currentTarget;
    const { selectionStart, selectionEnd, value } = editor;
    onDraft(`${value.slice(0, selectionStart)}    ${value.slice(selectionEnd)}`);
    window.requestAnimationFrame(() => {
      editor.selectionStart = selectionStart + 4;
      editor.selectionEnd = selectionStart + 4;
    });
  };

  return (
    <section className='pr-code' aria-labelledby='practice-code-heading'>
      <div className='pr-panel-block'>
        <div className='pr-code-head'>
          <h2 id='practice-code-heading'>Your solution</h2>
          <span className='pr-file-name'>{fileName}</span>
        </div>
        <label className='sr-only' htmlFor={editorId}>Java solution for {problemTitle}</label>
        <textarea
          className='pr-editor'
          id={editorId}
          value={draft}
          rows={16}
          wrap='off'
          spellCheck={false}
          autoCapitalize='off'
          autoComplete='off'
          autoCorrect='off'
          aria-describedby={editorHintId}
          placeholder={`public class ${fileName.replace(/\.java$/, '')} {\n    public static void main(String[] args) {\n    }\n}`}
          onChange={(event) => onDraft(event.target.value)}
          onKeyDown={handleEditorKey}
          onFocus={() => { escaped.current = false; }}
        />
        <div className='pr-code-actions'>
          <button className='pr-button' type='button' disabled={!draft.trim()} onClick={() => downloadText(fileName, draft)}>
            Download {fileName}
          </button>
          <p className='pr-field-hint' id={editorHintId}>
            Tab indents; press Esc, then Tab to leave the editor. Your draft is saved in this browser.
          </p>
        </div>
      </div>

      <div className='pr-panel-block'>
        <h3>Run it on your computer</h3>
        <p className='pr-block-copy'>
          This site doesn’t compile or run code. Run your program locally
          {inputs.length ? ' with the judge input below' : ' using the sample input in the problem'}, then paste what it prints to compare.
        </p>
        {inputs.length
          ? <FileList files={inputs} />
          : <p className='pr-field-hint'>No judge input file is included in this packet.</p>}
      </div>

      <OutputCompare outputs={outputs} judgePdfUrl={judgePdfUrl} />

      {solutions.length || judgePdfUrl ? <SolutionReveal files={solutions} judgePdfUrl={judgePdfUrl} /> : null}
    </section>
  );
}

function CompressedHint ({ file }) {
  if (!file.compressed) return null;
  const plain = String(file.name).replace(/\.gz$/i, '');
  return (
    <p className='pr-field-hint'>
      Large file, gzip-compressed. After downloading, run <code>gunzip {file.name}</code> to get <code>{plain}</code>.
    </p>
  );
}

function FileList ({ files }) {
  return (
    <ul className='pr-files'>
      {files.map((file) => (
        <li key={file.url || file.name}>
          <div className='pr-file-row'>
            <span className='pr-file-name'>{file.name}</span>
            {file.url
              ? <a href={file.url} download={file.name}>Download<span className='sr-only'> {file.name}</span></a>
              : null}
          </div>
          <CompressedHint file={file} />
          {typeof file.text === 'string' && file.text !== ''
            ? (
              <details className='pr-file-view'>
                <summary>View<span className='sr-only'> {file.name}</span></summary>
                <pre className='pr-pre'>{file.text}</pre>
              </details>
              )
            : null}
        </li>
      ))}
    </ul>
  );
}

function renderDiffLine (value) {
  if (value === undefined) return <em className='pr-diff-missing'>no line</em>;
  if (value === '') return <em className='pr-diff-missing'>blank line</em>;
  return <code>{value}</code>;
}

function OutputCompare ({ outputs, judgePdfUrl }) {
  const [selected, setSelected] = useState(0);
  const [actual, setActual] = useState('');
  const [result, setResult] = useState(null);
  const [showJudge, setShowJudge] = useState(false);
  const outputId = useId();
  const resultRef = useRef(null);
  const output = outputs[selected];
  const [loaded, setLoaded] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const requestRef = useRef(null);
  const actualRef = useRef(actual);
  actualRef.current = actual;
  const judgeText = typeof output?.text === 'string' ? output.text : loaded?.url === output?.url ? loaded.text : null;

  useEffect(() => {
    setLoaded(null);
    setResult(null);
    setShowJudge(false);
    setLoading(false);
    setLoadError('');
    return () => requestRef.current?.abort();
  }, [output?.url]);

  const useJudgeOutput = async (compare) => {
    if (loading) return;
    let text = judgeText;
    if (text === null && output?.url) {
      const controller = new AbortController();
      requestRef.current = controller;
      setLoading(true);
      setLoadError('');
      try {
        const response = await fetch(output.url, { signal: controller.signal });
        if (!response.ok) throw Error(`HTTP ${response.status}`);
        text = (await response.text()).replace(/^\uFEFF/, '');
        if (controller.signal.aborted) return;
        setLoaded({ url: output.url, text });
      } catch (error) {
        if (error.name !== 'AbortError') setLoadError('Judge output didn’t load. Try again or download the file.');
        return;
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    if (text === null) return;
    if (compare) setResult(compareOutputs(actualRef.current, text));
    setShowJudge(true);
  };

  useEffect(() => {
    if (result) resultRef.current?.focus();
  }, [result]);

  if (outputs.length === 0) {
    return (
      <div className='pr-panel-block'>
        <h3>Compare output</h3>
        <p className='pr-block-copy'>
          No judge output file is included in this packet. Check your result against the sample output in the problem.
          {judgePdfUrl ? ' The judge packet PDF is linked under Solution below.' : ''}
        </p>
      </div>
    );
  }

  return (
    <div className='pr-panel-block'>
      <h3>Compare output</h3>
      {outputs.length > 1
        ? (
          <Select
            className='pr-select-block'
            label='Judge file'
            value={selected}
            options={outputs.map((file, index) => ({ value: index, label: file.name }))}
            onChange={(value) => {
              setSelected(value);
              setResult(null);
            }}
          />
          )
        : null}
      <label className='pr-block-label' htmlFor={outputId}>Your program’s output</label>
      <textarea
        className='pr-output-input'
        id={outputId}
        value={actual}
        rows={6}
        wrap='off'
        spellCheck={false}
        placeholder='Paste the output here'
        onChange={(event) => {
          setActual(event.target.value);
          setResult(null);
        }}
      />
      <p className='pr-field-hint'>Trailing spaces and blank lines at the end are ignored; everything else must match exactly.</p>
      <div className='pr-code-actions'>
        {judgeText !== null || output.url
          ? (
            <button
              className='pr-button'
              data-variant='primary'
              type='button'
              disabled={loading}
              onClick={() => useJudgeOutput(true)}
            >
              {loading ? 'Loading judge output…' : `Compare with ${output.name}`}
            </button>
            )
          : null}
        {!showJudge
          ? <button className='pr-link-button' type='button' disabled={loading} onClick={() => useJudgeOutput(false)}>Show judge output</button>
          : null}
      </div>

      {loadError ? <p className='pr-field-hint' role='alert'>{loadError} <a href={output.url} download={output.name}>Download {output.name}</a></p> : null}

      {result
        ? (
          <div className='pr-compare-result' data-status={result.status} ref={resultRef} tabIndex={-1}>
            {result.status === 'empty'
              ? <p className='pr-compare-title'>Paste your program’s output first.</p>
              : null}
            {result.status === 'match'
              ? (
                <p className='pr-compare-title'>
                  {result.lineCount === 0
                    ? '✓ Both outputs are empty, so they match.'
                    : `✓ Matches the judge output (${plural(result.lineCount, 'line')}).`}
                </p>
                )
              : null}
            {result.status === 'mismatch'
              ? (
                <>
                  <p className='pr-compare-title'>
                    ✕ {plural(result.differenceCount, 'line')} {result.differenceCount === 1 ? 'differs' : 'differ'}.
                  </p>
                  <p className='pr-field-hint'>
                    Yours has {plural(result.mineCount, 'line')}; the judge output has {plural(result.judgeCount, 'line')}.
                    {result.judgeCount === 0 ? ' The judge output is empty.' : ''}
                    {result.differenceCount > MAX_DIFF_LINES ? ` Showing the first ${MAX_DIFF_LINES}.` : ''}
                  </p>
                  <ol className='pr-diff'>
                    {result.differences.slice(0, MAX_DIFF_LINES).map((difference) => (
                      <li key={difference.line}>
                        <p className='pr-diff-line'>Line {difference.line}</p>
                        <dl>
                          <div><dt>Judge</dt><dd>{renderDiffLine(difference.judge)}</dd></div>
                          <div><dt>Yours</dt><dd>{renderDiffLine(difference.mine)}</dd></div>
                        </dl>
                      </li>
                    ))}
                  </ol>
                </>
                )
              : null}
          </div>
          )
        : null}

      {showJudge
        ? (
          <div className='pr-judge-output'>
            <div className='pr-file-row'>
              <span className='pr-file-name'>{output.name}</span>
              {output.url ? <a href={output.url} download={output.name}>Download<span className='sr-only'> {output.name}</span></a> : null}
            </div>
            <CompressedHint file={output} />
            {judgeText !== null
              ? <>
                  <pre className='pr-pre'>{judgeText.slice(0, 100000) || ' '}</pre>
                  {judgeText.length > 100000 ? <p className='pr-field-hint'>Preview shows the first 100 KB. Comparison uses the complete file; download for the full output.</p> : null}
                </>
              : <p className='pr-field-hint'>Download the file to compare by hand.</p>}
          </div>
          )
        : null}
    </div>
  );
}

function SolutionReveal ({ files, judgePdfUrl }) {
  const [open, setOpen] = useState(false);
  const regionId = useId();

  return (
    <div className='pr-panel-block'>
      <h3>Solution</h3>
      {files.length
        ? (
          <>
            {!open
              ? <p className='pr-block-copy'>The Java solution supplied with this contest. Give the problem a real attempt first.</p>
              : null}
            <button className='pr-button' type='button' aria-expanded={open} aria-controls={regionId} onClick={() => setOpen(!open)}>
              {open ? 'Hide solution' : 'Reveal solution'}
            </button>
          </>
          )
        : <p className='pr-block-copy'>No Java solution file is included in this packet.</p>}
      {judgePdfUrl
        ? (
          <p className='pr-field-hint'>
            Optional: <JudgePdfLink url={judgePdfUrl} />, which includes the official solutions.
          </p>
          )
        : null}
      <div id={regionId} hidden={!open}>
        {open
          ? files.map((file) => (
            <div className='pr-solution' key={file.url || file.name}>
              <div className='pr-file-row'>
                <span className='pr-file-name'>{file.name}</span>
                {file.url ? <a href={file.url} download={file.name}>Download<span className='sr-only'> {file.name}</span></a> : null}
              </div>
              {typeof file.text === 'string' ? <pre className='pr-pre pr-pre-tall'><code>{file.text}</code></pre> : null}
            </div>
          ))
          : null}
      </div>
    </div>
  );
}
