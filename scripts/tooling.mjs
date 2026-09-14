import { access, cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import config from '../design-center.config.json' with { type: 'json' };

const mode = process.argv[2] || 'build';
const { repository, sourceCommit, version, cssEntrypoint } = config.glaze;
const [owner, repo] = repository.split('/');
const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${sourceCommit}`;
const vendorRoot = path.resolve('vendor/glaze');

async function fetchResponse(relativePath) {
  const response = await fetch(`${rawBase}/${relativePath}`, {
    headers: { 'User-Agent': 'GoreeCloud-Design-Center-Glaze-Sync' }
  });
  if (!response.ok) throw new Error(`Unable to synchronize ${relativePath}: HTTP ${response.status}`);
  return response;
}

async function fetchText(relativePath) {
  return (await fetchResponse(relativePath)).text();
}

async function fetchBytes(relativePath) {
  const buffer = await (await fetchResponse(relativePath)).arrayBuffer();
  return Buffer.from(buffer);
}

async function save(relativePath, content) {
  const target = path.join(vendorRoot, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content);
}

async function syncGlaze() {
  const seenCss = new Set();
  const seenAssets = new Set();

  async function syncAsset(relativePath) {
    if (seenAssets.has(relativePath)) return;
    seenAssets.add(relativePath);
    await save(relativePath, await fetchBytes(relativePath));
  }

  async function syncCss(relativePath) {
    if (seenCss.has(relativePath)) return;
    seenCss.add(relativePath);

    const content = await fetchText(relativePath);
    await save(relativePath, content);

    const baseDir = path.posix.dirname(relativePath);
    const imports = new Set();

    const importPattern = /@import\s+url\(["']?([^"')]+)["']?\)/g;
    for (const match of content.matchAll(importPattern)) {
      const imported = match[1];
      if (/^(?:https?:|data:|\/)/i.test(imported)) {
        throw new Error(`Remote or absolute CSS import is not allowed: ${imported}`);
      }
      const child = path.posix.normalize(path.posix.join(baseDir, imported));
      imports.add(imported);
      await syncCss(child);
    }

    const urlPattern = /url\(["']?([^"')]+)["']?\)/g;
    for (const match of content.matchAll(urlPattern)) {
      const asset = match[1];
      if (imports.has(asset) || asset.startsWith('#') || /^data:/i.test(asset)) continue;
      if (/^https?:/i.test(asset) || asset.startsWith('/')) {
        throw new Error(`Remote or absolute runtime asset is not allowed: ${asset}`);
      }
      const relativeAsset = path.posix.normalize(path.posix.join(baseDir, asset));
      await syncAsset(relativeAsset);
    }
  }

  await rm(vendorRoot, { recursive: true, force: true });

  const upstreamVersion = (await fetchText('VERSION')).trim();
  if (upstreamVersion !== version) {
    throw new Error(`Pinned Glaze source reports VERSION ${upstreamVersion}; expected ${version}`);
  }

  const lifecycleText = await fetchText('registry/lifecycle.json');
  const lifecycle = JSON.parse(lifecycleText);
  if (lifecycle.currentStable !== version || lifecycle.currentOfficial !== version) {
    throw new Error(`Pinned Glaze lifecycle is not Official Stable ${version}`);
  }

  await save('VERSION', `${upstreamVersion}\n`);
  await save('registry/lifecycle.json', lifecycleText);
  await syncCss(cssEntrypoint);

  for (const runtime of ['js/glaze-v1.4.0.mjs', 'js/glaze-v1.4-optical-engine.mjs']) {
    await save(runtime, await fetchText(runtime));
  }

  await save('SOURCE.json', `${JSON.stringify({
    repository,
    sourceCommit,
    version,
    synchronizedAt: new Date().toISOString(),
    cssFiles: [...seenCss].sort(),
    localAssets: [...seenAssets].sort()
  }, null, 2)}\n`);

  console.log(`Synchronized GLAZE UI ${version} from ${sourceCommit} (${seenCss.size} CSS files, ${seenAssets.size} local assets).`);
}

async function validate() {
  const failures = [];
  const requireText = async (file) => readFile(file, 'utf8');
  const expect = (condition, message) => { if (!condition) failures.push(message); };

  const [index, css, app] = await Promise.all([
    requireText('index.html'),
    requireText('src/app.css'),
    requireText('src/app.js')
  ]);

  expect(config.product.status === 'development', 'Design Center must remain Development until application-specific acceptance is complete.');
  expect(config.glaze.version === '1.4.0', 'Configured Glaze target must be 1.4.0.');
  expect(/^[0-9a-f]{40}$/.test(config.glaze.sourceCommit), 'Glaze source must be pinned to an exact commit.');

  expect(index.includes('vendor/glaze/css/glaze-v1.4.0.css'), 'index.html must load the local synchronized Glaze 1.4.0 entrypoint.');
  expect(index.includes('name="viewport"'), 'index.html must define a responsive viewport.');
  expect(index.includes('<main'), 'index.html must contain a semantic main region.');
  expect(index.includes('Skip to content'), 'index.html must contain a keyboard skip link.');
  expect(index.includes('aria-live="polite"'), 'Search feedback must expose a polite live region.');
  expect(index.includes('assets/design-center-mark.svg'), 'Repository-local Design Center identity must be used.');

  const runtimeSource = `${index}\n${css}\n${app}`;
  expect(!/(?:src|href)=["']https?:\/\//i.test(runtimeSource), 'Runtime source must not depend on remote scripts, stylesheets, fonts, or images.');
  expect(css.includes('--dc-target: 48px'), 'Touch target floor must be defined at 48px.');
  expect(css.includes('@media (min-width: 600px)'), 'Medium composition breakpoint is missing.');
  expect(css.includes('@media (min-width: 1024px)'), 'Expanded composition breakpoint is missing.');
  expect(css.includes('@media (min-width: 1440px)'), 'Wide composition breakpoint is missing.');
  expect(css.includes('prefers-reduced-motion: reduce'), 'Reduced Motion fallback is missing.');
  expect(css.includes('prefers-reduced-transparency: reduce'), 'Reduced Transparency fallback is missing.');
  expect(css.includes('prefers-contrast: more'), 'Increased Contrast fallback is missing.');
  expect(css.includes('forced-colors: active'), 'Forced Colors fallback is missing.');
  expect(css.includes(':focus-visible'), 'Visible keyboard focus styling is missing.');

  for (const required of [
    'vendor/glaze/VERSION',
    'vendor/glaze/registry/lifecycle.json',
    'vendor/glaze/css/glaze-v1.4.0.css',
    'vendor/glaze/js/glaze-v1.4.0.mjs',
    'vendor/glaze/js/glaze-v1.4-optical-engine.mjs',
    'assets/design-center-mark.svg'
  ]) {
    try { await access(required); }
    catch { failures.push(`Required synchronized/local asset is missing: ${required}`); }
  }

  try {
    const vendorVersion = (await requireText('vendor/glaze/VERSION')).trim();
    expect(vendorVersion === config.glaze.version, `Synchronized Glaze VERSION is ${vendorVersion}, expected ${config.glaze.version}.`);
    const lifecycle = JSON.parse(await requireText('vendor/glaze/registry/lifecycle.json'));
    expect(lifecycle.currentStable === config.glaze.version, 'Synchronized lifecycle does not identify the configured version as current Stable.');
    expect(lifecycle.currentOfficial === config.glaze.version, 'Synchronized lifecycle does not identify the configured version as current Official.');
  } catch (error) {
    failures.push(`Unable to validate synchronized Glaze lifecycle: ${error.message}`);
  }

  if (failures.length) {
    console.error('Design Center validation failed:');
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exitCode = 1;
    throw new Error(`${failures.length} validation check(s) failed.`);
  }

  console.log('Design Center source validation passed.');
}

async function build() {
  await syncGlaze();
  await validate();

  await rm('dist', { recursive: true, force: true });
  await mkdir('dist', { recursive: true });

  for (const entry of ['index.html', 'src', 'assets', 'vendor']) {
    await cp(entry, `dist/${entry}`, { recursive: true });
  }

  await writeFile('dist/build-metadata.json', `${JSON.stringify({
    product: config.product.name,
    lifecycle: config.product.status,
    glazeVersion: config.glaze.version,
    glazeSourceCommit: config.glaze.sourceCommit,
    builtAt: new Date().toISOString()
  }, null, 2)}\n`);

  console.log('Built static Design Center artifact in dist/.');
}

if (mode === 'sync') await syncGlaze();
else if (mode === 'validate') await validate();
else if (mode === 'build') await build();
else throw new Error(`Unknown tooling mode: ${mode}`);
