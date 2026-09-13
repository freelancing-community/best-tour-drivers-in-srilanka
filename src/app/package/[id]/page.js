"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { showErrorAlert, showSuccessAlert, showWarningAlert } from "@/lib/alert";
import Breadcrumb from "@/components/common/Breadcrumb";
import Newslatter from "@/components/common/Newslatter";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Topbar from "@/components/topbar/Topbar";
import toursData from "@/data/tours.json";
import destinationsData from "@/data/destinations.json";

// ─── helpers ─────────────────────────────────────────────────────────────────

/** Given a driversinsrilanka location slug, return the matching destination id */
function slugToDestId(url) {
  if (!url) return null;
  // Extract the slug from "ba-locations/<slug>/"
  const m = url.match(/ba-locations\/([^/]+)\/?/);
  if (!m) return null;
  const slug = m[1];
  // Try to match against destination titles (slugified comparison)
  const toSlug = (s) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  const dest = destinationsData.find((d) => toSlug(d.title) === slug);
  return dest ? dest.id : null;
}

// ─── small icon components (reused from package page) ────────────────────────
const PeopleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 18 18" fill="none">
    <path d="M8.15624 10.2261L7.70276 12.3534L5.60722 18L6.85097 17.7928L12.6612 10.1948C13.4812 10.1662 14.2764 10.1222 14.9674 10.054C18.1643 9.73783 17.9985 8.99997 17.9985 8.99997C17.9985 8.99997 18.1643 8.26211 14.9674 7.94594C14.2764 7.87745 13.4811 7.8335 12.6611 7.80518L6.851 0.206972L5.60722 -5.41705e-07L7.70276 5.64663L8.15624 7.77386C7.0917 7.78979 6.37132 7.81403 6.37132 7.81403C6.37132 7.81403 4.90278 7.84793 2.63059 8.35988L0.778036 5.79016L0.000253424 5.79016L0.554115 8.91458C0.454429 8.94514 0.454429 9.05483 0.554115 9.08539L0.000253144 12.2098L0.778036 12.2098L2.63059 9.64035C4.90278 10.1523 6.37132 10.1857 6.37132 10.1857C6.37132 10.1857 7.0917 10.2102 8.15624 10.2261Z" />
    <path d="M12.0703 11.9318L12.0703 12.7706L8.97041 12.7706L8.97041 11.9318L12.0703 11.9318ZM12.0703 5.23292L12.0703 6.0714L8.97059 6.0714L8.97059 5.23292L12.0703 5.23292ZM9.97892 14.7465L9.97892 15.585L7.11389 15.585L7.11389 14.7465L9.97892 14.7465ZM9.97892 2.41846L9.97892 3.2572L7.11389 3.2572L7.11389 2.41846L9.97892 2.41846Z" />
  </svg>
);

// ─── Tour Card (same as used on listing pages) ────────────────────────────────
const TourCard = ({ tour }) => {
  const price = tour.details?.price_from || tour.price || "";
  const duration = tour.details?.duration || tour.days || "";
  const maxPeople = tour.details?.max_people || "";
  return (
    <div className="col-lg-4 col-md-6">
      <div className="package-card">
        <div className="package-card-img-wrap">
          <Link href={`/package/${tour.id}`} className="card-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={tour.image} alt={tour.title} />
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

// ─── Quantity counter ─────────────────────────────────────────────────────────
const TicketCounter = ({ value, onChange }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <button
      type="button"
      onClick={() => onChange(Math.max(1, value - 1))}
      style={{
        width: 32, height: 32, borderRadius: "50%", border: "1px solid #ddd",
        background: "#fff", cursor: "pointer", fontWeight: "bold", fontSize: 18,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      −
    </button>
    <span style={{ minWidth: 24, textAlign: "center", fontWeight: 600, fontSize: 16 }}>{value}</span>
    <button
      type="button"
      onClick={() => onChange(value + 1)}
      style={{
        width: 32, height: 32, borderRadius: "50%", border: "1px solid #ddd",
        background: "#fff", cursor: "pointer", fontWeight: "bold", fontSize: 18,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      +
    </button>
  </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────
const TourDetailPage = () => {
  const params = useParams();
  const tourId = params?.id;

  // Find the tour
  const tour = useMemo(
    () => toursData.find((t) => t.id === tourId),
    [tourId]
  );

  // "You May Like" — 3 random tours excluding current
  const suggestedTours = useMemo(() => {
    if (!tour) return [];
    const others = toursData.filter((t) => t.id !== tourId);
    const shuffled = [...others].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [tourId, tour]);

  // Gallery lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Booking form state
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [ticketCount, setTicketCount] = useState(1);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Inquiry form state
  const [inquiryForm, setInquiryForm] = useState({
    name: "", email: "", phone: "", message: "",
  });

  // ── not found ──────────────────────────────────────────────────────────────
  if (!tour) {
    return (
      <>
        <Topbar />
        <Header />
        <Breadcrumb
          pagename="Tour Not Found"
          pagetitle="Tour Not Found"
          bgImage="/images/breadcrumb/tom-nicholson-PTw2xsseQxM-unsplash.jpg"
        />
        <div className="container py-5 text-center">
          <h3>Tour not found.</h3>
          <Link href="/package" className="primary-btn1 mt-3 d-inline-block">
            Back to Tours
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const details = tour.details || {};
  const images = details.gallery_images || [tour.image];
  const lightboxSlides = images.map((src) => ({ src }));

  // ── gallery layout helpers ─────────────────────────────────────────────────
  const mainImg = images[0];
  const sideImgs = images.slice(1, 5); // up to 4 side thumbnails

  const openLightbox = (idx) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  // ── itinerary: resolve place links to destination pages ───────────────────
  const resolvedPlan = (details.tour_plan || []).map((day) => ({
    ...day,
    places: (day.places || []).map((place) => {
      const destId = slugToDestId(place.link);
      return {
        ...place,
        destHref: destId ? `/destination/${destId}` : null,
      };
    }),
  }));

  // ── form helpers ───────────────────────────────────────────────────────────
  const formatBookingDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate) {
      showWarningAlert("Date required", "Please select a tour start date.");
      return;
    }

    setBookingSubmitting(true);
    try {
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "booking",
          tourId,
          guestName: bookingForm.name,
          guestEmail: bookingForm.email,
          guestPhone: bookingForm.phone,
          date: formatBookingDate(selectedDate),
          time: selectedTime,
          ticketCount,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to submit booking");
      }

      await showSuccessAlert(
        "Booking request received",
        "Thank you. Our team will contact you shortly to confirm your tour."
      );

      setBookingForm({ name: "", email: "", phone: "" });
      setSelectedDate(null);
      setSelectedTime("");
      setTicketCount(1);
    } catch (error) {
      showErrorAlert(
        "Unable to submit booking",
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquirySubmitting(true);
    try {
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "inquiry",
          tourId,
          guestName: inquiryForm.name,
          guestEmail: inquiryForm.email,
          guestPhone: inquiryForm.phone,
          message: inquiryForm.message,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to submit inquiry");
      }

      await showSuccessAlert(
        "Inquiry received",
        "Thank you. Our team will get back to you as soon as possible."
      );

      setInquiryForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      showErrorAlert(
        "Unable to submit inquiry",
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setInquirySubmitting(false);
    }
  };

  return (
    <>
      <Topbar />
      <Header />
      <Breadcrumb
        pagename={tour.title}
        pagetitle="Tour Details"
        bgImage="/images/breadcrumb/tom-nicholson-PTw2xsseQxM-unsplash.jpg"
      />

      <div className="package-details-area pt-120 mb-120 position-relative">
        <div className="container">
          {/* ═══ GALLERY ═══════════════════════════════════════════════════ */}
          <div className="row">
            <div className="col-12">
              <div className="package-img-group mb-50">
                <div className="row align-items-stretch g-3">
                  {/* Main large image */}
                  <div className={images.length === 1 ? "col-12" : "col-lg-6"}>
                    <div className="gallery-img-wrap" style={{ height: "100%" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={mainImg} alt={tour.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <a style={{ cursor: "pointer" }} onClick={() => openLightbox(0)}>
                        <i className="bi bi-eye" />
                      </a>
                    </div>
                  </div>

                  {/* Side thumbnails grid */}
                  {images.length > 1 && (
                    <div className="col-lg-6">
                      <div className="row g-3 h-100">
                        {sideImgs.map((src, idx) => {
                          const isLast = idx === sideImgs.length - 1 && images.length > 5;
                          return (
                            <div key={idx} className="col-6">
                              <div
                                className="gallery-img-wrap"
                                style={{ height: sideImgs.length <= 2 ? "220px" : "160px" }}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={src} alt={`Gallery ${idx + 2}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                {isLast ? (
                                  <button
                                    className="StartSlideShowFirstImage"
                                    onClick={() => openLightbox(idx + 1)}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <i className="bi bi-plus-lg" /> View More Images
                                  </button>
                                ) : (
                                  <a style={{ cursor: "pointer" }} onClick={() => openLightbox(idx + 1)}>
                                    <i className="bi bi-eye" />
                                  </a>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ═══ MAIN CONTENT + SIDEBAR ═════════════════════════════════════ */}
          <div className="row g-xl-4 gy-5">
            {/* ── Left column ─────────────────────────────────────────────── */}
            <div className="col-xl-8">
              {/* Title */}
              <h2 className="mb-20">{tour.title}</h2>

              {/* Price */}
              <div className="tour-price mb-20">
                <h3>{details.price_from || tour.price}</h3>
              </div>

              {/* Overview meta */}
              <ul className="tour-info-metalist mb-30">
                {/* Duration */}
                <li>
                  <svg width={14} height={14} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 7C14 8.85652 13.2625 10.637 11.9497 11.9497C10.637 13.2625 8.85652 14 7 14C5.14348 14 3.36301 13.2625 2.05025 11.9497C0.737498 10.637 0 8.85652 0 7C0 5.14348 0.737498 3.36301 2.05025 2.05025C3.36301 0.737498 5.14348 0 7 0C8.85652 0 10.637 0.737498 11.9497 2.05025C13.2625 3.36301 14 5.14348 14 7ZM7 3.0625C7 2.94647 6.95391 2.83519 6.87186 2.75314C6.78981 2.67109 6.67853 2.625 6.5625 2.625C6.44647 2.625 6.33519 2.67109 6.25314 2.75314C6.17109 2.83519 6.125 2.94647 6.125 3.0625V7.875C6.12502 7.95212 6.14543 8.02785 6.18415 8.09454C6.22288 8.16123 6.27854 8.2165 6.3455 8.25475L9.408 10.0048C9.5085 10.0591 9.62626 10.0719 9.73611 10.0406C9.84596 10.0092 9.93919 9.93611 9.99587 9.83692C10.0525 9.73774 10.0682 9.62031 10.0394 9.50975C10.0107 9.39919 9.93982 9.30426 9.842 9.24525L7 7.62125V3.0625Z" />
                  </svg>
                  {details.duration || tour.days}
                </li>
                {/* Max people */}
                {details.max_people && (
                  <li>
                    <svg width={14} height={14} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 7C7.92826 7 8.8185 6.63125 9.47487 5.97487C10.1313 5.3185 10.5 4.42826 10.5 3.5C10.5 2.57174 10.1313 1.6815 9.47487 1.02513C8.8185 0.368749 7.92826 0 7 0C6.07174 0 5.1815 0.368749 4.52513 1.02513C3.86875 1.6815 3.5 2.57174 3.5 3.5C3.5 4.42826 3.86875 5.3185 4.52513 5.97487C5.1815 6.63125 6.07174 7 7 7ZM14 12.8333C14 14 12.8333 14 12.8333 14H1.16667C1.16667 14 0 14 0 12.8333C0 11.6667 1.16667 8.16667 7 8.16667C12.8333 8.16667 14 11.6667 14 12.8333Z" />
                    </svg>
                    Max People : {details.max_people}
                  </li>
                )}
                {/* Tour type */}
                {details.tour_type && (
                  <li>
                    <svg width={14} height={14} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M14 0.43748C14 0.372778 13.9856 0.308889 13.9579 0.250418C13.9302 0.191947 13.8898 0.140348 13.8398 0.0993396C13.7897 0.0583312 13.7312 0.0289339 13.6684 0.0132656C13.6057 -0.00240264 13.5402 -0.00395173 13.4768 0.00872996L9.1875 0.86623L4.89825 0.00872996C4.84164 -0.00258444 4.78336 -0.00258444 4.72675 0.00872996L0.35175 0.88373C0.252608 0.903546 0.163389 0.957088 0.099263 1.03525C0.0351366 1.11342 6.10593e-05 1.21138 0 1.31248L0 13.5625C3.90711e-05 13.6272 0.0144289 13.6911 0.0421328 13.7495C0.0698367 13.808 0.110165 13.8596 0.160212 13.9006C0.210259 13.9416 0.268779 13.971 0.331556 13.9867C0.394332 14.0024 0.459803 14.0039 0.52325 13.9912L4.8125 13.1337L9.10175 13.9912C9.15836 14.0025 9.21664 14.0025 9.27325 13.9912L13.6482 13.1162C13.7474 13.0964 13.8366 13.0429 13.9007 12.9647C13.9649 12.8865 13.9999 12.7886 14 12.6875V0.43748ZM4.375 12.3287V0.97123L4.8125 0.88373L5.25 0.97123V12.3287L4.89825 12.2587C4.84165 12.2474 4.78335 12.2474 4.72675 12.2587L4.375 12.3287ZM8.75 13.0287V1.67123L9.10175 1.74123C9.15836 1.75254 9.21664 1.75254 9.27325 1.74123L9.625 1.67123V13.0287L9.1875 13.1162L8.75 13.0287Z" />
                    </svg>
                    Tour Type : {details.tour_type}
                  </li>
                )}
                {/* Min age */}
                {details.min_age && (
                  <li>
                    <svg width={14} height={14} viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 0C3.13 0 0 3.13 0 7C0 10.87 3.13 14 7 14C10.87 14 14 10.87 14 7C14 3.13 10.87 0 7 0ZM7 2.1C8.155 2.1 9.1 3.045 9.1 4.2C9.1 5.355 8.155 6.3 7 6.3C5.845 6.3 4.9 5.355 4.9 4.2C4.9 3.045 5.845 2.1 7 2.1ZM7 11.9C5.25 11.9 3.71 11.025 2.8 9.695C2.821 8.33 5.6 7.595 7 7.595C8.393 7.595 11.179 8.33 11.2 9.695C10.29 11.025 8.75 11.9 7 11.9Z" />
                    </svg>
                    Min Age : {details.min_age}+
                  </li>
                )}
              </ul>

              {/* Overview description */}
              {details.overview && (
                <div className="mb-30">
                  <p style={{ whiteSpace: "pre-line", lineHeight: "1.7", color: "#555" }}>
                    {details.overview}
                  </p>
                </div>
              )}

              {/* ── Included / Excluded ──────────────────────────────────── */}
              {(details.included?.length > 0 || details.excluded?.length > 0) && (
                <>
                  <h4>Included and Excluded</h4>
                  <div className="includ-and-exclud-area mb-20">
                    {details.included?.length > 0 && (
                      <ul>
                        {details.included.map((item, i) => (
                          <li key={i}>
                            <i className="bi bi-check-lg" /> {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {details.excluded?.length > 0 && (
                      <ul className="exclud">
                        {details.excluded.map((item, i) => (
                          <li key={i}>
                            <i className="bi bi-x-lg" /> {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              )}

              {/* ── Day-by-Day Itinerary ──────────────────────────────────── */}
              {resolvedPlan.length > 0 && (
                <>
                  <h4>Itinerary</h4>
                  <div className="accordion tour-plan mb-40" id="tourPlanAccordion">
                    {resolvedPlan.map((day, idx) => {
                      const headId = `tourHead-${tourId}-${idx}`;
                      const colId = `tourCollapse-${tourId}-${idx}`;
                      return (
                        <div className="accordion-item" key={idx}>
                          <h2 className="accordion-header" id={headId}>
                            <button
                              className={`accordion-button${idx === 0 ? "" : " collapsed"}`}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#${colId}`}
                              aria-expanded={idx === 0 ? "true" : "false"}
                              aria-controls={colId}
                            >
                              <span>{day.day}</span>&nbsp;
                              {/* Extract a short title from description first line */}
                              {day.description?.split("\n")[0]?.trim() || ""}
                            </button>
                          </h2>
                          <div
                            id={colId}
                            className={`accordion-collapse collapse${idx === 0 ? " show" : ""}`}
                            aria-labelledby={headId}
                            data-bs-parent="#tourPlanAccordion"
                          >
                            <div className="accordion-body">
                              {/* Description paragraphs */}
                              {day.description && (
                                <p style={{ whiteSpace: "pre-line" }}>{day.description}</p>
                              )}
                              {/* Places */}
                              {day.places?.length > 0 && (
                                <ul>
                                  {day.places.map((place, pi) => (
                                    <li key={pi}>
                                      <i className="bi bi-check-lg" />{" "}
                                      {place.destHref ? (
                                        <Link href={place.destHref} style={{ color: "inherit" }}>
                                          {place.name}
                                        </Link>
                                      ) : (
                                        place.name
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* ── You May Also Like ──────────────────────────────────────── */}
              {suggestedTours.length > 0 && (
                <div className="mt-50">
                  <h4 className="mb-30">You May Also Like</h4>
                  <div className="row g-4">
                    {suggestedTours.map((t) => (
                      <TourCard key={t.id} tour={t} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Sidebar ────────────────────────────────────────────────── */}
            <div className="col-xl-4">
              <div className="booking-form-wrap mb-40">
                <h4>Book Your Tour</h4>
                <p>Reserve your ideal trip early for a hassle-free experience!</p>

                <div className="nav nav-pills mb-40" role="tablist">
                  <button
                    className="nav-link show active"
                    id={`pill-booking-tab-${tourId}`}
                    data-bs-toggle="pill"
                    data-bs-target={`#pill-booking-${tourId}`}
                    type="button"
                    role="tab"
                    aria-controls={`pill-booking-${tourId}`}
                    aria-selected="true"
                  >
                    Online Booking
                  </button>
                  <button
                    className="nav-link"
                    id={`pill-inquiry-tab-${tourId}`}
                    data-bs-toggle="pill"
                    data-bs-target={`#pill-inquiry-${tourId}`}
                    type="button"
                    role="tab"
                    aria-controls={`pill-inquiry-${tourId}`}
                    aria-selected="false"
                  >
                    Inquiry Form
                  </button>
                </div>

                <div className="tab-content" id={`pills-tabContent-${tourId}`}>
                  {/* Online Booking tab */}
                  <div
                    className="tab-pane fade active show"
                    id={`pill-booking-${tourId}`}
                    role="tabpanel"
                    aria-labelledby={`pill-booking-tab-${tourId}`}
                  >
                    <div className="sidebar-booking-form">
                        <form onSubmit={handleBookingSubmit}>
                          <div className="form-inner mb-20">
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>
                              Full Name <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="Enter your full name"
                              value={bookingForm.name}
                              onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="form-inner mb-20">
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>
                              Email Address <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="email"
                              placeholder="Enter your email address"
                              value={bookingForm.email}
                              onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                              required
                            />
                          </div>
                          <div className="form-inner mb-20">
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>
                              Phone Number <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="tel"
                              placeholder="Enter your phone number"
                              value={bookingForm.phone}
                              onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                              required
                            />
                          </div>

                          {/* Date Picker */}
                          <div className="form-inner mb-25">
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>
                              Select Date <span style={{ color: "red" }}>*</span>
                            </label>
                            <DatePicker
                              selected={selectedDate}
                              onChange={(date) => setSelectedDate(date)}
                              minDate={tomorrow}
                              placeholderText="Select tour start date"
                              dateFormat="MMMM d, yyyy"
                              className="form-control"
                              id={`datepicker-${tourId}`}
                              required
                              wrapperClassName="w-100"
                              style={{ width: "100%" }}
                            />
                          </div>

                          {/* Time (optional) */}
                          <div className="form-inner mb-25">
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>
                              Preferred Time <span style={{ color: "#999", fontWeight: 400 }}>(optional)</span>
                            </label>
                            <select
                              className="form-control"
                              value={selectedTime}
                              onChange={(e) => setSelectedTime(e.target.value)}
                              style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: 6 }}
                            >
                              <option value="">-- Select time --</option>
                              <option value="06:00">06:00 AM</option>
                              <option value="07:00">07:00 AM</option>
                              <option value="08:00">08:00 AM</option>
                              <option value="09:00">09:00 AM</option>
                              <option value="10:00">10:00 AM</option>
                              <option value="11:00">11:00 AM</option>
                              <option value="12:00">12:00 PM</option>
                              <option value="13:00">01:00 PM</option>
                              <option value="14:00">02:00 PM</option>
                              <option value="15:00">03:00 PM</option>
                              <option value="16:00">04:00 PM</option>
                            </select>
                          </div>

                          {/* Ticket Count */}
                          <div className="form-inner mb-30">
                            <label style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>
                              Number of Tickets
                            </label>
                            <TicketCounter value={ticketCount} onChange={setTicketCount} />
                          </div>

                          {/* Submit */}
                          <button type="submit" className="primary-btn1 two" disabled={bookingSubmitting}>
                            {bookingSubmitting ? "Submitting..." : "Book Now"}
                          </button>
                        </form>
                    </div>
                  </div>

                  {/* Inquiry Form tab */}
                  <div
                    className="tab-pane fade"
                    id={`pill-inquiry-${tourId}`}
                    role="tabpanel"
                    aria-labelledby={`pill-inquiry-tab-${tourId}`}
                  >
                    <div className="sidebar-booking-form">
                        <form onSubmit={handleInquirySubmit}>
                          <div className="form-inner mb-20">
                            <label>Full Name <span style={{ color: "red" }}>*</span></label>
                            <input
                              type="text"
                              placeholder="Enter your full name"
                              value={inquiryForm.name}
                              onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="form-inner mb-20">
                            <label>Email Address <span style={{ color: "red" }}>*</span></label>
                            <input
                              type="email"
                              placeholder="Enter your email address"
                              value={inquiryForm.email}
                              onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                              required
                            />
                          </div>
                          <div className="form-inner mb-20">
                            <label>Phone Number <span style={{ color: "red" }}>*</span></label>
                            <input
                              type="tel"
                              placeholder="Enter your phone number"
                              value={inquiryForm.phone}
                              onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                              required
                            />
                          </div>
                          <div className="form-inner mb-30">
                            <label>Write Your Message <span style={{ color: "red" }}>*</span></label>
                            <textarea
                              placeholder="Write your inquiry..."
                              value={inquiryForm.message}
                              onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                              required
                            />
                          </div>
                          <div className="form-inner">
                            <button type="submit" className="primary-btn1 two" disabled={inquirySubmitting}>
                              {inquirySubmitting ? "Submitting..." : "Submit Now"}
                            </button>
                          </div>
                        </form>
                    </div>
                  </div>
                </div>
              </div>

              {/* More Inquiry card */}
              <div className="banner2-card mt-30">
                <img src="/assets/img/innerpage/support-img.jpg" alt="Support" />
                <div className="banner2-content-wrap">
                  <div className="banner2-content">
                    <div className="hotline-area">
                      <div className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 28 28">
                          <path d="M27.2653 21.5995L21.598 17.8201C20.8788 17.3443 19.9147 17.5009 19.383 18.1798L17.7322 20.3024C17.6296 20.4377 17.4816 20.5314 17.3154 20.5664C17.1492 20.6014 16.9759 20.5752 16.8275 20.4928L16.5134 20.3196C15.4725 19.7522 14.1772 19.0458 11.5675 16.4352C8.95784 13.8246 8.25001 12.5284 7.6826 11.4893L7.51042 11.1753C7.42683 11.0269 7.39968 10.8532 7.43398 10.6864C7.46827 10.5195 7.56169 10.3707 7.69704 10.2673L9.81816 8.61693C10.4968 8.08517 10.6536 7.1214 10.1784 6.40198L6.39895 0.734676C5.91192 0.00208106 4.9348-0.21784 4.18082 0.235398L1.81096 1.65898C1.06634 2.09672 0.520053 2.80571 0.286612 3.63733C-0.56677 6.74673 0.0752209 12.1131 7.98033 20.0191C14.2687 26.307 18.9501 27.9979 22.1677 27.9979C22.9083 28.0011 23.6459 27.9048 24.3608 27.7115C25.1925 27.4783 25.9016 26.932 26.3391 26.1871L27.7641 23.8187C28.218 23.0645 27.9982 22.0868 27.2653 21.5995Z" />
                        </svg>
                      </div>
                      <div className="content">
                        <span>To More Inquiry</span>
                        <h6>
                          <a href="tel:+94773531693">+94 762 205 763</a>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lightbox */}
        <Lightbox
          className="img-fluid"
          open={lightboxOpen}
          plugins={[Fullscreen]}
          index={lightboxIndex}
          close={() => setLightboxOpen(false)}
          styles={{ container: { backgroundColor: "rgba(0,0,0,.9)" } }}
          slides={lightboxSlides}
        />
      </div>

      {/* Sticky Book Now button — mobile only */}
      <div
        className="d-xl-none"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          padding: "12px 16px",
          background: "rgba(255,255,255,0.97)",
          boxShadow: "0 -2px 12px rgba(0,0,0,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: "#888" }}>Price from</div>
          <div style={{ fontWeight: 700, fontSize: 18, color: "#1a1a1a" }}>
            {details.price_from || tour.price}
          </div>
        </div>
        <a
          href={`#pill-booking-${tourId}`}
          className="primary-btn1"
          onClick={(e) => {
            e.preventDefault();
            const el = document.querySelector(".sidebar-booking-card");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          style={{ minWidth: 140, textAlign: "center" }}
        >
          Book Now
        </a>
      </div>

      <Newslatter />
      <Footer />
    </>
  );
};

export default TourDetailPage;
