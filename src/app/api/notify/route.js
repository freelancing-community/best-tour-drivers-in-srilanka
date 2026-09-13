import { NextResponse } from "next/server";
import toursData from "@/data/tours.json";
import { sendTemplateEmail } from "@/lib/brevo";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TEMPLATE_ENV_BY_TYPE = {
  booking: "TOUR_BOOKING_CONFIRMATION_TEMPLATE_ID",
  inquiry: "INQUIRY_NOTIFICATION_TEMPLATE_ID",
  contact: "CONTACT_NOTIFICATION_TEMPLATE_ID",
  tailor: "TAILOR_MODE_NOTIFICATION_TEMPLATE_ID",
};

const SUCCESS_MESSAGE_BY_TYPE = {
  booking: "Booking request sent successfully",
  inquiry: "Inquiry sent successfully",
  contact: "Contact message sent successfully",
  tailor: "Tailor-made request sent successfully",
};

function isPlaceholder(value) {
  return !value || value.includes("your_") || value.includes("_here");
}

function missingConfig(type) {
  const required = ["BREVO_API_KEY", "OWNER_EMAIL", TEMPLATE_ENV_BY_TYPE[type]];
  return required.filter((key) => isPlaceholder(process.env[key]));
}

function badRequest(message) {
  return NextResponse.json({ success: false, message }, { status: 400 });
}

function textOrFallback(value, fallback = "Not specified") {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function formatArrivalDeparture(date, hour, minute, amPm) {
  const safeDate = textOrFallback(date);
  const safeHour = hour && hour !== "Select" ? hour : null;
  const safeMinute = minute && minute !== "Select" ? minute : null;
  if (!safeHour || !safeMinute) {
    return `${safeDate}, time not specified`;
  }
  return `${safeDate}, ${safeHour}:${safeMinute} ${amPm || "AM"}`;
}

function buildPreferredCommunication(whatsApp, email) {
  const channels = [];
  if (whatsApp) channels.push("WhatsApp");
  if (email) channels.push("Email");
  return channels.length ? channels.join(" & ") : "Not specified";
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const {
    type,
    tourId,
    guestName,
    guestEmail,
    guestPhone,
    date,
    time,
    ticketCount,
    message,
    // tailor-mode fields
    firstName,
    lastName,
    phoneCode,
    phoneNumber,
    communicationWhatsApp,
    communicationEmail,
    country,
    adults,
    children,
    infants,
    arrivalDate,
    arrivalHour,
    arrivalMinute,
    arrivalAmPm,
    departureDate,
    departureHour,
    departureMinute,
    departureAmPm,
    currency,
    arrangeAccommodation,
    hasTourPlan,
    specialRequests,
  } = body || {};

  if (!type || !TEMPLATE_ENV_BY_TYPE[type]) {
    return badRequest('type must be "booking", "inquiry", "contact", or "tailor"');
  }

  let templateId;
  let params;

  if (type === "booking" || type === "inquiry") {
    if (!tourId || typeof tourId !== "string") {
      return badRequest("tourId is required");
    }

    const name = typeof guestName === "string" ? guestName.trim() : "";
    const email = typeof guestEmail === "string" ? guestEmail.trim() : "";
    const phone = typeof guestPhone === "string" ? guestPhone.trim() : "";

    if (!name) return badRequest("guestName is required");
    if (!email) return badRequest("guestEmail is required");
    if (!EMAIL_REGEX.test(email)) return badRequest("guestEmail is invalid");
    if (!phone) return badRequest("guestPhone is required");

    const tour = toursData.find((item) => item.id === tourId);
    if (!tour) {
      return NextResponse.json(
        { success: false, message: "Tour not found" },
        { status: 404 }
      );
    }

    const tourTitle = tour.title || "Tour";
    const priceFrom = tour.details?.price_from || tour.price || "N/A";

    if (type === "booking") {
      if (!date || typeof date !== "string" || !date.trim()) {
        return badRequest("date is required for booking");
      }

      const tickets = Number(ticketCount);
      if (!Number.isFinite(tickets) || tickets < 1) {
        return badRequest("ticketCount must be a number greater than or equal to 1");
      }

      templateId = process.env.TOUR_BOOKING_CONFIRMATION_TEMPLATE_ID;
      params = {
        guest_name: name,
        guest_phone: phone,
        guest_email: email,
        tour_title: tourTitle,
        tour_id: tourId,
        tour_date: date.trim(),
        tour_time: typeof time === "string" && time.trim() ? time.trim() : "Not specified",
        ticket_count: String(tickets),
        price_from: priceFrom,
      };
    } else {
      const inquiryMessage = typeof message === "string" ? message.trim() : "";
      if (!inquiryMessage) {
        return badRequest("message is required for inquiry");
      }

      templateId = process.env.INQUIRY_NOTIFICATION_TEMPLATE_ID;
      params = {
        guest_name: name,
        guest_phone: phone,
        guest_email: email,
        message: inquiryMessage,
        tour_title: tourTitle,
        tour_id: tourId,
      };
    }
  } else if (type === "contact") {
    const name = typeof guestName === "string" ? guestName.trim() : "";
    const email = typeof guestEmail === "string" ? guestEmail.trim() : "";
    const phone = typeof guestPhone === "string" ? guestPhone.trim() : "";
    const contactMessage = typeof message === "string" ? message.trim() : "";

    if (!name) return badRequest("guestName is required");
    if (!email) return badRequest("guestEmail is required");
    if (!EMAIL_REGEX.test(email)) return badRequest("guestEmail is invalid");
    if (!phone) return badRequest("guestPhone is required");
    if (!contactMessage) return badRequest("message is required");

    templateId = process.env.CONTACT_NOTIFICATION_TEMPLATE_ID;
    params = {
      guest_name: name,
      guest_phone: phone,
      guest_email: email,
      message: contactMessage,
    };
  } else {
    // tailor
    const first = typeof firstName === "string" ? firstName.trim() : "";
    const last = typeof lastName === "string" ? lastName.trim() : "";
    const email = typeof guestEmail === "string" ? guestEmail.trim() : "";
    const code = typeof phoneCode === "string" ? phoneCode.trim() : "";
    const number = typeof phoneNumber === "string" ? phoneNumber.trim() : "";

    if (!first) return badRequest("firstName is required");
    if (!last) return badRequest("lastName is required");
    if (!email) return badRequest("guestEmail is required");
    if (!EMAIL_REGEX.test(email)) return badRequest("guestEmail is invalid");
    if (!code || !number) return badRequest("phoneCode and phoneNumber are required");
    if (!communicationWhatsApp && !communicationEmail) {
      return badRequest("Select at least one preferred communication method");
    }

    const adultsCount = Number(adults);
    if (!Number.isFinite(adultsCount) || adultsCount < 1) {
      return badRequest("adults must be a number greater than or equal to 1");
    }

    if (!arrivalDate || typeof arrivalDate !== "string" || !arrivalDate.trim()) {
      return badRequest("arrivalDate is required");
    }
    if (!departureDate || typeof departureDate !== "string" || !departureDate.trim()) {
      return badRequest("departureDate is required");
    }

    templateId = process.env.TAILOR_MODE_NOTIFICATION_TEMPLATE_ID;
    params = {
      guest_name: `${first} ${last}`,
      guest_phone: `${code} ${number}`,
      guest_email: email,
      preferred_communication: buildPreferredCommunication(
        Boolean(communicationWhatsApp),
        Boolean(communicationEmail)
      ),
      country: textOrFallback(country),
      travelers: `Adults ${adultsCount}, Children ${textOrFallback(String(children ?? "0"), "0")}, Infants ${textOrFallback(String(infants ?? "0"), "0")}`,
      arrival: formatArrivalDeparture(arrivalDate, arrivalHour, arrivalMinute, arrivalAmPm),
      departure: formatArrivalDeparture(departureDate, departureHour, departureMinute, departureAmPm),
      currency: textOrFallback(currency, "USD"),
      arrange_accommodation: textOrFallback(arrangeAccommodation, "No"),
      has_tour_plan: textOrFallback(hasTourPlan, "No"),
      special_requests: textOrFallback(specialRequests, "None"),
    };
  }

  const configGaps = missingConfig(type);
  if (configGaps.length > 0) {
    return NextResponse.json(
      {
        success: false,
        message: `Email service is not configured. Missing: ${configGaps.join(", ")}`,
      },
      { status: 500 }
    );
  }

  try {
    await sendTemplateEmail({
      templateId: Number(templateId),
      to: process.env.OWNER_EMAIL,
      params,
    });

    return NextResponse.json({
      success: true,
      message: SUCCESS_MESSAGE_BY_TYPE[type],
    });
  } catch (error) {
    console.error("Notify API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to send notification email",
      },
      { status: 502 }
    );
  }
}
