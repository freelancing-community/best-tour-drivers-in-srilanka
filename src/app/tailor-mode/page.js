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
    icon: "https://res.cloudinary.com/lxkua2cu/image/upload/v1792156575/btd/site/logo.png",
  },
};

const Page = () => {
  return (
    <>
      <Topbar />
      <Header />
      <Breadcrumb
        pagename="Tailor Made Tour"
        pagetitle="Tailor Mode"
        bgImage="https://res.cloudinary.com/lxkua2cu/image/upload/v1792156923/btd/site/breadcrumb/jerry-kavan-i9eaAR4dWi8-unsplash.jpg"
      />
      <TailorModePage />
      <Newslatter />
      <Footer />
    </>
  );
};

export default Page;
