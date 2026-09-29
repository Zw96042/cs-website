#!/usr/bin/env python3
"""Import the supplied 2003–2011 written archives as native practice questions.

Legacy Word packets are converted locally with the bundled LibreOffice runtime.
Their original documents remain downloadable. No source code is executed.
"""
import importlib.util
import json
import os
import re
import subprocess
from pathlib import Path

import pymupdf as pdf

BASE = Path(__file__).resolve().parents[1]
WORK = BASE / 'work' / 'legacy-written'
SOFFICE = Path(os.environ.get('UIL_SOFFICE', Path.home() / '.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override/soffice'))
DOWNLOADS = Path(os.environ.get('UIL_DOWNLOADS', Path.home() / 'Downloads'))
spec = importlib.util.spec_from_file_location('uil', BASE / 'scripts/import-uil.py')
uil = importlib.util.module_from_spec(spec)
spec.loader.exec_module(uil)
ARCHIVES = [*(f'UIL_CS_{y}_Written.zip' for y in range(2003, 2009)), 'UIL2009Written.zip', '2010UIL_CS_Written.zip', 'UIL2011Written.zip']


def contest_name(filename):
    stem = Path(filename).stem.lower()
    if 'commentary' in stem: return None
    if 'utcs' in stem: return 'UTCS Invitational'
    if 'practice' in stem: return 'Practice test'
    if 'state' in stem: return 'State'
    if 'reg' in stem: return 'Regional'
    if re.search(r'd(?:istrict|ist)?[ _]?1', stem): return 'District 1'
    if re.search(r'd(?:istrict|ist)?[ _]?2', stem): return 'District 2'
    if 'inv' in stem or stem in {'a', 'b'}:
        return 'Invitational B' if re.search(r'inv(?:itational)?[ _]?b', stem) or stem == 'b' else 'Invitational A'
    raise ValueError(f'Unknown round: {filename}')


shared_cells = uil.native.shared_code_cells


def repair_2003_state_matrix(content):
    """Join the 2003 State Q34 table, whose PDF mixes fonts by cell type."""
    start = next((index for index, block in enumerate(content)
                  if block.get('type') == 'code' and block.get('text', '').endswith('[0]')
                  and re.findall(r'\[(\d)\]', block.get('text', '').splitlines()[0]) == list('01234567')), None)
    if start is None or len(content) < start + 16:
        return content
    rows = []
    for index in range(8):
        if index:
            label_block = content[start + 2 * index]
            if label_block.get('type') != 'code' or label_block.get('text') != f'[{index}]':
                return content
        values_block = content[start + 1 + 2 * index]
        if values_block.get('type') != 'paragraph':
            return content
        values = ''.join(run.get('text', '') for run in values_block.get('runs', [])).split()
        if len(values) != 8 or any(not value.isdigit() for value in values):
            return content
        rows.append([str(index), *values])
    table = ['      ' + ''.join(f'[{column}]'.center(6) for column in range(8))]
    table.extend(
        f'[{row[0]}]'.ljust(6) + ''.join(str(value).center(6) for value in row[1:])
        for row in rows
    )
    return [*content[:start], {'type': 'code', 'text': '\n'.join(table)}, *content[start + 16:]]

def import_packet(source, converted, year, contest):
    doc = pdf.open(converted)
    slug = re.sub(r'[^a-z0-9]+', '-', contest.lower()).strip('-')
    test_id = f'{year}-{slug}-mc'
    pdf_url = uil.source_pdf(f'legacy-{test_id}.pdf', converted.read_bytes())
    meta = {'id': test_id, 'year': year, 'contest': contest, 'mode': 'mc', 'title': f'{year} {contest}',
            'pdfUrl': pdf_url, 'dataUrl': f'/practice-data/{test_id}.json'}
    if source.suffix.lower() == '.doc':
        meta['documentUrl'] = uil.source_pdf(f'legacy-{test_id}.doc', source.read_bytes())
    key_pages = [i for i, page in enumerate(doc) if 'ANSWER KEY' in page.get_text().upper()]
    assert len(key_pages) == 1, (source, key_pages)
    key_page = key_pages[0]
    key_text = doc[key_page].get_text().split('Notes:')[0]
    answers = {int(n): a for n, a in re.findall(r'(?<!\w)(\d{1,2})\.\s*([A-E])\b', key_text)}
    assert set(answers) == set(range(1, 41)), (source, 'missing answers')
    cache = {i: [item for item in uil.page_lines(doc[i]) if not re.search(r'UIL COMPUTER SCIENCE|• PAGE| PAGE', item['raw'], re.I)] for i in range(key_page)}
    headers = []
    for pno, items in cache.items():
        for item in items:
            match = re.fullmatch(r'\s*Q?UESTION\s+(\d{1,2})\s*', item['raw'], re.I)
            if match:
                number = int(match[1])
                # The supplied 2010 B packet repeats QUESTION5 between9and11.
                # Its sequential position and official key identify question10.
                if year == 2010 and contest == 'Invitational B' and pno == 2 and number == 5: number = 10
                if number not in {n for n, _, _ in headers}:
                    headers.append((number, pno, item['rect'].y0))
    assert [n for n, _, _ in headers] == list(range(1, 41)), (source, 'question sequence', headers)
    contexts = {pno: shared_cells(doc[pno], items) for pno, items in cache.items()}
    questions = []
    for index, (number, pno, top) in enumerate(headers):
        following = headers[index + 1] if index + 1 < len(headers) else None
        bottom = following[2] if following and following[1] == pno else 735
        if year == 2003 and contest == 'Regional' and number == 38:
            # This source repeats C on the24option; its second position is B.
            first_c = next(item for item in cache[pno] if top <= item['rect'].y0 < bottom and item['raw'].strip() == 'C.')
            first_c['raw'] = first_c['raw'].replace('C', 'B')
            for char in first_c['chars']:
                if char['c'] == 'C': char['c'] = 'B'
        if year == 2003 and contest == 'Invitational B' and number == 13:
            for item in cache[pno]:
                if item['raw'].strip() == 'A:' and item['rect'].y0 > 450:
                    item['raw'] = item['raw'].replace(':', '.')
        page_items = [item for item in cache[pno] if not re.fullmatch(r'\s*Q?UESTION\s+\d{1,2}\s*', item['raw'], re.I)]
        cell = next((cell for cell in contexts[pno] if cell[0] - 3 <= top < cell[1] - 3), None)
        content, choices = uil.native_written(doc[pno], page_items, top, bottom, list('ABCDE'), test_id, number,
                                               legacy=True, right_context=cell[3] if cell else None)
        if test_id == '2003-state-mc' and number == 34:
            content = repair_2003_state_matrix(content)
        if cell:
            first_header = min(y for _, cp, y in headers if cp == pno and cell[0] - 3 <= y < cell[1] - 3)
            intro = [item for item in page_items if cell[0] <= item['rect'].y0 < first_header - 2
                     and item['rect'].x0 < cell[2]]
            if re.search(r'following questions', ' '.join(item['raw'] for item in intro), re.I):
                content = uil.native_blocks(doc[pno], intro, test_id, f'q{number}-intro') + content
        used_pages = [pno]
        if not following or following[1] != pno:
            final_page = following[1] if following else key_page - 1
            for cp in range(pno + 1, final_page + 1):
                end = following[2] if following and cp == following[1] else 735
                if not following and re.search(r'(?:STANDARD CLASSES|SUPPLEMENTAL REFERENCE|class java\.)', doc[cp].get_text(), re.I): break
                items = [item for item in cache[cp] if 15 <= item['rect'].y0 < end - 1 and not re.fullmatch(r'\s*Q?UESTION\s+\d{1,2}\s*', item['raw'], re.I)]
                # Reference sheets are after the final question, not continuations.
                if not items: continue
                extra, options = uil.native_written(doc[cp], items, 15, end, list('ABCDE'), test_id, number, legacy=True)
                content.extend(extra)
                for choice, addition in zip(choices, options): choice['content'].extend(addition['content'])
                used_pages.append(cp)
        # Standalone punctuation from old Word label cells is not an option value.
        for choice in choices:
            choice['content'] = [block for block in choice['content'] if not (block['type'] == 'paragraph' and ''.join(r['text'] for r in block['runs']).strip() == '.')]
        # Two supplied packets leave an option empty. Label that source defect
        # explicitly rather than inventing a value or hiding its radio choice.
        if (year, contest, number) in {(2003, 'Invitational A', 5), (2009, 'Invitational A', 37)}:
            blank = 'E' if year == 2003 else 'C'
            choices[ord(blank) - ord('A')]['content'] = [{'type': 'paragraph', 'runs': [{'text': 'Blank in the original packet'}]}]
        text = '\n'.join(doc[cp].get_text(clip=pdf.Rect(25, top if cp == pno else 40, doc[cp].rect.width - 25, bottom if cp == pno else 735)) for cp in used_pages)
        questions.append({'id': f'{test_id}-{number}', 'number': number, 'kind': 'mc', 'choices': list('ABCDE'),
                          'answer': answers[number], 'acceptedAnswers': [answers[number]], 'content': content,
                          'choiceContent': choices, 'text': uil.clean_text(text),
                          'images': [uil.source_image(doc, cp, test_id) for cp in used_pages], 'explanation': ''})
    # Explicit references to earlier questions reuse the actual earlier code.
    if year == 2005 and contest == 'Invitational A':
        # Q28 operates on the initial matrix introduced by Q27 in the same
        # source cell. Show it in the standalone question as well as the method.
        initial = next(b for b in questions[26]['content'] if b['type'] == 'diagram')
        questions[27]['content'].insert(0, {**initial, 'title': 'Initial array m'})
    for question in questions:
        prose = ' '.join(''.join(r['text'] for r in b['runs']) for b in question['content'] if b['type'] == 'paragraph')
        refs = [int(n) for n in re.findall(r'question\s+(\d{1,2})\b', prose, re.I) if 1 <= int(n) < question['number']]
        for ref in refs:
            earlier_code = [b for b in questions[ref - 1]['content'] if b['type'] == 'code']
            existing = {b.get('text') for b in question['content'] if b['type'] == 'code'}
            question['content'] = [b for b in earlier_code if b['text'] not in existing] + question['content']
    uil.native.apply_diagram_models(test_id, questions)
    meta['questionCount'] = len(questions)
    # Reference pages contain supplied API documentation, retained in the PDF.
    last_question_page = headers[-1][1]
    reference_pages = [pno for pno in range(last_question_page + 1, key_page)]
    uil.write_json(uil.OUT / f'{test_id}.json', {**meta, 'questions': questions,
                   'referenceImages': [uil.source_image(doc, cp, test_id) for cp in reference_pages]})
    return meta


def main():
    WORK.mkdir(parents=True, exist_ok=True)
    converted_dir = WORK / 'converted'
    converted_dir.mkdir(exist_ok=True)
    sources = []
    resources = []
    for archive_name in ARCHIVES:
        archive = DOWNLOADS / archive_name
        year = int(re.search(r'20\d\d', archive_name)[0])
        folder = WORK / str(year)
        folder.mkdir(exist_ok=True)
        for name, data in uil.archive_entries(archive):
            if name.suffix.lower() not in {'.pdf', '.doc'}: continue
            source = folder / name.name
            source.write_bytes(data)
            contest = contest_name(name.name)
            if contest is None:
                resources.append({'year': year, 'contest': 'Practice test', 'mode': 'mc', 'title': '2008 practice test commentary',
                                  'url': uil.source_pdf('legacy-2008-practice-commentary.pdf', data), 'note': 'Supplied commentary and explanations for the 2008 practice test.'})
                continue
            converted = source
            if source.suffix.lower() == '.doc':
                converted = converted_dir / (source.stem + '.pdf')
                if not converted.exists():
                    subprocess.run([str(SOFFICE), '--headless', '--convert-to', 'pdf', '--outdir', str(converted_dir), str(source)], check=True, capture_output=True)
                if not converted.exists(): raise RuntimeError(f'Conversion failed: {source.name}')
            sources.append((source, converted, year, contest))
    tests = [import_packet(*source) for source in sources]
    uil.write_json(BASE / 'work/legacy-written-manifest.json', {'tests': tests, 'resources': resources})
    uil.write_json(uil.OUT / 'legacy-written-index.json', {'tests': tests, 'resources': resources})
    print(json.dumps({'sets': len(tests), 'questions': sum(t['questionCount'] for t in tests), 'resources': len(resources)}))


if __name__ == '__main__': main()
