import About1 from "@/components/about/About1";
// import PrivateDriverFeatures from "@/components/about/PrivateDriverFeatures";
import Home1Activities from "@/components/activities/Home1Activities";
import Banner1 from "@/components/banner/Banner1";
import Banner1Bottom from "@/components/banner/Banner1Bottom";
import Home1Banner2 from "@/components/banner/Home1Banner2";
import Newslatter from "@/components/common/Newslatter";
import Destination1 from "@/components/destination/Destination1";
// import ChooseYourDestinations from "@/components/destination/ChooseYourDestinations";
import Home1FacilitySlide from "@/components/facilitySlide/Home1FacilitySlide";
import Home1Fecilities2 from "@/components/facilitySlide/Home1Fecilities2";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
// import Home1popularTour from "@/components/popularTour/Home1popularTour";
import Home1Testimonail from "@/components/testimonial/Home1Testimonail";
import Home1TourPackage from "@/components/tourPackage/Home1TourPackage";
// import FeaturedToursOctApr from "@/components/tourPackage/FeaturedToursOctApr";
// import FamilyTourPackagesMaySep from "@/components/tourPackage/FamilyTourPackagesMaySep";
// import WhyUsProcess from "@/components/whyChoose/WhyUsProcess";
export const metadata = {
  title: "Best Tour Drivers in Sri Lanka | Private Drivers & Custom Tours",
  description:
    "Best Tour Drivers in Sri Lanka offers reliable private drivers, custom tour packages, and unforgettable travel experiences across Sri Lanka.",
  icons: {
    icon: "/images/logo.png",
  },
};
export default function Home() {
  return (
    <>
      <Header />
      <Banner1 />
      <About1 />
      {/* <PrivateDriverFeatures /> */}
      <Destination1 />
      <Home1Fecilities2 />
      <Home1FacilitySlide />
      <Home1TourPackage />
      {/* <FeaturedToursOctApr /> */}
      {/* <WhyUsProcess /> */}
      {/* <FamilyTourPackagesMaySep /> */}
      {/* <Home1popularTour /> */}
      <Home1Activities />
      <Home1Banner2 />
      <Home1Testimonail />
      {/* <ChooseYourDestinations /> */}
      <Newslatter />
      <Footer />
    </>
  );
}
