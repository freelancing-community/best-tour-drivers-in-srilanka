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
  title: "TripRex - Tour & Travel Agency  NextJs Template",
  description:
    "TripRex is a NextJs Template for Tour and Travel Agency purpose",
  icons: {
    icon: "/assets/img/sm-logo.svg",
  },
};
export default function Home() {
  return (
    <>
      <Header />
      <Banner1 />
      <Banner1Bottom />
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
