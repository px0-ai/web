#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const webRoot = resolve(__dirname, '../../../../');
const px0Repo = resolve(webRoot, '../px0');

const gitBin = existsSync('/usr/bin/git')
  ? '/usr/bin/git'
  : (existsSync('/usr/local/bin/git') ? '/usr/local/bin/git' : 'git');

function getGitOutput(gitArgs, cwd = px0Repo) {
  const res = spawnSync(gitBin, gitArgs, { cwd, encoding: 'utf8' });
  if (res.error || res.status !== 0) {
    console.error(`Error executing ${gitBin} ${gitArgs.join(' ')}:`, res.error || res.stderr);
    process.exit(1);
  }
  return res.stdout.trim();
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Usage: node generate-changelog.mjs <version> [from_ref] [to_ref]");
  console.log("Example: node generate-changelog.mjs 0.1.3 v0.1.2 HEAD");
  process.exit(1);
}

const rawVersion = args[0];
const version = rawVersion.replace(/^v/, '');
const tag = `v${version}`;

// Get list of existing tags
const tags = getGitOutput(['tag', '-l', '--sort=-v:refname']).split('\n').filter(Boolean);
const fromRef = args[1] || tags[0] || 'HEAD~1';
const toRef = args[2] || (tags.includes(tag) ? tag : 'HEAD');

console.log(`Generating changelog for version ${version} (${tag})...`);
console.log(`Commit range: ${fromRef}..${toRef} in ${px0Repo}`);

const commitCountStr = getGitOutput(['rev-list', '--count', `${fromRef}..${toRef}`]);
const commitCount = parseInt(commitCountStr, 10) || 0;

let releaseDate = new Date().toISOString().slice(0, 10);
if (tags.includes(tag)) {
  const tagDate = getGitOutput(['log', '-1', '--format=%ad', '--date=short', tag]);
  if (tagDate) releaseDate = tagDate;
}

const logRaw = getGitOutput(['log', '--reverse', '--format=COMMIT_START%n%h%n%s%n%b%nCOMMIT_END', `${fromRef}..${toRef}`]);

const commits = [];
const blocks = logRaw.split('COMMIT_START').filter(b => b.trim().length > 0);

for (const b of blocks) {
  const lines = b.trim().split('\n');
  const hash = lines[0]?.trim();
  const subject = lines[1]?.trim();
  const bodyLines = lines.slice(2).filter(l => l !== 'COMMIT_END' && l.trim().length > 0);
  if (hash && subject) {
    commits.push({ hash, subject, bodyLines });
  }
}

// Group commits into categories
const categoriesMap = {
  'Features': [],
  'Improvements': [],
  'Fixes': [],
  'Documentation': [],
  'Tooling': []
};

for (const c of commits) {
  const sub = c.subject;
  const lower = sub.toLowerCase();

  // Extract bullet points from commit body if any
  const bodyBullets = c.bodyLines
    .filter(l => l.trim().startsWith('- ') || l.trim().startsWith('* '))
    .map(l => l.trim().replace(/^[-*]\s+/, ''));

  const items = bodyBullets.length > 0 ? bodyBullets : [sub];

  if (lower.startsWith('fix') || lower.includes('bug') || lower.includes('collision') || lower.includes('clash')) {
    categoriesMap['Fixes'].push(...items);
  } else if (lower.startsWith('doc') || lower.includes('readme') || lower.includes('architecture') || lower.includes('guide')) {
    categoriesMap['Documentation'].push(...items);
  } else if (lower.startsWith('add') || lower.startsWith('support') || lower.includes('feature')) {
    categoriesMap['Features'].push(...items);
  } else if (lower.includes('bump version') || lower.includes('publish') || lower.includes('makefile') || lower.includes('install')) {
    categoriesMap['Tooling'].push(...items);
  } else {
    categoriesMap['Improvements'].push(...items);
  }
}

const categories = Object.entries(categoriesMap)
  .filter(([_, items]) => items.length > 0)
  .map(([name, items]) => ({
    name,
    items: Array.from(new Set(items))
  }));

const changelogData = {
  version,
  tag,
  date: releaseDate,
  title: `Release ${tag}`,
  summary: `Updates and improvements in version ${tag}.`,
  commitCount,
  commitRange: `${fromRef}..${toRef}`,
  categories
};

const targetFile = resolve(webRoot, `src/data/changelog/v${version}.json`);
writeFileSync(targetFile, JSON.stringify(changelogData, null, 2) + '\n', 'utf8');

console.log(`Successfully generated: ${targetFile}`);
