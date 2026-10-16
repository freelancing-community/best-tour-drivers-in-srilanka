# Cloudinary image migration

Uploads **live nav routes only**: `/`, `/package`, `/destination`, `/offers`, `/tailor-mode`, `/about`, `/contact` (+ detail pages, shared Header/Footer, `tours.json` / `destinations.json`, `guide-images`). Sample theme pages (`index2`–`index6`, shop, visas, etc.) are **not** scanned.

## 1) Fix credentials (required before upload)

Cloudinary rejected the Key/Secret pair in `.env` (`api_secret mismatch` / `Invalid Signature`).

1. Open Cloudinary → **Settings → API Keys**
2. Copy **API Key and API Secret from the same row**
3. Put them in `.env`:

```
CLOUDINARY_CLOUD_NAME=lxkua2cu
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=lxkua2cu
```

4. Test:

```bash
node -e "require('dotenv').config();const {v2:c}=require('cloudinary');c.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET});c.api.ping().then(console.log).catch(e=>console.error(e.error||e))"
```

You should see `{ status: 'ok' }`.

## 2) Upload + rewrite

```bash
npm run migrate:images:dry      # list candidates + public_ids (no auth)
npm run migrate:images          # upload referenced images, write scripts/cloudinary-url-map.json
npm run migrate:images:rewrite  # replace local/https image paths in src + data JSON
# or
npm run migrate:images:all
```

After a successful upload+rewrite:

```bash
npm run cleanup:images          # dry-run unused public/images
npm run cleanup:images:delete   # delete unused public/images only
node scripts/cleanup-unused-cloudinary.mjs           # dry-run unused CDN assets
node scripts/cleanup-unused-cloudinary.mjs --delete  # delete unused from Cloudinary (keeps live-used)
```

## 3) Deploy

Set on host (Vercel etc.):

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=lxkua2cu`
- `NEXT_PUBLIC_SITE_URL=https://your-domain.com`

Do **not** put `CLOUDINARY_API_SECRET` in the browser/client env.
