import Breadcrumb from "@/components/common/Breadcrumb";
import Newslatter from "@/components/common/Newslatter";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Topbar from "@/components/topbar/Topbar";
import Home2Activities from "@/components/activities/Home2Activities";
import Home2Team from "@/components/team/Home2Team";
import Home2Blog from "@/components/blog/Home2Blog";
import Home2WhyChoose from "@/components/whyChoose/Home2WhyChoose";
import Home2About from "@/components/about/Home2About";
export const metadata = {
  title: "About Us",
  description:
    "Learn more about Best Tour Drivers in Sri Lanka, your trusted partner for private tour drivers, customized itineraries, and island-wide travel in Sri Lanka.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us | Best Tour Drivers in Sri Lanka",
    description:
      "Private tour drivers, customized itineraries, and island-wide travel in Sri Lanka.",
  },
  icons: {
    icon: "https://res.cloudinary.com/lxkua2cu/image/upload/v1792156575/btd/site/logo.png",
  },
};
const page = () => {
  return (
    <>
      <Topbar />
      <Header />
      <Breadcrumb
        pagename="About Us"
        pagetitle="About Us"
        bgImage="https://res.cloudinary.com/lxkua2cu/image/upload/v1792156623/btd/site/breadcrumb/abdulla-faiz-7yPjauuz858-unsplash.jpg"
      />
      <Home2About />
      <Home2WhyChoose />
      {/* <Home2Activities /> */}
      <Home2Team />
      {/* <Home2Blog /> */}
      <Newslatter />
      <Footer />
    </>
  );
};

export default page;
