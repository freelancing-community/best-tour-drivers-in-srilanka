import JsonLd from "@/components/seo/JsonLd";
import toursData from "@/data/tours.json";
import { breadcrumbJsonLd, cloudinaryOgFromSrc, tourJsonLd } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const tour = toursData.find((item) => item.id === params.id);
  if (!tour) {
    return { title: "Tour Not Found" };
  }

  const description =
    tour.details?.overview?.replace(/\s+/g, " ").slice(0, 160) ||
    `Book ${tour.title} with Best Tour Drivers in Sri Lanka.`;

  const ogImage = cloudinaryOgFromSrc(tour.image);

  return {
    title: tour.title,
    description,
    alternates: {
      canonical: `/package/${tour.id}`,
    },
    openGraph: {
      title: tour.title,
      description: `Private driver tour in Sri Lanka — from ${
        tour.details?.price_from || tour.price || "contact us"
      }.`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: tour.title,
      description,
      images: [ogImage],
    },
  };
}

export default function TourDetailLayout({ children, params }) {
  const tour = toursData.find((item) => item.id === params.id);

  return (
    <>
      <JsonLd data={tourJsonLd(tour)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Packages", url: "/package" },
          {
            name: tour?.title || "Tour",
            url: `/package/${params.id}`,
          },
        ])}
      />
      {children}
    </>
  );
}
