const root = document.documentElement;
const grid = document.querySelector('#token-grid');
const category = document.querySelector('#token-category');
const status = document.querySelector('#token-status');

const TOKENS = [
  { name: '--glz1-canvas', label: 'Canvas', category: 'surface', swatch: true },
  { name: '--glz1-base', label: 'Base surface', category: 'surface', swatch: true },
  { name: '--glz1-raised', label: 'Raised surface', category: 'surface', swatch: true },
  { name: '--glz1-overlay-bg', label: 'Overlay surface', category: 'surface', swatch: true },
  { name: '--glz1-text-primary', label: 'Primary text', category: 'text', swatch: true },
  { name: '--glz1-text-secondary', label: 'Secondary text', category: 'text', swatch: true },
  { name: '--glz1-line', label: 'Line', category: 'text', swatch: true },
  { name: '--glz1-focus', label: 'Focus', category: 'interaction', swatch: true },
  { name: '--glz14-frost-strength', label: 'Frost strength', category: 'optical', swatch: false },
  { name: '--glz14-blur-scale', label: 'Blur scale', category: 'optical', swatch: false },
  { name: '--glz14-semantic-protection', label: 'Semantic protection', category: 'optical', swatch: false },
  { name: '--glz14-depth-hue-shift', label: 'Depth hue shift', category: 'optical', swatch: false },
  { name: '--glz14-light-warmth', label: 'Light warmth', category: 'optical', swatch: false },
  { name: '--glz14-memory-tint', label: 'Memory tint', category: 'optical', swatch: true },
  { name: '--glz14-memory-tint-influence', label: 'Memory tint influence', category: 'optical', swatch: false }
];

function resolvedValue(name) {
  return getComputedStyle(root).getPropertyValue(name).trim();
}

function makeToken(token) {
  const value = resolvedValue(token.name);
  const available = Boolean(value);
  const item = document.createElement('article');
  item.className = 'dc-token-item';
  item.dataset.available = String(available);
  item.setAttribute('role', 'listitem');

  const swatch = document.createElement('span');
  swatch.className = 'dc-token-swatch';
  swatch.setAttribute('aria-hidden', 'true');
  if (available && token.swatch) swatch.style.setProperty('--token-swatch', value);

  const copy = document.createElement('div');
  copy.className = 'dc-token-copy';

  const text = document.createElement('div');
  const name = document.createElement('code');
  name.textContent = token.name;
  const resolved = document.createElement('span');
  resolved.className = 'dc-token-value';
  resolved.textContent = available ? `${token.label} · ${value}` : `${token.label} · unavailable`;
  text.append(name, resolved);

  const button = document.createElement('button');
  button.className = 'dc-copy-button';
  button.type = 'button';
  button.textContent = 'Copy';
  button.disabled = !available;
  button.setAttribute('aria-label', available ? `Copy resolved value for ${token.name}` : `${token.name} is unavailable`);
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(value);
      status.textContent = `Copied ${token.name}.`;
    } catch {
      status.textContent = `Copy unavailable for ${token.name}.`;
    }
  });

  copy.append(text, button);
  item.append(swatch, copy);
  return item;
}

function render() {
  if (!grid) return;
  const filter = category?.value || 'all';
  grid.replaceChildren();
  TOKENS
    .filter((token) => filter === 'all' || token.category === filter)
    .forEach((token) => grid.append(makeToken(token)));
}

category?.addEventListener('change', render);

new MutationObserver((mutations) => {
  if (mutations.some((mutation) => mutation.attributeName === 'data-glz-appearance')) render();
}).observe(root, { attributes: true, attributeFilter: ['data-glz-appearance'] });

render();
