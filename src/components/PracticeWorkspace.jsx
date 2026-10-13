import { memo, useEffect, useId, useRef, useState } from 'react';
import { BackLink, Select } from './PracticeControls.jsx';
import PracticeDiagram from './PracticeDiagram.jsx';
import { MODE_LABELS, isRecord, hasAnswer, plural, draftKey, countLabel } from '../lib/practice-model.js';
import { isCorrect, normalizeAnswer, compareOutputs, hasExpired, scoreAnswers, trimCodePadding, coalesceChoiceCodeBlocks } from '../lib/practice.js';
import '../practice-workspace.css';

const EXAM_DURATION_MS = 45 * 60 * 1000;

const QUESTION_STATE_LABELS = {
  open: 'not answered',
  answered: 'answered',
  correct: 'correct',
  incorrect: 'incorrect',
  skipped: 'skipped'
};

const QUESTION_MARKS = { correct: '✓', incorrect: '✕', skipped: '–' };

const MAX_DIFF_LINES = 25;

const clampIndex = (value, length) => Math.min(Math.max(Number(value) || 0, 0), Math.max(length - 1, 0));

const answerIsCorrect = (answer, question) => isCorrect(answer, question.answer, question.acceptedAnswers);

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

const Prompt = memo(function Prompt ({ item }) {
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
});

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
            <a className='text-action secondary-action' href={test.pdfUrl} target='_blank' rel='noreferrer'>
              PDF<span className='sr-only'> (opens in a new tab)</span>
              <span className='action-arrow' aria-hidden='true'>↗</span>
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

function ExamClock ({ deadline, onExpire }) {
  const now = useNow(true);
  const remaining = Number.isFinite(deadline) ? Math.min(deadline - now, EXAM_DURATION_MS) : 0;
  const expired = remaining <= 0;
  useEffect(() => { if (expired) onExpire(); }, [expired, onExpire]);
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

function TimeLeftText ({ deadline }) {
  const remaining = deadline - useNow(true);
  return remaining > 60000 ? ` You still have ${Math.floor(remaining / 60000)} minutes.` : null;
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
              {inExam ? <ExamClock deadline={session.deadline} onExpire={() => finish('expired')} /> : null}
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
          {inExam ? <TimeLeftText deadline={session.deadline} /> : null}
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

export default function PracticeWorkspace (props) {
  return props.test.mode === 'frq'
    ? <ProgrammingWorkspace {...props} />
    : <WrittenWorkspace {...props} />;
}
