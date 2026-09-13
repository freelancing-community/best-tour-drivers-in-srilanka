/**
 * Sends a Brevo transactional email using a template ID and params.
 * Sender name/email come from the Brevo template settings (not from env).
 * @param {{ templateId: number, to: string, params: Record<string, string | number> }} options
 */
export async function sendTemplateEmail({ templateId, to, params }) {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not configured");
  }
  if (!templateId || Number.isNaN(Number(templateId))) {
    throw new Error("Valid Brevo templateId is required");
  }
  if (!to) {
    throw new Error("Recipient email is required");
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      to: [{ email: to }],
      templateId: Number(templateId),
      params,
    }),
  });

  if (!response.ok) {
    let details = "";
    try {
      const errorBody = await response.json();
      details = errorBody?.message || JSON.stringify(errorBody);
    } catch {
      details = await response.text();
    }
    throw new Error(`Brevo email failed (${response.status}): ${details}`);
  }

  return response.json();
}
