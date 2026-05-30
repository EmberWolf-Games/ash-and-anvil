#!/usr/bin/env node
/**
 * Validate system.json version for CI / release workflow.
 * Usage: node utils/release/validate-version.mjs <version>
 */
import { isValidVersion, parseVersion, versionTag } from "./version.mjs";

const version = process.argv[2]?.replace(/^v/i, "")?.trim();

if (!version) {
  console.error("Usage: node utils/release/validate-version.mjs <version>");
  process.exit(1);
}

if (!isValidVersion(version)) {
  console.error(`Invalid version: ${version}`);
  console.error("Expected M.m.bbb.hhh (e.g. 0.6.001.002) or legacy semver (e.g. 0.6.1).");
  process.exit(1);
}

const parsed = parseVersion(version);
console.log(`Valid ${parsed.scheme} version: ${version} (tag ${versionTag(version)})`);
process.exit(0);
