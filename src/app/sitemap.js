import toursData from "@/data/tours.json";
import destinationsData from "@/data/destinations.json";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://besttourdriversinsrilanka.com";

export default function sitemap() {
  const staticRoutes = [
    "",
    "/package",
    "/destination",
    "/contact",
    "/about",
    "/tailor-mode",
    "/gallery",
    "/faq",
    "/blog",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const tourRoutes = toursData.map((tour) => ({
    url: `${siteUrl}/package/${tour.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const destinationRoutes = destinationsData.map((dest) => ({
    url: `${siteUrl}/destination/${dest.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...tourRoutes, ...destinationRoutes];
}
