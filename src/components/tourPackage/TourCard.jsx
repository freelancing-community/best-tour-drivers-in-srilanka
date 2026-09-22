import Link from "next/link";
import React from "react";

/**
 * Offers-page tour card.
 *
 * Styling lives in src/app/offers/offers.css, where every rule is scoped under
 * `.offers-page`. This component is imported only by src/app/offers/page.js —
 * the tour listing and tour detail pages keep their own template cards.
 */

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1Zm13 8H4v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9Z" />
  </svg>
);

const PeopleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={15} height={11} viewBox="0 0 15 11" aria-hidden="true">
    <path d="M9.4 0.3a.9.9 0 0 0-1.3 1.3l2.6 2.6H1a.9.9 0 0 0 0 1.8h9.7L8.1 8.6a.9.9 0 1 0 1.3 1.3l4.1-4.1a.9.9 0 0 0 0-1.3L9.4.3Z" />
  </svg>
);

/**
 * @param tour       an entry from src/data/tours.json
 * @param ctaLabel   action button text
 * @param badge      optional category ribbon shown over the image
 * @param badgeColor that ribbon's background colour
 * @param delay      stagger, in ms, for the scroll-reveal transition
 * @param priority   true for above-the-fold cards, which skip lazy loading
 */
const TourCard = ({
  tour,
  ctaLabel = "Explore",
  badge = null,
  badgeColor = "#f6a824",
  delay = 0,
  priority = false,
}) => {
  const price = tour.details?.price_from || tour.price || "";
  const duration = tour.details?.duration || tour.days || "";
  const maxPeople = tour.details?.max_people || "";
  const href = `/package/${tour.id}`;

  return (
    /* The reveal wrapper owns the scroll-in transform and the card owns the
       hover lift. Keeping them on separate elements stops the two transforms
       from overwriting each other. */
    <div
      className="ofr-reveal"
      style={delay ? { "--ofr-delay": `${delay}ms` } : undefined}
    >
      <article className="ofr-card">
      <Link href={href} className="ofr-card-media" tabIndex={-1} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tour.image}
          alt=""
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      </Link>
      {badge && (
        <span className="ofr-badge" style={{ backgroundColor: badgeColor }}>
          {badge}
        </span>
      )}

      <div className="ofr-card-body">
        <ul className="ofr-meta">
          {duration && (
            <li>
              <CalendarIcon />
              <span>{duration}</span>
            </li>
          )}
          {maxPeople && (
            <li>
              <PeopleIcon />
              <span>
                Max {maxPeople} {parseInt(maxPeople, 10) === 1 ? "Person" : "People"}
              </span>
            </li>
          )}
        </ul>

        <h3 className="ofr-card-title">
          <Link href={href} title={tour.title}>
            {tour.title}
          </Link>
        </h3>

        <div className="ofr-card-foot">
          <div>
            <span className="ofr-price-label">From USD</span>
            <span className="ofr-price">{price}</span>
          </div>
          <Link href={href} className="ofr-btn">
            {ctaLabel}
            <ArrowIcon />
          </Link>
        </div>
      </div>
      </article>
    </div>
  );
};

export default TourCard;
