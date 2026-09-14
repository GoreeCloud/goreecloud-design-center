import { access, readFile } from 'node:fs/promises';
import config from '../design-center.config.json' with { type: 'json' };

const failures = [];
const fail = (message) => failures.push(message);
const text = async (file) => readFile(file, 'utf8');

const [index, tokenScript, workspaceCss, manifestText] = await Promise.all([
  text('index.html'),
  text('src/token-inspector.js'),
  text('src/workspace.css'),
  text('goreecloud.platform.yaml')
]);

let manifest;
try {
  manifest = JSON.parse(manifestText);
} catch (error) {
  fail(`goreecloud.platform.yaml must remain JSON-compatible YAML for dependency-free local validation: ${error.message}`);
}

const ids = [...index.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = ids.filter((id, position) => ids.indexOf(id) !== position);
if (duplicateIds.length) fail(`Duplicate HTML ids: ${[...new Set(duplicateIds)].join(', ')}`);

const idSet = new Set(ids);
for (const match of index.matchAll(/\shref="#([^"]+)"/g)) {
  if (!idSet.has(match[1])) fail(`Broken internal anchor: #${match[1]}`);
}
for (const match of index.matchAll(/\saria-controls="([^"]+)"/g)) {
  if (!idSet.has(match[1])) fail(`aria-controls target does not exist: ${match[1]}`);
}

if (/(?:src|href)=["']https?:\/\//i.test(index)) {
  fail('index.html must not load remote runtime scripts, stylesheets, images, or fonts.');
}

for (const requiredId of ['workspace', 'overview', 'foundations', 'tokens', 'components', 'adaptation', 'accessibility', 'token-grid', 'token-status']) {
  if (!idSet.has(requiredId)) fail(`Required workspace id is missing: ${requiredId}`);
}

if (!index.includes('src/token-inspector.js')) fail('Token inspector script is not loaded.');
if (!index.includes('src/workspace.css')) fail('Workspace extension stylesheet is not loaded.');
if (!tokenScript.includes("'--glz1-canvas'") || !tokenScript.includes("'--glz14-frost-strength'")) {
  fail('Token inspector must read both inherited semantic and V1.4 optical variables.');
}
if (!tokenScript.includes('getComputedStyle(root)')) fail('Token inspector must resolve values from computed Glaze styles.');
if (!workspaceCss.includes('.dc-token-grid')) fail('Token inspector layout styles are missing.');

const baselineFiles = [
  'README.md',
  'SPECIFICATIONS.md',
  'FEATURES.md',
  'FEATURE-ROADMAP.md',
  'BENEFITS.md',
  'COMPETITIVE-OBJECTIVES.md',
  'BRANDING.md',
  'USER-MANUAL.md',
  'PRIVACY POLICY.md',
  'NOTES.md',
  'SECURITY.md',
  '.gitignore',
  '.editorconfig',
  'goreecloud.platform.yaml'
];
for (const file of baselineFiles) {
  try { await access(file); }
  catch { fail(`Required repository baseline file is missing: ${file}`); }
}

if (manifest) {
  const expectedSystems = ['manager', 'privacy_shield', 'wardveil_security', 'everkeep', 'glaze_ui', 'mesh', 'identity', 'sync'];
  if (manifest.schema_version !== '0.3') fail('Platform Contract schema_version must be 0.3.');
  if (manifest.component?.repository !== 'GoreeCloud/goreecloud-design-center') fail('Platform manifest repository identity is incorrect.');
  if (manifest.lifecycle !== 'development') fail('Design Center Platform Contract lifecycle must remain development.');
  if (manifest.conformance?.status !== 'nonconformant') fail('Design Center must remain nonconformant until all applicable acceptance gates pass.');
  if (manifest.compatibility?.platform_contract !== '0.3') fail('Platform Contract compatibility version must be 0.3.');
  if (manifest.compatibility?.glaze_ui_required !== config.glaze.version) fail('Platform manifest Glaze requirement must match Design Center configuration.');
  if (manifest.platform_systems?.glaze_ui?.version !== config.glaze.version) fail('Declared Glaze integration version must match Design Center configuration.');
  for (const system of expectedSystems) {
    if (!manifest.platform_systems?.[system]) fail(`Platform manifest does not declare Integral Platform System: ${system}`);
  }
}

if (failures.length) {
  console.error('Design Center workspace validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Design Center workspace and repository-baseline validation passed.');
