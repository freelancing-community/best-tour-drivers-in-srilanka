const CLOUD =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUDINARY_CLOUD_NAME ||
  "lxkua2cu";

/**
 * Build a Cloudinary delivery URL with optional transforms.
 * @param {string} publicIdOrUrl - public_id or full https URL
 * @param {{ width?: number, transforms?: string }} [options]
 */
export function cloudinaryUrl(publicIdOrUrl, options = {}) {
  if (!publicIdOrUrl) return "";

  const { width, transforms } = options;
  const parts = ["f_auto", "q_auto"];
  if (width) parts.push(`w_${width}`, "c_limit");
  if (transforms) parts.push(transforms);
  const transform = parts.filter(Boolean).join(",");

  if (/^https?:\/\//i.test(publicIdOrUrl)) {
    if (publicIdOrUrl.includes("res.cloudinary.com") && publicIdOrUrl.includes("/upload/")) {
      return publicIdOrUrl.replace("/upload/", `/upload/${transform}/`);
    }
    return publicIdOrUrl;
  }

  const id = publicIdOrUrl.replace(/^\//, "");
  return `https://res.cloudinary.com/${CLOUD}/image/upload/${transform}/${id}`;
}

/** Open Graph friendly JPG crop */
export function cloudinaryOgUrl(publicIdOrUrl) {
  return cloudinaryUrl(publicIdOrUrl, {
    transforms: "f_jpg,w_1200,h_630,c_fill,g_auto",
  });
}

export function getCloudinaryCloudName() {
  return CLOUD;
}
