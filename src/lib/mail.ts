import { Resend } from "resend";
import type { LeadRole } from "@/lib/db";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY is not set");
  }
  return new Resend(key);
}

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

function formatPayload(payload: Record<string, unknown>) {
  return Object.entries(payload)
    .filter(([, value]) => {
      if (value == null || value === "") return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    })
    .map(([key, value]) => {
      const display = Array.isArray(value) ? value.join(", ") : String(value);
      return `<tr>
        <td style="padding:6px 12px 6px 0;vertical-align:top;color:#555;white-space:nowrap;">${escapeHtml(key)}</td>
        <td style="padding:6px 0;vertical-align:top;color:#111;">${escapeHtml(display)}</td>
      </tr>`;
    })
    .join("");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendLeadEmails(input: {
  role: LeadRole;
  email: string;
  name: string;
  payload: Record<string, unknown>;
}) {
  const resend = getResend();
  const from = requireEnv("MAIL_FROM");
  const notifyTo = requireEnv("NOTIFICATION_EMAIL");
  const roleLabel = input.role === "firma" ? "Unternehmen" : "Creator";

  const notificationHtml = `
    <h2>Neue Anfrage (${roleLabel})</h2>
    <p><strong>${escapeHtml(input.name)}</strong> &lt;${escapeHtml(input.email)}&gt;</p>
    <table>${formatPayload(input.payload)}</table>
  `;

  const confirmationHtml =
    input.role === "firma"
      ? `
        <p>Hallo ${escapeHtml(input.name)},</p>
        <p>vielen Dank für Ihre Anfrage bei Raistell. Wir haben Ihre Daten erhalten.</p>
        <p>Bitte wählen Sie im nächsten Schritt einen Termin für Ihr kostenloses Erstgespräch.</p>
        <p>Viele Grüße<br/>Raistell</p>
      `
      : `
        <p>Hallo ${escapeHtml(input.name)},</p>
        <p>danke für deine Bewerbung bei Raistell. Wir haben deine Daten erhalten.</p>
        <p>Bitte wähle im nächsten Schritt einen Termin, damit wir dich kennenlernen können.</p>
        <p>Viele Grüße<br/>Raistell</p>
      `;

  const [notifyResult, confirmResult] = await Promise.all([
    resend.emails.send({
      from,
      to: notifyTo,
      replyTo: input.email,
      subject: `Neue ${roleLabel}-Anfrage: ${input.name}`,
      html: notificationHtml,
    }),
    resend.emails.send({
      from,
      to: input.email,
      subject:
        input.role === "firma"
          ? "Ihre Anfrage bei Raistell – bitte Termin wählen"
          : "Deine Bewerbung bei Raistell – bitte Termin wählen",
      html: confirmationHtml,
    }),
  ]);

  if (notifyResult.error) {
    throw new Error(`Notification mail failed: ${notifyResult.error.message}`);
  }
  if (confirmResult.error) {
    throw new Error(`Confirmation mail failed: ${confirmResult.error.message}`);
  }
}
