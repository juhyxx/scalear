#!/usr/bin/env python3
"""Build fonts/ScalearPixelCE.ttf: the letters Silkscreen lacks, drawn on its pixel grid.

Silkscreen covers Latin-1 but not Czech háček and kroužek letters (Č Ř Š Ž Ě Ď Ť Ň Ů) or arrows.
This font holds only those glyphs; CSS lists it after Silkscreen, so the browser uses it just for
them. The base letters were sampled from Silkscreen (which draws lowercase like uppercase), the
háček is Silkscreen's circumflex turned over, and both are licensed under the SIL OFL 1.1.

Run: python3 tools/pixel-ce-font.py
"""
import struct
from pathlib import Path

PX = 125          # one Silkscreen pixel: the em is 8 pixels
UPM = 1000
ASCENT, DESCENT = 1025, 250   # Silkscreen's line metrics, so mixing the two fonts doesn't change line height

# Pixel rows from the top (row 4) down to the baseline (row 0); '#' is ink. The first column is the
# left side bearing, as in Silkscreen.
BASES = {
    'C': ['..##.', '.#..#', '.#...', '.#..#', '..##.'],
    'D': ['.###.', '.#..#', '.#..#', '.#..#', '.###.'],
    'E': ['.###', '.#..', '.###', '.#..', '.###'],
    'N': ['.#...#', '.##..#', '.#.#.#', '.#..##', '.#...#'],
    'R': ['.###.', '.#..#', '.###.', '.#.#.', '.#..#'],
    'S': ['..###', '.#...', '..##.', '....#', '.###.'],
    'T': ['.###', '..#.', '..#.', '..#.', '..#.'],
    'U': ['.#..#', '.#..#', '.#..#', '.#..#', '..##.'],
    'Z': ['.###', '...#', '..#.', '.#..', '.###'],
}
# Marks sit in rows 7 and 6, above a one-pixel gap, like Silkscreen's É and Å.
CARON = {3: ['.#.#', '..#.'], 4: ['.#..#', '..##.'], 5: ['..#.#', '...#.']}
RING = {4: ['..##.', '..##.']}
CARON_LETTERS = 'CDENRSTZ'
ARROWS = {
    '→': ['...#..', '....#.', '.#####', '....#.', '...#..'],
    '←': ['...#..', '..#...', '.#####', '..#...', '...#..'],
}


def ink_width(rows):
    return max(len(r.rstrip('.')) for r in rows) - 1


def pixels(rows, top):
    """(column, row) for every '#', rows listed from `top` downward."""
    return {(x, top - y) for y, r in enumerate(rows) for x, c in enumerate(r) if c == '#'}


def glyphs():
    out = {}
    for ch in CARON_LETTERS:
        base = BASES[ch]
        w = ink_width(base)
        mark = CARON[w]
        out[ch + '̌'] = (pixels(base, 4) | pixels(mark, 7), w)
    out['Ů'] = (pixels(BASES['U'], 4) | pixels(RING[4], 7), 4)
    for ch, rows in ARROWS.items():
        out[ch] = (pixels(rows, 4), ink_width(rows))
    return out


def compose(name):
    """'Č' → ['Č', 'č']; arrows map to themselves."""
    import unicodedata
    if len(name) == 1:
        return [name]
    upper = unicodedata.normalize('NFC', name)
    return [upper, upper.lower()]


# ---------------------------------------------------------------- TrueType writing

def contours_for(pix):
    """One rectangle per horizontal run, overlapping its neighbours by a unit so no seams show."""
    rects = []
    for y in sorted({p[1] for p in pix}):
        xs = sorted(x for x, yy in pix if yy == y)
        start = prev = xs[0]
        for x in xs[1:] + [None]:
            if x is not None and x == prev + 1:
                prev = x
                continue
            rects.append((start * PX, y * PX - 1, (prev + 1) * PX, (y + 1) * PX + 1))
            if x is not None:
                start = prev = x
    # clockwise: up the left edge, across the top, down the right edge
    return [[(x0, y0), (x0, y1), (x1, y1), (x1, y0)] for x0, y0, x1, y1 in rects]


def glyf_entry(contours):
    if not contours:
        return b''
    pts = [p for c in contours for p in c]
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    data = struct.pack('>hhhhh', len(contours), min(xs), min(ys), max(xs), max(ys))
    end = -1
    for c in contours:
        end += len(c)
        data += struct.pack('>H', end)
    data += struct.pack('>H', 0)                 # no instructions
    data += bytes([0x01]) * len(pts)             # every point on-curve, coordinates as int16 deltas
    px = py = 0
    xd, yd = b'', b''
    for x, y in pts:
        xd += struct.pack('>h', x - px)
        yd += struct.pack('>h', y - py)
        px, py = x, y
    data += xd + yd
    return data + b'\0' * (-len(data) % 4)


def checksum(b):
    b += b'\0' * (-len(b) % 4)
    return sum(struct.unpack(f'>{len(b) // 4}L', b)) & 0xFFFFFFFF


def name_table(records):
    count = len(records)
    strings = b''
    recs = b''
    for nid, text in records:
        enc = text.encode('utf-16-be')
        recs += struct.pack('>HHHHHH', 3, 1, 0x409, nid, len(enc), len(strings))
        strings += enc
    return struct.pack('>HHH', 0, count, 6 + 12 * count) + recs + strings


def cmap_table(mapping):
    codes = sorted(mapping)
    segs = [(c, c, mapping[c]) for c in codes] + [(0xFFFF, 0xFFFF, 0)]
    n = len(segs)
    sr = 2 * 2 ** (n.bit_length() - 1)
    body = struct.pack('>HHHH', n * 2, sr, (n.bit_length() - 1), n * 2 - sr)
    body += b''.join(struct.pack('>H', e) for _, e, _ in segs) + struct.pack('>H', 0)
    body += b''.join(struct.pack('>H', s) for s, _, _ in segs)
    body += b''.join(struct.pack('>H', (g - s) % 0x10000 if s != 0xFFFF else 1) for s, _, g in segs)  # idDelta
    body += b''.join(struct.pack('>H', 0) for _ in segs)
    sub = struct.pack('>HHH', 4, 6 + len(body), 0) + body
    return struct.pack('>HHHHL', 0, 1, 3, 1, 12) + sub


def build():
    shapes = glyphs()
    order = [('.notdef', set(), 3), ('space', set(), 3)] + [(k, v[0], v[1]) for k, v in shapes.items()]
    mapping = {0x20: 1}
    for gid, (key, _, _) in enumerate(order):
        if gid >= 2:
            for ch in compose(key):
                mapping[ord(ch)] = gid

    glyf, loca, hmtx = b'', [], b''
    max_pts = max_cont = 0
    xmin = ymin = 10 ** 6
    xmax = ymax = -10 ** 6
    for key, pix, width in order:
        loca.append(len(glyf))
        contours = contours_for(pix) if pix else []
        glyf += glyf_entry(contours)
        adv = (width + 2) * PX
        lsb = min((p[0] for c in contours for p in c), default=0)
        hmtx += struct.pack('>Hh', adv, lsb)
        if contours:
            pts = [p for c in contours for p in c]
            max_pts, max_cont = max(max_pts, len(pts)), max(max_cont, len(contours))
            xmin, xmax = min(xmin, *[p[0] for p in pts]), max(xmax, *[p[0] for p in pts])
            ymin, ymax = min(ymin, *[p[1] for p in pts]), max(ymax, *[p[1] for p in pts])
    loca.append(len(glyf))
    n = len(order)
    adv_max = max(struct.unpack('>H', hmtx[i * 4:i * 4 + 2])[0] for i in range(n))

    tables = {
        'head': struct.pack('>LLLLHHqqhhhhHHhhh', 0x00010000, 0x00010000, 0, 0x5F0F3CF5, 0x000B, UPM,
                            0, 0, xmin, ymin, xmax, ymax, 0, 8, 2, 1, 0),
        'hhea': struct.pack('>LhhhHhhhhhhhhhhhH', 0x00010000, ASCENT, -DESCENT, 0, adv_max, 0, 0, xmax,
                            1, 0, 0, 0, 0, 0, 0, 0, n),
        'maxp': struct.pack('>LHHHHHHHHHHHHHH', 0x00010000, n, max_pts, max_cont, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0),
        'OS/2': struct.pack('>HhHHHhhhhhhhhhhh10sLLLL4sHHHhhhHHLLhhHHH',
                            4, 6 * PX, 400, 5, 0, 650, 700, 0, 140, 650, 700, 0, 480, 50, 300, 0,
                            bytes(10), 0x7, 0, 0, 0, b'SCLR', 0x0040, min(mapping), max(mapping),
                            ASCENT, -DESCENT, 0, ASCENT, DESCENT, 0x3, 0, 625, 625, 0, 0x20, 0),
        'hmtx': hmtx,
        'cmap': cmap_table(mapping),
        'loca': b''.join(struct.pack('>L', o) for o in loca),
        'glyf': glyf,
        'name': name_table([
            (0, 'Copyright 2001 The Silkscreen Project Authors; Czech letters for Scalear.'),
            (1, 'Scalear Pixel CE'), (2, 'Regular'), (3, 'Scalear Pixel CE Regular'),
            (4, 'Scalear Pixel CE Regular'), (5, 'Version 1.000'), (6, 'ScalearPixelCE-Regular'),
            (13, 'This Font Software is licensed under the SIL Open Font License, Version 1.1.'),
            (14, 'https://openfontlicense.org'),
        ]),
        'post': struct.pack('>LLhhLLLLL', 0x00030000, 0, -PX, PX, 0, 0, 0, 0, 0),
    }

    tags = sorted(tables)
    num = len(tags)
    sr = 16 * 2 ** (num.bit_length() - 1)
    header = struct.pack('>LHHHH', 0x00010000, num, sr, num.bit_length() - 1, num * 16 - sr)
    offset = 12 + 16 * num
    directory, body = b'', b''
    for tag in tags:
        data = tables[tag]
        directory += struct.pack('>4sLLL', tag.encode(), checksum(data), offset + len(body), len(data))
        body += data + b'\0' * (-len(data) % 4)
    font = bytearray(header + directory + body)
    # checkSumAdjustment lives at offset 8 of the head table
    head_off = offset + sum(len(tables[t]) + (-len(tables[t]) % 4) for t in tags[:tags.index('head')])
    struct.pack_into('>L', font, head_off + 8, (0xB1B0AFBA - checksum(bytes(font))) & 0xFFFFFFFF)
    return bytes(font), mapping


if __name__ == '__main__':
    data, mapping = build()
    out = Path(__file__).resolve().parent.parent / 'fonts' / 'ScalearPixelCE.ttf'
    out.write_bytes(data)
    print(f'{out}: {len(data)} bytes, {len(mapping) - 1} characters:', ''.join(sorted(chr(c) for c in mapping if c != 0x20)))
