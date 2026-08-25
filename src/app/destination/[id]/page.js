"use client";
import React from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import Link from "next/link";
import { useParams } from "next/navigation";
import destinationsData from "@/data/destinations.json";
import toursData from "@/data/tours.json";

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
          <Link href={`/package/${tour.id}`} className="card-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={tour.image} alt={tour.title} />
          </Link>
          <div className="batch">
            <span className="date">{duration}</span>
            {maxPeople && (
              <div
                className="location"
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
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
              <Link href={`/package/${tour.id}`}>{tour.title}</Link>
            </h5>
          </div>
          <div className="card-content-bottom">
            <div className="price-area">
              <h6>Price From:</h6>
              <span>{price}</span>
            </div>
            <Link href={`/package/${tour.id}`} className="primary-btn2">
              Book Tour
              <BookIcon />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const DestinationDetailsPage = () => {
  const params = useParams();
  const destId = params?.id;

  const destination = destinationsData.find(
    (d) => d.id === destId || d.id === `dest-${destId}`
  );

  if (!destination) {
    return (
      <>
        <Breadcrumb pagename="Destination Not Found" pagetitle="Destination Details" />
        <div className="container pt-120 mb-120 text-center">
          <h2>Destination Not Found</h2>
          <p className="mt-3">The destination you are looking for does not exist.</p>
          <Link href="/destination" className="primary-btn2 mt-4 inline-block">
            Back to Destinations
          </Link>
        </div>
      </>
    );
  }

  // Related tours lookup
  const relatedTours = (destination.tour_ids || [])
    .map((tid) => toursData.find((t) => t.id === tid))
    .filter(Boolean);

  // Format overview paragraphs if contains newlines
  const paragraphs = destination.overview
    ? destination.overview.split("\n").filter((p) => p.trim() !== "")
    : [];

  return (
    <>
      <Breadcrumb
        pagename={destination.title}
        pagetitle="Destination Details"
      />
      <div className="destination-details-wrap mb-120 pt-120">
        <div className="container">
          {/* Main Destination Info Section */}
          <div className="row g-lg-4 gy-5 mb-80">
            <div className="col-lg-7">
              <div className="destination-details-content">
                <h2>{destination.title}</h2>
                <div className="eg-tag mb-4 mt-2" style={{ display: "inline-block" }}>
                  <span
                    style={{
                      backgroundColor: "var(--primary-color1, #ff7262)",
                      color: "#fff",
                      padding: "6px 16px",
                      borderRadius: "20px",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    {destination.tour_count}
                  </span>
                </div>
                {paragraphs.length > 0 ? (
                  paragraphs.map((para, idx) => (
                    <p key={idx} className="mb-3" style={{ lineHeight: "1.8", color: "#555" }}>
                      {para}
                    </p>
                  ))
                ) : (
                  <p style={{ lineHeight: "1.8", color: "#555" }}>
                    Explore the beauty and culture of {destination.title} with our dedicated tour packages.
                  </p>
                )}
              </div>
            </div>
            <div className="col-lg-5">
              <div
                className="destination-img-wrap"
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={destination.image}
                  alt={destination.title}
                  style={{ width: "100%", height: "400px", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>

          {/* Related Tours Section */}
          <div className="related-tours-section pt-60 border-top">
            <div className="section-title mb-40">
              <h3>Explore Tours</h3>
              <p className="text-muted">
                Discover unforgettable travel experiences and packages tailored for your journey.
              </p>
            </div>

            {relatedTours.length > 0 ? (
              <div className="list-grid-product-wrap">
                <div className="row gy-4">
                  {relatedTours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 text-center rounded bg-light">
                <p className="mb-0 text-muted">
                  No specific tours listed for this destination yet. Check out our full list of packages!
                </p>
                <Link href="/package" className="primary-btn2 mt-3 inline-block">
                  View All Tours
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DestinationDetailsPage;
