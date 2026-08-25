"use client";
import Breadcrumb from "@/components/common/Breadcrumb";
import Newslatter from "@/components/common/Newslatter";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Topbar from "@/components/topbar/Topbar";
import Link from "next/link";
import React, { useState } from "react";
import toursData from "@/data/tours.json";

const CARDS_PER_PAGE = 9;

// People icon SVG for the max-people badge
const PeopleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

// Plane / Book icon SVG
const BookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
  >
    <path d="M8.15624 10.2261L7.70276 12.3534L5.60722 18L6.85097 17.7928L12.6612 10.1948C13.4812 10.1662 14.2764 10.1222 14.9674 10.054C18.1643 9.73783 17.9985 8.99997 17.9985 8.99997C17.9985 8.99997 18.1643 8.26211 14.9674 7.94594C14.2764 7.87745 13.4811 7.8335 12.6611 7.80518L6.851 0.206972L5.60722 -5.41705e-07L7.70276 5.64663L8.15624 7.77386C7.0917 7.78979 6.37132 7.81403 6.37132 7.81403C6.37132 7.81403 4.90278 7.84793 2.63059 8.35988L0.778036 5.79016L0.000253424 5.79016L0.554115 8.91458C0.454429 8.94514 0.454429 9.05483 0.554115 9.08539L0.000253144 12.2098L0.778036 12.2098L2.63059 9.64035C4.90278 10.1523 6.37132 10.1857 6.37132 10.1857C6.37132 10.1857 7.0917 10.2102 8.15624 10.2261Z" />
    <path d="M12.0703 11.9318L12.0703 12.7706L8.97041 12.7706L8.97041 11.9318L12.0703 11.9318ZM12.0703 5.23292L12.0703 6.0714L8.97059 6.0714L8.97059 5.23292L12.0703 5.23292ZM9.97892 14.7465L9.97892 15.585L7.11389 15.585L7.11389 14.7465L9.97892 14.7465ZM9.97892 2.41846L9.97892 3.2572L7.11389 3.2572L7.11389 2.41846L9.97892 2.41846Z" />
  </svg>
);

const TourCard = ({ tour }) => {
  const price = tour.details?.price_from || tour.price || "";
  const duration = tour.details?.duration || tour.days || "";
  const maxPeople = tour.details?.max_people || "";

  return (
    <div className="col-lg-4 col-md-6 item">
      <div className="package-card">
        <div className="package-card-img-wrap">
          <Link
            href={`/package/${tour.id}`}
            className="card-img"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tour.image}
              alt={tour.title}
            />
          </Link>
          <div className="batch">
            <span className="date">{duration}</span>
            {maxPeople && (
              <div className="location" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <PeopleIcon />
                <span style={{ fontSize: "13px", fontWeight: 500 }}>
                  Max {maxPeople} {parseInt(maxPeople) === 1 ? "Person" : "People"}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="package-card-content">
          <div className="card-content-top">
            <h5>
              <Link href={`/package/${tour.id}`}>
                {tour.title}
              </Link>
            </h5>
          </div>
          <div className="card-content-bottom">
            <div className="price-area">
              <h6>Price From:</h6>
              <span>{price}</span>
            </div>
            <Link
              href={`/package/${tour.id}`}
              className="primary-btn2"
            >
              Book Tour
              <BookIcon />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(toursData.length / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const visibleTours = toursData.slice(startIndex, startIndex + CARDS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Build page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <>
      <Topbar />
      <Header />
      <Breadcrumb pagename="Tour Packages" pagetitle="Tour Packages" />
      <div className="package-grid-with-sidebar-section pt-120 mb-120">
        <div className="container">
          {/* Top bar: results count */}
          <div className="package-inner-title-section mb-40">
            <p>
              Showing {startIndex + 1}–{Math.min(startIndex + CARDS_PER_PAGE, toursData.length)} of{" "}
              {toursData.length} tours
            </p>
          </div>

          {/* Tour cards grid — full-width, 3 per row */}
          <div className="list-grid-product-wrap mb-70">
            <div className="row gy-4">
              {visibleTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="row">
              <div className="col-lg-12">
                <nav className="inner-pagination-area">
                  <ul className="pagination-list">
                    <li>
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="shop-pagi-btn"
                        style={{ background: "none", border: "none", cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.4 : 1 }}
                      >
                        <i className="bi bi-chevron-left" />
                      </button>
                    </li>
                    {getPageNumbers().map((pg, idx) =>
                      pg === "..." ? (
                        <li key={`ellipsis-${idx}`}>
                          <span>
                            <i className="bi bi-three-dots" />
                          </span>
                        </li>
                      ) : (
                        <li key={pg}>
                          <button
                            onClick={() => handlePageChange(pg)}
                            className={currentPage === pg ? "active" : ""}
                            style={{ background: "none", border: "none", cursor: "pointer" }}
                          >
                            {pg}
                          </button>
                        </li>
                      )
                    )}
                    <li>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="shop-pagi-btn"
                        style={{ background: "none", border: "none", cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.4 : 1 }}
                      >
                        <i className="bi bi-chevron-right" />
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
      <Newslatter />
      <Footer />
    </>
  );
};

export default Page;

