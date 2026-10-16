import ContactPage from "@/components/contact/ContactPage";

export const metadata = {
  title: "Contact Us",
  description:
    "Contact Best Tour Drivers in Sri Lanka for private tours, WhatsApp booking support, and Sri Lanka driver/guide introductions.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us | Best Tour Drivers in Sri Lanka",
    description:
      "Private tour inquiries, WhatsApp support, and Sri Lanka driver/guide contacts.",
  },
};

const page = () => {
  return <ContactPage />;
};

export default page;
