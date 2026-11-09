// The root picker shared by Explore and the Catalog: twelve keys, natural notes in white, and the
// accidentals switch (automatic, ♯ or ♭). Buttons carry data-act="root" / "spelling"; each view
// handles the clicks.
import { state } from './store.js';
import { spellRoot, noteName } from './theory.js';
import { esc, seg } from './dom.js';
import { t } from './i18n.js';

// intervals: the shown item's, so automatic spelling names the keys the way that item is spelled.
export function rootPicker(intervals) {
  const keys = [];
  for (let pc = 0; pc < 12; pc++) {
    const n = spellRoot(pc, state.spelling, intervals);
    keys.push(`<button type="button" class="btn root-chip${n.acc ? '' : ' natural'}" data-act="root" data-val="${pc}" aria-pressed="${pc === state.rootPc}">${noteName(n)}</button>`);
  }
  const spelling = seg('spelling', [
    ['auto', t('ex.spellAuto'), t('ex.spellAutoHint')], ['sharp', '♯', t('ex.spellSharp')], ['flat', '♭', t('ex.spellFlat')],
  ], state.spelling, 'small keys');
  return `<div class="roots" role="group" aria-label="${esc(t('ex.root'))}">${keys.join('')}</div>
    <span class="module-label">${esc(t('ex.accidentals'))}</span>${spelling}`;
}
