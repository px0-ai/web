export const GITHUB = "https://github.com/px0-ai/px0";
export const RELEASES = `${GITHUB}/releases`;
export const ISSUES = `${GITHUB}/issues`;
export const LICENSE = `${GITHUB}/blob/master/LICENSE`;
export const repoDoc = (name: string) => `${GITHUB}/blob/master/${name}`;

export const EMAIL = "arpit@arpitbhayani.me";
export const MAILTO = `mailto:${EMAIL}`;
export const AUTHOR = "https://arpitbhayani.me";

export const VERSION = "0.1.0";

/** The one-liner shown on the site. Kept here so it lives in one place. */
export const INSTALL_URL = "https://raw.githubusercontent.com/px0-ai/px0/master/install.sh";
export const INSTALL_CMD = `curl -fsSL ${INSTALL_URL} | bash`;
