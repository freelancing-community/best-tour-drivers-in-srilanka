/**
 * Migrate images used by LIVE app routes only (not Triprex sample pages).
 *
 * Live routes (header nav):
 *   /  /package  /destination  /offers  /tailor-mode  /about  /contact
 * Plus package/[id], destination/[id], shared Header/Footer/layouts, tours/destinations JSON,
 * and public/guide-images.
 *
 * Env: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 *
 * Usage:
 *   node scripts/migrate-images-to-cloudinary.mjs --dry-run
 *   node scripts/migrate-images-to-cloudinary.mjs
 *   node scripts/migrate-images-to-cloudinary.mjs --rewrite
 *   node scripts/migrate-images-to-cloudinary.mjs --all
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { config as loadEnv } from "dotenv";
import { v2 as cloudinary } from "cloudinary";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

loadEnv({ path: path.join(ROOT, ".env") });

const MAP_PATH = path.join(__dirname, "cloudinary-url-map.json");
const PUBLIC_DIR = path.join(ROOT, "public");
const SRC_DIR = path.join(ROOT, "src");

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|svg|JPG|JPEG|PNG)$/i;
const LOCAL_PATH_RE = /(?:["'`(])(\/(?:images|guide-images|assets\/img)\/[^"'`)\s]+)/g;
const HTTPS_IMAGE_RE =
  /https?:\/\/[^\s"'`)]+\.(?:jpe?g|png|gif|webp|avif)(?:\?[^\s"'`]*)?/gi;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function assertConfig() {
  const { cloud_name, api_key, api_secret } = cloudinary.config();
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      "Missing Cloudinary env: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET"
    );
  }
}

async function assertAuth() {
  try {
    await cloudinary.api.ping();
    console.log("Cloudinary auth OK");
  } catch (err) {
    const msg = err?.error?.message || err?.message || String(err);
    throw new Error(
      `Cloudinary auth failed (${msg}). Copy API Key + API Secret from the SAME row in Cloudinary → Settings → API Keys into .env and retry.`
    );
  }
}

function walkFiles(dir, filterFn, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, filterFn, acc);
    else if (filterFn(full)) acc.push(full);
  }
  return acc;
}

/** Live product entry points — sample theme routes (index2–6, shop, visas, …) ignored */
const LIVE_ENTRY_REL = [
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

function collectFromText(text, set) {
  let m;
  const localRe = new RegExp(LOCAL_PATH_RE.source, "g");
  while ((m = localRe.exec(text))) {
    set.add(decodeURIComponent(m[1].split("?")[0]));
  }
  const httpsRe = new RegExp(HTTPS_IMAGE_RE.source, "gi");
  while ((m = httpsRe.exec(text))) {
    const url = m[0].replace(/[),;]+$/, "");
    // Skip template literals / dynamic URLs (e.g. flagcdn ${countryCode})
    if (url.includes("${") || url.includes("`")) continue;
    if (
      /wp-content\/uploads|unsplash|tripadvisor|cloudinary|driversinsrilanka/i.test(url) ||
      IMAGE_EXT.test(url)
    ) {
      // Skip tiny flag CDN placeholders
      if (/flagcdn\.com/i.test(url)) continue;
      set.add(url);
    }
  }
}

function resolveImport(fromFile, spec) {
  if (!spec || spec.startsWith("http") || spec.startsWith("data:")) return null;
  if (!spec.startsWith("@/") && !spec.startsWith(".")) return null;

  let base;
  if (spec.startsWith("@/")) base = path.join(SRC_DIR, spec.slice(2));
  else base = path.resolve(path.dirname(fromFile), spec);

  const tries = [
    base,
    `${base}.js`,
    `${base}.jsx`,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.css`,
    `${base}.json`,
    path.join(base, "index.js"),
    path.join(base, "index.jsx"),
  ];
  for (const t of tries) {
    if (fs.existsSync(t) && fs.statSync(t).isFile()) return t;
  }
  return null;
}

/** BFS from live entries through local imports only */
function collectLiveSourceFiles() {
  const queue = LIVE_ENTRY_REL.map((rel) => path.join(ROOT, rel)).filter((f) =>
    fs.existsSync(f)
  );
  const seen = new Set(queue);

  while (queue.length) {
    const file = queue.shift();
    if (!/\.(js|jsx|ts|tsx|css|json)$/.test(file)) continue;
    let text;
    try {
      text = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    let m;
    const re = new RegExp(IMPORT_RE.source, "g");
    while ((m = re.exec(text))) {
      const resolved = resolveImport(file, m[1]);
      if (!resolved || seen.has(resolved)) continue;
      if (!resolved.startsWith(SRC_DIR)) continue;
      seen.add(resolved);
      queue.push(resolved);
    }
  }

  return [...seen];
}

function collectCandidates() {
  const set = new Set();
  const liveFiles = collectLiveSourceFiles();
  console.log(`scanning ${liveFiles.length} live source files (nav routes + imports)`);

  for (const file of liveFiles) {
    collectFromText(fs.readFileSync(file, "utf8"), set);
  }

  // Product guide photos (Contact + secondary)
  for (const file of walkFiles(path.join(PUBLIC_DIR, "guide-images"), (f) => IMAGE_EXT.test(f))) {
    set.add("/" + path.relative(PUBLIC_DIR, file).split(path.sep).join("/"));
  }

  return [...set].filter((item) => {
    if (item.startsWith("http")) return true;
    if (item.endsWith(".svg")) return false;
    return IMAGE_EXT.test(item);
  });
}

function collectRewriteTargets() {
  return collectLiveSourceFiles().filter((f) => /\.(js|jsx|json)$/.test(f));
}

function publicIdFor(source) {
  if (source.startsWith("http")) {
    const u = new URL(source);
    const base = path.basename(u.pathname).replace(/\.[^.]+$/, "");
    const hash = crypto.createHash("md5").update(source).digest("hex").slice(0, 8);
    let folder = "btd/remote";
    if (/driversinsrilanka\.com/i.test(source)) folder = "btd/gallery";
    else if (/unsplash|tripadvisor/i.test(source)) folder = "btd/destinations";
    return `${folder}/${sanitize(base)}_${hash}`;
  }

  const rel = source.replace(/^\//, "");
  const noExt = rel.replace(/\.[^.]+$/, "");
  if (rel.startsWith("guide-images/")) return `btd/guides/${sanitize(path.basename(noExt))}`;
  if (rel.startsWith("images/Tours/")) return `btd/tours/${sanitize(path.basename(noExt))}`;
  if (rel.startsWith("images/")) return `btd/site/${sanitize(noExt.replace(/^images\//, ""))}`;
  if (rel.startsWith("assets/img/")) return `btd/assets/${sanitize(noExt.replace(/^assets\/img\//, ""))}`;
  return `btd/misc/${sanitize(noExt)}`;
}

function sanitize(value) {
  return value
    .replace(/\\/g, "/")
    .replace(/[^a-zA-Z0-9/_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 180);
}

async function uploadOne(source, map) {
  if (map[source]) {
    console.log(`skip (mapped): ${source}`);
    return map[source];
  }

  const publicId = publicIdFor(source);
  let result;

  if (source.startsWith("http")) {
    console.log(`upload remote: ${source}`);
    result = await cloudinary.uploader.upload(source, {
      public_id: publicId,
      overwrite: false,
      unique_filename: false,
      resource_type: "image",
    });
  } else {
    const localPath = path.join(PUBLIC_DIR, source.replace(/^\//, ""));
    if (!fs.existsSync(localPath)) {
      console.warn(`missing local file: ${source}`);
      return null;
    }
    console.log(`upload local: ${source}`);
    result = await cloudinary.uploader.upload(localPath, {
      public_id: publicId,
      overwrite: false,
      unique_filename: false,
      resource_type: "image",
    });
  }

  const url = result.secure_url;
  map[source] = url;
  // also map without query for https
  if (source.startsWith("http") && source.includes("?")) {
    map[source.split("?")[0]] = url;
  }
  return url;
}

function loadMap() {
  if (fs.existsSync(MAP_PATH)) {
    return JSON.parse(fs.readFileSync(MAP_PATH, "utf8"));
  }
  return {};
}

function saveMap(map) {
  fs.writeFileSync(MAP_PATH, JSON.stringify(map, null, 2) + "\n");
  console.log(`wrote ${MAP_PATH} (${Object.keys(map).length} entries)`);
}

function rewriteFile(filePath, map) {
  let text = fs.readFileSync(filePath, "utf8");
  let next = text;
  // Longer keys first
  const keys = Object.keys(map).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (!key || !map[key]) continue;
    if (next.includes(key)) {
      next = next.split(key).join(map[key]);
    }
  }
  if (next !== text) {
    fs.writeFileSync(filePath, next);
    console.log(`rewrote ${path.relative(ROOT, filePath)}`);
    return true;
  }
  return false;
}

async function rewriteUsingMap(map) {
  for (const f of collectRewriteTargets()) {
    if (fs.existsSync(f)) rewriteFile(f, map);
  }
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const dryRun = args.has("--dry-run");
  const doUpload = (!args.has("--rewrite") || args.has("--all")) && !dryRun;
  const doRewrite = args.has("--rewrite") || args.has("--all");

  if (dryRun) {
    const candidates = collectCandidates();
    console.log(`dry-run: ${candidates.length} image candidates`);
    for (const source of candidates) {
      console.log(`  ${source} -> ${publicIdFor(source)}`);
    }
    return;
  }

  assertConfig();
  await assertAuth();
  const map = loadMap();

  if (doUpload && !args.has("--rewrite")) {
    const candidates = collectCandidates();
    console.log(`found ${candidates.length} image candidates`);

    let i = 0;
    let failures = 0;
    for (const source of candidates) {
      i += 1;
      try {
        await uploadOne(source, map);
      } catch (err) {
        failures += 1;
        console.error(`FAIL [${i}/${candidates.length}] ${source}`);
        console.error(err?.message || err);
        if (/invalid signature|api_secret mismatch|unknown api_key/i.test(String(err?.message || err))) {
          throw new Error("Stopping: Cloudinary credentials invalid. Fix .env and re-run.");
        }
      }
      if (i % 10 === 0) saveMap(map);
    }
    saveMap(map);
    console.log(`done. failures=${failures}`);
  }

  if (doRewrite) {
    const latest = loadMap();
    if (!Object.keys(latest).length) {
      console.warn("URL map empty — nothing to rewrite. Run upload after fixing Cloudinary credentials.");
      return;
    }
    await rewriteUsingMap(latest);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
