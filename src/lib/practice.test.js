import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { normalizeAnswer, isCorrect, scoreAnswers, normalizeOutput, compareOutputs, hasExpired, loadProgress, saveProgress, PROGRESS_KEY } from './practice.js';

const questions = [{ id: 'a', answer: 'C' }, { id: 'b', answer: '-86' }, { id: 'c', answer: 'A' }];

test('written scoring includes numeric response, wrong answer penalty, and blank answers', () => {
  assert.deepEqual(scoreAnswers(questions, { a: ' c ', b: ' -86 ' }), { correct: 2, incorrect: 0, unanswered: 1, score: 12, maxScore: 18 });
  assert.deepEqual(scoreAnswers(questions, { a: 'D', b: '   ', c: 'E' }), { correct: 0, incorrect: 2, unanswered: 1, score: -4, maxScore: 18 });
  assert.equal(isCorrect('', ''), false);
  assert.equal(isCorrect('13', '13'), true);
  assert.equal(normalizeAnswer(null), '');
});

test('output comparison keeps indentation, internal spaces and case significant', () => {
  assert.equal(normalizeOutput('  X  \r\nY\t\r\n\r\n'), '  X\nY');
  assert.notEqual(normalizeOutput(' X'), normalizeOutput('X'));
  assert.notEqual(normalizeOutput('X  Y'), normalizeOutput('X Y'));
  assert.notEqual(normalizeOutput('Yes'), normalizeOutput('yes'));
});

test('complete judge comparisons count every difference while bounding the preview', () => {
  const result = compareOutputs(Array(100).fill('Wrong').join('\n'), Array(100).fill('Right').join('\n'));
  assert.equal(result.status, 'mismatch');
  assert.equal(result.differenceCount, 100);
  assert.equal(result.differences.length, 25);
  assert.deepEqual(compareOutputs(' A\r\nB  \r\n', ' A\nB'), { status: 'match', lineCount: 2 });
  assert.deepEqual(compareOutputs('', 'A'), { status: 'empty' });
});

test('an exam expires at its saved deadline, including when resumed after time is up', () => {
  const session = { mode: 'exam', submitted: false, deadline: 1000 };
  assert.equal(hasExpired(session, 999), false);
  assert.equal(hasExpired(session, 1000), true);
  assert.equal(hasExpired(session, 5000), true);
  assert.equal(hasExpired({ ...session, submitted: true }, 5000), false);
  assert.equal(hasExpired({ ...session, mode: 'practice' }, 5000), false);
  assert.equal(hasExpired({ ...session, deadline: null }, 5000), true);
});

test('storage recovers missing, invalid and broken progress without crashing', () => {
  let stored = null;
  globalThis.window = { localStorage: { getItem: () => stored, setItem: (key, value) => { assert.equal(key, PROGRESS_KEY); stored = value; } } };
  try {
    const empty = { version: 1, sessions: {}, drafts: {} };
    assert.deepEqual(loadProgress(), empty);
    stored = '{invalid';
    assert.deepEqual(loadProgress(), empty);
    stored = JSON.stringify({ version: 1, sessions: { a: null, b: { answers: null, currentIndex: -2 } }, drafts: ['bad'] });
    const sanitized = loadProgress();
    assert.equal(sanitized.sessions.a, undefined);
    assert.deepEqual(sanitized.sessions.b.answers, {});
    assert.equal(sanitized.sessions.b.currentIndex, 0);
    assert.deepEqual(sanitized.drafts, {});
    stored = JSON.stringify({ ...empty, notes: { a: 'old' }, reviewed: { a: true }, drafts: { 'problem:java': 'public class Test {}' }, sessions: { exam: { mode: 'exam', deadline: 1000, answers: { a: 'A' }, currentIndex: 2 } } });
    assert.equal(loadProgress().notes, undefined);
    assert.equal(loadProgress().reviewed, undefined);
    assert.equal(loadProgress().drafts['problem:java'], 'public class Test {}');
    assert.equal(loadProgress().sessions.exam.deadline, 1000);
    assert.equal(saveProgress(empty), true);
    assert.deepEqual(loadProgress(), empty);
    window.localStorage.getItem = () => { throw Error('denied'); };
    window.localStorage.setItem = () => { throw Error('quota'); };
    assert.deepEqual(loadProgress(), empty);
    assert.equal(saveProgress(empty), false);
  } finally { delete globalThis.window; }
});

const root = resolve(import.meta.dirname, '../../public');
const readJSON = url => JSON.parse(readFileSync(resolve(root, '.' + url), 'utf8'));

test('all imported sets have complete question sequences, valid keys and existing source assets', () => {
  const manifest = readJSON('/practice-data/manifest.json');
  assert.equal(manifest.version, 1);
  assert.equal(new Set(manifest.tests.map(t => t.id)).size, manifest.tests.length);
  const checked = new Set();
  const checkAsset = url => {
    assert.ok(url.startsWith('/practice-data/'));
    if (checked.has(url)) return;
    assert.ok(existsSync(resolve(root, '.' + url)), `Missing ${url}`);
    checked.add(url);
  };
  for (const entry of manifest.tests) {
    const data = readJSON(entry.dataUrl);
    checkAsset(entry.pdfUrl);
    if (entry.judgePdfUrl) checkAsset(entry.judgePdfUrl);
    if (entry.documentUrl) checkAsset(entry.documentUrl);
    if (entry.judgeDocumentUrl) checkAsset(entry.judgeDocumentUrl);
    assert.equal(data.questions.length, entry.questionCount, entry.id);
    const expectedCount = entry.mode === 'mc' ? 40 : entry.year <= 2005 ? 10 : [2007, 2008, 2009].includes(entry.year) && /^District/.test(entry.contest) ? 6 : 12;
    assert.equal(entry.questionCount, expectedCount, entry.id);
    assert.deepEqual(data.questions.map(q => q.number), Array.from({ length: entry.questionCount }, (_, i) => i + 1), entry.id);
    for (const q of data.questions) {
      assert.ok(q.text.length > 0, q.id);
      if (entry.mode === 'mc') assert.ok(q.images.length > 0, q.id);
      if (q.kind === 'mc') assert.ok(q.choices.includes(q.answer), q.id);
      if (entry.mode === 'mc') assert.ok(String(q.answer).trim(), q.id);
      if (q.kind === 'mc') assert.ok(q.choiceContent.every(c => c.content.length > 0), `Missing option ${q.id}`);
      assert.ok(q.content.length > 0, `Missing native prompt ${q.id}`);
      assert.deepEqual(q.choiceContent?.map(choice => choice.label) || [], q.choices || [], q.id);
      const blocks = [...q.content, ...(q.choiceContent || []).flatMap(choice => choice.content)];
      for (const block of blocks) if (block.type === 'figure') checkAsset(block.url);
      for (const asset of [...q.images, ...(q.files || [])]) if (asset.url) checkAsset(asset.url);
    }
    for (const image of data.referenceImages) if (image.url) checkAsset(image.url);
  }
  for (const resource of manifest.resources) checkAsset(resource.url);
  assert.ok(manifest.tests.some(t => t.year === 2020 && t.contest === 'Invitational A'));
  assert.ok(manifest.tests.some(t => t.year === 2020 && t.contest === 'Invitational B'));
  assert.ok(manifest.tests.some(t => t.year === 2020 && t.contest === 'District'));
});

test('source regressions retain real choices and official alternate answers', () => {
  const question = (id, number) => readJSON(`/practice-data/${id}-mc.json`).questions[number - 1];
  assert.deepEqual(question('2023-state', 31).choices, [...'ABCDE']);
  assert.deepEqual(question('2026-invitational-b', 34).choices, [...'ABCDEF']);
  assert.deepEqual(question('2021-state', 15).choices, [...'ABCDE']);
  assert.deepEqual(question('2025-regional', 18).choices, [...'ABCDEFGHIJKLMNO']);
  for (const [id, alternative] of [['2019-district', '!(A&B)^C'], ['2025-invitational-a', 'ADFCGA'], ['2018-state', 'C ⊕ D̅ + A * B']]) {
    const q = question(id, 40);
    assert.equal(isCorrect(alternative, q.answer, q.acceptedAnswers), true, id);
    assert.equal(scoreAnswers([q], { [q.id]: alternative }).score, 6, id);
  }
  assert.equal(isCorrect('1 23', '12 3'), false);
  const q33 = question('2026-state', 33);
  const q34 = question('2026-state', 34);
  const code = q33.content.filter(block => block.type === 'code').map(block => block.text).join('\n');
  assert.ok(code.includes('out.println(Difficulty.fromLevel(4));'), 'Shared code must not stop at the next question heading');
  assert.equal(q34.content.filter(block => block.type === 'code').map(block => block.text).join('\n'), code);
  assert.ok(q33.choiceContent.find(c => c.label === 'A').content.some(b => b.text?.includes('MEDIUM')));
  assert.ok(question('2026-invitational-a', 1).content[0].runs.some(run => run.style === 'sub' && run.text === '10'));
  assert.ok(question('2026-invitational-a', 39).content.some(block => block.type === 'diagram'));
  for (const id of ['2021-district', '2022-regional']) {
    const packet = readJSON(`/practice-data/${id}-frq.json`);
    assert.ok(packet.questions.every(q => q.files.length > 0), `Nested judge files missing: ${id}`);
  }
  assert.ok(readFileSync(resolve(root, './practice-data/2026-district-frq.json')).byteLength < 1_000_000, 'Large judge outputs should load on demand');
});

test('native source content retains shared classes, diagram choices and complete samples', () => {
  const packet = (id, mode = 'mc') => readJSON(`/practice-data/${id}-${mode}.json`);
  const code = q => q.content.filter(b => b.type === 'code').map(b => b.text).join('\n');
  for (const n of [31, 32, 33]) assert.ok(code(packet('2018-state').questions[n - 1]).includes('public static void sort'));
  for (const n of [34, 35]) assert.ok(code(packet('2018-state').questions[n - 1]).includes('public class UILString'));
  const graphs = packet('2018-state').questions[37];
  assert.ok(code(graphs).includes('public class Edge'));
  assert.ok(graphs.choiceContent.every(c => c.content.some(b => b.type === 'diagram')));
  for (const n of [31, 33, 34]) {
    const shared = code(packet('2025-state').questions[n - 1]);
    assert.ok(shared.includes('final class Character'));
    assert.ok(shared.includes('public Character thing()'));
  }
  for (const n of [36, 38]) assert.ok(code(packet('2026-invitational-a').questions[n - 1]).includes('public class Q36_37_38'));
  for (const n of [34, 37]) assert.ok(code(packet('2026-district').questions[n - 1]).includes('HashSet<byte[]> uniques'));
  const boolean = packet('2018-state').questions[39];
  assert.equal(boolean.answer, 'A * B + C ⊕ D̅');
  assert.equal(isCorrect('A * B + C D̅', boolean.answer, boolean.acceptedAnswers), false);
  const newton = packet('2026-district', 'frq').questions.find(q => q.title === 'Newton');
  assert.ok(code(newton).includes('3\n1\n3\n5'));
  assert.ok(code(newton).includes('*\n\n  *\n ***\n*****\n\n    *'));
  assert.ok(code(packet('2026-state', 'frq').questions.find(q => q.title === 'AJ')).includes('3\nXOX Fly'));
  assert.ok(code(packet('2022-regional', 'frq').questions.find(q => q.title === 'Arya')).includes('5\n10 7'));
});

test('2022 District keeps the preceding main method with Q11 instead of Q10 option E', () => {
  const packet = readJSON('/practice-data/2022-district-mc.json');
  const q10 = packet.questions[9];
  const q11 = packet.questions[10];
  const code = q => q.content.filter(block => block.type === 'code').map(block => block.text).join('\n');
  assert.ok(code(q10).includes('int [] ints = {9, 5, 1, 4, 1, 3};'));
  assert.ok(code(q10).includes('out.print(Arrays.toString(ints));'));
  assert.ok(!code(q10).includes('<code>'));
  const optionE = q10.choiceContent.find(choice => choice.label === 'E');
  assert.equal(optionE.content.length, 1);
  assert.equal(optionE.content[0].type, 'paragraph');
  assert.equal(optionE.content[0].runs.map(run => run.text).join('').trim(), 'There is no output due to an error.');
  assert.ok(code(q11).includes('public static void main(String[] args) throws IOException'));
  assert.ok(code(q11).includes('Scanner f = new Scanner(new File("data.dat"));\n     <code>;'));
  assert.ok(code(q11).includes('s += f.next();'));
  assert.ok(code(q11).endsWith('f.close();\n}'));
  assert.deepEqual([q10.answer, q11.answer], ['B', 'B']);
  const district2020 = readJSON('/practice-data/2020-district-mc.json');
  assert.ok(!JSON.stringify([district2020.questions[9].content, district2020.questions[9].choiceContent]).includes('public class Q11'));
  assert.ok(code(district2020.questions[10]).startsWith('public class Q11\n{'));
  assert.ok(code(district2020.questions[10]).includes('Scanner f = new Scanner(<missing code>);'));
  const regional2021 = readJSON('/practice-data/2021-regional-mc.json').questions[10];
  assert.ok(code(regional2021).startsWith('public class Q11\n{'));
  assert.ok(code(regional2021).includes('scr.close();'));
  assert.equal(code(regional2021).match(/public class Q11/g).length, 1);
  const state2022 = readJSON('/practice-data/2022-state-mc.json').questions[10];
  assert.ok(code(state2022).includes('x += f.nextInt(i);'));
  assert.ok(code(state2022).endsWith('out.println(x);\n}'));
});

test('2026 Invitational B keeps the next-page code with its named question', () => {
  const packet = readJSON('/practice-data/2026-invitational-b-mc.json');
  const code = n => packet.questions[n - 1].content.filter(block => block.type === 'code').map(block => block.text).join('\n');
  assert.ok(code(11).includes('/* Code for Q11 */'));
  assert.ok(code(11).includes('sc.useRadix(8);'));
  assert.ok(code(11).includes('else last = sc.nextInt(10);'));
  assert.ok(code(11).endsWith('sc.close();'));
  assert.equal(packet.questions[11].content.filter(block => block.type === 'code').length, 1);
  assert.ok(code(12).startsWith('int n = 508;'));
  assert.ok(code(12).includes('out.println(sum + "|" + prod);'));
  assert.ok(!code(12).includes('boolean p'));
  assert.ok(!code(12).includes('ArrayList'));
  assert.ok(!packet.questions[11].text.includes('Code for Q11'));
  assert.ok(code(13).includes('boolean p = false;'));
  assert.ok(!code(13).includes('ArrayList'));
  assert.ok(code(15).includes('a.subList(1, 4)'));
});

test('older contests preserve actual packet sizes, source blanks and Java file names', () => {
  assert.equal(readJSON('/practice-data/2003-regional-frq.json').questions.length, 10);
  assert.equal(readJSON('/practice-data/2007-district-a-frq.json').questions.length, 6);
  const correct = readJSON('/practice-data/2004-regional-frq.json').questions[0];
  assert.equal(correct.programName, 'correct');
  assert.ok(correct.files.some(f => f.name === 'correct.java'));
  const blank = readJSON('/practice-data/2009-invitational-a-mc.json').questions[36].choiceContent[2];
  assert.equal(blank.content[0].runs[0].text, 'Blank in the original packet');
  for (const entry of readJSON('/practice-data/manifest.json').tests.filter(t => t.year <= 2012 && t.mode === 'frq')) {
    const packet = readJSON(entry.dataUrl);
    for (const q of packet.questions) {
      for (const file of q.files.filter(f => f.role === 'output')) {
        assert.ok(!/(?:^|\/)(?:example|sample)\//i.test(file.sourcePath), `Sample selected as judge: ${q.id}`);
      }
    }
  }
});

test('legacy native questions retain complete shared code and mathematical baselines', () => {
  const packet = id => readJSON(`/practice-data/${id}-mc.json`);
  const code = q => q.content.filter(b => b.type === 'code').map(b => b.text).join('\n');
  for (const n of [7, 8, 9]) assert.ok(code(packet('2003-invitational-a').questions[n - 1]).includes('Winner is'));
  for (const n of [23, 24, 25, 26]) assert.ok(code(packet('2007-invitational-b').questions[n - 1]).includes('public static void show()'));
  for (const n of [27, 28, 29, 30]) assert.ok(code(packet('2007-invitational-b').questions[n - 1]).includes('public String toString()'));
  for (const n of [38, 39, 40]) {
    const shared = code(packet('2008-invitational-b').questions[n - 1]);
    assert.match(shared, /return first\.isEmpty\(\) &&\s+second\.isEmpty\(\)/);
    assert.ok(shared.includes('structTwo'));
  }
  assert.ok(code(packet('2008-invitational-a').questions[30]).includes('it.next().getValue()'));
  assert.ok(code(packet('2011-invitational-a').questions[30]).includes('set.size()'));
  const options = packet('2007-invitational-b').questions[27].choiceContent;
  assert.ok(options[3].content.some(b => b.runs?.some(r => r.style === 'sup' && r.text === '2')));
  assert.ok(options[4].content.some(b => b.runs?.some(r => r.style === 'sup' && r.text === 'N')));
  assert.equal(code(packet('2007-invitational-b').questions[0]), '');
  assert.ok(!code(packet('2007-invitational-b').questions[1]).includes('String s1'));
});

test('2003 State Q34 keeps its source matrix aligned and the shared path function complete', () => {
  const packet = readJSON('/practice-data/2003-state-mc.json');
  const code = q => q.content.filter(block => block.type === 'code').map(block => block.text);
  const source33 = code(packet.questions[32]).find(text => text.includes('bool path('));
  const source34 = code(packet.questions[33]).find(text => text.includes('bool path('));
  assert.equal(source33, source34, 'Shared path function must remain complete and belong to Q33 and Q34');
  assert.ok(source34.includes('found[i]=true;'));
  assert.ok(source34.includes('return false;'));
  assert.ok(source34.trimEnd().endsWith('}'));
  const matrix = code(packet.questions[33]).find(text => /^\s+\[0\]/.test(text));
  assert.ok(matrix, 'Q34 matrix should be one aligned native code block');
  const lines = matrix.split('\n');
  for (let column = 0; column < 8; column++) {
    const center = lines[0].indexOf(`[${column}]`) + 1;
    for (const row of lines.slice(1)) assert.match(row[center], /\d/, 'Header and data cell centers must align');
  }
  assert.deepEqual(matrix.split('\n').slice(1).map(row => row.trim().split(/\s+/).slice(1)), [
    ['0', '3', '0', '0', '7', '8', '0', '4'],
    ['0', '0', '0', '2', '7', '7', '7', '0'],
    ['0', '2', '0', '7', '3', '5', '0', '2'],
    ['6', '0', '1', '0', '1', '0', '0', '1'],
    ['8', '2', '2', '2', '0', '1', '0', '1'],
    ['0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0'],
    ['4', '7', '0', '4', '8', '8', '0', '0']
  ]);
});

test('native graphs belong to their questions, retain directions and use text options', () => {
  const questions = readJSON('/practice-data/2026-invitational-a-mc.json').questions;
  assert.ok(questions[28].content.every(b => !['figure', 'diagram'].includes(b.type)), 'Graph must not leak into the preceding code question');
  const graph = questions[29].content.find(b => b.type === 'diagram');
  assert.deepEqual(graph.nodes.map(n => n.id).sort(), [...'ABCDEFHI'].sort());
  assert.equal(graph.edges.length, 9);
  const edge = (from, to) => graph.edges.find(e => e.from === from && e.to === to);
  assert.equal(edge('A', 'H').weight, 8);
  assert.equal(edge('A', 'H').both, true);
  assert.deepEqual(edge('C', 'D'), { from: 'C', to: 'D', weight: 9, directed: true, both: false });
  assert.ok(!graph.edges.some(e => e.from === 'I' || e.to === 'I'), 'I is isolated in the original');
  for (const n of [31, 32, 33]) assert.deepEqual(questions[n - 1].content.find(b => b.type === 'diagram'), graph);
  const text = runs => runs.map(r => r.text ?? text(r.runs)).join('');
  assert.deepEqual(questions[32].choiceContent.map(c => c.content.map(b => text(b.runs)).join('').trim()), ['AHED', 'AHCD', 'AHFED', 'ABCD', 'ABCHED']);
  for (const entry of readJSON('/practice-data/manifest.json').tests.filter(t => t.mode === 'mc')) {
    for (const q of readJSON(entry.dataUrl).questions) {
      assert.ok(q.choiceContent.every(c => c.content.every(b => b.type !== 'figure')), `Image option: ${q.id}`);
      for (const b of [...q.content, ...q.choiceContent.flatMap(c => c.content)]) {
        assert.notEqual(b.alt, 'Formula from the question', `Ordinary text/formula image fallback: ${q.id}`);
      }
    }
  }
});

test('the full native tree keeps all leaf nodes and both questions share it', () => {
  const questions = readJSON('/practice-data/2026-invitational-a-mc.json').questions;
  const tree = questions[38].content.find(b => b.type === 'diagram');
  assert.deepEqual(questions[39].content.find(b => b.type === 'diagram'), tree);
  assert.deepEqual(tree.nodes.map(n => Number(n.id)).sort((a, b) => a - b), [1, 2, 3, 4, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 20, 24]);
  assert.equal(tree.edges.length, 15);
  assert.ok(tree.edges.some(e => e.from === '18' && e.to === '17'));
  const children = new Map();
  for (const edge of tree.edges) children.set(edge.from, (children.get(edge.from) || 0) + 1);
  assert.equal([...children.values()].filter(count => count === 1).length, Number(questions[38].answer));
  for (const node of tree.nodes) {
    assert.ok(node.x >= 12 && node.x <= tree.width - 12 && node.y >= 12 && node.y <= tree.height - 12, `Clipped node ${node.id}`);
    for (const other of tree.nodes.filter(other => other.id !== node.id)) {
      assert.ok(Math.hypot(node.x - other.x, node.y - other.y) >= 26, `Overlapping nodes ${node.id}/${other.id}`);
    }
  }
});

test('native Boolean expressions retain individual and nested negation bars', () => {
  const q = readJSON('/practice-data/2025-regional-mc.json').questions[25];
  const text = runs => runs.map(r => r.text ?? text(r.runs)).join('');
  const bars = runs => runs.flatMap(r => [...(r.style === 'overline' ? [text(r.runs)] : []), ...bars(r.runs || [])]);
  for (const option of q.choiceContent.slice(0, 3)) assert.ok(bars(option.content[0].runs).includes('B'), `Missing individual B negation in ${option.label}`);
  assert.ok(bars(q.choiceContent[2].content[0].runs).some(value => value.includes('A') && value.includes('∗') && value.includes('B')), 'Grouped negation must survive alongside individual bars');
  const regional = readJSON('/practice-data/2026-regional-mc.json').questions[39];
  assert.ok(regional.content.some(b => b.runs && bars(b.runs).includes('B')), 'Space-encoded negation over B must survive');
  const circuit = readJSON('/practice-data/2025-regional-mc.json').questions[26];
  assert.ok(circuit.content.some(b => ['figure', 'diagram'].includes(b.type)));
  assert.ok(circuit.choiceContent.every(c => c.content.every(b => !['figure', 'diagram'].includes(b.type))), 'Shared right-column circuit must not become an answer choice');
});

test('shared modern methods retain their complete source cells', () => {
  const q = readJSON('/practice-data/2026-district-mc.json').questions;
  const code = n => q[n - 1].content.filter(b => b.type === 'code').map(b => b.text).join('\n');
  assert.equal(code(27), code(28));
  assert.ok(code(27).includes('int mystery(String s)'));
  assert.ok(code(27).includes('return 1 + 2 * mystery(s);'));
  assert.equal(code(29), code(30));
  assert.ok(code(30).includes('int goodtime(int i, int j)'));
  assert.ok(code(30).includes('out.print(goodtime(14, 9));'));
  for (const id of ['2006-district-1', '2006-district-2']) {
    const tree = readJSON(`/practice-data/${id}-mc.json`).questions[26].content.find(b => b.type === 'diagram');
    assert.deepEqual(tree.labels.map(l => l.text).sort(), [...'ABCDE']);
  }
  const prompt = readJSON('/practice-data/2025-regional-mc.json').questions[38].content.filter(b => b.type === 'paragraph').flatMap(b => b.runs).map(r => r.text || '').join('');
  assert.match(prompt, /and E, the number of edges/);
});

test('graph choices and shared illustrations retain native source geometry', () => {
  const packet = id => readJSON(`/practice-data/${id}-mc.json`).questions;
  for (const [id, n] of [['2017-district', 34], ['2018-district', 38], ['2018-invitational-a', 35], ['2018-state', 38]]) {
    const choices = packet(id)[n - 1].choiceContent;
    const diagrams = choices.flatMap(c => c.content.filter(b => b.type === 'diagram'));
    assert.ok(diagrams.length >= 3, id);
    assert.ok(choices.every(c => c.content.every(b => b.type !== 'figure')), `Picture choice in ${id}`);
  }
  const invB = packet('2018-invitational-b');
  assert.ok(invB[37].content.every(b => !['figure', 'diagram'].includes(b.type)));
  const graph = invB[38].content.find(b => b.type === 'diagram');
  assert.ok(graph.edges.find(e => e.from === 'B' && e.to === 'D').via.length, 'B–D must bend around C');
  const invA = packet('2018-invitational-a');
  assert.equal(invA[35].content.filter(b => ['figure', 'diagram'].includes(b.type)).length, 1);
  assert.ok(invA[36].content.some(b => b.type === 'figure'), 'Q37 keeps its own circuit');
  for (const [id, parent, child] of [['2020-invitational-a', 'Z', 'U'], ['2019-invitational-a', '7', '6']]) {
    const tree = packet(id)[id.startsWith('2020') ? 36 : 35].content.find(b => b.type === 'diagram');
    assert.ok(tree.nodes.find(n => n.id === child).x < tree.nodes.find(n => n.id === parent).x, `${child} is a left child`);
  }
  const initial = packet('2005-invitational-a')[27];
  assert.deepEqual(initial.content.find(b => b.type === 'diagram').labels.map(l => l.text), [...'123456789']);
  assert.ok(initial.content.some(b => b.type === 'code' && b.text.includes('public static void reverse')));
});
