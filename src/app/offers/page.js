"use client";
import Breadcrumb from "@/components/common/Breadcrumb";
import Newslatter from "@/components/common/Newslatter";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Topbar from "@/components/topbar/Topbar";
import Link from "next/link";
import React from "react";
import toursData from "@/data/tours.json";

// ─── Icon components (reused from the package page pattern) ──────────────────

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

// ─── Offer category sections configuration ───────────────────────────────────

const OFFER_SECTIONS = [
  {
    title: "Special Tour Packages",
    subtitle: "Explore our handpicked special tour packages designed to give you the best Sri Lanka experience",
    tourType: "Special Tour Packages",
    badgeLabel: "Special",
    badgeColor: "#F6A824",
  },
  {
    title: "Family Tour Packages",
    subtitle: "Perfect tours for families — safe, comfortable, and unforgettable experiences for all ages",
    tourType: "Family Packages",
    badgeLabel: "Family",
    badgeColor: "#28a745",
  },
  {
    title: "Special Offers",
    subtitle: "Limited-time offers with exclusive pricing — book now and save on your Sri Lanka adventure",
    tourType: "Special Offers",
    badgeLabel: "Offer",
    badgeColor: "#dc3545",
  },
  {
    title: "One Day Tour Packages",
    subtitle: "Short on time? Discover the best of Sri Lanka in a single day with our curated day tours",
    tourType: "One Day Tours",
    badgeLabel: "Day Tour",
    badgeColor: "#17a2b8",
  },
];

// ─── Badge styles ────────────────────────────────────────────────────────────

const badgeStyle = (bgColor) => ({
  position: "absolute",
  top: "12px",
  left: "12px",
  backgroundColor: bgColor,
  color: "#fff",
  padding: "4px 12px",
  borderRadius: "4px",
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  zIndex: 2,
  boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
});

// ─── Section heading styles ──────────────────────────────────────────────────

const sectionHeadingStyle = {
  textAlign: "center",
  marginBottom: "12px",
  fontSize: "28px",
  fontWeight: 700,
  color: "#1a1a2e",
};

const sectionSubtitleStyle = {
  textAlign: "center",
  marginBottom: "40px",
  fontSize: "15px",
  color: "#666",
  maxWidth: "650px",
  marginLeft: "auto",
  marginRight: "auto",
  lineHeight: 1.6,
};

const sectionDividerStyle = {
  width: "60px",
  height: "3px",
  backgroundColor: "#F6A824",
  margin: "0 auto 16px",
  borderRadius: "2px",
};

// ─── OfferCard component ─────────────────────────────────────────────────────
// Follows the exact same structure / CSS classes as the TourCard in
// src/app/package/page.js so it inherits the existing template styling.

const OfferCard = ({ tour, badgeLabel, badgeColor }) => {
  const price = tour.details?.price_from || tour.price || "";
  const duration = tour.details?.duration || tour.days || "";
  const maxPeople = tour.details?.max_people || "";

  return (
    <div className="col-lg-4 col-md-6 item">
      <div className="package-card">
        <div className="package-card-img-wrap" style={{ position: "relative" }}>
          {badgeLabel && (
            <span style={badgeStyle(badgeColor)}>{badgeLabel}</span>
          )}
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
              Explore
              <BookIcon />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── OfferSection component ──────────────────────────────────────────────────

const OfferSection = ({ title, subtitle, tours, badgeLabel, badgeColor }) => {
  if (!tours || tours.length === 0) return null;

  return (
    <div style={{ marginBottom: "80px" }}>
      <div style={sectionDividerStyle} />
      <h2 style={sectionHeadingStyle}>{title}</h2>
      <p style={sectionSubtitleStyle}>{subtitle}</p>
      <div className="list-grid-product-wrap">
        <div className="row gy-4">
          {tours.map((tour) => (
            <OfferCard
              key={tour.id}
              tour={tour}
              badgeLabel={badgeLabel}
              badgeColor={badgeColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Main Offers Page ────────────────────────────────────────────────────────

const OffersPage = () => {
  // Group tours by tour_type
  const toursByType = {};
  toursData.forEach((tour) => {
    const type = tour.details?.tour_type || "Other";
    if (!toursByType[type]) toursByType[type] = [];
    toursByType[type].push(tour);
  });

  return (
    <>
      <Topbar />
      <Header />
      <Breadcrumb
        pagename="Tour Offers"
        pagetitle="Tour Offers"
        bgImage="/images/breadcrumb/hendrik-cornelissen-jpTT_SAU034-unsplash.jpg"
      />
      <div className="package-grid-with-sidebar-section pt-120 mb-120">
        <div className="container">
          {/* Page intro */}
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "32px", fontWeight: 700, color: "#1a1a2e", marginBottom: "16px" }}>
              Sri Lanka Tour Offers
            </h2>
            <p style={{ fontSize: "16px", color: "#666", maxWidth: "700px", margin: "0 auto", lineHeight: 1.7 }}>
              Discover our exclusive tour packages and special offers. Whether you&apos;re looking for a family getaway,
              a quick day tour, or a specially curated multi-day adventure, we have the perfect package for you.
            </p>
          </div>

          {/* Render each offer section */}
          {OFFER_SECTIONS.map((section) => (
            <OfferSection
              key={section.tourType}
              title={section.title}
              subtitle={section.subtitle}
              tours={toursByType[section.tourType] || []}
              badgeLabel={section.badgeLabel}
              badgeColor={section.badgeColor}
            />
          ))}
        </div>
      </div>
      <Newslatter />
      <Footer />
    </>
  );
};

export default OffersPage;
