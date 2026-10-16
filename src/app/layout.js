import AppProviders from "@/components/common/AppProviders";
import JsonLd from "@/components/seo/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://besttourdriversinsrilanka.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Best Tour Drivers in Sri Lanka | Private Drivers & Custom Tours",
    template: "%s | Best Tour Drivers in Sri Lanka",
  },
  description:
    "Reliable private drivers, custom tour packages, and unforgettable travel experiences across Sri Lanka.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_LK",
    url: siteUrl,
    siteName: "Best Tour Drivers in Sri Lanka",
    title: "Best Tour Drivers in Sri Lanka",
    description:
      "Private drivers and custom Sri Lanka tours with local expert guides.",
    images: [
      {
        url: "https://res.cloudinary.com/lxkua2cu/image/upload/v1792156575/btd/site/logo.png",
        width: 512,
        height: 512,
        alt: "Best Tour Drivers in Sri Lanka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Tour Drivers in Sri Lanka",
    description:
      "Private drivers and custom Sri Lanka tours with local expert guides.",
    images: ["https://res.cloudinary.com/lxkua2cu/image/upload/v1792156575/btd/site/logo.png"],
  },
  icons: {
    icon: "https://res.cloudinary.com/lxkua2cu/image/upload/v1792156575/btd/site/logo.png",
    shortcut: "https://res.cloudinary.com/lxkua2cu/image/upload/v1792156575/btd/site/logo.png",
    apple: "https://res.cloudinary.com/lxkua2cu/image/upload/v1792156575/btd/site/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <JsonLd data={organizationJsonLd()} />
          <JsonLd data={websiteJsonLd()} />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
