console.log(`I'm an action!`, process.env.TAG);

/**
 * This ensures npm deploys get tagged correctly from Git:
 * v1.2.3         -> tag “latest”
 * v1.2.3-alpha.0 -> tag “alpha”
 * v1.2.3-rc.0    -> tag “rc”
 */

/* eslint-disable no-console */
const version = process.env.TAG;
const timeStart = process.hrtime();

console.log(`📦 Publishing ${version} to npm...`);

// 3. Publish to npm
// execSync(`npm publish ../pkg --tag ${npmTag}`, {
//   cwd: __dirname, // run the command from this folder (so it can run anywhere)
// });

const timeEnd = process.hrtime(timeStart);
const time = timeEnd[0] + Math.round(timeEnd[1] / 100000000) / 10;
console.log(`🚀 Deployed ${version} in ${time}s`);
