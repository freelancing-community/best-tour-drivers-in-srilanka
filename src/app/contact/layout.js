import Breadcrumb from "@/components/common/Breadcrumb";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Topbar from "@/components/topbar/Topbar";
import React from "react";

const layout = ({ children }) => {
  return (
    <>
      <Topbar />
      <Header />
      <Breadcrumb
        pagename="Contact Us"
        pagetitle="Contact Us"
        bgImage="https://res.cloudinary.com/lxkua2cu/image/upload/v1792156670/btd/site/contact-us-image.png"
      />
      {children}
      <Footer />
    </>
  );
};

export default layout;
