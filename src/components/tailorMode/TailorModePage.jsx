"use client";
import React, { useState, useRef, useEffect } from "react";
import countriesData from "@/data/countries.json";

const ACCENT = "#E08B12";

const WhatsAppIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const EmailIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

// Flag Image component using flagcdn
const FlagImage = ({ code, alt, width = 20, height = 15 }) => {
  const countryCode = code ? code.toLowerCase() : "us";
  return (
    <img
      src={`https://flagcdn.com/w40/${countryCode}.png`}
      srcSet={`https://flagcdn.com/w80/${countryCode}.png 2x`}
      width={width}
      height={height}
      alt={alt || countryCode}
      className="flag-img-icon"
      loading="lazy"
    />
  );
};

// Custom Searchable Country Dropdown Component with National Flag Images
const SearchableCountrySelect = ({ value, onChange, placeholder = "- Select Your Country -" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  const selectedCountry = countriesData.find((c) => c.name === value);

  const filteredCountries = countriesData.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="searchable-dropdown-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className="custom-underline-select-trigger d-flex align-items-center justify-content-between w-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedCountry ? "text-dark fw-medium d-flex align-items-center gap-2" : "text-muted"}>
          {selectedCountry ? (
            <>
              <FlagImage code={selectedCountry.code} alt={selectedCountry.name} />
              <span>{selectedCountry.name}</span>
            </>
          ) : (
            placeholder
          )}
        </span>
        <span className="dropdown-arrow">▼</span>
      </button>

      {isOpen && (
        <div className="searchable-dropdown-menu shadow-lg rounded-3">
          <div className="p-2 border-bottom">
            <div className="search-input-box d-flex align-items-center gap-2 px-2 py-1 bg-light rounded-2">
              <SearchIcon />
              <input
                type="text"
                className="dropdown-search-field border-0 bg-transparent"
                placeholder="Search country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <div className="dropdown-options-list">
            <div
              className="dropdown-item-custom text-muted"
              onClick={() => {
                onChange("");
                setIsOpen(false);
                setSearchQuery("");
              }}
            >
              {placeholder}
            </div>
            {filteredCountries.length > 0 ? (
              filteredCountries.map((c) => (
                <div
                  key={c.code}
                  className={`dropdown-item-custom d-flex align-items-center gap-2 ${value === c.name ? "selected" : ""
                    }`}
                  onClick={() => {
                    onChange(c.name);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                >
                  <FlagImage code={c.code} alt={c.name} />
                  <span className="country-name">{c.name}</span>
                </div>
              ))
            ) : (
              <div className="dropdown-item-custom text-muted text-center py-2">
                No matching countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Custom Searchable Mobile Dial Code Extension Component with National Flag Images
const SearchableDialCodeSelect = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  const selectedItem = countriesData.find((c) => c.dial_code === value) || countriesData.find((c) => c.code === "US");

  const filteredItems = countriesData.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.dial_code.includes(searchQuery) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="searchable-dialcode-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className="dialcode-trigger-btn d-flex align-items-center gap-2 border-0 bg-transparent pe-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FlagImage code={selectedItem?.code || "US"} alt={selectedItem?.name} />
        <span className="dial-code-text fw-medium">{selectedItem?.dial_code || value}</span>
        <span className="small-arrow">▼</span>
      </button>

      {isOpen && (
        <div className="searchable-dropdown-menu dialcode-menu shadow-lg rounded-3">
          <div className="p-2 border-bottom">
            <div className="search-input-box d-flex align-items-center gap-2 px-2 py-1 bg-light rounded-2">
              <SearchIcon />
              <input
                type="text"
                className="dropdown-search-field border-0 bg-transparent"
                placeholder="Search country or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <div className="dropdown-options-list">
            {filteredItems.length > 0 ? (
              filteredItems.map((c, idx) => (
                <div
                  key={`${c.code}-${c.dial_code}-${idx}`}
                  className={`dropdown-item-custom d-flex align-items-center justify-content-between ${value === c.dial_code ? "selected" : ""
                    }`}
                  onClick={() => {
                    onChange(c.dial_code);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <FlagImage code={c.code} alt={c.name} />
                    <span className="country-name small">{c.name}</span>
                  </div>
                  <span className="dial-code-badge badge bg-light text-dark fw-bold">{c.dial_code}</span>
                </div>
              ))
            ) : (
              <div className="dropdown-item-custom text-muted text-center py-2">
                No country found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const TailorModePage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCode: "+1",
    phoneNumber: "",
    communicationWhatsApp: false,
    communicationEmail: false,
    country: "",
    adults: "2",
    children: "0",
    infants: "0",
    arrivalDate: "",
    arrivalHour: "Select",
    arrivalMinute: "Select",
    arrivalAmPm: "AM",
    departureDate: "",
    departureHour: "Select",
    departureMinute: "Select",
    departureAmPm: "AM",
    currency: "USD",
    arrangeAccommodation: "No",
    hasTourPlan: "No",
    specialRequests: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const hoursOptions = ["Select", ...Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"))];
  const minutesOptions = ["Select", "00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

  return (
    <div className="tailor-mode-wrapper">
      <div className="container py-5">
        <div className="tailor-card shadow-sm p-4 p-md-5 bg-white rounded-3">
          {submitted ? (
            <div className="alert alert-success text-center py-5 rounded-3">
              <div className="mb-3">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="fw-bold mb-2">Thank You for Your Request!</h3>
              <p className="lead text-muted mb-4">
                We have received your tailor-made tour request. Our team will review your details and reach out to you within 24 hours via your preferred communication method.
              </p>
              <button className="primary-btn2" onClick={() => setSubmitted(false)}>
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* SECTION 1: PERSONAL INFORMATION */}
              <div className="tailor-section mb-5">
                <div className="section-header mb-4">
                  <h2 className="section-title">Personal Information</h2>
                  <div className="section-line" />
                </div>

                <div className="row g-4">
                  {/* First Name & Last Name */}
                  <div className="col-md-6">
                    <div className="form-field-underline">
                      <label htmlFor="firstName" className="field-label">
                        First Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        placeholder=""
                        className="custom-underline-input"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-field-underline">
                      <label htmlFor="lastName" className="field-label">
                        Last Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        placeholder=""
                        className="custom-underline-input"
                      />
                    </div>
                  </div>

                  {/* Email, Mobile & Preferred Communication */}
                  <div className="col-lg-4 col-md-6">
                    <div className="form-field-underline">
                      <label htmlFor="email" className="field-label">
                        Email Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="custom-underline-input"
                      />
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-6">
                    <div className="form-field-underline">
                      <label htmlFor="phoneNumber" className="field-label">
                        Mobile Number <span className="text-danger">*</span>
                      </label>
                      <div className="d-flex align-items-center gap-2 underline-container">
                        <SearchableDialCodeSelect
                          value={formData.phoneCode}
                          onChange={(val) => setFormData((prev) => ({ ...prev, phoneCode: val }))}
                        />
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          required
                          className="custom-underline-input border-0"
                          placeholder="Mobile Number *"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-12">
                    <div className="form-field-underline pb-2">
                      <label className="field-label-bold mb-2">
                        Preferred Communication Method <span className="text-danger">*</span>
                      </label>
                      <div className="d-flex gap-4 align-items-center mt-1">
                        <label className="checkbox-container d-flex align-items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="communicationWhatsApp"
                            checked={formData.communicationWhatsApp}
                            onChange={handleChange}
                            className="custom-checkbox"
                          />
                          <span>WhatsApp</span>
                        </label>
                        <label className="checkbox-container d-flex align-items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="communicationEmail"
                            checked={formData.communicationEmail}
                            onChange={handleChange}
                            className="custom-checkbox"
                          />
                          <span>Email</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Select Country */}
                  <div className="col-12">
                    <div className="form-field-underline">
                      <label htmlFor="country" className="field-label-bold mb-2">
                        Select Country
                      </label>
                      <SearchableCountrySelect
                        value={formData.country}
                        onChange={(val) => setFormData((prev) => ({ ...prev, country: val }))}
                        placeholder="- Select Your Country -"
                      />
                    </div>
                  </div>

                  {/* Adults, Children, Infants */}
                  <div className="col-md-4">
                    <div className="form-field-underline">
                      <label htmlFor="adults" className="field-label-bold">
                        Number of Adults <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        id="adults"
                        name="adults"
                        min="1"
                        max="50"
                        value={formData.adults}
                        onChange={handleChange}
                        required
                        className="custom-underline-input fw-semibold"
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-field-underline">
                      <label htmlFor="children" className="field-label-bold d-block">
                        Number of Children
                      </label>
                      <input
                        type="number"
                        id="children"
                        name="children"
                        min="0"
                        max="30"
                        value={formData.children}
                        onChange={handleChange}
                        className="custom-underline-input fw-semibold"
                      />
                      <span className="sublabel-text">6-12 Years</span>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-field-underline">
                      <label htmlFor="infants" className="field-label-bold d-block">
                        Number of Infants
                      </label>
                      <input
                        type="number"
                        id="infants"
                        name="infants"
                        min="0"
                        max="20"
                        value={formData.infants}
                        onChange={handleChange}
                        className="custom-underline-input fw-semibold"
                      />
                      <span className="sublabel-text">1-5 Years</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: ARRIVAL & DEPARTURE DETAILS */}
              <div className="tailor-section mb-5">
                <div className="section-header mb-4">
                  <h2 className="section-title">Arrival & Departure Details</h2>
                  <div className="section-line" />
                </div>

                <div className="row g-4">
                  {/* Arrival Date & Arrival Time */}
                  <div className="col-lg-6">
                    <div className="form-field-underline">
                      <label htmlFor="arrivalDate" className="field-label d-flex align-items-center gap-2">
                        <CalendarIcon />
                        <span>Arrival Date <span className="text-danger">*</span></span>
                      </label>
                      <input
                        type="date"
                        id="arrivalDate"
                        name="arrivalDate"
                        value={formData.arrivalDate}
                        onChange={handleChange}
                        required
                        className="custom-underline-input"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-field-underline">
                      <label className="field-label-bold mb-2">
                        Arrival Time <span className="text-danger">*</span>
                      </label>
                      <div className="row g-2 align-items-center">
                        <div className="col-4">
                          <span className="time-select-label d-block mb-1">Hours</span>
                          <select
                            name="arrivalHour"
                            value={formData.arrivalHour}
                            onChange={handleChange}
                            className="custom-underline-select w-100"
                          >
                            {hoursOptions.map((h) => (
                              <option key={h} value={h}>
                                {h}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-4">
                          <span className="time-select-label d-block mb-1">Minutes</span>
                          <select
                            name="arrivalMinute"
                            value={formData.arrivalMinute}
                            onChange={handleChange}
                            className="custom-underline-select w-100"
                          >
                            {minutesOptions.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-4">
                          <span className="time-select-label d-block mb-1">&nbsp;</span>
                          <select
                            name="arrivalAmPm"
                            value={formData.arrivalAmPm}
                            onChange={handleChange}
                            className="custom-underline-select w-100"
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Departure Date & Departure Time */}
                  <div className="col-lg-6">
                    <div className="form-field-underline">
                      <label htmlFor="departureDate" className="field-label d-flex align-items-center gap-2">
                        <CalendarIcon />
                        <span>Departure Date <span className="text-danger">*</span></span>
                      </label>
                      <input
                        type="date"
                        id="departureDate"
                        name="departureDate"
                        value={formData.departureDate}
                        onChange={handleChange}
                        required
                        className="custom-underline-input"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-field-underline">
                      <label className="field-label-bold mb-2">
                        Departure Time <span className="text-danger">*</span>
                      </label>
                      <div className="row g-2 align-items-center">
                        <div className="col-4">
                          <span className="time-select-label d-block mb-1">Hours</span>
                          <select
                            name="departureHour"
                            value={formData.departureHour}
                            onChange={handleChange}
                            className="custom-underline-select w-100"
                          >
                            {hoursOptions.map((h) => (
                              <option key={h} value={h}>
                                {h}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-4">
                          <span className="time-select-label d-block mb-1">Minutes</span>
                          <select
                            name="departureMinute"
                            value={formData.departureMinute}
                            onChange={handleChange}
                            className="custom-underline-select w-100"
                          >
                            {minutesOptions.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-4">
                          <span className="time-select-label d-block mb-1">&nbsp;</span>
                          <select
                            name="departureAmPm"
                            value={formData.departureAmPm}
                            onChange={handleChange}
                            className="custom-underline-select w-100"
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: TOUR INFORMATION */}
              <div className="tailor-section mb-5">
                <div className="section-header mb-4">
                  <h2 className="section-title">Tour Information</h2>
                  <div className="section-line" />
                </div>

                <div className="row g-4">
                  {/* Currency Selection */}
                  <div className="col-12">
                    <div className="mb-4">
                      <label className="field-label-bold mb-2">
                        Your Preferred Currency <span className="text-danger">*</span>
                      </label>
                      <div className="d-flex flex-wrap gap-4 align-items-center mt-2">
                        {["USD", "British Pounds", "Euro", "LKR"].map((curr) => (
                          <label key={curr} className="radio-container d-flex align-items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="currency"
                              value={curr}
                              checked={formData.currency === curr}
                              onChange={handleChange}
                              className="custom-radio"
                            />
                            <span>{curr}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Arrange Accommodation */}
                  <div className="col-12">
                    <div className="mb-4">
                      <label className="field-label-bold mb-2">
                        Do you want to arrange accommodation by us? <span className="text-danger">*</span>
                      </label>
                      <div className="d-flex gap-4 align-items-center mt-2">
                        {["Yes", "No"].map((opt) => (
                          <label key={`acc-${opt}`} className="radio-container d-flex align-items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="arrangeAccommodation"
                              value={opt}
                              checked={formData.arrangeAccommodation === opt}
                              onChange={handleChange}
                              className="custom-radio"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tour Plan */}
                  <div className="col-12">
                    <div className="mb-4">
                      <label className="field-label-bold mb-2">
                        Do you have any tour plan? <span className="text-danger">*</span>
                      </label>
                      <div className="d-flex flex-column gap-2 mt-2">
                        {["Yes", "No"].map((opt) => (
                          <label key={`plan-${opt}`} className="radio-container d-flex align-items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="hasTourPlan"
                              value={opt}
                              checked={formData.hasTourPlan === opt}
                              onChange={handleChange}
                              className="custom-radio"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="col-12">
                    <div className="mb-4">
                      <textarea
                        name="specialRequests"
                        rows="6"
                        value={formData.specialRequests}
                        onChange={handleChange}
                        placeholder="Special Requests"
                        className="custom-textarea w-100 p-3"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: SEND REQUEST BUTTON */}
              <div className="mb-5">
                <button type="submit" className="send-request-btn">
                  SEND REQUEST
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* FOOTER CONTACT BANNER */}
      <div className="tailor-contact-banner py-4 mt-4">
        <div className="container">
          <div className="row align-items-center gy-3 justify-content-between">
            <div className="col-lg-8 col-md-12">
              <div className="d-flex flex-wrap align-items-center gap-4">
                <p className="contact-banner-text mb-0">
                  Don&apos;t wait any longer. Contact us now via WhatsApp or Email...
                </p>
                <div className="d-flex flex-wrap align-items-center gap-4">
                  <a
                    href="https://wa.me/94773531693"
                    target="_blank"
                    rel="noreferrer"
                    className="banner-contact-item d-flex align-items-center gap-2 text-decoration-none"
                  >
                    <WhatsAppIcon />
                    <span className="fw-bold contact-val">+94 762 205 763</span>
                  </a>
                  <a
                    href="mailto:besttourdriversinsrilanka@gmail.com"
                    className="banner-contact-item d-flex align-items-center gap-2 text-decoration-none"
                  >
                    <EmailIcon />
                    <span className="fw-bold contact-val">besttourdriversinsrilanka@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-12 text-lg-end">
              <div className="d-flex align-items-center justify-content-lg-end gap-3">
                <span className="follow-us-text">Follow us</span>
                <div className="social-icons d-flex gap-2">
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-circle">
                    <i className="bi bi-facebook" />
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-circle">
                    <i className="bi bi-youtube" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-circle">
                    <i className="bi bi-twitter-x" />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-circle">
                    <i className="bi bi-instagram" />
                  </a>
                  <a href="https://tripadvisor.com" target="_blank" rel="noreferrer" className="social-circle">
                    <i className="bi bi-balloon" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .tailor-mode-wrapper {
          background-color: #f8f9fa;
          font-family: inherit;
        }

        .tailor-card {
          border: 1px solid #e9ecef;
        }

        .section-header {
          position: relative;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 500;
          color: #2b2b2b;
          margin-bottom: 8px;
        }

        .section-line {
          width: 100%;
          height: 2px;
          background-color: #2b2b2b;
          margin-top: 12px;
        }

        .form-field-underline {
          position: relative;
          padding-bottom: 8px;
        }

        .field-label {
          color: #888;
          font-size: 0.95rem;
          margin-bottom: 6px;
          display: block;
        }

        .field-label-bold {
          color: #111;
          font-size: 0.95rem;
          font-weight: 700;
          display: block;
        }

        .sublabel-text {
          font-size: 0.8rem;
          color: #888;
          display: block;
          margin-top: 4px;
        }

        .custom-underline-input {
          width: 100%;
          border: none;
          border-bottom: 1.5px solid #ccc;
          outline: none;
          padding: 6px 0;
          font-size: 1rem;
          color: #333;
          background: transparent;
          transition: border-color 0.2s ease;
        }

        .custom-underline-input:focus {
          border-bottom-color: ${ACCENT};
        }

        .custom-underline-select {
          border: none;
          border-bottom: 1.5px solid #ccc;
          outline: none;
          padding: 6px 20px 6px 0;
          font-size: 0.95rem;
          color: #333;
          background: transparent;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%3C555' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right center;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }

        .custom-underline-select:focus {
          border-bottom-color: ${ACCENT};
        }

        /* National Flag Image Styling */
        .flag-img-icon {
          width: 22px;
          height: 15px;
          object-fit: cover;
          border-radius: 2px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(0, 0, 0, 0.08);
          flex-shrink: 0;
        }

        /* Searchable Dropdown Styles */
        .searchable-dropdown-wrapper,
        .searchable-dialcode-wrapper {
          position: relative;
          width: 100%;
        }

        .custom-underline-select-trigger {
          border: none;
          border-bottom: 1.5px solid #ccc;
          padding: 6px 0;
          font-size: 0.95rem;
          background: transparent;
          cursor: pointer;
          text-align: left;
          transition: border-color 0.2s ease;
        }

        .custom-underline-select-trigger:focus,
        .searchable-dropdown-wrapper:hover .custom-underline-select-trigger {
          border-bottom-color: ${ACCENT};
        }

        .dropdown-arrow,
        .small-arrow {
          font-size: 0.7rem;
          color: #666;
          margin-left: 6px;
        }

        .dialcode-trigger-btn {
          padding: 6px 0;
          cursor: pointer;
        }

        .searchable-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 1050;
          width: 100%;
          min-width: 260px;
          max-height: 280px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          margin-top: 4px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .dialcode-menu {
          width: 320px;
        }

        .dropdown-search-field {
          width: 100%;
          font-size: 0.88rem;
          outline: none;
        }

        .dropdown-options-list {
          overflow-y: auto;
          max-height: 220px;
        }

        .dropdown-item-custom {
          padding: 8px 12px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .dropdown-item-custom:hover {
          background-color: #f1f5f9;
        }

        .dropdown-item-custom.selected {
          background-color: #fef3c7;
          font-weight: 600;
        }

        .underline-container {
          border-bottom: 1.5px solid #ccc;
          padding-bottom: 2px;
        }

        .underline-container:focus-within {
          border-bottom-color: ${ACCENT};
        }

        .time-select-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: #111;
        }

        .custom-checkbox {
          width: 18px;
          height: 18px;
          accent-color: ${ACCENT};
          cursor: pointer;
        }

        .custom-radio {
          width: 18px;
          height: 18px;
          accent-color: ${ACCENT};
          cursor: pointer;
        }

        .radio-container, .checkbox-container {
          font-size: 0.95rem;
          color: #333;
        }

        .custom-textarea {
          border: 1.5px solid #4ba3e3;
          border-radius: 4px;
          outline: none;
          font-size: 0.95rem;
          resize: vertical;
        }

        .custom-textarea:focus {
          border-color: ${ACCENT};
          box-shadow: 0 0 0 3px rgba(224, 139, 18, 0.15);
        }

        .send-request-btn {
          background-color: ${ACCENT};
          color: #ffffff;
          border: none;
          padding: 12px 32px;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }

        .send-request-btn:hover {
          background-color: #c9790e;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(224, 139, 18, 0.3);
        }

        .tailor-contact-banner {
          background-color: #FAF6f0;
          border-top: 1px solid #ebdcd0;
        }

        .contact-banner-text {
          font-size: 0.95rem;
          color: #777;
        }

        .contact-val {
          color: #0b1c39;
          font-size: 1.15rem;
        }

        .follow-us-text {
          font-size: 0.9rem;
          color: #888;
        }

        .social-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #333;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .social-circle:hover {
          background: ${ACCENT};
          color: #fff;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default TailorModePage;
