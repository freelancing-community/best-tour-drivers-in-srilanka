import Newslatter from "@/components/common/Newslatter";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Topbar from "@/components/topbar/Topbar";
import React from "react";
export const metadata = {
  title: "Destinations in Sri Lanka",
  description:
    "Discover top travel destinations across Sri Lanka with private drivers from Best Tour Drivers in Sri Lanka.",
  alternates: { canonical: "/destination" },
  openGraph: {
    title: "Destinations in Sri Lanka | Best Tour Drivers in Sri Lanka",
    description:
      "Discover top travel destinations across Sri Lanka with private drivers.",
  },
  icons: {
    icon: "https://res.cloudinary.com/lxkua2cu/image/upload/v1792156575/btd/site/logo.png",
  },
};
const layout = ({children}) => {
  return (
    <>
      <Topbar />
      <Header />
      {children}
      <Newslatter/>
      <Footer/>
    </>
  );
};

export default layout;
