import Newslatter from "@/components/common/Newslatter";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Topbar from "@/components/topbar/Topbar";
import React from "react";
export const metadata = {
  title: "Hotels & Stays | Best Tour Drivers in Sri Lanka",
  description:
    "Find top recommended hotels and accommodations in Sri Lanka with Best Tour Drivers in Sri Lanka.",
  icons: {
    icon: "/images/logo.png",
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
