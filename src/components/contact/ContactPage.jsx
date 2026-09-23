"use client";
import React, { useState } from "react";
import Newslatter from "@/components/common/Newslatter";
import { showErrorAlert, showSuccessAlert } from "@/lib/alert";

const ACCENT = "#F6A824";

const contactCards = [
  {
    label: "WhatsApp/Voice",
    value: "+94 762 205 763",
    href: "https://wa.me/94743801833",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    label: "Email Now",
    value: "besttourdriversinsrilanka@gmail.com",
    href: "mailto:besttourdriversinsrilanka@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
      </svg>
    ),
  },
  {
    label: "Location",
    value: "No:11, Siri Niwasa Mawatha, Kalutara North, Sri Lanka.",
    href: "https://maps.google.com/?q=11+Siri+Niwasa+Mawatha,+Kalutara+North,+Sri+Lanka",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.4" />
      </svg>
    ),
  },
  {
    label: "Business Hours",
    value: "Open 24 Hours | 7 Days",
    href: null,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </svg>
    ),
  },
];

const agents = [
  {
    country: "Australia",
    name: "Tharindu Wijesinghe",
    address: "14, Blackman Avenue, Mill Park, Melbourne, Australia",
    phone: "+61 450 483 244",
    wa: "61450483244",
    img: "/images/Rectangle 66.png",
  },
  {
    country: "United Kingdom",
    name: "Tharindu Wijesinghe",
    address: "22, King’s Road, Chelsea, London, United Kingdom",
    phone: "+44 7700 900244",
    wa: "447700900244",
    img: "/images/Rectangle 66 (1).png",
  },
  {
    country: "Italy",
    name: "Tharindu Wijesinghe",
    address: "14, Blackman Avenue, Mill Park, Melbourne, Australia",
    phone: "+61 450 483 244",
    wa: "61450483244",
    img: "/images/Rectangle 66 (2).png",
  },
];

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <path
      fill={ACCENT}
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
    />
  </svg>
);

const ContactPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    email: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          guestName: form.name,
          guestPhone: form.whatsapp,
          guestEmail: form.email,
          message: form.message,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to send message");
      }

      await showSuccessAlert(
        "Message received",
        "Thank you. Our team will get back to you shortly."
      );
      setForm({ name: "", whatsapp: "", email: "", message: "" });
    } catch (error) {
      showErrorAlert(
        "Unable to send message",
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-us-brand">
      <section className="cu-contact-section">
        <div className="container">
          <div className="row g-4 g-xl-5 align-items-stretch">
            <div className="col-lg-5">
              <div className="cu-info-list">
                {contactCards.map((card) => (
                  <article key={card.label} className="cu-info-card">
                    <span className="cu-info-label">{card.label}</span>
                    <div className="cu-info-body">
                      <div className="cu-info-icon">{card.icon}</div>
                      {card.href ? (
                        <a href={card.href} target={card.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                          {card.value}
                        </a>
                      ) : (
                        <p>{card.value}</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="col-lg-7">
              <div className="cu-form-card">
                <h3>Get In Touch With Us</h3>
                <p>
                  Have a question about our tours or need help planning your Sri Lanka trip?
                  Send us a message and our team will get back to you shortly.
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label htmlFor="cu-name">Your Name*</label>
                      <input
                        id="cu-name"
                        type="text"
                        name="name"
                        placeholder="Your name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="cu-whatsapp">WhatsApp Number*</label>
                      <input
                        id="cu-whatsapp"
                        type="tel"
                        name="whatsapp"
                        placeholder="WhatsApp number"
                        value={form.whatsapp}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="cu-email">Email*</label>
                      <input
                        id="cu-email"
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="cu-message">Write your Message*</label>
                      <textarea
                        id="cu-message"
                        name="message"
                        rows={6}
                        placeholder="What’s on your mind"
                        value={form.message}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="cu-submit" disabled={submitting}>
                        {submitting ? "Sending..." : "Submit"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cu-agents-section">
        <div className="container">
          <h2>Worldwide Agents of Drivers in Sri Lanka</h2>
          <div className="row g-4 justify-content-center">
            {agents.map((agent) => (
              <div key={agent.country} className="col-lg-4 col-md-6">
                <article className="cu-agent-card">
                  <h5>{agent.country}</h5>
                  <div className="cu-agent-photo">
                    <img src={agent.img} alt={`${agent.name} — ${agent.country}`} />
                  </div>
                  <div className="cu-agent-body">
                    <h4>{agent.name}</h4>
                    <p>{agent.address}</p>
                    <a className="cu-agent-wa" href={`https://wa.me/${agent.wa}`} target="_blank" rel="noreferrer">
                      <WhatsAppIcon />
                      <span>{agent.phone}</span>
                    </a>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cu-map-section">
        <div className="container">
          <div className="cu-map-frame">
            <iframe
              title="Drivers in Sri Lanka location"
              src="https://maps.google.com/maps?q=11%20Siri%20Niwasa%20Mawatha%2C%20Kalutara%20North%2C%20Sri%20Lanka&z=13&output=embed"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <Newslatter />

      <style jsx global>{`
        .contact-us-brand {
          background: #fff;
        }
        .cu-contact-section {
          padding: 90px 0 40px;
        }
        .cu-info-list {
          display: flex;
          flex-direction: column;
          gap: 28px;
          height: 100%;
        }
        .cu-info-card {
          position: relative;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 10px 30px rgba(16, 12, 8, 0.07);
          padding: 28px 24px 24px;
        }
        .cu-info-label {
          position: absolute;
          top: -10px;
          left: 28px;
          background: #fff;
          padding: 0 10px;
          color: ${ACCENT};
          font-family: var(--font-rubik);
          font-size: 14px;
          font-weight: 600;
          line-height: 1;
        }
        .cu-info-body {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .cu-info-icon {
          width: 48px;
          height: 48px;
          min-width: 48px;
          border-radius: 50%;
          border: 1.5px solid ${ACCENT};
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
        }
        .cu-info-icon svg {
          width: 22px;
          height: 22px;
        }
        .cu-info-body a,
        .cu-info-body p {
          margin: 0;
          color: #0a1019;
          font-family: var(--font-rubik);
          font-size: 16px;
          font-weight: 600;
          line-height: 1.45;
          word-break: break-word;
        }
        .cu-info-body a:hover {
          color: ${ACCENT};
        }
        .cu-form-card {
          background: #fdf3e4;
          border-radius: 16px;
          padding: 42px 40px;
          height: 100%;
        }
        .cu-form-card h3 {
          font-family: var(--font-rubik);
          font-size: 30px;
          font-weight: 700;
          color: #0a1019;
          margin-bottom: 10px;
        }
        .cu-form-card > p {
          font-family: var(--font-rubik);
          font-size: 14px;
          color: #5e5e5e;
          line-height: 1.6;
          margin-bottom: 28px;
        }
        .cu-form-card label {
          display: block;
          color: ${ACCENT};
          font-family: var(--font-rubik);
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .cu-form-card input,
        .cu-form-card textarea {
          width: 100%;
          border: none;
          outline: none;
          background: #fff;
          border-radius: 10px;
          font-family: var(--font-rubik);
          font-size: 14px;
          color: #0a1019;
          padding: 14px 16px;
        }
        .cu-form-card input {
          height: 52px;
        }
        .cu-form-card textarea {
          min-height: 150px;
          resize: vertical;
        }
        .cu-form-card input::placeholder,
        .cu-form-card textarea::placeholder {
          color: #9a9a9a;
        }
        .cu-submit {
          border: none;
          background: ${ACCENT};
          color: #fff;
          font-family: var(--font-rubik);
          font-size: 16px;
          font-weight: 600;
          border-radius: 10px;
          padding: 14px 42px;
          cursor: pointer;
          transition: 0.3s;
        }
        .cu-submit:hover {
          background: #d8901b;
          color: #fff;
        }
        .cu-agents-section {
          padding: 70px 0 40px;
        }
        .cu-agents-section h2 {
          text-align: center;
          font-family: var(--font-rubik);
          font-size: 36px;
          font-weight: 700;
          color: #0a1019;
          margin-bottom: 40px;
          line-height: 1.25;
        }
        .cu-agent-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(16, 12, 8, 0.08);
          overflow: hidden;
          height: 100%;
          padding-top: 18px;
        }
        .cu-agent-card h5 {
          text-align: center;
          font-family: var(--font-rubik);
          font-size: 18px;
          font-weight: 700;
          color: #0a1019;
          margin-bottom: 14px;
        }
        .cu-agent-photo {
          width: 100%;
          height: 280px;
          overflow: hidden;
          background: #7ec8d3;
        }
        .cu-agent-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
        }
        .cu-agent-body {
          padding: 22px 20px 26px;
          text-align: center;
        }
        .cu-agent-body h4 {
          font-family: var(--font-rubik);
          font-size: 20px;
          font-weight: 700;
          color: ${ACCENT};
          margin-bottom: 10px;
        }
        .cu-agent-body p {
          font-family: var(--font-rubik);
          font-size: 14px;
          color: #6b6b6b;
          line-height: 1.55;
          margin-bottom: 16px;
        }
        .cu-agent-wa {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: ${ACCENT};
          font-family: var(--font-rubik);
          font-size: 16px;
          font-weight: 600;
        }
        .cu-agent-wa:hover {
          color: #d8901b;
        }
        .cu-map-section {
          padding: 20px 0 70px;
        }
        .cu-map-frame {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(16, 12, 8, 0.08);
        }
        .cu-map-frame iframe {
          width: 100%;
          min-height: 420px;
          border: 0;
          display: block;
        }
        @media (max-width: 1199px) {
          .cu-form-card {
            padding: 32px 24px;
          }
          .cu-agents-section h2 {
            font-size: 32px;
          }
        }
        @media (max-width: 991px) {
          .cu-contact-section {
            padding: 60px 0 20px;
          }
          .cu-form-card h3 {
            font-size: 26px;
          }
          .cu-agents-section {
            padding: 50px 0 20px;
          }
          .cu-agents-section h2 {
            font-size: 28px;
          }
          .cu-map-frame iframe {
            min-height: 340px;
          }
        }
        @media (max-width: 767px) {
          .cu-contact-section {
            padding: 40px 0 10px;
          }
          .cu-info-card {
            padding: 24px 16px 20px;
          }
          .cu-info-body a,
          .cu-info-body p {
            font-size: 15px;
          }
          .cu-form-card {
            padding: 28px 18px;
          }
          .cu-agents-section h2 {
            font-size: 24px;
            margin-bottom: 28px;
          }
          .cu-agent-photo {
            height: 260px;
          }
          .cu-map-section {
            padding: 10px 0 50px;
          }
          .cu-map-frame iframe {
            min-height: 280px;
          }
        }
        @media (max-width: 575px) {
          .cu-info-icon {
            width: 42px;
            height: 42px;
            min-width: 42px;
          }
          .cu-submit {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
