"use client"
import React, { useState, useRef, useEffect } from 'react'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import destinations from "../../data/destinationData"

const Banner1Bottom = () => {
  const [from, setFrom] = useState("Switzerland");
  const [to, setTo] = useState("Sri Lanka");
  const [journeyDate, setJourneyDate] = useState(new Date("2026-12-02"));
  const [returnDate, setReturnDate] = useState(new Date("2026-12-10"));
  const [activeDropdown, setActiveDropdown] = useState(null); // 'from' | 'to' | null

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSelect = (type, val) => {
    if (type === 'from') setFrom(val);
    if (type === 'to') setTo(val);
    setActiveDropdown(null);
  };

  return (
    <div className="home1-banner-bottom mb-120 banner-bottom-outer">
      <div className="container-fluid" ref={dropdownRef}>
        <div className="search-container shadow-sm">

          {/* Fields Row */}
          <div className="search-fields-row">

            {/* From */}
            <div
              className="search-item"
              onClick={() => setActiveDropdown(activeDropdown === 'from' ? null : 'from')}
            >
              <span className="search-label">
                <i className="bi bi-geo-alt me-2" style={{ color: "#F6A824" }}></i>
                From
              </span>
              <div className="search-value-row">
                <span className="search-value">{from}</span>
                <i className="bi bi-chevron-down text-muted chevron-icon"></i>
              </div>
              {activeDropdown === 'from' && (
                <div className="dropdown-menu show search-dropdown">
                  <ul className="list-unstyled mb-0 py-2">
                    {destinations.map((d, i) => (
                      <li key={i} className="dropdown-item py-2 px-4 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleSelect('from', d.name); }}>
                        <div className="fw-bold">{d.name}</div>
                        <small className="text-muted">{d.locations}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* To */}
            <div
              className="search-item"
              onClick={() => setActiveDropdown(activeDropdown === 'to' ? null : 'to')}
            >
              <span className="search-label">
                <i className="bi bi-geo-alt me-2" style={{ color: "#F6A824" }}></i>
                To
              </span>
              <div className="search-value-row">
                <span className="search-value">{to}</span>
                <i className="bi bi-chevron-down text-muted chevron-icon"></i>
              </div>
              {activeDropdown === 'to' && (
                <div className="dropdown-menu show search-dropdown">
                  <ul className="list-unstyled mb-0 py-2">
                    {destinations.map((d, i) => (
                      <li key={i} className="dropdown-item py-2 px-4 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleSelect('to', d.name); }}>
                        <div className="fw-bold">{d.name}</div>
                        <small className="text-muted">{d.locations}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Journey Date */}
            <div className="search-item date-picker-wrapper">
              <span className="search-label">
                <i className="bi bi-calendar3 me-2" style={{ color: "#F6A824" }}></i>
                Journey date
              </span>
              <div className="search-value-row">
                <DatePicker
                  selected={journeyDate}
                  onChange={(date) => setJourneyDate(date)}
                  dateFormat="MMM d"
                  className="border-0 bg-transparent fw-bold p-0 w-100 date-input"
                />
                <i className="bi bi-chevron-down text-muted chevron-icon" style={{ pointerEvents: "none" }}></i>
              </div>
            </div>

            {/* Return Date */}
            <div className="search-item date-picker-wrapper">
              <span className="search-label">
                <i className="bi bi-calendar3 me-2" style={{ color: "#F6A824" }}></i>
                Return date
              </span>
              <div className="search-value-row">
                <DatePicker
                  selected={returnDate}
                  onChange={(date) => setReturnDate(date)}
                  dateFormat="MMM d"
                  className="border-0 bg-transparent fw-bold p-0 w-100 date-input"
                />
                <i className="bi bi-chevron-down text-muted chevron-icon" style={{ pointerEvents: "none" }}></i>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="search-btn-container">
            <button className="search-btn">
              Search
            </button>
          </div>

        </div>
      </div>

      <style jsx>{`
        .banner-bottom-outer {
          position: relative;
          z-index: 10;
          padding: 0 5%;
        }
        .search-container {
          background-color: #FFE8C1;
          border-radius: 0 0 30px 30px;
          overflow: visible;
          display: flex;
          align-items: stretch;
        }
        .search-fields-row {
          display: flex;
          flex: 1;
          align-items: stretch;
        }
        .search-item {
          flex: 1;
          padding: 18px 22px;
          border-right: 1px solid #e0ceab;
          position: relative;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .search-label {
          color: #888;
          font-size: 13px;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
        }
        .search-value-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .search-value {
          font-weight: 700;
          color: #100C08;
          font-size: 15px;
        }
        .chevron-icon {
          font-size: 12px;
          margin-left: 6px;
        }
        .search-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 1000;
          max-height: 250px;
          overflow-y: auto;
          margin-top: 10px;
          border-radius: 15px;
          border: none;
          box-shadow: 0 10px 30px rgba(0,0,0,0.12);
        }
        .search-btn-container {
          flex: 0 0 140px;
          display: flex;
        }
        .search-btn {
          width: 100%;
          height: 100%;
          background-color: #F6A824;
          color: #fff;
          font-weight: 700;
          font-size: 1.05rem;
          border: none;
          border-radius: 0 0 30px 0;
          cursor: pointer;
          transition: background 0.2s;
        }
        .search-btn:hover {
          background-color: #e09416;
        }
        .dropdown-item:hover {
          background-color: #FFE8C1;
        }
        .date-picker-wrapper .react-datepicker-wrapper {
          width: 100%;
        }
        .date-input {
          cursor: pointer;
          color: #100C08;
          font-weight: 700;
          font-size: 15px;
        }
        .date-input:focus {
          outline: none;
        }

        /* ── Tablet (≤ 991px): 2 columns */
        @media (max-width: 991px) {
          .search-container {
            flex-direction: column;
            border-radius: 0 0 24px 24px;
          }
          .search-fields-row {
            flex-wrap: wrap;
          }
          .search-item {
            flex: 1 1 48%;
            border-right: none;
            border-bottom: 1px solid #e0ceab;
          }
          .search-btn-container {
            flex: 1 1 100%;
            min-height: 56px;
          }
          .search-btn {
            border-radius: 0 0 24px 24px;
          }
        }

        /* ── Mobile (≤ 575px): single column */
        @media (max-width: 575px) {
          .banner-bottom-outer {
            padding: 0 3%;
          }
          .search-container {
            border-radius: 0 0 20px 20px;
          }
          .search-fields-row {
            flex-direction: column;
          }
          .search-item {
            flex: none;
            width: 100%;
            border-bottom: 1px solid #e0ceab;
          }
          .search-btn-container {
            min-height: 52px;
          }
          .search-btn {
            border-radius: 0 0 20px 20px;
          }
        }
      `}</style>
    </div>
  )
}

export default Banner1Bottom
