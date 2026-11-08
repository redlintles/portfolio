/**
 * Stop early on Node.js versions the project does not run on, instead of failing later
 * with cryptic errors. Next.js 16 calls `headers.hasOwnProperty()`, which Node.js 27
 * removed by making request headers null-prototype objects (every request returns 500).
 */
const MINIMUM = 22;
const FIRST_UNSUPPORTED = 27;
const major = Number(process.versions.node.split(".")[0]);

if (major < MINIMUM || major >= FIRST_UNSUPPORTED) {
  console.error(
    `Node.js ${process.versions.node} is not supported. ` +
      `Use an LTS release from ${MINIMUM} to ${FIRST_UNSUPPORTED - 1} (22, 24 or 26).`,
  );
  process.exit(1);
}
