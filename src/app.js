const root = document.documentElement;
const appearance = document.querySelector('#appearance');
const search = document.querySelector('#catalog-search');
const searchable = [...document.querySelectorAll('.dc-searchable')];
const emptyState = document.querySelector('#empty-state');
const searchStatus = document.querySelector('#search-status');
const menuButton = document.querySelector('.dc-menu-button');
const mobileNav = document.querySelector('#mobile-navigation');
const desktopLinks = [...document.querySelectorAll('.dc-nav a')];

const appearanceQuery = window.matchMedia('(prefers-color-scheme: dark)');

function readPreference(key, fallback) {
  try { return localStorage.getItem(key) || fallback; }
  catch { return fallback; }
}

function writePreference(key, value) {
  try { localStorage.setItem(key, value); }
  catch { /* Storage can be unavailable in restricted browser contexts. */ }
}

function applyLayoutClass() {
  const width = window.innerWidth;
  root.dataset.glzLayoutClass = width < 600 ? 'compact' : width < 1024 ? 'medium' : width < 1440 ? 'expanded' : 'wide';
}

function applyAppearance(value) {
  const resolved = value === 'system' ? (appearanceQuery.matches ? 'dark' : 'light') : value;
  root.dataset.glzAppearance = resolved;
  root.style.colorScheme = resolved === 'light' ? 'light' : 'dark';
  writePreference('design-center-appearance', value);
}

const savedAppearance = readPreference('design-center-appearance', 'system');
appearance.value = savedAppearance;
applyLayoutClass();
applyAppearance(savedAppearance);

appearance.addEventListener('change', () => applyAppearance(appearance.value));
appearanceQuery.addEventListener('change', () => {
  if (appearance.value === 'system') applyAppearance('system');
});

function filterCatalog() {
  const query = search.value.trim().toLowerCase();
  let visible = 0;

  searchable.forEach((section) => {
    const haystack = `${section.dataset.search || ''} ${section.textContent}`.toLowerCase();
    const matches = !query || haystack.includes(query);
    section.hidden = !matches;
    if (matches) visible += 1;
  });

  emptyState.hidden = visible !== 0;
  searchStatus.textContent = query ? `${visible} section${visible === 1 ? '' : 's'} matched.` : '';
}

search.addEventListener('input', filterCatalog);

document.addEventListener('keydown', (event) => {
  if (event.key === '/' && document.activeElement !== search && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '')) {
    event.preventDefault();
    search.focus();
  }
  if (event.key === 'Escape' && document.activeElement === search) {
    search.value = '';
    filterCatalog();
    search.blur();
  }
});

function setMobileNav(open) {
  mobileNav.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
}

menuButton.addEventListener('click', () => setMobileNav(mobileNav.hidden));
mobileNav.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMobileNav(false);
});

const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting && !entry.target.hidden)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;
  desktopLinks.forEach((link) => {
    const active = link.getAttribute('href') === `#${visible.target.id}`;
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}, { rootMargin: '-18% 0px -68% 0px', threshold: [0.08, 0.25, 0.5] });

searchable.forEach((section) => sectionObserver.observe(section));

window.addEventListener('resize', () => {
  applyLayoutClass();
  if (window.innerWidth >= 1024) setMobileNav(false);
}, { passive: true });
