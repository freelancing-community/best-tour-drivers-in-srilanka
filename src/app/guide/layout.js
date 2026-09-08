import Newslatter from "@/components/common/Newslatter";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Topbar from "@/components/topbar/Topbar";


export const metadata = {
  title: "Tour Guides & Drivers | Best Tour Drivers in Sri Lanka",
  description:
    "Meet our experienced tour guides and private drivers in Sri Lanka.",
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
