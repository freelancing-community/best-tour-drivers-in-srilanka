import { cloudinaryOgUrl } from "@/lib/cloudinary";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://besttourdriversinsrilanka.com";

export function getSiteUrl() {
  return siteUrl.replace(/\/$/, "");
}

/** OG image URL — Cloudinary transform when CDN, otherwise absolute site URL */
export function cloudinaryOgFromSrc(src) {
  if (!src) return `${getSiteUrl()}https://res.cloudinary.com/lxkua2cu/image/upload/v1792156575/btd/site/logo.png`;
  if (typeof src === "string" && src.includes("res.cloudinary.com")) {
    return cloudinaryOgUrl(src);
  }
  if (typeof src === "string" && src.startsWith("http")) return src;
  return `${getSiteUrl()}${src.startsWith("/") ? src : `/${src}`}`;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Best Tour Drivers in Sri Lanka",
    url: getSiteUrl(),
    logo: `${getSiteUrl()}https://res.cloudinary.com/lxkua2cu/image/upload/v1792156575/btd/site/logo.png`,
    email: "besttourdriversinsrilanka@gmail.com",
    telephone: "+94762205763",
    address: {
      "@type": "PostalAddress",
      streetAddress: "No:11, Siri Niwasa Mawatha",
      addressLocality: "Kalutara North",
      addressCountry: "LK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 6.5854,
      longitude: 79.9607,
    },
    areaServed: {
      "@type": "Country",
      name: "Sri Lanka",
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Best Tour Drivers in Sri Lanka",
    url: getSiteUrl(),
  };
}

export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${getSiteUrl()}${item.url}`,
    })),
  };
}

export function tourJsonLd(tour) {
  if (!tour) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: tour.title,
    description: tour.details?.overview?.slice(0, 300) || tour.title,
    image: tour.image,
    brand: {
      "@type": "Brand",
      name: "Best Tour Drivers in Sri Lanka",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: String(tour.price || tour.details?.price_from || "").replace(/[^\d.]/g, "") || undefined,
      availability: "https://schema.org/InStock",
      url: `${getSiteUrl()}/package/${tour.id}`,
    },
  };
}
