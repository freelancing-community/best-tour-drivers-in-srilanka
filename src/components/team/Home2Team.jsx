"use client";
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  Autoplay,
  EffectFade,
  Navigation,
  Pagination,
} from "swiper";
import CldImage from "@/components/common/CldImage";

SwiperCore.use([Autoplay, EffectFade, Navigation, Pagination]);

const CARD_BG =
  "https://res.cloudinary.com/lxkua2cu/image/upload/v1792156793/btd/assets/home2/teams-card-bg.png";

const guides = [
  {
    name: "Mahesh",
    role: "Tour Guide",
    img: "https://res.cloudinary.com/lxkua2cu/image/upload/v1792156495/btd/guides/Mahesh.jpg",
  },
  {
    name: "Thilina",
    role: "Tour Guide",
    img: "https://res.cloudinary.com/lxkua2cu/image/upload/v1792156497/btd/guides/Thilina-02.jpg",
  },
  {
    name: "Nilaka",
    role: "Tour Guide",
    img: "https://res.cloudinary.com/lxkua2cu/image/upload/v1792156498/btd/guides/nilaka-01.jpg",
  },
];

const SocialIconList = () => {
  const stop = (e) => {
    e.preventDefault();
  };

  return (
    <ul className="social-list">
      <li>
        <a href="#" onClick={stop} aria-disabled="true" tabIndex={-1}>
          <i className="bx bxl-instagram" />
        </a>
      </li>
      <li>
        <a href="#" onClick={stop} aria-disabled="true" tabIndex={-1}>
          <i className="bx bxl-pinterest-alt" />
        </a>
      </li>
      <li>
        <a href="#" onClick={stop} aria-disabled="true" tabIndex={-1}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={18}
            height={18}
            fill="currentColor"
            className="bi bi-twitter-x"
            viewBox="0 0 16 16"
          >
            <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
          </svg>
        </a>
      </li>
      <li>
        <a href="#" onClick={stop} aria-disabled="true" tabIndex={-1}>
          <i className="bx bxl-facebook" />
        </a>
      </li>
    </ul>
  );
};

const Home2Team = () => {
  const settings = useMemo(() => {
    return {
      slidesPerView: "auto",
      speed: 1500,
      spaceBetween: 25,
      navigation: {
        nextEl: ".teams-card-next",
        prevEl: ".teams-card-prev",
      },
      breakpoints: {
        280: { slidesPerView: 1 },
        386: { slidesPerView: 1 },
        576: { slidesPerView: 2, spaceBetween: 15 },
        768: { slidesPerView: 2, spaceBetween: 15 },
        992: { slidesPerView: 3, spaceBetween: 15 },
        1200: { slidesPerView: 3, spaceBetween: 15 },
        1400: { slidesPerView: 3 },
      },
    };
  }, []);

  return (
    <div className="teams-section mb-120">
      <div className="container">
        <div className="row mb-50">
          <div className="col-lg-12">
            <div className="section-title2 text-center">
              <div className="eg-section-tag">
                <span>Tour Guide</span>
              </div>
              <h2>Our Travel Guide </h2>
            </div>
          </div>
        </div>
        <div className="teams-slider-area">
          <div className="row mb-60">
            <div className="col-lg-12">
              <Swiper {...settings} className="swiper teams-card-slider">
                {guides.map((guide) => (
                  <SwiperSlide className="swiper-slide" key={guide.name}>
                    <div className="teams-card">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={CARD_BG} alt="" />
                      <div className="teams-img">
                        <CldImage
                          src={guide.img}
                          alt={`${guide.name} — Sri Lanka tour guide`}
                          fill
                          sizes="200px"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div className="teams-content">
                        <h4>{guide.name}</h4>
                        <span>{guide.role}</span>
                      </div>
                      <SocialIconList />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="slide-and-view-btn-grp style-4">
                <div className="slider-btn-grp3">
                  <div className="slider-btn teams-card-prev">
                    <i className="bi bi-arrow-left" />
                    <span>PREV</span>
                  </div>
                  <div className="slider-btn teams-card-next">
                    <span>NEXT</span>
                    <i className="bi bi-arrow-right" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home2Team;
