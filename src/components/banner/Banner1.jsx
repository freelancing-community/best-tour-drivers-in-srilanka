"use client";
import React from "react";
import Link from "next/link";

const Banner1 = () => {
  return (
    <>
      <div className="home1-banner-area" style={{ padding: "20px 5%" }}>
        <div className="container-fluid">
          <div
            className="home1-banner-wrapper"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(16, 12, 8, 0.4) 0%, rgba(16, 12, 8, 0.4) 100%), url(/images/homepage-cover-photo.png)",
              borderRadius: "30px",
              minHeight: "80vh",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="home1-banner-content text-center">
                    <h1 className="banner-heading">
                      Let's Travel And Explore Destination.
                    </h1>
                    <div className="banner-content-bottom justify-content-center mt-4 d-flex flex-wrap align-items-center gap-3">
                      <Link
                        href="/package"
                        className="primary-btn1"
                        style={{
                          backgroundColor: "#F6A824",
                          border: "none",
                          padding: "14px 28px",
                          fontSize: "1.1rem",
                          borderRadius: "50px",
                        }}
                      >
                        Book A Trip
                      </Link>
                      <div
                        className="rating-area d-inline-flex align-items-center bg-white p-2 rounded-pill"
                        style={{ color: "black" }}
                      >
                        <div className="icon me-2">
                          <img
                            src="/assets/img/home1/icon/tripadvisor-logo.svg"
                            alt="tripadvisor"
                            style={{ width: "30px" }}
                          />
                        </div>
                        <div className="content d-flex flex-column align-items-start">
                          <div className="rating d-flex align-items-center">
                            <ul className="d-flex list-unstyled m-0 me-2 text-warning">
                              <li><i className="bi bi-circle-fill" /></li>
                              <li><i className="bi bi-circle-fill" /></li>
                              <li><i className="bi bi-circle-fill" /></li>
                              <li><i className="bi bi-circle-fill" /></li>
                              <li><i className="bi bi-circle-half" /></li>
                            </ul>
                            <span className="fw-bold">4.5/5.0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .banner-heading {
          font-size: 5rem;
          margin-bottom: 20px;
          color: #fff;
        }
        @media (max-width: 991px) {
          .banner-heading {
            font-size: 3rem;
          }
        }
        @media (max-width: 575px) {
          .banner-heading {
            font-size: 2rem;
          }
          .home1-banner-area {
            padding: 12px 3% !important;
          }
          .home1-banner-wrapper {
            border-radius: 20px !important;
            min-height: 60vh !important;
          }
        }
      `}</style>
    </>
  );
};

export default Banner1;
