export interface ChangelogCategory {
  name: string;
  items: string[];
}

export interface ChangelogEntry {
  version: string;
  tag: string;
  date: string;
  title: string;
  summary: string;
  commitCount: number;
  commitRange: string;
  categories: ChangelogCategory[];
}

const changelogModules = import.meta.glob<{ default: ChangelogEntry } | ChangelogEntry>(
  './changelog/*.json',
  { eager: true }
);

function parseSemVer(v: string): number[] {
  return v.replace(/^v/, '').split('.').map((num) => parseInt(num, 10) || 0);
}

function compareSemVer(a: string, b: string): number {
  const pa = parseSemVer(a);
  const pb = parseSemVer(b);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] ?? 0;
    const nb = pb[i] ?? 0;
    if (na !== nb) return nb - na;
  }
  return 0;
}

export const changelogs: ChangelogEntry[] = Object.values(changelogModules)
  .map((mod: any) => mod.default || mod)
  .sort((a, b) => compareSemVer(a.version, b.version));

export function getLatestChangelog(): ChangelogEntry {
  return changelogs[0];
}

export function getAllChangelogs(): ChangelogEntry[] {
  return changelogs;
}
