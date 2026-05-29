/** @type {readonly string} */
export const GITHUB_REPO = "EmberWolf-Games/ash-and-anvil";

/** @type {readonly string} */
export const SYSTEM_ID = "ash-and-anvil";

/** @type {readonly string} */
export const PACKAGE_ZIP_NAME = `${SYSTEM_ID}.zip`;

/** Foundry / Forge install manifest (always resolves to newest release). */
export const RELEASE_MANIFEST_URL =
  `https://github.com/${GITHUB_REPO}/releases/latest/download/system.json`;

/** Foundry / Forge package download (always resolves to newest release). */
export const RELEASE_DOWNLOAD_URL =
  `https://github.com/${GITHUB_REPO}/releases/latest/download/${PACKAGE_ZIP_NAME}`;

export const RELEASE_PAGE_URL = `https://github.com/${GITHUB_REPO}/releases/latest`;
