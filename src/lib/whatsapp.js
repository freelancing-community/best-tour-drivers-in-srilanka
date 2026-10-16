/**
 * Sends a WhatsApp Cloud API template message to the owner.
 * Used for tour booking alerts only.
 */

function isPlaceholder(value) {
  return !value || value.includes("your_") || value.includes("_here");
}

function truncateText(value, maxLength = 200) {
  const text = String(value || "").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

export function isWhatsAppBookingConfigured() {
  return ![
    "WHATSAPP_ACCESS_TOKEN",
    "WHATSAPP_PHONE_NUMBER_ID",
    "WHATSAPP_OWNER_NUMBER",
    "WHATSAPP_BOOKING_TEMPLATE_NAME",
  ].some((key) => isPlaceholder(process.env[key]));
}

/**
 * @param {{
 *   guestName: string,
 *   guestPhone: string,
 *   guestEmail: string,
 *   tourTitle: string,
 *   tourDate: string,
 *   tourTime: string,
 *   ticketCount: string | number,
 *   priceFrom: string,
 * }} booking
 */
export async function sendBookingWhatsAppAlert(booking) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const ownerNumber = process.env.WHATSAPP_OWNER_NUMBER;
  const templateName = process.env.WHATSAPP_BOOKING_TEMPLATE_NAME || "tour_booking_alert";
  const languageCode = process.env.WHATSAPP_TEMPLATE_LANGUAGE || "en";
  const apiVersion = process.env.WHATSAPP_API_VERSION || "v25.0";

  if (!isWhatsAppBookingConfigured()) {
    throw new Error("WhatsApp booking alert is not configured");
  }

  const guestContact = `${booking.guestPhone} / ${booking.guestEmail}`;
  const travelDetails = `${booking.tourDate}, ${booking.tourTime}, ${booking.ticketCount} tickets, from ${booking.priceFrom}`;

  const bodyParameters = [
    truncateText(booking.guestName, 60),
    truncateText(guestContact, 120),
    truncateText(booking.tourTitle, 80),
    truncateText(travelDetails, 160),
  ].map((text) => ({ type: "text", text }));

  const response = await fetch(
    `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: ownerNumber.replace(/\D/g, ""),
        type: "template",
        template: {
          name: templateName,
          language: { code: languageCode },
          components: [
            {
              type: "body",
              parameters: bodyParameters,
            },
          ],
        },
      }),
    }
  );

  if (!response.ok) {
    let details = "";
    try {
      const errorBody = await response.json();
      details = errorBody?.error?.message || JSON.stringify(errorBody);
    } catch {
      details = await response.text();
    }
    throw new Error(`WhatsApp message failed (${response.status}): ${details}`);
  }

  return response.json();
}
