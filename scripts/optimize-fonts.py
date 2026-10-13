"""Keep production font weight ranges, preserving every glyph.

Run manually with FontTools and Brotli installed. The web build uses the
checked-in outputs; original fonts remain available for future typography.
"""
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ASSETS = Path(__file__).resolve().parents[1] / 'assets'
FONTS = [
    ('geist-latin', 'geist-ui-latin', (400, 700)),
    ('geist-mono-latin', 'geist-mono-ui-latin', (400, 700)),
    ('newsreader-latin', 'newsreader-display-latin', (400, 500)),
]

for original, output, weights in FONTS:
    font = TTFont(ASSETS / f'{original}.woff2', recalcTimestamp=False)
    instantiateVariableFont(font, {'wght': weights}, inplace=True)
    font.flavor = 'woff2'
    font.save(ASSETS / f'{output}.woff2')
