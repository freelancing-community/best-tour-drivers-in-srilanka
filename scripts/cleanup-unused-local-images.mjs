/**
 * Delete unused local rasters under public/images (and optional --assets).
 * Keeps guide-images (including secondary Thilina/Nilaka photos) until CDN rewrite.
 *
 * Usage:
 *   node scripts/cleanup-unused-local-images.mjs           # dry-run
 *   node scripts/cleanup-unused-local-images.mjs --delete  # apply
 *   node scripts/cleanup-unused-local-images.mjs --delete --assets
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const SRC_DIR = path.join(ROOT, "src");

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif)$/i;
const LOCAL_PATH_RE = /(?:["'`(])(\/(?:images|guide-images|assets\/img)\/[^"'`)\s]+)/g;

const KEEP = new Set([
  "/images/logo.png",
  "/guide-images/Mahesh.jpg",
  "/guide-images/Thilina-01.jpg",
  "/guide-images/Thilina-02.jpg",
  "/guide-images/nilaka-01.jpg",
  "/guide-images/nilaka-02.jpg",
]);

function walkFiles(dir, filterFn, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, filterFn, acc);
    else if (filterFn(full)) acc.push(full);
  }
  return acc;
}

function collectReferenced() {
  const set = new Set(KEEP);
  const files = walkFiles(SRC_DIR, (f) => /\.(js|jsx|ts|tsx|css|json)$/.test(f));
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    let m;
    const re = new RegExp(LOCAL_PATH_RE.source, "g");
    while ((m = re.exec(text))) {
      set.add(decodeURIComponent(m[1].split("?")[0]));
    }
  }
  return set;
}

function listLocalRasters(includeAssets) {
  const roots = ["images"];
  if (includeAssets) roots.push("assets/img");
  const out = [];
  for (const r of roots) {
    for (const file of walkFiles(path.join(PUBLIC_DIR, r), (f) => IMAGE_EXT.test(f))) {
      out.push("/" + path.relative(PUBLIC_DIR, file).split(path.sep).join("/"));
    }
  }
  return out;
}

function main() {
  const doDelete = process.argv.includes("--delete");
  const includeAssets = process.argv.includes("--assets");
  const referenced = collectReferenced();
  const local = listLocalRasters(includeAssets);
  const unused = local.filter((p) => !referenced.has(p) && !KEEP.has(p));

  console.log(`referenced local paths: ${referenced.size}`);
  console.log(`local rasters scanned: ${local.length}`);
  console.log(`unused candidates: ${unused.length}`);

  for (const p of unused) {
    console.log(`${doDelete ? "DELETE" : "would delete"}: ${p}`);
    if (doDelete) {
      fs.unlinkSync(path.join(PUBLIC_DIR, p.replace(/^\//, "")));
    }
  }

  if (!doDelete) {
    console.log("\nDry-run only. Re-run with --delete to apply.");
  }
}

main();
