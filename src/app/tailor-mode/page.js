import Breadcrumb from "@/components/common/Breadcrumb";
import Newslatter from "@/components/common/Newslatter";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Topbar from "@/components/topbar/Topbar";
import TailorModePage from "@/components/tailorMode/TailorModePage";

export const metadata = {
  title: "Tailor Made Tour | Best Tour Drivers in Sri Lanka",
  description:
    "Customize your ideal Sri Lanka holiday with private driver & guide services. Fill in your personal details, tour dates, and preferences for a bespoke itinerary.",
  icons: {
    icon: "/assets/img/sm-logo.svg",
  },
};

const Page = () => {
  return (
    <>
      <Topbar />
      <Header />
      <Breadcrumb pagename="Tailor Made Tour" pagetitle="Tailor Mode" />
      <TailorModePage />
      <Newslatter />
      <Footer />
    </>
  );
};

export default Page;
