import {
  allArchiveFilters,
  getArchiveRequest,
  getInitialArchiveFilters,
  getNavigationTarget,
  getPage,
  getSavedArchiveFilters,
  withArchiveFilters
} from '../lib/navigation.js';
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import '../practice.css';
import { loadProgress, saveProgress } from '../lib/practice.js';
import { MODE_LABELS, isRecord, hasAnswer, plural, draftKey, countLabel } from '../lib/practice-model.js';
import { BackLink, LoadState, Select } from './PracticeControls.jsx';

const MANIFEST_URL = '/practice-data/manifest.json';

const ROUNDS = ['Invitational A', 'Invitational B', 'District', 'District 1', 'District 2', 'District A', 'District B', 'Regional', 'State', 'UTCS Invitational', 'Practice test'];

function readTestParam () {
  try {
    return new URLSearchParams(window.location.search).get('test') || null;
  } catch {
    return null;
  }
}

// A history entry the archive already showed keeps its filters; header links such
// as ?type=mc choose the Type for a new one.
function readArchiveFilters () {
  try {
    return getInitialArchiveFilters(window.location.search, window.history.state);
  } catch {
    return getInitialArchiveFilters('', null);
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

function loadedManifest (data) {
  const tests = Array.isArray(data?.tests)
    ? data.tests.filter((test) => isRecord(test) && test.id && test.dataUrl)
    : [];
  const resources = Array.isArray(data?.resources)
    ? data.resources.filter((resource) => isRecord(resource) && resource.url)
    : [];
  return { status: 'ready', tests: sortTests(tests), resources, error: '' };
}

export default function PracticePage ({ onReady, initialManifest = null, prerendered = false }) {
  const [stateRestored, setStateRestored] = useState(!prerendered);
  // Hydrate the public archive first, then restore private browser state before paint.
  const [progress, setProgress] = useState(() => prerendered ? { version: 1, sessions: {}, drafts: {} } : loadProgress());
  const [saveFailed, setSaveFailed] = useState(false);
  const [manifest, setManifest] = useState(() => initialManifest ? loadedManifest(initialManifest) : { status: 'loading', tests: [], resources: [], error: '' });
  const [manifestAttempt, setManifestAttempt] = useState(0);
  const [selectedId, setSelectedId] = useState(() => prerendered ? null : readTestParam());
  const [testLoad, setTestLoad] = useState({ id: null, status: 'idle', data: null, error: '' });
  const [testAttempt, setTestAttempt] = useState(0);
  const [archive, setArchive] = useState(() => prerendered ? allArchiveFilters : readArchiveFilters());
  const progressRef = useRef(progress);
  const testCache = useRef(new Map());
  const navigated = useRef(false);

  useLayoutEffect(() => {
    if (!prerendered) return;
    const restoredProgress = loadProgress();
    if (Object.keys(restoredProgress.sessions).length || Object.keys(restoredProgress.drafts).length) setProgress(restoredProgress);
    setSelectedId(readTestParam());
    const restoredArchive = readArchiveFilters();
    setArchive(current => current.mode === restoredArchive.mode && current.year === restoredArchive.year && current.round === restoredArchive.round ? current : restoredArchive);
    setStateRestored(true);
  }, []);

  useEffect(() => {
    progressRef.current = progress;
    if (!stateRestored) return;
    const timer = window.setTimeout(() => setSaveFailed(!saveProgress(progress)), 250);
    return () => window.clearTimeout(timer);
  }, [progress, stateRestored]);

  useEffect(() => {
    const flush = () => saveProgress(progressRef.current);
    const syncFromUrl = () => {
      if (getPage(window.location.pathname) !== 'practice') return;
      navigated.current = true;
      setSelectedId(readTestParam());
      // Back and Forward restore the filters saved on an archive entry. Other entries
      // keep the current filters; the copy saves them on the entry (see below).
      const saved = getSavedArchiveFilters(window.history.state);
      setArchive((current) => saved || { ...current });
    };
    // Type links reset the archive on click rather than on popstate, so returning to
    // a ?type= entry restores it, and a link to the current URL still applies.
    const requestArchive = (event) => {
      const request = getArchiveRequest(event, event.target.closest?.('a[href]'), window.location.href);
      if (request) setArchive(request);
    };

    window.addEventListener('pagehide', flush);
    window.addEventListener('popstate', syncFromUrl);
    document.addEventListener('click', requestArchive);
    return () => {
      flush();
      window.removeEventListener('pagehide', flush);
      window.removeEventListener('popstate', syncFromUrl);
      document.removeEventListener('click', requestArchive);
    };
  }, []);

  // Save the archive's filters on its history entry so returning to it restores them.
  useEffect(() => {
    if (!stateRestored || selectedId) return;
    try {
      window.history.replaceState(withArchiveFilters(window.history.state, archive), '');
    } catch { /* Without saved state, Back keeps the current filters. */ }
  }, [archive, selectedId, stateRestored]);

  useEffect(() => {
    if (initialManifest && manifestAttempt === 0) return;
    const controller = new AbortController();
    setManifest((current) => ({ ...current, status: 'loading', error: '' }));

    fetchJson(MANIFEST_URL, controller.signal)
      .then((data) => {
        setManifest(loadedManifest(data));
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
      setTestLoad({ id: selectedTest.id, status: 'ready', ...cached, error: '' });
      return undefined;
    }

    const controller = new AbortController();
    let active = true;
    setTestLoad({ id: selectedTest.id, status: 'loading', data: null, error: '' });

    // Fetch questions and their runner together; the archive needs neither.
    const workspace = import('./PracticeWorkspace.jsx').catch((error) => {
      error.reload = true;
      throw error;
    });
    Promise.all([fetchJson(selectedTest.dataUrl, controller.signal), workspace])
      .then(([data, module]) => {
        if (!active) return;
        const test = normalizeTest(selectedTest, data);
        const loaded = { data: test, Workspace: module.default };
        testCache.current.set(selectedTest.id, loaded);
        setTestLoad({ id: selectedTest.id, status: 'ready', ...loaded, error: '' });
      })
      .catch((error) => {
        if (!active || error.name === 'AbortError') return;
        setTestLoad({ id: selectedTest.id, status: 'error', data: null, error: error.message, reload: Boolean(error.reload) });
      });

    return () => { active = false; controller.abort(); };
  }, [selectedTest, testAttempt]);

  useEffect(() => {
    const base = 'Practice | Westlake Computer Science Club';
    document.title = selectedTest
      ? `${selectedTest.title} ${MODE_LABELS[selectedTest.mode] || ''} | ${base}`
      : base;
  }, [selectedTest]);

  // Restore cross-page history only after the archive or test has its full layout.
  const contentReady = stateRestored && (manifest.status === 'error' || (manifest.status === 'ready' && (
    !selectedId || !selectedTest || (testLoad.id === selectedId && ['ready', 'error'].includes(testLoad.status))
  )));
  useEffect(() => {
    if (contentReady) onReady?.();
  }, [contentReady, onReady, selectedId]);

  const navigate = useCallback((testId) => {
    const url = new URL(window.location.href);
    if (testId) url.searchParams.set('test', testId);
    else url.searchParams.delete('test');
    // A type request belongs to the link that made it; the entries pushed here carry
    // their filters in history state instead.
    url.searchParams.delete('type');
    url.hash = '';
    window.history.pushState({}, '', url);
    navigated.current = true;
    setSelectedId(testId);
    window.scrollTo({ left: 0, top: 0, behavior: 'instant' });
  }, []);

  const changeMode = useCallback(mode => setArchive(current => ({ ...current, mode })), []);
  const changeYear = useCallback(year => setArchive(current => ({ ...current, year })), []);
  const changeRound = useCallback(round => setArchive(current => ({ ...current, round })), []);
  const retryManifest = useCallback(() => setManifestAttempt(attempt => attempt + 1), []);

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
    setArchive({ mode, year: 'all', round: 'all' });
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
          prerendered={prerendered}
          manifest={manifest}
          progress={progress}
          mode={archive.mode}
          onModeChange={changeMode}
          year={archive.year}
          onYearChange={changeYear}
          round={archive.round}
          onRoundChange={changeRound}
          onOpen={navigate}
          onRetry={retryManifest}
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
          error={testLoad.reload ? '' : testLoad.error}
          loadingLabel='Loading questions…'
          errorLabel='This test didn’t load.'
          retryLabel={testLoad.reload ? 'Reload page' : 'Try again'}
          onRetry={() => testLoad.reload ? window.location.reload() : setTestAttempt((attempt) => attempt + 1)}
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

    const Workspace = testLoad.Workspace;
    content = <Workspace {...shared} key={test.id} drafts={progress.drafts} onDraft={setDraft} />;
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
    </main>
  );

  return main;
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
              Past UIL computer science contests. Your answers and code stay saved in this browser.
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

const Library = memo(function Library ({ prerendered, manifest, progress, mode, onModeChange: setMode, year, onYearChange: setYear, round, onRoundChange: setRound, onOpen, onRetry }) {
  const tests = manifest.tests;
  const resources = manifest.resources || [];
  const now = Date.now();

  const years = [...new Set([...tests, ...resources].map((item) => String(item.year)))]
    .sort((a, b) => Number(b) - Number(a));
  const rounds = [...new Set([...tests, ...resources].map((item) => item.contest))].sort(compareRounds);
  const matchesPlace = (item) =>
    (year === 'all' || String(item.year) === year) &&
    (round === 'all' || item.contest === round);
  // Type counts in its menu follow the Year/Round choice, so each option says what it would show.
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
          <div className='pr-filter-selects'>
            <Select
              className='pr-select-type'
              label='Type'
              value={mode}
              options={[['all', 'All types'], ['mc', MODE_LABELS.mc], ['frq', MODE_LABELS.frq]].map(([value, label]) => ({
                value,
                label,
                count: value === 'all' ? placeTests.length : placeTests.filter((test) => test.mode === value).length
              }))}
              onChange={setMode}
            />
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
            <Archive {...{ manifest, groups, progress, now, mode, year, round, onOpen, prerendered }} />
            )}
      </>
    );
  }

  return (
    <section className='pr-library' aria-labelledby='library-heading'>
      <div className='section-inner'>
        <header className='pr-library-head'>
          <h2 id='library-heading' tabIndex={-1}>Contest archive</h2>
        </header>
        {body}
      </div>
    </section>
  );
});

// The initial public rows are already rendered in the document. Reuse them until
// filters, metadata or private progress require new rows; the controls hydrate
// normally. Only our own prerendered DOM supplies this markup.
function Archive ({ manifest, groups, progress, now, mode, year, round, onOpen, prerendered }) {
  const [initial] = useState(() => {
    if (!prerendered || typeof document === 'undefined') return null;
    const element = document.querySelector('.pr-archive');
    return element ? { manifest, html: element.innerHTML } : null;
  });
  const reuse = initial?.manifest === manifest && mode === 'all' && year === 'all' && round === 'all' &&
    Object.keys(progress.sessions).length === 0 && Object.keys(progress.drafts).length === 0;
  // One handler works for both retained HTML and rows rendered after filtering.
  const handleClick = (event) => {
    const link = event.target.closest?.('a[href]');
    const target = getNavigationTarget(event, link, window.location.href);
    const id = target?.searchParams.get('test');
    if (getPage(target?.pathname || '') !== 'practice' || !id || !manifest.tests.some((test) => test.id === id)) return;
    event.preventDefault();
    onOpen(id);
  };
  if (reuse) {
    return <div className='pr-archive' data-mode-filter={mode} onClick={handleClick} dangerouslySetInnerHTML={{ __html: initial.html }} />;
  }
  return (
    <div className='pr-archive' data-mode-filter={mode} onClick={handleClick}>
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
  );
}

function TestEntry ({ test, summary }) {
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
        >
          {summary.action}<span className='sr-only'> {name}</span>
          <span className='action-arrow' aria-hidden='true'>→</span>
        </a>
        {test.pdfUrl
          ? (
            <a className='pr-link-button' href={test.pdfUrl} target='_blank' rel='noreferrer'>
              PDF<span className='sr-only'> of {name} (opens in a new tab)</span>
            </a>
            )
          : null}
      </div>
    </article>
  );
}
