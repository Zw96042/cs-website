import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { coalesceChoiceCodeBlocks, trimCodePadding } from './practice.js';

test('code samples remove PDF padding without losing indentation or interior spacing', () => {
  const sample = '\r\n \t\r\n  if (ready) {\r\n    out.print("  ");\r\n\r\n    return;\r\n  }\r\n \r\n\r\n';
  assert.equal(trimCodePadding(sample), '  if (ready) {\n    out.print("  ");\n\n    return;\n  }');
  assert.equal(trimCodePadding('  out.print(" ");  '), '  out.print(" ");  ');
  assert.equal(trimCodePadding(null), '');
});

test('adjacent pure-code choice paragraphs and code blocks render as one code block', () => {
  const leading = { type: 'paragraph', runs: [{ text: '  ' }, { text: '5 ', style: 'code' }] };
  const trailing = { type: 'code', text: '  1_000_000_009' };
  assert.deepEqual(coalesceChoiceCodeBlocks([leading, trailing]), [
    { type: 'code', text: '  5 \n  1_000_000_009' }
  ]);

  const rows = [
    { type: 'paragraph', runs: [{ text: '  print(1)', style: 'code' }] },
    { type: 'paragraph', runs: [{ text: '\n  print(2)', style: 'code' }] }
  ];
  assert.deepEqual(coalesceChoiceCodeBlocks(rows), [
    { type: 'code', text: '  print(1)\n  print(2)' }
  ]);
});

test('choice coalescing preserves singleton blocks and leaves prose, formulas, and diagrams alone', () => {
  const singleton = { type: 'paragraph', runs: [{ text: '  5 ', style: 'code' }] };
  const prose = { type: 'paragraph', runs: [{ text: 'There is no output due to an error.' }] };
  const formula = { type: 'paragraph', runs: [{ text: 'x', style: 'italic', runs: [{ text: '2', style: 'sup' }] }] };
  const diagram = { type: 'diagram', lines: ['+-+'] };
  const code = { type: 'code', text: '42' };
  const input = [singleton, prose, code, formula, diagram];
  const result = coalesceChoiceCodeBlocks(input);
  assert.equal(result[0], singleton);
  assert.equal(result[1], prose);
  assert.equal(result[2], code);
  assert.equal(result[3], formula);
  assert.equal(result[4], diagram);
});

test('Invitational A multiline output choices keep both rows in the same code block', () => {
  const packet = JSON.parse(readFileSync(new URL('../../public/practice-data/2026-invitational-a-mc.json', import.meta.url), 'utf8'));
  for (const number of [36, 38]) {
    for (const choice of packet.questions[number - 1].choiceContent.slice(0, 4)) {
      const merged = coalesceChoiceCodeBlocks(choice.content);
      assert.equal(merged.length, 1);
      assert.equal(merged[0].type, 'code');
      const rows = merged[0].text.split('\n').map(row => row.trim());
      const expected = choice.content.map(block => block.type === 'code' ? block.text : block.runs.map(run => run.text).join('')).map(text => text.trim());
      assert.deepEqual(rows, expected);
    }
    const prose = packet.questions[number - 1].choiceContent[4].content;
    assert.deepEqual(coalesceChoiceCodeBlocks(prose), prose);
  }
});
