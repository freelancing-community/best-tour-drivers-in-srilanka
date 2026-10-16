"use client";

import Image from "next/image";
import cloudinaryLoader from "@/lib/cloudinaryLoader";

function isCloudinarySrc(src) {
  return typeof src === "string" && (
    src.includes("res.cloudinary.com") ||
    (!src.startsWith("/") && !src.startsWith("http"))
  );
}

/**
 * Optimized image: uses Cloudinary loader for CDN URLs/public_ids,
 * otherwise standard next/image for local/remote paths.
 */
export default function CldImage({
  src,
  alt = "",
  width,
  height,
  fill = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  className,
  style,
  ...rest
}) {
  if (!src) return null;

  const useCld = isCloudinarySrc(src);
  const common = {
    src,
    alt,
    sizes,
    priority,
    className,
    style,
    ...(useCld ? { loader: cloudinaryLoader } : {}),
    ...rest,
  };

  if (fill) {
    return <Image fill {...common} alt={alt} />;
  }

  return (
    <Image
      width={width || 800}
      height={height || 600}
      {...common}
      alt={alt}
    />
  );
}
