// Runs automatically after `npm run build` (see "postbuild" in package.json).
//
// Why: on Windows, Next.js writes some page-prefetch files into nested folders
// (out/add/__next.add/__PAGE__.txt) instead of flat names (out/add/__next.add.__PAGE__.txt),
// because it builds the name by replacing "/" with "." and Windows paths use "\".
// The browser asks for the flat name, gets a 404, and page-to-page navigation gets slower and glitchy.
// This script flattens those folders. On Mac/Linux there is nothing to fix, so it does nothing.
import { readdir, rename, rm, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const OUT = "out";

async function filesIn(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) => (e.isDirectory() ? filesIn(join(dir, e.name)) : [join(dir, e.name)])),
  );
  return nested.flat();
}

async function fix(dir) {
  let fixed = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "_next") continue;
    const path = join(dir, entry.name);
    if (entry.name.startsWith("__next.")) {
      for (const file of await filesIn(path)) {
        const flatName = entry.name + "." + relative(path, file).split(sep).join(".");
        await rename(file, join(dir, flatName));
        fixed++;
      }
      await rm(path, { recursive: true });
    } else {
      fixed += await fix(path);
    }
  }
  return fixed;
}

if (await stat(OUT).catch(() => null)) {
  const fixed = await fix(OUT);
  if (fixed) console.log(`fix-export-windows: flattened ${fixed} prefetch file(s) in ${OUT}/`);
}
