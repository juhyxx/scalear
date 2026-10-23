// Small chord-box diagram for a voicing: strings vertical in physical order, frets downward.
// The root is drawn as a square, other tones as dots; a short string's starting fret counts as open.
import { pitchAt } from './instruments.js';

export function renderChordDiagram(frets, strings, rootPc, lefty = false) {
  const S = frets.length;
  const sp = 11;
  const fh = 13;
  const fretted = frets.filter((f, s) => f > strings[s].from);
  const maxF = fretted.length ? Math.max(...fretted) : 0;
  const minF = fretted.length ? Math.min(...fretted) : 0;
  const first = maxF <= 4 ? 1 : minF;
  const rows = Math.max(4, maxF - first + 1);
  const left = 18;
  const top = 16;
  const W = left + (S - 1) * sp + 10;
  const H = top + rows * fh + 6;
  const xOf = s => (lefty ? left + (S - 1 - s) * sp : left + s * sp);

  const out = [];
  for (let r = 0; r <= rows; r++) {
    const y = top + r * fh;
    out.push(`<line class="cd-fret${r === 0 && first === 1 ? ' nut' : ''}" x1="${left}" x2="${left + (S - 1) * sp}" y1="${y}" y2="${y}"/>`);
  }
  for (let s = 0; s < S; s++) out.push(`<line class="cd-string" x1="${xOf(s)}" x2="${xOf(s)}" y1="${top}" y2="${top + rows * fh}"/>`);
  if (first > 1) out.push(`<text class="cd-pos" x="${left - 5}" y="${top + fh / 2}">${first}</text>`);

  frets.forEach((f, s) => {
    const x = xOf(s);
    const str = strings[s];
    const root = f >= str.from && pitchAt(str, f) % 12 === rootPc;
    if (f < 0) out.push(`<text class="cd-mute" x="${x}" y="${top - 6}">×</text>`);
    else if (f === str.from) {
      out.push(root
        ? `<rect class="cd-open root" x="${x - 3}" y="${top - 10}" width="6" height="6"/>`
        : `<circle class="cd-open" cx="${x}" cy="${top - 7}" r="3"/>`);
    } else {
      const y = top + (f - first + 0.5) * fh;
      out.push(root
        ? `<rect class="cd-dot root" x="${x - 4.2}" y="${y - 4.2}" width="8.4" height="8.4" rx="1.5"/>`
        : `<circle class="cd-dot" cx="${x}" cy="${y}" r="4.4"/>`);
    }
  });

  return `<svg class="chord-diagram" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true">${out.join('')}</svg>`;
}

// Twelve-point pitch-class clock used on catalog cards.
export function renderPcClock(semis, size = 44) {
  const r = size / 2 - 5;
  const c = size / 2;
  const pts = [];
  const dots = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const x = (c + r * Math.cos(a)).toFixed(1);
    const y = (c + r * Math.sin(a)).toFixed(1);
    const on = semis.includes(i);
    if (on) pts.push(`${x},${y}`);
    dots.push(i === 0
      ? `<rect x="${(x - 3.2).toFixed(1)}" y="${(y - 3.2).toFixed(1)}" width="6.4" height="6.4" rx="1" class="pc-root"/>`
      : `<circle cx="${x}" cy="${y}" r="${on ? 2.8 : 1.4}" class="${on ? 'pc-on' : 'pc-off'}"/>`);
  }
  const poly = pts.length > 2 ? `<polygon points="${pts.join(' ')}" class="pc-poly"/>` : pts.length === 2 ? `<polyline points="${pts.join(' ')}" class="pc-poly"/>` : '';
  return `<svg class="pc-clock" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" aria-hidden="true">${poly}${dots.join('')}</svg>`;
}

// Note wheel: the twelve pitch classes round a circle with C at the top, chromatic or in fifths.
// Slots are { pc, midi, name, member, cls, label, sub }; members light up, the root as a square.
export function renderNoteWheel(slots, order, label = '') {
  const C = 120;
  const R = 92;
  const r = 16;
  const index = pc => (order === 'fifths' ? (pc * 7) % 12 : pc);
  const at = (pc, rad) => {
    const a = (index(pc) / 12) * Math.PI * 2 - Math.PI / 2;
    return [C + rad * Math.cos(a), C + rad * Math.sin(a)].map(v => Math.round(v * 10) / 10);
  };
  const members = slots.filter(s => s.member).sort((a, b) => index(a.pc) - index(b.pc));
  const poly = members.map(s => at(s.pc, R).join(',')).join(' ');
  const out = [`<circle class="wh-ring" cx="${C}" cy="${C}" r="${R}"/>`];
  if (members.length > 1) out.push(`<polygon class="wh-poly" points="${poly}"/>`);
  for (const s of slots) {
    const [x, y] = at(s.pc, R);
    const attrs = `data-pc="${s.pc}" data-midi="${s.midi}"`;
    if (!s.member) {
      out.push(`<g class="wk off" ${attrs}><circle class="wk-hit" cx="${x}" cy="${y}" r="${r}"/><text x="${x}" y="${y}">${s.name}</text></g>`);
      continue;
    }
    const body = s.cls === 'root'
      ? `<rect class="wk-body" x="${x - r * 0.88}" y="${y - r * 0.88}" width="${r * 1.76}" height="${r * 1.76}" rx="${r * 0.3}"/>`
      : `<circle class="wk-body" cx="${x}" cy="${y}" r="${r}"/>`;
    const [sx, sy] = at(s.pc, R - 30);
    out.push(`<g class="wk ${s.cls}" ${attrs}>${body}<text x="${x}" y="${y}" class="wk-label${s.label.length > 2 ? ' small' : ''}">${s.label}</text>` +
      (s.sub ? `<text x="${sx}" y="${sy}" class="wk-sub">${s.sub}</text>` : '') + `</g>`);
  }
  return `<svg class="wheel" viewBox="0 0 240 240" role="img" aria-label="${label}">${out.join('')}</svg>`;
}
