#!/usr/bin/env python3
"""Merge importer indexes and remove obsolete generated figures/page previews."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / 'public/practice-data'
ROUNDS = ['Invitational A', 'Invitational B', 'District', 'District 1', 'District 2', 'District A', 'District B', 'Regional', 'State', 'UTCS Invitational', 'UTCS UIL Invitational', 'Practice test']


def main():
    tests = {}
    resources = {}
    for name in ['modern-index.json', 'legacy-written-index.json', 'legacy-programming-index.json']:
        path = ROOT / name
        if not path.exists(): continue
        index = json.loads(path.read_text())
        for test in index['tests']:
            if test['id'] in tests: raise ValueError(f'Duplicate test: {test["id"]}')
            tests[test['id']] = test
        for resource in index.get('resources', []):
            resources[(resource['year'], resource['contest'], resource['url'])] = resource
    def rank(test):
        contest = test['contest']
        return (-test['year'], ROUNDS.index(contest) if contest in ROUNDS else len(ROUNDS), contest, test['mode'])
    manifest = {'version': 1, 'tests': sorted(tests.values(), key=rank), 'resources': list(resources.values())}
    (ROOT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, separators=(',', ':')) + '\n')
    referenced = set()
    for test in tests.values():
        data = json.loads((ROOT / (test['id'] + '.json')).read_text())
        for q in data['questions']:
            blocks = q['content'] + [b for c in q.get('choiceContent', []) for b in c['content']]
            referenced.update(Path(b['url']).name for b in blocks if b['type'] == 'figure')
    # These files are reproducible importer output only, never user originals.
    for path in (ROOT / 'figures').glob('*.webp'):
        if path.name not in referenced: path.unlink()
    image_dir = ROOT / 'images'
    if image_dir.exists():
        for path in image_dir.glob('*.webp'): path.unlink()
        if not any(image_dir.iterdir()): image_dir.rmdir()
    print(json.dumps({'tests': len(tests), 'writtenQuestions': sum(t['questionCount'] for t in tests.values() if t['mode'] == 'mc'), 'programmingProblems': sum(t['questionCount'] for t in tests.values() if t['mode'] == 'frq'), 'figures': len(referenced)}))


if __name__ == '__main__': main()
