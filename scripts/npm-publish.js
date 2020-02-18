const { readFileSync, writeFileSync } = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SELECT_TAG = /-.*/; // Selects anything after a hyphen, or nothing

/**
 * This ensures npm deploys get tagged correctly from Git:
 * v1.2.3         -> tag “latest”
 * v1.2.3-alpha.0 -> tag “alpha”
 * v1.2.3-rc.0    -> tag “rc”
 */
const parseTagName = version => {
  const tag = SELECT_TAG.exec(version);

  if (tag && tag[0].length > 1) {
    // Remove hyphens and anything trailing a dot
    const tagName = tag[0].replace('-', '').replace(/\.[^.]+$/, '');
    return tagName;
  }

  // default
  return 'latest';
};

/* eslint-disable no-console */
const version = process.env.TAG.replace('refs/tags/v', '');
const timeStart = process.hrtime();

console.log(`📦 Publishing ${version} to npm...`);

// Update package version from tag
if (version) {
  const pkgJSON = path.resolve(__dirname, '..', 'package.json');
  const pkgManifest = JSON.parse(readFileSync(pkgJSON, 'utf8'));
  pkgManifest.version = version;
  writeFileSync(pkgJSON, JSON.stringify(pkgManifest, null, 2).concat('\n'), 'utf8');
}

// 2. Determine if @latest or @[other]
const npmTag = parseTagName(version);

// 3. Publish to npm
execSync(`npm publish ../ --tag ${npmTag}`, {
  cwd: __dirname, // run the command from this folder (so it can run anywhere)
});

const timeEnd = process.hrtime(timeStart);
const time = timeEnd[0] + Math.round(timeEnd[1] / 100000000) / 10;
console.log(`🚀 Deployed ${version} in ${time}s`);
