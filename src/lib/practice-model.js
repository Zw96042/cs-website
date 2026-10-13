import { normalizeAnswer } from './practice.js';

export const MODE_LABELS = { mc: 'Multiple choice', frq: 'Programming FRQ' };

export const isRecord = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

export const hasAnswer = (value) => typeof value === 'string' && normalizeAnswer(value) !== '';

export const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;

export const draftKey = (problemId) => `${problemId}:java`;

export function countLabel (test) {
  const count = Number(test.questionCount) || 0;
  return plural(count, test.mode === 'frq' ? 'problem' : 'question');
}
