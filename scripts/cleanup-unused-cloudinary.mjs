/**
 * Delete Cloudinary assets under btd/ that are NOT referenced by live nav routes.
 * Keeps everything currently used on: /, /package, /destination, /offers,
 * /tailor-mode, /about, /contact (+ detail pages) and guide-images.
 *
 * Usage:
 *   node scripts/cleanup-unused-cloudinary.mjs           # report only
 *   node scripts/cleanup-unused-cloudinary.mjs --delete  # apply
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { config as loadEnv } from "dotenv";
import { v2 as cloudinary } from "cloudinary";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
loadEnv({ path: path.join(ROOT, ".env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const LIVE = [
  "src/app/layout.js",
  "src/app/page.js",
  "src/app/about/page.js",
  "src/app/contact/page.js",
  "src/app/contact/layout.js",
  "src/app/package/page.js",
  "src/app/package/layout.js",
  "src/app/package/[id]/page.js",
  "src/app/package/[id]/layout.js",
  "src/app/destination/page.js",
  "src/app/destination/layout.js",
  "src/app/destination/[id]/page.js",
  "src/app/destination/[id]/layout.js",
  "src/app/offers/page.js",
  "src/app/tailor-mode/page.js",
  "src/data/tours.json",
  "src/data/destinations.json",
  "src/data/destination-_idebar.json",
];

const IMPORT_RE =
  /(?:from\s+|import\s*\(\s*|require\s*\(\s*|import\s+)['"]([^'"]+)['"]/g;
const CLD_RE =
  /https?:\/\/res\.cloudinary\.com\/[^/\s"'`)]+\/image\/upload\/(?:[^/\s"'`)]+\/)*(btd\/[^\s"'`)?#]+)/gi;

function resolveImport(fromFile, spec) {
  if (!spec || (!spec.startsWith("@/") && !spec.startsWith("."))) return null;
  const base = spec.startsWith("@/")
    ? path.join(SRC, spec.slice(2))
    : path.resolve(path.dirname(fromFile), spec);
  for (const t of [
    base,
    `${base}.js`,
    `${base}.jsx`,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.css`,
    `${base}.json`,
    path.join(base, "index.js"),
    path.join(base, "index.jsx"),
  ]) {
    if (fs.existsSync(t) && fs.statSync(t).isFile()) return t;
  }
  return null;
}

function collectLiveFiles() {
  const queue = LIVE.map((r) => path.join(ROOT, r)).filter((f) => fs.existsSync(f));
  const seen = new Set(queue);
  while (queue.length) {
    const file = queue.shift();
    if (!/\.(js|jsx|ts|tsx|css|json)$/.test(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    const cleaned = text
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/(^|[^:])\/\/.*$/gm, "$1");
    let m;
    const re = new RegExp(IMPORT_RE.source, "g");
    while ((m = re.exec(cleaned))) {
      const resolved = resolveImport(file, m[1]);
      if (resolved && !seen.has(resolved) && resolved.startsWith(SRC)) {
        seen.add(resolved);
        queue.push(resolved);
      }
    }
  }
  return [...seen];
}

function collectUsedPublicIds() {
  const used = new Set([
    "btd/guides/Mahesh",
    "btd/guides/Thilina-01",
    "btd/guides/Thilina-02",
    "btd/guides/nilaka-01",
    "btd/guides/nilaka-02",
  ]);
  for (const file of collectLiveFiles()) {
    const text = fs.readFileSync(file, "utf8");
    let m;
    const re = new RegExp(CLD_RE.source, "gi");
    while ((m = re.exec(text))) {
      used.add(m[1].replace(/\.(jpe?g|png|gif|webp|avif)$/i, ""));
    }
  }
  return used;
}

async function listBtd() {
  const all = [];
  let next;
  do {
    const res = await cloudinary.api.resources({
      type: "upload",
      prefix: "btd/",
      max_results: 500,
      next_cursor: next,
    });
    all.push(...res.resources);
    next = res.next_cursor;
  } while (next);
  return all;
}

async function main() {
  const doDelete = process.argv.includes("--delete");
  const used = collectUsedPublicIds();
  const all = await listBtd();
  const unused = all.map((r) => r.public_id).filter((id) => !used.has(id));

  console.log(`used=${used.size} total_btd=${all.length} unused=${unused.length}`);
  for (const id of unused.slice(0, 30)) console.log(`  ${id}`);
  if (unused.length > 30) console.log(`  ... +${unused.length - 30} more`);

  if (!doDelete) {
    console.log("\nDry-run. Re-run with --delete to remove unused from Cloudinary.");
    return;
  }

  let deleted = 0;
  for (let i = 0; i < unused.length; i += 50) {
    const batch = unused.slice(i, i + 50);
    const res = await cloudinary.api.delete_resources(batch, {
      resource_type: "image",
      type: "upload",
    });
    deleted += Object.values(res.deleted || {}).filter((s) => s === "deleted").length;
  }
  console.log(`deleted ${deleted} assets`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
