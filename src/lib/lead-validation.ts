export type ValidatedLead = {
  role: "firma" | "creator";
  email: string;
  name: string;
  payload: Record<string, unknown>;
};

type ValidationResult = { ok: true; lead: ValidatedLead } | { ok: false; error: string };
const stringValue = (value: unknown) => typeof value === "string" ? value.trim() : "";
const arrayValue = (value: unknown): string[] => Array.isArray(value)
  ? [...new Set(value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean))]
  : [];

export function validateLead(input: unknown): ValidationResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { ok: false, error: "Ungültige Anfrage." };
  const body = input as Record<string, unknown>;
  const role = body.role;
  if (role !== "firma" && role !== "creator") return { ok: false, error: "Ungültige Rolle." };
  const email = stringValue(body.email);
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Bitte eine gültige E-Mail-Adresse angeben." };
  if (body.consent !== "on" && body.consent !== true) return { ok: false, error: "Bitte bestätigen Sie den Datenschutzhinweis." };
  const name = stringValue(role === "firma" ? body.contact : body.name);
  if (!name) return { ok: false, error: "Bitte einen Namen angeben." };

  const payload: Record<string, unknown> = { consent: true };
  const fields = role === "firma"
    ? ["company", "contact", "phone", "region", "industry", "budget", "message"]
    : ["name", "profileUrl", "collaborationType", "phone", "region", "reach", "topic", "about", "price"];
  for (const key of fields) {
    const value = stringValue(body[key]);
    const maxLength = key === "message" || key === "about" ? 4000 : 500;
    if (value.length > maxLength) return { ok: false, error: "Eine Angabe ist zu lang. Bitte kürzen Sie Ihre Eingabe." };
    if (value) payload[key] = value;
  }

  if (role === "firma") {
    if (!payload.company) return { ok: false, error: "Bitte das Unternehmen oder seine Website angeben." };
    const seeking = arrayValue(body.seeking);
    if (seeking.length === 0) return { ok: false, error: "Bitte den geplanten Einsatz wählen – auch ‚Noch offen‘ ist möglich." };
    if (seeking.length > 10 || seeking.some((item) => item.length > 200)) return { ok: false, error: "Ungültige Auswahl zum geplanten Einsatz." };
    payload.seeking = seeking;
  } else {
    if (!payload.region) return { ok: false, error: "Bitte deinen Ort oder deine Region angeben." };
    try {
      const url = new URL(stringValue(body.profileUrl));
      if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw new Error("invalid URL");
    } catch {
      return { ok: false, error: "Bitte einen vollständigen Profil- oder Portfolio-Link mit https:// angeben." };
    }
    const collaborationType = stringValue(body.collaborationType);
    if (!["produktion", "veroeffentlichung", "beides"].includes(collaborationType)) return { ok: false, error: "Bitte die gewünschte Zusammenarbeit wählen." };
    const platforms = arrayValue(body.platforms);
    if (collaborationType !== "produktion" && platforms.length === 0) return { ok: false, error: "Bitte für Veröffentlichungen mindestens eine Plattform wählen." };
    if (platforms.length > 10 || platforms.some((item) => item.length > 100)) return { ok: false, error: "Ungültige Plattformauswahl." };
    payload.platforms = platforms;
  }
  return { ok: true, lead: { role, name, email, payload } };
}
