"use client";
import React, { useEffect, useRef } from "react";

// Without JavaScript nothing would ever get `.is-visible`, so unhide the
// cards up front. Rendered server-side, so there is no flash.
const NOSCRIPT_CSS =
  "<style>.home-deals .banner2-card{opacity:1!important;translate:none!important}</style>";

/**
 * Renders a plain `div` with `className` and reveals every `.banner2-card`
 * inside it as it scrolls into view. Kept separate from Home1Banner2 so the
 * tour data stays on the server.
 */
const DealsReveal = ({ className, children }) => {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;

    const cards = Array.from(root.querySelectorAll(".banner2-card"));
    const showAll = () => cards.forEach((el) => el.classList.add("is-visible"));

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
          // A fast flick can report a card only after it has scrolled past
          // the top of the viewport. Reveal those too.
          const scrolledPast = entry.boundingClientRect.top < 0;
          if (!entry.isIntersecting && !scrolledPast) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -48px 0px" }
    );

    cards.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={className} ref={ref}>
      <noscript dangerouslySetInnerHTML={{ __html: NOSCRIPT_CSS }} />
      {children}
    </div>
  );
};

export default DealsReveal;
