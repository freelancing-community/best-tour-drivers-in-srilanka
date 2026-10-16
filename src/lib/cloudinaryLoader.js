/**
 * Custom next/image loader for Cloudinary.
 * Accepts a Cloudinary public_id or a full res.cloudinary.com URL.
 */
export default function cloudinaryLoader({ src, width, quality }) {
  const cloud =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME ||
    "lxkua2cu";

  const q = quality || "auto";
  const transform = `f_auto,q_${q},w_${width},c_limit`;

  if (!src) return src;

  // Local public paths — keep serving from site until Cloudinary rewrite
  if (src.startsWith("/") && !src.includes("res.cloudinary.com")) {
    return src;
  }

  if (/^https?:\/\//i.test(src)) {
    if (src.includes("res.cloudinary.com") && src.includes("/upload/")) {
      // Avoid double-injecting transforms
      if (/\/upload\/(?:[^/]+,)*f_auto/.test(src) || /\/upload\/f_auto/.test(src)) {
        return src.replace(/\/upload\/[^/]+\//, `/upload/${transform}/`);
      }
      return src.replace("/upload/", `/upload/${transform}/`);
    }
    // Non-Cloudinary remote: return as-is (next may still need domain allowlist)
    return src;
  }

  const publicId = src.replace(/^\//, "");
  return `https://res.cloudinary.com/${cloud}/image/upload/${transform}/${publicId}`;
}
