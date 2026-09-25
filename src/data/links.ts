import { getLatestChangelog } from './changelogs';

export const GITHUB = "https://github.com/px0-ai/px0";
export const RELEASES = `${GITHUB}/releases`;
export const ISSUES = `${GITHUB}/issues`;
export const LICENSE = `${GITHUB}/blob/master/LICENSE`;
export const repoDoc = (name: string) => `${GITHUB}/blob/master/${name}`;
export const SLACK = "https://join.slack.com/t/px0community/shared_invite/zt-4b3g4riww-TsgeJZ4aHbPIlEKuVn~3aA";

export const EMAIL = "arpit@arpitbhayani.me";
export const MAILTO = `mailto:${EMAIL}`;
export const AUTHOR = "https://arpitbhayani.me";

/** Design Partner Program link (set to a Tally/Typeform URL or empty to use the structured email gate) */
export const DESIGN_PARTNER_FORM_URL = "";

export const VERSION = getLatestChangelog()?.version || "0.1.10";

/** The one-liner shown on the site. Kept here so it lives in one place. */
export const INSTALL_URL = "https://px0.ai/install.sh";
export const INSTALL_CMD = `curl -fsSL ${INSTALL_URL} | sh`;
