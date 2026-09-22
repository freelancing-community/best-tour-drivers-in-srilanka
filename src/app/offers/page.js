"use client";
import Breadcrumb from "@/components/common/Breadcrumb";
import Newslatter from "@/components/common/Newslatter";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Topbar from "@/components/topbar/Topbar";
import TourCard from "@/components/tourPackage/TourCard";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import toursData from "@/data/tours.json";
import "./offers.css";

// ─── Offer categories ───────────────────────────────────────────────────────
// `tourType` maps each section onto the tour_type values already stored in
// src/data/tours.json. No tour is re-classified here.

const OFFER_SECTIONS = [
  {
    id: "special-tour-packages",
    heading: "Special Tour Packages (October to April)",
    tourType: "Special Tour Packages",
    columns: 3,
    badge: "Special",
    badgeColor: "#f6a824",
  },
  {
    id: "family-tour-packages",
    heading: "Family Tour Packages",
    tourType: "Family Packages",
    columns: 2,
    badge: "Family",
    badgeColor: "#2e9e5b",
  },
  {
    id: "seasonal-tour-packages",
    heading: "Seasonal Tour Packages (May to September)",
    tourType: "East Coast",
    columns: 3,
    badge: "Seasonal",
    badgeColor: "#2b6cb0",
  },
  {
    id: "special-offers",
    heading: "Special Offers",
    tourType: "Special Offers",
    columns: 2,
    badge: "Offer",
    badgeColor: "#d94f42",
  },
  {
    id: "one-day-tour-packages",
    heading: "One Day Tour Packages",
    tourType: "One Day Tours",
    columns: 4,
    badge: "Day Tour",
    badgeColor: "#1a8f9e",
  },
];

// Without JavaScript nothing would ever get `.is-visible`, so unhide the
// reveal elements up front. Rendered server-side, so there is no flash.
const NOSCRIPT_CSS =
  "<style>.offers-page .ofr-reveal{opacity:1!important;transform:none!important}</style>";

/**
 * Reveals every `.ofr-reveal` inside `ref` as it scrolls into view. Runs after
 * mount only, so it introduces no hydration mismatch and no layout shift — the
 * elements keep their box, only opacity and transform change.
 */
function useScrollReveal(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;

    const items = Array.from(root.querySelectorAll(".ofr-reveal"));
    const showAll = () => items.forEach((el) => el.classList.add("is-visible"));

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      showAll();
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // During a fast flick the observer can deliver an entry only after
          // the element has already scrolled past the top of the viewport.
          // Reveal those too, otherwise they stay invisible for good.
          const scrolledPast = entry.boundingClientRect.top < 0;
          if (!entry.isIntersecting && !scrolledPast) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -48px 0px" }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ref]);
}

const OfferSection = ({ section, tours, priority }) => (
  <section id={section.id} className="ofr-section">
    <div className="ofr-section-head ofr-reveal">
      <h2>{section.heading}</h2>
    </div>

    <div className={`ofr-grid ofr-grid--${section.columns}`}>
      {tours.length > 0 ? (
        tours.map((tour, index) => (
          <TourCard
            key={tour.id}
            tour={tour}
            ctaLabel="Explore"
            badge={section.badge}
            badgeColor={section.badgeColor}
            /* each card in a row trails the one before it */
            delay={(index % section.columns) * 90}
            priority={priority && index < section.columns}
          />
        ))
      ) : (
        /* Shown when no tour in tours.json carries this tour_type */
        <div className="ofr-empty">
          <p>
            There are no {section.heading.toLowerCase()} available at the
            moment. Contact us and we will plan a trip around your dates.
          </p>
          <Link href="/contact" className="ofr-btn">
            Contact Us
          </Link>
        </div>
      )}
    </div>
  </section>
);

const OffersPage = () => {
  const pageRef = useRef(null);
  useScrollReveal(pageRef);

  // Group the existing tour data by its own tour_type field
  const toursByType = toursData.reduce((acc, tour) => {
    const type = tour.details?.tour_type;
    if (!type) return acc;
    (acc[type] = acc[type] || []).push(tour);
    return acc;
  }, {});

  return (
    <>
      <Topbar />
      <Header />
      <Breadcrumb
        pagename="Sri Lanka Tour Offers"
        pagetitle="Tour Offers"
        bgImage="/images/breadcrumb/hendrik-cornelissen-jpTT_SAU034-unsplash.jpg"
      />
      <noscript dangerouslySetInnerHTML={{ __html: NOSCRIPT_CSS }} />
      <div className="offers-page" ref={pageRef}>
        <div className="container">
          {OFFER_SECTIONS.map((section, index) => (
            <OfferSection
              key={section.id}
              section={section}
              tours={toursByType[section.tourType] || []}
              priority={index === 0}
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
