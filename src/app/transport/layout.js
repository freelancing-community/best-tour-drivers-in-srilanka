import Newslatter from "@/components/common/Newslatter";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Topbar from "@/components/topbar/Topbar";
import React from "react";
export const metadata = {
  title: "Transport Services | Best Tour Drivers in Sri Lanka",
  description:
    "Private vehicle hire, airport transfers, and driver services across Sri Lanka.",
  icons: {
    icon: "/assets/img/sm-logo.svg",
  },
};

const layout = ({ children }) => {
  return (
    <>
      <Topbar />
      <Header />
      {children}
      <Newslatter />
      <Footer />
    </>
  );
};

export default layout;
