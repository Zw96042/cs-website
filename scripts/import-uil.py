#!/usr/bin/env python3
"""Import supplied UIL packets without rewriting their questions or answer keys.

Requires PyMuPDF, Pillow, and FontTools. Usage: python3 scripts/import-uil.py ARCHIVE.zip
PDFs supply native text, code and cropped figures; nested archives supply judge files.
The importer never executes source code or instructions found inside the archive.
"""
import argparse
import gzip
import hashlib
import io
import importlib.util
import json
import re
import zipfile
from pathlib import Path, PurePosixPath

import pymupdf as pdf
from PIL import Image

_native_spec = importlib.util.spec_from_file_location('uil_native', Path(__file__).with_name('uil_native.py'))
native = importlib.util.module_from_spec(_native_spec)
_native_spec.loader.exec_module(native)

ROUND_NAMES = {'InvA': 'Invitational A', 'InvB': 'Invitational B', 'District': 'District', 'Regional': 'Regional', 'State': 'State'}
OUT = Path(__file__).resolve().parents[1] / 'public' / 'practice-data'
REPORT = {'written': [], 'programming': [], 'notes': []}


def archive_entries(archive):
    with zipfile.ZipFile(archive) as z:
        for item in z.infolist():
            path = PurePosixPath(item.filename)
            if path.is_absolute() or '..' in path.parts:
                raise ValueError(f'Unsafe archive path: {item.filename}')
            if item.is_dir() or '__MACOSX' in path.parts or path.name.startswith('.'):
                continue
            yield path, z.read(item)


def nested_entries(data, prefix=PurePosixPath(), depth=0):
    if depth > 4:
        raise ValueError('Programming archive nesting exceeds four levels')
    for path, content in archive_entries(io.BytesIO(data)):
        full_path = prefix / path
        if path.suffix.lower() == '.zip':
            yield from nested_entries(content, full_path, depth + 1)
        else:
            yield full_path, content


def choice_labels(text):
    labels = set()
    for line in text.splitlines():
        previous = None
        for match in re.finditer(r'([A-Z])\)', line):
            # Labels begin a line, or follow another option on the same line.
            # An inline label must be the next letter; a code variable such as
            # int T) must never become an option merely because it ends in ).
            starts_line = not line[:match.start()].strip()
            next_inline = previous and ord(match[1]) == ord(previous) + 1
            if not starts_line and not previous and re.fullmatch(r'[\s\d.+-]+', line[:match.start()]):
                # Some PDF generators put the preceding numeric option value
                # and the next bold label on one extracted line.
                next_inline = True
            if starts_line or next_inline:
                labels.add(match[1])
                previous = match[1]
    if not labels:
        labels = set(re.findall(r'(?m)^\s*([A-Z])\.(?=\s|$)', text))
    if not labels:
        labels = set(re.findall(r'(?m)^\s*([A-Z])(?:[ \t]{2,}|[ \t]*$)', text))
    return sorted(labels)


def is_mono(font):
    return bool(re.search(r'courier|consolas|mono|lucida.?console', font, re.I))


def page_lines(page):
    result = []
    glyphs = native.decoded_glyphs(page)
    for block_index, block in enumerate(page.get_text('rawdict')['blocks']):
        if 'lines' not in block:
            continue
        for line in block['lines']:
            visible = [s for s in line['spans'] if any(c['c'].strip() or tuple(round(v, 2) for v in c['origin']) in glyphs for c in s['chars'])]
            if not visible:
                # Blank rows inside a monospace sample are meaningful output.
                visible = [s for s in line['spans'] if is_mono(s['font'])]
                if not visible: continue
            main = max(visible, key=lambda s: s['size'])
            chars = []
            for span in line['spans']:
                style = 'code' if is_mono(span['font']) else 'bold' if 'bold' in span['font'].lower() else None
                if span['size'] < main['size'] * .86:
                    delta = span['origin'][1] - main['origin'][1]
                    if delta > .15: style = 'sub'
                    elif delta < -.15: style = 'sup'
                for char in span['chars']:
                    chars.append({**char, 'style': style, 'bold': 'bold' in span['font'].lower()})
            result.append({'rect': pdf.Rect(line['bbox']), 'raw': ''.join(c['c'] for c in chars),
                           'chars': chars, 'block': block_index,
                           'mono': all(is_mono(s['font']) for s in visible)})
    return native.restore_lines(result, glyphs)


def rich_runs(chars):
    # Nested overlines retain Boolean grouping as native markup.
    if any(c.get('_overbars') for c in chars):
        runs, group, owner = [], [], None
        def flush():
            if group:
                value = rich_runs(group)
                runs.extend([{'style': 'overline', 'runs': value}] if owner is not None else value)
        for char in chars:
            ids = char.get('_overbars', [])
            current = ids[0] if ids else None
            if group and current != owner:
                flush()
                group = []
            owner = current
            group.append({**char, '_overbars': ids[1:]})
        flush()
        return runs
    runs = []
    for char in chars:
        value, style = char['c'], char.get('style')
        if runs and runs[-1].get('style') == style:
            runs[-1]['text'] += value
        else:
            runs.append({'text': value, **({'style': style} if style else {})})
    return runs


def runs_text(runs):
    return ''.join(run.get('text', runs_text(run.get('runs', []))) for run in runs)


def crop_figure(page, rect, prefix, label, alt):
    vector = native.vector_diagram(page, rect, alt)
    if vector: return vector
    rect = (rect + (-3, -3, 3, 3)) & page.rect
    crop_id = hashlib.sha256(str(tuple(round(x, 2) for x in rect)).encode()).hexdigest()[:8]
    target = OUT / 'figures' / f'{prefix}-{label}-{crop_id}.webp'
    target.parent.mkdir(parents=True, exist_ok=True)
    if not target.exists():
        pixmap = page.get_pixmap(matrix=pdf.Matrix(3, 3), clip=rect, alpha=False)
        Image.frombytes('RGB', (pixmap.width, pixmap.height), pixmap.samples).save(target, 'WEBP', quality=95, method=6)
    return {'type': 'figure', 'url': '/practice-data/figures/' + target.name, 'alt': alt}


def native_blocks(page, items, prefix, label, preserve_gaps=False):
    blocks = []
    for item in items:
        raw = item['raw'].rstrip()
        if not raw.strip():
            if item['mono'] and blocks and blocks[-1]['type'] == 'code':
                blocks[-1]['text'] += '\n'
                blocks[-1]['_last_y'] = item['rect'].y0
            continue
        # Preserve only localized typeset formulas when a PDF uses non-Unicode
        # math glyphs. All ordinary text and source code remain native content.
        if any(ord(c) < 32 and c not in '\n\t' for c in raw) or '\ufffd' in raw:
            blocks.append(crop_figure(page, item['rect'], prefix, f'{label}-{len(blocks)}', 'Formula from the question'))
            continue
        # Mathematical notation can use the same font as source code. Keep
        # its baseline changes instead of flattening an exponent into a digit.
        has_script = any(c.get('style') in {'sup', 'sub'} for c in item['chars'])
        kind = 'code' if item['mono'] and not has_script else 'paragraph'
        previous = blocks[-1] if blocks else None
        if kind == 'code':
            if previous and previous['type'] == 'code':
                advance = max(8, previous.get('_height', 10) * 1.1)
                rows = max(1, round((item['rect'].y0 - previous.get('_last_y', item['rect'].y0)) / advance)) if preserve_gaps else 1
                same_row = abs(item['rect'].y0 - previous.get('_last_y', item['rect'].y0)) < 3
                if same_row and item['rect'].x0 >= previous.get('_last_x', item['rect'].x0):
                    gap = item['rect'].x0 - previous.get('_last_x', item['rect'].x0)
                    previous['text'] += ' ' * max(1, round(gap / 6)) + raw
                else:
                    previous['text'] += '\n' * rows + raw
                previous['_last_x'] = item['rect'].x1
                previous['_last_y'] = item['rect'].y0
            else:
                blocks.append({'type': 'code', 'text': raw, '_block': item['block'], '_last_y': item['rect'].y0, '_height': item['rect'].height, '_last_x': item['rect'].x1})
        else:
            runs = rich_runs(item['chars'])
            if previous and previous['type'] == 'paragraph' and previous.get('_block') == item['block'] and not re.match(r'^(?:Sample (?:input|output)|Input|Output):', raw, re.I) and not re.match(r'^(?:Sample (?:input|output)|Input|Output):', runs_text(previous['runs']), re.I):
                previous['runs'].append({'text': ' '})
                previous['runs'].extend(runs)
            else:
                blocks.append({'type': 'paragraph', 'runs': runs, '_block': item['block']})
    for block in blocks:
        block.pop('_block', None)
        block.pop('_last_y', None)
        block.pop('_height', None)
        block.pop('_last_x', None)
    return blocks


def graphic_owner(rect, anchors):
    above = [a for a in anchors if -5 <= rect.x0 - a['rect'].x0 <= 100
             and -8 <= rect.y0 - a['rect'].y0 < 35]
    if above:
        return min(above, key=lambda a: (abs(rect.x0 - a['rect'].x0), -a['rect'].y0))
    # Some old packets place the label beside the bottom of its picture.
    beside = [a for a in anchors if -5 <= rect.x0 - a['rect'].x0 <= 100
              and rect.y0 <= a['rect'].y0 <= rect.y1 + 3]
    return min(beside, key=lambda a: abs(rect.x0 - a['rect'].x0)) if beside else None


def graphics(page, top, bottom, anchors=()):
    found = []
    for block in page.get_text('dict')['blocks']:
        if 'lines' not in block:
            rect = pdf.Rect(block['bbox'])
            if rect.width > 15 and rect.height > 15:
                found.append(rect)
    # Word exports often represent cell borders and text highlighting as many
    # filled rectangles. They are page chrome, not question diagrams.
    paths = [path for path in page.get_drawings() if path['type'] in {'s', 'fs'}
             and pdf.Rect(path['rect']).width < page.rect.width * .8
             and not (pdf.Rect(path['rect']).height < 1 and pdf.Rect(path['rect']).width > 240 and pdf.Rect(path['rect']).x0 < 45)
             and not (pdf.Rect(path['rect']).width < 1 and (pdf.Rect(path['rect']).height > 100
                       or pdf.Rect(path['rect']).x0 < 45
                       or pdf.Rect(path['rect']).x0 > page.rect.width - 45
                       or abs(pdf.Rect(path['rect']).x0 - page.rect.width / 2) < 15))]
    for rect in page.cluster_drawings(drawings=paths):
        if rect.width > 20 and rect.height > 20 and rect.width < 450 and rect.y1 > top and rect.y0 < bottom:
            found.append(rect)
    # Split vector clusters that connect two option matrices in one column.
    separated = []
    for rect in found:
        candidates = [a for a in anchors if -5 <= rect.x0 - a['rect'].x0 <= 100
                      and rect.y0 - 8 <= a['rect'].y0 < rect.y1 - 8]
        distance = min((abs(rect.x0 - a['rect'].x0) for a in candidates), default=0)
        column = sorted([a for a in candidates if abs(rect.x0 - a['rect'].x0) <= distance + 5], key=lambda a: a['rect'].y0)
        cuts = [a['rect'].y0 - 1 for a in column[1:]]
        start = rect.y0
        for end in cuts + [rect.y1]:
            separated.append(pdf.Rect(rect.x0, start, rect.x1, end))
            start = end
    found = separated
    # Adjacent raster strips are often one tree/graph. Join overlapping strips
    # rather than showing a sliced diagram in the middle of a question.
    def owner(rect):
        anchor = graphic_owner(rect, anchors)
        return anchor['label'] if anchor else None
    joined = []
    for rect in found:
        for i, old in enumerate(joined):
            if owner(old) == owner(rect) and (old + (-4, -4, 4, 4)).intersects(rect):
                joined[i] |= rect
                break
        else:
            joined.append(rect)
    return [rect for rect in joined if rect.y1 > top and rect.y0 < bottom]


def native_written(page, items, top, bottom, letters, prefix, number, legacy=False, right_context=None, excluded_diagrams=()):
    region = [item for item in items if item['rect'].y0 >= top - 2 and item['rect'].y0 < bottom - 1
              and not re.match(r'^\(?Question\s*\d', item['raw'].strip(), re.I)
              and item['rect'].y0 < 735 and not any(rect.contains(item['rect']) for rect in excluded_diagrams)]
    anchors = []
    for item in region:
        matches = [] if legacy else list(re.finditer(r'(?<!\w)([A-Z])\)', item['raw']))
        explicit = bool(matches)
        if not matches:
            pattern = r'(?<!\w)([A-Z])\.(?=\s|$)' if legacy else r'^\s*([A-Z])\.'
            matches = list(re.finditer(pattern, item['raw']))
            explicit = bool(matches)
        if not matches and legacy:
            # Old Word packets sometimes wrap the period under its letter.
            for match in re.finditer(r'(?<!\w)([A-E])(?=\s*$)', item['raw']):
                char_rect = pdf.Rect(item['chars'][match.start(1)]['bbox'])
                if any(line['raw'].strip() == '.' and abs(line['rect'].x0 - char_rect.x0) < 4
                       and 5 < line['rect'].y0 - char_rect.y0 < 18 for line in region):
                    matches.append(match)
                    explicit = True
        if not matches:
            matches = list(re.finditer(r'^\s*([A-Z])(?=[ \t]{2,}|\s*$)', item['raw']))
        for match in matches:
            if match[1] not in letters:
                continue
            character = item['chars'][match.start(1)]
            if item['raw'][:match.start(1)].strip() and not character['bold'] and not (legacy and explicit):
                continue
            anchors.append({'label': match[1], 'rect': pdf.Rect(character['bbox']), 'item': item, 'match': match,
                            'priority': 2 if explicit else 0})
    # Explicit punctuation takes precedence over diagram nodes or code names.
    unique = {}
    for anchor in anchors:
        previous = unique.get(anchor['label'])
        if previous is None or anchor['priority'] > previous['priority']:
            unique[anchor['label']] = anchor
    anchors = list(unique.values())
    anchor_lines = {id(a['item']) for a in anchors}
    right_start = 250 if legacy else 300
    option_blocks = {item['block'] for item in region if legacy and item['mono'] and any(
        0 <= item['rect'].x0 - a['rect'].x0 <= 45 and abs(item['rect'].y0 - a['rect'].y0) <= 8
        for a in anchors)}
    right_choices = False if legacy else any(a['rect'].x0 >= 300 for a in anchors)
    diagrams = [rect for rect in graphics(page, top, bottom, anchors) if not any((rect & excluded).get_area() > rect.get_area() * .8 for excluded in excluded_diagrams)]
    # Source code in the right column may cross PDF text-block boundaries or
    # sit centrally beside several questions. Assemble complete column groups.
    column_items = sorted([item for item in items if item['rect'].x0 >= right_start
                           and item['mono'] and item['block'] not in option_blocks and 40 < item['rect'].y0 < 735
                           and not re.match(r'^\s*[A-Z][).]\s', item['raw'])
                           and not any(item['rect'].intersects(rect) for rect in [*diagrams, *excluded_diagrams])],
                          key=lambda item: (item['rect'].y0, item['rect'].x0))
    groups = []
    for item in column_items:
        if not groups or item['rect'].y0 - groups[-1][-1]['rect'].y1 > 24:
            groups.append([])
        groups[-1].append(item)
    right_items = []
    explicit_items = []
    region_text = '\n'.join(item['raw'] for item in region if item['rect'].x0 < right_start)
    refs = set(re.findall(r'//\s*Q(\d+)', region_text))
    for group in groups:
        raw = '\n'.join(item['raw'] for item in group)
        class_refs = re.findall(r'\bclass\s+Q(\d+(?:_\d+)*)\b', raw)
        explicit = any(str(number) in match.split('_') for match in class_refs)
        explicit |= any(re.search(r'//\s*Q' + ref + r'\b', raw) for ref in refs)
        directive = re.search(r'questions?\s+([\d ,andthrough–-]+)', raw, re.I)
        if directive:
            nums = [int(n) for n in re.findall(r'\d+', directive[1])]
            explicit |= number in nums
        overlaps = group[-1]['rect'].y1 > top - 2 and group[0]['rect'].y0 < bottom - 1
        if explicit:
            explicit_items.extend(group)
    if explicit_items:
        right_items = explicit_items
    elif not right_choices:
        # Proximity alone does not imply shared source. Ordinary code belongs
        # to its original PDF block; only explicit references join blocks.
        right_ids = {item['block'] for item in region if item['mono'] and item['rect'].x0 >= right_start
                     and item['block'] not in option_blocks and id(item) not in anchor_lines and not any(item['rect'].intersects(rect) for rect in diagrams)}
        for block_id in right_ids:
            block_items = [item for item in column_items if item['block'] == block_id]
            chunks = []
            for item in block_items:
                if not chunks or item['rect'].y0 - chunks[-1][-1]['rect'].y1 > 24:
                    chunks.append([])
                chunks[-1].append(item)
            for chunk in chunks:
                raw = '\n'.join(item['raw'] for item in chunk)
                classes = re.findall(r'\bclass\s+Q(\d+(?:_\d+)*)\b', raw)
                if classes and not any(str(number) in refs.split('_') for refs in classes): continue
                if chunk[-1]['rect'].y1 > top - 2 and chunk[0]['rect'].y0 < bottom - 1:
                    right_items.extend(chunk)
        right_items.sort(key=lambda item: (item['rect'].y0, item['rect'].x0))
    if right_context is not None:
        right_items = right_context
    prompt = []
    choices = {letter: [] for letter in letters}
    for item in region:
        if item in right_items or any(item['rect'].intersects(rect) for rect in diagrams):
            continue
        line_anchors = sorted([a for a in anchors if a['item'] is item], key=lambda a: a['match'].start())
        segments = []
        start = 0
        owner = None
        for anchor in line_anchors:
            if anchor['match'].start() > start:
                segments.append((item['chars'][start:anchor['match'].start()], owner))
            start = anchor['match'].end()
            owner = anchor
        if start < len(item['chars']):
            segments.append((item['chars'][start:], owner))
        if not line_anchors:
            segments = [(item['chars'], None)]
        for chars, inline_owner in segments:
            if not chars or not any(c['c'].strip() for c in chars):
                continue
            rect = pdf.Rect(chars[0]['bbox'])
            for char in chars[1:]: rect |= pdf.Rect(char['bbox'])
            candidates = [a for a in anchors if a['rect'].y0 <= rect.y0 + 5 and a['rect'].x0 <= rect.x0 + (2 if legacy else 15)]
            # Choice columns share x positions. Choose the nearest column, then
            # its most recent label, preserving multi-line output options.
            nearest_column = min((abs(rect.x0 - a['rect'].x0) for a in candidates), default=0)
            column = [a for a in candidates if abs(rect.x0 - a['rect'].x0) <= nearest_column + 8]
            anchor = inline_owner or (max(column, key=lambda a: a['rect'].y0) if column else None)
            segment = {**item, 'chars': chars, 'raw': ''.join(c['c'] for c in chars), 'rect': rect}
            if anchor:
                choices[anchor['label']].append(segment)
            else:
                prompt.append(segment)
    content = native_blocks(page, prompt, prefix, f'q{number}-prompt')
    # Code is presented above the options. Ignore blank lines from separators.
    content.extend(native_blocks(page, right_items, prefix, f'q{number}-code'))
    choice_blocks = {letter: native_blocks(page, choices[letter], prefix, f'q{number}-choice-{letter}') for letter in letters}
    right_diagram_reference = bool(re.search(r'(?:graph|tree|diagram|circuit|table)[^\n?]{0,45}to the right', re.sub(r'\s+', ' ', region_text), re.I))
    for i, rect in enumerate(diagrams):
        # A shared right-column illustration can sit beside the last label in
        # a horizontal choice row. That proximity does not make it an option.
        owner = None if right_diagram_reference and rect.x0 >= right_start else graphic_owner(rect, anchors)
        if owner:
            choice_blocks[owner['label']].append(crop_figure(page, rect, prefix, f'q{number}-choice-{owner["label"]}-diagram-{i}', f'Diagram for choice {owner["label"]}'))
        else:
            content.append(crop_figure(page, rect, prefix, f'q{number}-diagram-{i}', f'Diagram for question {number}'))
    return content, [{'label': letter, 'content': choice_blocks[letter]} for letter in letters]


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, separators=(',', ':')) + '\n')


def clean_text(text):
    # Some source PDFs have non-Unicode glyph mappings. The page images, rather
    # than a guessed translation of those glyphs, remain the authoritative text.
    return ''.join(c for c in text if c in '\n\t' or ord(c) >= 32).strip()


def lines(page):
    return [(pdf.Rect(line['bbox']), ''.join(span['text'] for span in line['spans']).strip())
            for block in page.get_text('dict')['blocks'] if 'lines' in block
            for line in block['lines']]


def source_pdf(name, data):
    target = OUT / 'sources' / name
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)
    return '/practice-data/sources/' + name


def source_image(doc, page_no, prefix):
    # Metadata supports source-reference downloads and text fallbacks. Practice
    # views use native blocks and tightly cropped figures, never packet pages.
    return {'text': clean_text(doc[page_no].get_text()), 'page': page_no + 1}


def test_meta(year, round_code, mode, pdf_url):
    round_slug = {'InvA': 'invitational-a', 'InvB': 'invitational-b'}.get(round_code, round_code.lower())
    test_id = f'{year}-{round_slug}-{mode}'
    return {'id': test_id, 'year': year, 'contest': ROUND_NAMES[round_code], 'mode': mode,
            'title': f'{year} {ROUND_NAMES[round_code]}', 'pdfUrl': pdf_url,
            'dataUrl': f'/practice-data/{test_id}.json'}


def import_written(name, data, year, codes):
    doc = pdf.open(stream=data, filetype='pdf')
    pdf_url = source_pdf(name, data)
    keys = [i for i, p in enumerate(doc) if 'ANSWER KEY' in p.get_text().upper()]
    assert len(keys) == len(codes), (name, 'answer-key sections', keys, codes)
    previous_key = -1
    for round_code, key_page in zip(codes, keys):
        meta = test_meta(year, round_code, 'mc', pdf_url)
        key_text = doc[key_page].get_text().split('Note:')[0].split('* See')[0]
        answers = {int(n): clean_text(a) for n, a in re.findall(
            r'(?<!\w)\*?(\d{1,2})\)\s*([^\n]*?)(?=\s+\*?\d{1,2}\)|\n|$)', key_text)}
        answers = {n: re.sub(r'^([A-Z])_+$', r'\1', answer) for n, answer in answers.items()}
        # These source keys use unmapped math glyphs or 'See Explanation'.
        # Transcriptions below were checked against the rendered key and the
        # actual explanation pages; they are not generated solutions.
        transcribed = {
            ('2018_State_MC.pdf', 40): 'A * B + C ⊕ D̅',
            ('2025_District_MC.pdf', 39): 'O(n lg n) or O(n log2 n) or O(n log n)',
            ('2025_District_MC.pdf', 40): '((A+(B-C))*(D/(E-(F+G))))',
            ('2025_InvB_MC.pdf', 40): '1 6 8 9 17 29 34 48 67 97 104 147 212',
            ('2025_Regional_MC.pdf', 39): 'O(V^2) or O(E)'
        }
        for (filename, number), answer in transcribed.items():
            if name == filename: answers[number] = answer
        assert set(answers) == set(range(1, 41)), (name, round_code, 'missing key answers', answers)
        headers = []
        reference_pages = []
        for page_no in range(previous_key + 1, key_page):
            p = doc[page_no]
            if 'SUPPLEMENTAL REFERENCE' in p.get_text(): reference_pages.append(page_no)
            for box, text in lines(p):
                match = re.match(r'^\(?Question\s*(\d{1,2})(?!\d)', text, re.I)
                if match and box.x0 < 100 and int(match[1]) not in {n for n, _, _ in headers}:
                    headers.append((int(match[1]), page_no, box.y0))
        assert [n for n, _, _ in headers] == list(range(1, 41)), (name, round_code, 'question sequence', headers)
        explanation_end = keys[keys.index(key_page) + 1] if key_page != keys[-1] else len(doc)
        # Stop before the next exam's first question/directions, which are not
        # part of the current explanation section in the combined 2020 packet.
        exp_pages = []
        for i in range(key_page + 1, explanation_end):
            t = doc[i].get_text()
            if 'General Directions' in t: break
            exp_pages.append(t)
        exp = '\n'.join(exp_pages)
        exp_matches = list(re.finditer(r'(?:^|\n)\s*(\d{1,2})\.\s*\n\s*([^\n]+)', exp))
        explanations = {}
        for index, match in enumerate(exp_matches):
            number = int(match[1])
            if number not in answers or number in explanations: continue
            end = exp_matches[index + 1].start() if index + 1 < len(exp_matches) else len(exp)
            explanations[number] = clean_text(exp[match.end():end])
        native_cache = {pno: page_lines(doc[pno]) for pno in range(previous_key + 1, key_page)}
        full_context = {}
        shared_diagrams = {}
        diagram_regions = {}
        diagram_directives = set()
        # Explicit source directives can introduce a full-width class/method
        # several pages before the questions that use it.
        for pno, items in native_cache.items():
            for item in items:
                match = re.search(r'questions?\s+((?:\d{1,2}|,|\s|and|through|to|[-–])+)', item['raw'], re.I)
                if not match or item['rect'].x0 >= 300: continue
                nums = [int(n) for n in re.findall(r'\d{1,2}', match[1])]
                if len(nums) < 2 or any(n < 1 or n > 40 for n in nums): continue
                if re.search(r'through|to|[-–]', match[1]): nums = list(range(min(nums), max(nums) + 1))
                first = next(((hp, hy) for hn, hp, hy in headers if hp > pno or (hp == pno and hy > item['rect'].y0)), None)
                if not first: continue
                if re.search(r'graph|tree|circuit|diagram|table', item['raw'], re.I) and first[0] == pno:
                    regions = graphics(doc[pno], item['rect'].y1, first[1])
                    if regions:
                        diagram_regions.setdefault(pno, []).extend(regions)
                        diagram_directives.add((pno, item['block'], item['raw']))
                        for n in nums:
                            shared_diagrams.setdefault(n, []).extend((pno, rect) for rect in regions)
                shared = []
                for cp in range(pno, first[0] + 1):
                    start = item['rect'].y0 if cp == pno else 40
                    end = first[1] if cp == first[0] else 735
                    code = [line for line in native_cache[cp] if line['mono'] and start <= line['rect'].y0 < end]
                    if code: shared.append((cp, code))
                for n in nums: full_context.setdefault(n, []).extend(shared)
        code_cells = {pno: native.shared_code_cells(doc[pno], items) for pno, items in native_cache.items()}
        context_pages = {}
        for pno in sorted(set(p for _, p, _ in headers)):
            for match in re.finditer(r'questions?\s+((?:\d{1,2}|,|\s|and|through|to|[-–])+)', doc[pno].get_text(), re.I):
                nums = [int(n) for n in re.findall(r'\d{1,2}', match[1])]
                if len(nums) < 2 or any(n < 1 or n > 40 for n in nums): continue
                if re.search(r'through|to|[-–]', match[1]): nums = list(range(min(nums), max(nums) + 1))
                for n in nums: context_pages.setdefault(n, set()).add(pno)
        short_numbers = {int(n) for n in re.findall(r'\*(\d{1,2})\)', key_text)}
        questions = []
        for index, (number, page_no, top) in enumerate(headers):
            following = headers[index + 1] if index + 1 < len(headers) else None
            bottom = following[2] if following and following[1] == page_no else 735
            text = clean_text(doc[page_no].get_text(clip=pdf.Rect(25, top - 1, doc[page_no].rect.width - 25, bottom - 1)))
            continuation_pages = []
            if following and following[1] != page_no:
                for n in range(page_no + 1, following[1] + 1):
                    end_y = following[2] - 1 if n == following[1] else 735
                    extra = clean_text(doc[n].get_text(clip=pdf.Rect(25, 38, doc[n].rect.width - 25, end_y)))
                    if extra and end_y > 65:
                        text += '\n' + extra
                        continuation_pages.append(n)
            letters = choice_labels(text)
            kind = 'mc' if number not in short_numbers and len(answers[number]) == 1 and answers[number] in letters and len(letters) > 1 else 'short'
            if kind == 'mc': assert answers[number] in letters, (name, number, 'answer not an available choice', letters)
            if re.search(r'previous page|(?:code(?: segment)?|diagram|tree|graph|table|circuit)(?:\s+shown)?\s+above', text, re.I) and page_no > headers[0][1]:
                continuation_pages.append(page_no - 1)
            image_pages = sorted(set([page_no] + continuation_pages) | context_pages.get(number, set()))
            images = [source_image(doc, n, Path(name).stem) for n in image_pages]
            if page_no not in native_cache: native_cache[page_no] = page_lines(doc[page_no])
            page_items = [item for item in native_cache[page_no] if (page_no, item['block'], item['raw']) not in diagram_directives]
            cell = next((cell for cell in code_cells[page_no] if cell[0] - 3 <= top < cell[1] - 3), None)
            content, choice_content = native_written(doc[page_no], page_items, top, bottom, letters if kind == 'mc' else [], meta['id'], number, right_context=cell[3] if cell else None, excluded_diagrams=diagram_regions.get(page_no, []))
            content.extend(crop_figure(doc[cp], rect, meta['id'], f'q{number}-context-diagram-{i}', f'Shared diagram for question {number}') for i, (cp, rect) in enumerate(shared_diagrams.get(number, [])))
            shared_content = []
            for cp, code in full_context.get(number, []):
                shared_content.extend(native_blocks(doc[cp], code, meta['id'], f'q{number}-context-p{cp}'))
            content = shared_content + content
            # Question prose can refer to a shared block on an earlier page.
            # Bring over its code and diagrams, without repeating other prompts.
            for shared_page in sorted(context_pages.get(number, set()) | set(continuation_pages)):
                if shared_page == page_no or full_context.get(number): continue
                if shared_page not in native_cache: native_cache[shared_page] = page_lines(doc[shared_page])
                shared_items = [item for item in native_cache[shared_page] if item['rect'].x0 >= 300 and item['mono'] and item['rect'].y0 < 735]
                content.extend(native_blocks(doc[shared_page], shared_items, meta['id'], f'q{number}-shared-p{shared_page}'))
                for i, rect in enumerate(graphics(doc[shared_page], 40, 735)):
                    content.append(crop_figure(doc[shared_page], rect, meta['id'], f'q{number}-shared-p{shared_page}-diagram-{i}', f'Shared diagram for question {number}'))
            if name == '2018_State_MC.pdf' and number == 40:
                explanations[number] = 'A * B + C ⊕ D̅. The source also accepts C ⊕ D̅ + A * B, using generic Boolean notation with explicit operators.'
            accepted = re.split(r'\s+(?:or|also)\s+', answers[number], flags=re.I)
            # These are alternatives explicitly approved by the supplied
            # explanations. Do not infer algebraic equivalence or change the
            # source's rules about Java versus generic Boolean notation.
            source_alternatives = {
                ('2018_State_MC.pdf', 40): ['C ⊕ D̅ + A * B'],
                ('2019_District_MC.pdf', 40): ['!(A&B)^C'],
                ('2025_InvA_MC.pdf', 40): ['ADFCGA'],
            }
            accepted.extend(source_alternatives.get((name, number), []))
            if name == '2018_State_MC.pdf' and number == 40:
                accepted.extend(re.sub(r'\s+', '', answer) for answer in accepted[:])
            questions.append({'id': f'{meta["id"]}-{number}', 'number': number, 'kind': kind,
                              'choices': letters if kind == 'mc' else [], 'answer': answers[number],
                              'acceptedAnswers': list(dict.fromkeys(accepted)),
                              'content': content, 'choiceContent': choice_content,
                              'text': text, 'images': images, 'explanation': explanations.get(number, '')})
        meta['questionCount'] = len(questions)
        # Raster source diagrams have reviewed node/edge transcriptions. Keep
        # these definitions reproducible with the importer and original source.
        native.apply_diagram_models(meta['id'], questions)
        write_json(OUT / (meta['id'] + '.json'), {**meta, 'questions': questions,
                    'referenceImages': [source_image(doc, n, Path(name).stem) for n in reference_pages]})
        REPORT['written'].append({'id': meta['id'], 'questions': len(questions), 'keys': len(answers), 'explanations': len(explanations)})
        yield meta
        previous_key = key_page


def normalize(value):
    return re.sub(r'\s+', ' ', value.strip()).upper()


def judge_files(entries, title, test_id):
    slug = re.sub('[^a-z0-9]', '', title.lower())
    candidates = {}
    for path, data in entries:
        suffix = path.suffix.lower()
        if suffix not in {'.java', '.cpp', '.py', '.dat', '.out'}: continue
        stem = re.sub('[^a-z0-9]', '', path.stem.lower())
        if stem != slug: continue
        role = 'solution' if suffix in {'.java', '.cpp', '.py'} else 'input' if suffix == '.dat' else 'output'
        lower = str(path).lower()
        # Prefer dedicated judge data over student/sample data or duplicate
        # bundles. Source solutions and output are never guessed from examples.
        priority = (10 if 'judge' in lower else 0) + (3 if 'solutions_' not in lower and 'solutions-' not in lower else 0)
        if 'student' in lower or 'starter' in lower: priority -= 20
        key = (role, suffix)
        if key not in candidates or candidates[key][0] < priority: candidates[key] = (priority, path, data)
    result = []
    for (role, suffix), (_, path, data) in sorted(candidates.items()):
        filename = path.name
        compressed = role == 'input' and len(data) > 250_000
        if compressed: filename += '.gz'
        target = OUT / 'files' / test_id / filename
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(gzip.compress(data, mtime=0) if compressed else data)
        text = data.decode('utf-8-sig', errors='replace')
        # Large judge files are fetched on demand. Never truncate output; a
        # partial judge result would falsely mark an otherwise correct program.
        if len(data) > 100_000: text = None
        result.append({'name': filename, 'url': f'/practice-data/files/{test_id}/{filename}', 'role': role,
                       'text': text, 'compressed': compressed, 'byteLength': len(data),
                       'sourcePath': str(path)})
    return result


def import_programming(name, data, year, code, entries, judge=None):
    doc = pdf.open(stream=data, filetype='pdf')
    meta = test_meta(year, code, 'frq', source_pdf(name, data))
    if judge: meta['judgePdfUrl'] = source_pdf(f'{year}_{code}_Programming_Judge.pdf', judge)
    starts = []
    judge_start = len(doc)
    student_start = next((i for i, page in enumerate(doc) if 'Programming Problem Set' in page.get_text()), 0)
    for page_no in range(student_start + 1, len(doc)):
        page = doc[page_no]
        text = page.get_text()
        if re.search(r'JUDGES?\s+PACKET\s*[-–]?\s*CONFIDENTIAL', text, re.I):
            judge_start = page_no
            break
        if 'Program Name:' not in text: continue
        for box, line in lines(page):
            match = re.fullmatch(r'(\d{1,2})\.\s+(.+)', line)
            if match and box.y0 < 180 and 'java' not in line.lower():
                number, title = int(match[1]), match[2].strip()
                # The Rhea heading says 6 in the 2022 B source, while its table
                # of contents and judge packet identify it as problem 10.
                if year == 2022 and code == 'InvB' and title == 'Rhea' and number == 6:
                    number = 10
                starts.append((number, title, page_no))
                break
    assert [n for n, _, _ in starts] == list(range(1, 13)), (name, 'programming sequence', starts)
    questions = []
    for index, (number, title, page_no) in enumerate(starts):
        end = starts[index + 1][2] if index + 1 < len(starts) else judge_start
        images = [source_image(doc, n, Path(name).stem) for n in range(page_no, end)]
        # Program file basename is more reliable than a display title containing
        # initials, punctuation, or additional spacing.
        match = re.search(r'Program Name:\s*([\w -]+?)\.java', doc[page_no].get_text(), re.I)
        file_title = match[1].strip() if match else title
        files = judge_files(entries, file_title, meta['id'])
        content = []
        for n in range(page_no, end):
            page = doc[n]
            items = [item for item in page_lines(page) if item['rect'].y0 >= (80 if n == page_no else 65)
                     and item['rect'].y1 < 725
                     and not re.fullmatch(r'\s*' + str(number) + r'\.\s*' + re.escape(title) + r'\s*', item['raw'])]
            diagrams = graphics(page, 80, 725)
            # Prose, input/output descriptions and samples are native content.
            # Only actual diagrams remain images.
            content.extend(native_blocks(page, [item for item in items if not any(item['rect'].intersects(rect) for rect in diagrams)], meta['id'], f'problem{number}-p{n}', preserve_gaps=True))
            for i, rect in enumerate(diagrams):
                content.append(crop_figure(page, rect, meta['id'], f'problem{number}-p{n}-diagram-{i}', f'Diagram for {title}'))
        questions.append({'id': f'{meta["id"]}-{number}', 'number': number, 'kind': 'programming', 'title': title, 'programName': file_title,
                          'text': '\n\n'.join(item['text'] for item in images), 'images': images, 'files': files, 'content': content})
    meta['questionCount'] = len(questions)
    write_json(OUT / (meta['id'] + '.json'), {**meta, 'questions': questions, 'referenceImages': []})
    REPORT['programming'].append({'id': meta['id'], 'questions': len(questions), 'withFiles': sum(bool(q['files']) for q in questions)})
    return meta


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('archive', type=Path)
    args = parser.parse_args()
    entries = dict(archive_entries(args.archive))
    tests = []
    nested = {}
    for path, data in entries.items():
        match = re.fullmatch(r'(\d{4})_(InvA|InvB|District|Regional|State)_Programming(?:_Becker_Updates)?\.zip', path.name)
        if match:
            nested[(int(match[1]), match[2])] = list(nested_entries(data))
    for path, data in sorted(entries.items()):
        match = re.fullmatch(r'(\d{4})_(InvA|InvB|District|Regional|State|InvA_InvB_District)_MC\.pdf', path.name)
        if match:
            tests.extend(import_written(path.name, data, int(match[1]), match[2].split('_') if '_' in match[2] else [match[2]]))
    for path, data in sorted(entries.items()):
        match = re.fullmatch(r'(\d{4})_(InvA|InvB|District|Regional|State)_Programming\.pdf', path.name)
        if not match: continue
        year, code = int(match[1]), match[2]
        judge = next((value for key, value in entries.items() if key.name == f'{year}_{code}_Programming_Judge.pdf'), None)
        files = nested.get((year, code), [])
        if not judge:
            judge = next((value for key, value in files if key.suffix.lower() == '.pdf' and 'judge' in key.name.lower() and 'packet' in key.name.lower()), None)
        tests.append(import_programming(path.name, data, year, code, files, judge))
    # The 2026 Invitational A archive contains judge files but no statements.
    # Include it as a clearly labeled resource, rather than inventing prompts.
    resources = []
    used = {(test['year'], test['contest']) for test in tests if test['mode'] == 'frq'}
    for (year, code), files in nested.items():
        if (year, ROUND_NAMES[code]) not in used:
            original = next((data for path, data in entries.items() if path.name == f'{year}_{code}_Programming.zip'), None)
            if not original: continue
            name = f'{year}_{code}_Programming.zip'
            target = OUT / 'files' / name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(original)
            resources.append({'year': year, 'contest': ROUND_NAMES[code], 'title': f'{year} {ROUND_NAMES[code]} judge files',
                              'url': '/practice-data/files/' + name, 'note': 'Judge inputs, outputs and solutions only. The problem packet was not included in the supplied archive.'})
    # Keep supplied Becker correction documents accessible alongside the current
    # packet and updated judge data, without executing or following directions.
    for path, data in nested.get((2025, 'District'), []):
        if path.suffix.lower() == '.docx':
            target = OUT / 'files' / '2025-district-frq' / path.name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)
            resources.append({'year': 2025, 'contest': 'District', 'title': '2025 District Becker correction', 'url': '/practice-data/files/2025-district-frq/' + path.name, 'note': 'Supplied correction document for the Becker programming problem.'})
    tests.sort(key=lambda t: (-t['year'], list(ROUND_NAMES.values()).index(t['contest']), t['mode']))
    write_json(OUT / 'modern-index.json', {'version': 1, 'tests': tests, 'resources': resources})
    write_json(OUT / 'manifest.json', {'version': 1, 'tests': tests, 'resources': resources})
    report = Path(__file__).resolve().parents[1] / 'work' / 'uil-import-report.json'
    write_json(report, REPORT)
    print(json.dumps({'tests': len(tests), 'writtenQuestions': sum(t['questionCount'] for t in tests if t['mode'] == 'mc'),
                      'programmingProblems': sum(t['questionCount'] for t in tests if t['mode'] == 'frq'), 'resources': len(resources)}))


if __name__ == '__main__':
    main()
