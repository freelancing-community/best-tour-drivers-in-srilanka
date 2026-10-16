import JsonLd from "@/components/seo/JsonLd";
import destinationsData from "@/data/destinations.json";
import { breadcrumbJsonLd, cloudinaryOgFromSrc } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const dest = destinationsData.find((item) => item.id === params.id);
  if (!dest) {
    return { title: "Destination Not Found" };
  }

  const description =
    dest.description?.replace(/\s+/g, " ").slice(0, 160) ||
    `Explore ${dest.title} with a private driver from Best Tour Drivers in Sri Lanka.`;

  const ogImage = cloudinaryOgFromSrc(dest.image);

  return {
    title: dest.title,
    description,
    alternates: {
      canonical: `/destination/${dest.id}`,
    },
    openGraph: {
      title: `${dest.title} | Best Tour Drivers in Sri Lanka`,
      description,
      images: [{ url: ogImage }],
    },
  };
}

export default function DestinationDetailLayout({ children, params }) {
  const dest = destinationsData.find((item) => item.id === params.id);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Destinations", url: "/destination" },
          {
            name: dest?.title || "Destination",
            url: `/destination/${params.id}`,
          },
        ])}
      />
      {children}
    </>
  );
}
