"""Native PDF glyph recovery and diagram geometry; never executes source programs."""
import hashlib
import io
import json
import re
from pathlib import Path

import pymupdf as pdf
from fontTools.ttLib import TTFont

GLYPHS = {item['fingerprint']: item for item in json.loads(Path(__file__).with_name('uil-glyphs.json').read_text())}
FONT_CACHE = {}


def decoded_glyphs(page):
    """Resolve damaged ToUnicode entries by verified embedded glyph outlines.

    Fingerprints identify actual shapes, not moving CID/PUA aliases. Every map
    entry was checked against source-rendered glyphs; unknowns stay unresolved.
    """
    refs = {font[3].split('+')[-1].replace(',', ''): font[0] for font in page.get_fonts()}
    result = {}
    for span in page.get_texttrace():
        bad = [c for c in span['chars'] if c[0] < 32 or c[0] == 65533
               or (c[0] == 32 and span['font'].endswith('CambriaMath'))]
        xref = refs.get(span['font'].replace(',', ''))
        if not bad or not xref: continue
        raw = page.parent.extract_font(xref)[3]
        digest = hashlib.sha256(raw).hexdigest()
        if digest not in FONT_CACHE:
            try: FONT_CACHE[digest] = (TTFont(io.BytesIO(raw)), {})
            except Exception: FONT_CACHE[digest] = (None, {})
        font, cache = FONT_CACHE[digest]
        if font is None or 'glyf' not in font: continue
        try: order = font.getGlyphOrder()
        except Exception:
            FONT_CACHE[digest] = (None, {})
            continue
        for char in bad:
            gid = char[1]
            if gid not in cache:
                try:
                    coords, ends, flags = font['glyf'][order[gid]].getCoordinates(font['glyf'])
                    fingerprint = hashlib.sha256(repr((list(coords), list(ends), list(flags))).encode()).hexdigest()
                    match = GLYPHS.get(fingerprint)
                    cache[gid] = {**match, 'advanceUnits': max(x for x, y in coords) / font['head'].unitsPerEm} if match else None
                except Exception: cache[gid] = None
            if cache[gid]:
                result[(round(char[2][0], 2), round(char[2][1], 2))] = {**cache[gid], 'advance': cache[gid]['advanceUnits'] * span['size']}
    return result


def restore_lines(lines, glyphs):
    bars = []
    for item in lines:
        restored = []
        for char in item['chars']:
            match = glyphs.get(tuple(round(v, 2) for v in char['origin']))
            if match:
                if match.get('accent'):
                    x, y = char['origin']
                    bars.append((x, x + match['advance'], y))
                    continue
                char['c'] = match['text']
                if char.get('style') not in {'sup', 'sub'} and match['text'].isalpha(): char['style'] = 'italic'
            restored.append(char)
        item['chars'] = restored
    # Join the repeated short bars Word uses to draw a single overline.
    joined = []
    for x0, x1, y in sorted(bars, key=lambda b: (round(b[2], 1), b[0])):
        # Baselines can differ slightly in the PDF. A later bar may therefore
        # be to the left of the previous one; only intersecting/adjacent ranges
        # belong together, and both extents must survive the union.
        matches = [i for i, old in enumerate(joined) if abs(old[2] - y) < .4
                   and x0 <= old[1] + 1 and x1 >= old[0] - 1]
        for i in reversed(matches):
            old = joined.pop(i)
            x0, x1 = min(x0, old[0]), max(x1, old[1])
        joined.append((x0, x1, y))
    for item in lines:
        for char in item['chars']:
            cx = (char['bbox'][0] + char['bbox'][2]) / 2
            cy = char['origin'][1]
            covering = [(i, b) for i, b in enumerate(joined) if b[0] - .5 <= cx <= b[1] + .5 and 0 <= cy - b[2] <= 6]
            if covering: char['_overbars'] = [i for i, b in sorted(covering, key=lambda pair: -(pair[1][1] - pair[1][0]))]
        item['raw'] = ''.join(c['c'] for c in item['chars'])
    return [item for item in lines if item['chars']]


def diagram_model(nodes, edges, title, width, height, radius=12):
    """Build native paths/text from source-verified graph/tree relationships."""
    paths, labels = [], []
    lookup = {n['id']: n for n in nodes}
    for edge in edges:
        a, b = lookup[edge['from']], lookup[edge['to']]
        via = edge.get('via', [])
        first, last = (via[0], via[-1]) if via else (b, a)
        def direction(start, end):
            dx, dy = end['x'] - start['x'], end['y'] - start['y']
            length = (dx * dx + dy * dy) ** .5
            return dx / length, dy / length
        sx, sy = direction(a, first)
        ex, ey = direction(last, b)
        x0, y0 = a['x'] + radius * sx, a['y'] + radius * sy
        x1, y1 = b['x'] - radius * ex, b['y'] - radius * ey
        route = ''.join(f' L{p["x"]:.2f},{p["y"]:.2f}' for p in via)
        paths.append({'d': f'M{x0:.2f},{y0:.2f}{route} L{x1:.2f},{y1:.2f}', 'fill': 'none', 'stroke': 'ink', 'strokeWidth': 1})
        for x, y, vx, vy in ([(x1, y1, ex, ey)] if edge.get('directed') else []) + ([(x0, y0, -sx, -sy)] if edge.get('both') else []):
            paths.append({'d': f'M{x:.2f},{y:.2f} L{x-6*vx+2.5*vy:.2f},{y-6*vy-2.5*vx:.2f} L{x-6*vx-2.5*vy:.2f},{y-6*vy+2.5*vx:.2f} Z', 'fill': 'ink', 'stroke': 'none'})
        if 'weight' in edge:
            labels.append({'text': str(edge['weight']), 'x': edge.get('labelX', (x0 + x1) / 2), 'y': edge.get('labelY', (y0 + y1) / 2 - 6), 'size': 13, 'anchor': 'middle'})
    for node in nodes:
        x, y = node['x'], node['y']
        paths.append({'d': f'M{x-radius},{y} a{radius},{radius} 0 1,0 {2*radius},0 a{radius},{radius} 0 1,0 {-2*radius},0', 'fill': 'surface', 'stroke': 'ink', 'strokeWidth': 1})
        labels.append({'text': str(node.get('label', node['id'])), 'x': x, 'y': y + 4, 'size': 13, 'anchor': 'middle'})
    relations = [f'{e["from"]} {"to" if e.get("directed") and not e.get("both") else "connected to"} {e["to"]}' + (f', weight {e["weight"]}' if 'weight' in e else '') for e in edges]
    return {'type': 'diagram', 'width': width, 'height': height, 'title': title, 'description': '; '.join(relations), 'paths': paths, 'labels': labels,
            'nodes': nodes, 'edges': edges}


def vector_diagram(page, rect, title):
    """Represent a genuine vector figure as editable SVG paths and native labels."""
    rect = (rect + (-3, -3, 3, 3)) & page.rect
    if any('lines' not in block and pdf.Rect(block['bbox']).width > 15
           and pdf.Rect(block['bbox']).height > 15 and pdf.Rect(block['bbox']).intersects(rect)
           for block in page.get_text('dict')['blocks']): return None
    paths = []
    def point(p): return f'{p.x-rect.x0:.3f},{p.y-rect.y0:.3f}'
    for shape in page.get_drawings():
        box = pdf.Rect(shape['rect'])
        if not rect.contains(box) or (box.width < 1 and box.height > 100): continue
        if box.width > page.rect.width * .8: continue
        commands = []
        previous = None
        for item in shape['items']:
            kind = item[0]
            if kind in {'l', 'c'}:
                start, end = item[1], item[-1]
                if previous != start: commands.append('M' + point(start))
                commands.append(('L' + point(end)) if kind == 'l' else 'C' + ' '.join(point(p) for p in item[2:]))
                previous = end
            elif kind == 're':
                r = item[1]
                commands.append(f'M{point(r.tl)} L{point(r.tr)} L{point(r.br)} L{point(r.bl)} Z')
                previous = None
            elif kind == 'qu':
                q = item[1]
                commands.append(f'M{point(q.ul)} L{point(q.ur)} L{point(q.lr)} L{point(q.ll)} Z')
                previous = None
            else: return None
        if not commands: continue
        if shape.get('closePath'): commands.append('Z')
        fill = shape.get('fill')
        shade = sum(fill) / len(fill) if fill else 1
        fill_kind = 'none' if fill is None else 'ink' if shade < .4 else 'surface'
        paths.append({'d': ' '.join(commands), 'fill': fill_kind, 'stroke': 'ink' if shape.get('color') is not None else 'none', 'strokeWidth': max(.6, shape.get('width') or .6)})
    if not paths: return None
    labels = []
    restored = decoded_glyphs(page)
    drawings = page.get_drawings()
    for block in page.get_text('rawdict')['blocks']:
        for line in block.get('lines', []):
            for span in line['spans']:
                # A Word label can be one padded span starting far outside the
                # illustration. Keep its actual visible glyphs, not the span's
                # leading whitespace or neighboring labels.
                segments, current = [], []
                for char in span['chars']:
                    match = restored.get(tuple(round(v, 2) for v in char['origin']), {})
                    value = match.get('text', char['c'])
                    inside = rect.contains(pdf.Rect(char['bbox']))
                    if inside and value.strip() and any(ord(c) < 32 or c == '\ufffd' for c in value): return None
                    if not inside or not value.strip():
                        if current: segments.append(current); current = []
                        continue
                    if current and char['origin'][0] - current[-1]['bbox'][2] > span['size'] * .3:
                        segments.append(current); current = []
                    current.append({**char, 'c': value})
                if current: segments.append(current)
                for segment in segments:
                    ink = pdf.Rect(segment[0]['bbox'])
                    for char in segment[1:]: ink |= pdf.Rect(char['bbox'])
                    dark_background = any(s.get('fill') and sum(s['fill']) / len(s['fill']) < .4 and pdf.Rect(s['rect']).contains(ink) for s in drawings)
                    labels.append({'text': ''.join(c['c'] for c in segment), 'x': segment[0]['origin'][0] - rect.x0, 'y': segment[0]['origin'][1] - rect.y0, 'size': span['size'], 'bold': 'bold' in span['font'].lower(), 'italic': 'italic' in span['font'].lower(), 'color': 'surface' if dark_background else 'ink'})
    return {'type': 'diagram', 'title': title, 'width': rect.width, 'height': rect.height, 'paths': paths, 'labels': labels}


def shared_code_cells(page, items):
    """Read complete code cells, whose left neighbors contain several questions.

    Left-column row borders are deliberately excluded: a question heading does
    not terminate the method or class in the adjoining source-code cell.
    """
    rects = [pdf.Rect(path['rect']) for path in page.get_drawings()]
    # Word can split one horizontal border into several filled rectangles.
    edges = sorted([r for r in rects if r.height < 2 and r.width > 10], key=lambda r: r.y0)
    unique = []
    for edge in edges:
        if unique and abs(unique[-1].y0 - edge.y0) < 1:
            old = unique[-1]
            # Zero-height stroked borders are "empty" PyMuPDF rectangles;
            # Rect's union operator can discard one side of such a border.
            unique[-1] = pdf.Rect(min(old.x0, edge.x0), min(old.y0, edge.y0),
                                  max(old.x1, edge.x1), max(old.y1, edge.y1))
        else: unique.append(pdf.Rect(edge))
    unique = [r for r in unique if r.width > 160 and r.x1 > page.rect.width - 45 and r.x0 < 400]
    cells = []
    for upper, lower in zip(unique, unique[1:]):
        top, bottom = upper.y0, lower.y0
        if bottom - top < 40: continue
        boundary = max(upper.x0, lower.x0)
        if boundary < 150:
            # Dotted dividers may be raster borders, absent from get_drawings.
            # Their top/bottom horizontal borders still identify the actual
            # right cell, before the segments are joined across the page.
            starts = [[r.x0 for r in edges if abs(r.y0 - y) < 1
                       and 150 < r.x0 < 400 and r.x1 > page.rect.width - 45
                       and r.width > 160] for y in [top, bottom]]
            pairs = [(a, b) for a in starts[0] for b in starts[1] if abs(a - b) < 2]
            if pairs: boundary = max(max(pair) for pair in pairs)
        if boundary < 150:
            verticals = [r for r in rects if r.width < 2 and 150 < r.x0 < 400
                         and r.y1 > top and r.y0 < bottom]
            dividers = {round(r.x0): 0 for r in verticals}
            for r in verticals:
                dividers[round(r.x0)] += max(0, min(bottom, r.y1) - max(top, r.y0))
            boundaries = [x for x, covered in dividers.items() if covered >= (bottom - top) * .9]
            if not boundaries: continue
            boundary = max(boundaries)
        group = sorted([item for item in items if item['rect'].x0 >= boundary - 1
                        and top <= item['rect'].y0 < bottom and item['rect'].y0 < 735],
                       key=lambda item: (item['rect'].y0, item['rect'].x0))
        option_top = min((item['rect'].y0 for item in group if re.match(r'^\s*[A-Z][.)](?:\s|$)', item['raw'])), default=bottom)
        group = [item for item in group if item['rect'].y0 < option_top - 3]
        raw = '\n'.join(item['raw'] for item in group)
        if sum(item['mono'] for item in group) < 3: continue
        if not re.search(r'\b(?:class|public|static|int|void|Iterator|Set|TreeMap)\b|[{}]|<\*\d', raw): continue
        cells.append((top, bottom, boundary, group))
    return cells


def apply_diagram_models(test_id, questions):
    """Apply original-source transcriptions without discarding other artwork."""
    models = []
    for filename in ['uil-diagrams.json', 'uil-raster-diagrams.json']:
        path = Path(__file__).with_name(filename)
        if path.exists(): models.extend(json.loads(path.read_text()).get(test_id, []))
    for model in models:
        diagram = diagram_model(model['nodes'], model['edges'], model['title'], model['width'], model['height'], model.get('radius', 12))
        diagram.update({'source': model['source'], 'sourcePage': model['page']})
        for number in model['questions']:
            question = questions[number - 1]
            target = question if not model.get('choice') else next(c for c in question['choiceContent'] if c['label'] == model['choice'])
            if 'figureIndex' in model:
                positions = [i for i, b in enumerate(target['content']) if b['type'] in {'figure', 'diagram'}]
                target['content'][positions[model['figureIndex']]] = diagram
            else:
                target['content'] = [b for b in target['content'] if b['type'] not in {'figure', 'diagram'}] + [diagram]
        for number in model.get('excludeQuestions', []):
            question = questions[number - 1]
            question['content'] = [b for b in question['content'] if b['type'] not in {'figure', 'diagram'}]
