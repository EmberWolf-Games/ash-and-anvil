/**
 * Build Foundry release artifacts: stamped system.json + installable zip.
 *
 * Usage: node utils/release/build-release.mjs <semver>
 * Example: node utils/release/build-release.mjs 0.1.0
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import {
  GITHUB_REPO,
  PACKAGE_ZIP_NAME,
  RELEASE_DOWNLOAD_URL,
  RELEASE_MANIFEST_URL,
  SYSTEM_ID,
} from "./constants.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const DIST = path.join(ROOT, "dist", "release");
const STAGE = path.join(DIST, SYSTEM_ID);

const version = process.argv[2]?.replace(/^v/i, "");
if (!version || !/^\d+\.\d+\.\d+(-[\w.-]+)?(\+[\w.-]+)?$/.test(version)) {
  console.error("Usage: node utils/release/build-release.mjs <semver>");
  console.error("Example: node utils/release/build-release.mjs 0.1.0");
  process.exit(1);
}

/** Paths excluded from the Foundry install zip. */
const EXCLUDE_NAMES = new Set([
  ".git",
  ".github",
  ".gitignore",
  ".idea",
  ".vscode",
  "dist",
  "node_modules",
  "release",
  "utils",
  PACKAGE_ZIP_NAME,
  "system.json",
]);

/** @param {string} name */
function shouldExclude(name) {
  if (EXCLUDE_NAMES.has(name)) return true;
  if (name.endsWith(".zip")) return true;
  if (name.endsWith(".log")) return true;
  return false;
}

/** @param {string} src @param {string} dest */
function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      if (shouldExclude(entry)) continue;
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(STAGE, { recursive: true });

const manifestPath = path.join(ROOT, "system.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

manifest.version = version;
manifest.url = `https://github.com/${GITHUB_REPO}`;
manifest.manifest = RELEASE_MANIFEST_URL;
manifest.download = RELEASE_DOWNLOAD_URL;

const stagedManifestPath = path.join(STAGE, "system.json");
fs.writeFileSync(stagedManifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

for (const entry of fs.readdirSync(ROOT)) {
  if (shouldExclude(entry)) continue;
  const src = path.join(ROOT, entry);
  const dest = path.join(STAGE, entry);
  copyRecursive(src, dest);
}

const releaseManifestPath = path.join(DIST, "system.json");
fs.copyFileSync(stagedManifestPath, releaseManifestPath);

const zipPath = path.join(DIST, PACKAGE_ZIP_NAME);
if (process.platform === "win32") {
  execSync(
    `powershell -NoProfile -Command "Compress-Archive -Path '${STAGE}' -DestinationPath '${zipPath}' -Force"`,
    { stdio: "inherit", cwd: ROOT }
  );
} else {
  execSync(`cd "${path.join(DIST)}" && zip -r "${PACKAGE_ZIP_NAME}" "${SYSTEM_ID}"`, {
    stdio: "inherit",
  });
}

console.log(`Release ${version} artifacts:`);
console.log(`  ${releaseManifestPath}`);
console.log(`  ${zipPath}`);
console.log(`Manifest URL: ${RELEASE_MANIFEST_URL}`);
console.log(`Download URL: ${RELEASE_DOWNLOAD_URL}`);
