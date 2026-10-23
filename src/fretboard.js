// SVG fretboard. Geometry is computed along the neck (u, from the nut) and across it
// (v, from the lowest string), then mapped to x/y for horizontal or vertical display.

const INLAYS = [3, 5, 7, 9, 15, 17, 19, 21];
const DOUBLE_INLAYS = [12, 24];

const GEOMETRY = {
  h: { sp: 32, r: 12.5, fret: 66, ratio: 0.962, open: 46, names: 22, end: 14, side: 10, numbers: 24 },
  v: { sp: 52, r: 16, fret: 60, ratio: 0.966, open: 50, names: 24, end: 14, side: 12, numbers: 26 },
};

/**
 * @param {object} o
 * @param {Array<{open:number,from:number,name:string}>} o.strings  physical order; `from` > 0 is a short string
 * @param {boolean}  [o.fretless]
 * @param {number}   o.frets      highest fret shown
 * @param {boolean}  o.vertical
 * @param {boolean}  o.lefty
 * @param {Array<{s:number,f:number,midi:number,label:string,cls:string,ghost?:boolean}>} o.markers
 * @param {{lo:number,hi:number}|null} [o.band]   highlighted fret range
 * @param {number[]} [o.muted]   strings marked as not played
 * @param {string}   [o.label]   accessible name
 */
export function renderFretboard(o) {
  const g = GEOMETRY[o.vertical ? 'v' : 'h'];
  const S = o.strings.length;
  const fretPos = [0];
  for (let i = 1; i <= o.frets; i++) fretPos.push(fretPos[i - 1] + g.fret * g.ratio ** (i - 1));
  const neck = fretPos[o.frets];
  const across = (S - 1) * g.sp;
  const edge = g.sp * 0.55;
  const start = g.names + g.open;
  const along = f => (f === 0 ? -g.open / 2 : (fretPos[f - 1] + fretPos[f]) / 2);

  let W, H, pt;
  if (!o.vertical) {
    W = start + neck + g.end;
    H = g.side + across + 2 * edge + g.numbers;
    pt = (u, v) => [o.lefty ? W - (start + u) : start + u, g.side + edge + across - v];
  } else {
    W = g.numbers + across + 2 * edge + g.side;
    H = start + neck + g.end;
    pt = (u, v) => [o.lefty ? W - (g.numbers + edge + v) : g.numbers + edge + v, start + u];
  }

  const n = x => Math.round(x * 10) / 10;
  const rect = (u1, u2, v1, v2, attrs) => {
    const [x1, y1] = pt(u1, v1);
    const [x2, y2] = pt(u2, v2);
    return `<rect x="${n(Math.min(x1, x2))}" y="${n(Math.min(y1, y2))}" width="${n(Math.abs(x2 - x1))}" height="${n(Math.abs(y2 - y1))}" ${attrs}/>`;
  };
  const line = (u1, v1, u2, v2, attrs) => {
    const [x1, y1] = pt(u1, v1);
    const [x2, y2] = pt(u2, v2);
    return `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" ${attrs}/>`;
  };
  const text = (u, v, str, cls) => {
    const [x, y] = pt(u, v);
    return `<text x="${n(x)}" y="${n(y)}" class="${cls}">${str}</text>`;
  };
  const circle = (u, v, r, attrs) => {
    const [x, y] = pt(u, v);
    return `<circle cx="${n(x)}" cy="${n(y)}" r="${r}" ${attrs}/>`;
  };

  const out = [];
  out.push(rect(0, neck, -edge, across + edge, 'class="fb-wood" rx="3"'));

  if (o.band) {
    const u1 = o.band.lo === 0 ? -g.open + 4 : fretPos[o.band.lo - 1] + 2;
    const u2 = fretPos[o.band.hi] - 2;
    out.push(rect(u1, u2, -edge + 1, across + edge - 1, 'class="fb-band" rx="8"'));
  }

  // Fretless instruments get faint position lines and no inlays.
  const inlay = g.r * 0.62;
  for (const f of INLAYS) if (f <= o.frets && !o.fretless) out.push(circle(along(f), across / 2, inlay, 'class="fb-inlay"'));
  for (const f of DOUBLE_INLAYS) {
    if (f > o.frets || o.fretless) continue;
    const d = S > 2 ? g.sp : across / 4;
    out.push(circle(along(f), across / 2 - d, inlay, 'class="fb-inlay"'));
    out.push(circle(along(f), across / 2 + d, inlay, 'class="fb-inlay"'));
  }

  const fretCls = o.fretless ? 'fb-fret fretless' : 'fb-fret';
  for (let i = 1; i <= o.frets; i++) out.push(line(fretPos[i], -edge, fretPos[i], across + edge, `class="${fretCls}"`));
  out.push(rect(-4, 0, -edge, across + edge, 'class="fb-nut"'));

  const lowest = Math.min(...o.strings.map(st => st.open));
  o.strings.forEach((st, s) => {
    const w = Math.min(3, Math.max(0.8, 0.8 + (64 - st.open) * 0.045 + (st.open - lowest < 1 ? 0.2 : 0)));
    const v = s * g.sp;
    if (st.from) {
      // Short string: it starts at its own nut on fret `from`, with a peg just before it.
      const u0 = fretPos[st.from - 1] + 4;
      out.push(line(u0, v, neck, v, `class="fb-string" stroke-width="${n(w)}"`));
      out.push(rect(fretPos[st.from] - 3, fretPos[st.from], v - g.sp * 0.32, v + g.sp * 0.32, 'class="fb-nut"'));
      out.push(circle(u0, v, 2.6, 'class="fb-peg"'));
      out.push(text(-g.open - g.names / 2, v, `${st.name}<tspan class="fb-sub" dx="1" dy="-4">${st.from}</tspan>`, 'fb-sname'));
    } else {
      out.push(line(-g.open + 6, v, neck, v, `class="fb-string" stroke-width="${n(w)}"`));
      out.push(text(-g.open - g.names / 2, v, st.name, 'fb-sname'));
    }
  });

  for (let i = 1; i <= o.frets; i++) {
    const strong = INLAYS.includes(i) || DOUBLE_INLAYS.includes(i);
    out.push(text(along(i), -edge - g.numbers / 2, i, strong ? 'fb-num strong' : 'fb-num'));
  }

  // Invisible hit areas so any fret position can be tapped to hear it.
  o.strings.forEach((st, s) => {
    for (let f = st.from; f <= o.frets; f++) {
      const u1 = f === 0 ? -g.open : fretPos[f - 1];
      const u2 = f === 0 ? -2 : fretPos[f];
      out.push(rect(u1, u2, s * g.sp - g.sp / 2, s * g.sp + g.sp / 2, `class="fb-hit" data-midi="${st.open + f - st.from}"`));
    }
  });

  for (const s of o.muted || []) out.push(text(along(o.strings[s].from), s * g.sp, '×', 'fb-muted'));

  // Root notes are squares, everything else round.
  const shape = (x, y, r, root, attrs) => (root
    ? `<rect x="${n(x - r * 0.88)}" y="${n(y - r * 0.88)}" width="${n(r * 1.76)}" height="${n(r * 1.76)}" rx="${n(r * 0.3)}" ${attrs}/>`
    : `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" ${attrs}/>`);
  for (const m of o.markers) {
    const [x, y] = pt(along(m.f), m.s * g.sp);
    const attrs = `data-midi="${m.midi}" data-pos="${m.s}:${m.f}"`;
    const root = m.cls === 'root';
    if (m.ghost) {
      out.push(shape(x, y, g.r * 0.36, root, `class="mk ghost${root ? ' root' : ''}" ${attrs}`));
      continue;
    }
    const size = m.label.length > 2 ? ' small' : '';
    out.push(
      `<g class="mk ${m.cls}" ${attrs}>${shape(x, y, g.r, root, 'class="mk-body"')}` +
        (m.label ? `<text x="${n(x)}" y="${n(y)}" class="mk-label${size}">${m.label}</text>` : '') +
        `</g>`,
    );
  }

  const cls = o.vertical ? 'fretboard vertical' : 'fretboard horizontal';
  return `<svg class="${cls}" viewBox="0 0 ${n(W)} ${n(H)}" width="${n(W)}" height="${n(H)}" style="--w:${Math.round(W)}px" role="img" aria-label="${o.label || ''}">${out.join('')}</svg>`;
}
