"use client";
import Breadcrumb from "@/components/common/Breadcrumb";
import Link from "next/link";
import React, { useState } from "react";
import destinationsData from "@/data/destinations.json";

const CARDS_PER_PAGE = 12;

// Masonry column pattern: repeating groups of 3 cards with widths [3,5,4], [4,3,5], [5,4,3]
const COL_PATTERNS = [
  ["col-lg-3 col-sm-6", "col-lg-5 col-sm-6", "col-lg-4 col-sm-6"],
  ["col-lg-4 col-sm-6", "col-lg-3 col-sm-6", "col-lg-5 col-sm-6"],
  ["col-lg-5 col-sm-6", "col-lg-4 col-sm-6", "col-lg-3 col-sm-6"],
];

const DestinationCard = ({ dest, colClass }) => (
  <div className={colClass}>
    <div className="destination-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dest.image} alt={dest.title} />
      <div className="overlay" />
      <div className="card-title">
        <h4>{dest.title}</h4>
      </div>
      <div className="content">
        <h4>
          <Link href={`/destination/${dest.id}`}>{dest.title}</Link>
        </h4>
        <div className="eg-tag">
          <span>{dest.tour_count}</span>
        </div>
      </div>
    </div>
  </div>
);

const page = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(destinationsData.length / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const visibleDests = destinationsData.slice(startIndex, startIndex + CARDS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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
      <Breadcrumb pagename="Destinations" pagetitle="Destinations" />
      <div className="destination-gallery-section pt-120 mb-120">
        <div className="container">
          <div className="row g-lg-4 gy-5 mb-70">
            {visibleDests.map((dest, idx) => {
              // Cycle through the masonry pattern
              const patternGroup = Math.floor(idx / 3) % COL_PATTERNS.length;
              const posInGroup = idx % 3;
              const colClass = COL_PATTERNS[patternGroup][posInGroup];
              return (
                <DestinationCard key={dest.id} dest={dest} colClass={colClass} />
              );
            })}
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
                        style={{
                          background: "none",
                          border: "none",
                          cursor: currentPage === 1 ? "not-allowed" : "pointer",
                          opacity: currentPage === 1 ? 0.4 : 1,
                        }}
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
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
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
                        style={{
                          background: "none",
                          border: "none",
                          cursor:
                            currentPage === totalPages ? "not-allowed" : "pointer",
                          opacity: currentPage === totalPages ? 0.4 : 1,
                        }}
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
    </>
  );
};

export default page;
