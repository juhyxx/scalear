// Small DOM helpers shared by the views.

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = s => String(s).replace(/[&<>"']/g, c => ESC[c]);

// Segmented control. options: [[value, label, title?], …]
export function seg(name, options, current, extra = '') {
  return `<div class="seg ${extra}" role="group">${options
    .map(([v, label, title]) => `<button type="button" data-act="${name}" data-val="${esc(v)}" aria-pressed="${String(v) === String(current)}"${title ? ` title="${esc(title)}"` : ''}>${label}</button>`)
    .join('')}</div>`;
}

export const icon = {
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>',
  stop: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor"/></svg>',
  prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.6l2.55 5.3 5.8.75-4.25 4.05 1.07 5.75L12 16.65l-5.17 2.8 1.07-5.75-4.25-4.05 5.8-.75z" stroke-linejoin="round"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
};

// Star toggle for a catalogue item.
export const favButton = (on, kind, id, label) =>
  `<button type="button" class="btn icon fav" data-act="fav" data-kind="${kind}" data-id="${esc(id)}" aria-pressed="${on}" aria-label="${esc(label)}" title="${esc(label)}">${icon.star}</button>`;
