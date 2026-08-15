import postgres from "postgres";
import { site } from "@/config/site";

const globalForDb = globalThis as unknown as {
  sql: ReturnType<typeof postgres> | undefined;
  schemaReady: Promise<void> | undefined;
};

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  if (!globalForDb.sql) {
    globalForDb.sql = postgres(url, {
      max: 5,
      idle_timeout: 20,
      connect_timeout: 10,
    });
  }

  return globalForDb.sql;
}

export async function ensureSchema() {
  if (!globalForDb.schemaReady) {
    const sql = getSql();
    globalForDb.schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS leads (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          role TEXT NOT NULL CHECK (role IN ('firma', 'creator')),
          email TEXT NOT NULL,
          name TEXT NOT NULL,
          payload JSONB NOT NULL DEFAULT '{}'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC)`;
      await sql`CREATE INDEX IF NOT EXISTS leads_role_idx ON leads (role)`;
      await sql`CREATE INDEX IF NOT EXISTS leads_email_idx ON leads (email)`;

      await sql`
        CREATE TABLE IF NOT EXISTS site_settings (
          key TEXT PRIMARY KEY,
          value JSONB NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
    })();
  }

  await globalForDb.schemaReady;
}

/** @deprecated use ensureSchema */
export const ensureLeadsSchema = ensureSchema;

export type LeadRole = "firma" | "creator";

export type Lead = {
  id: string;
  role: LeadRole;
  email: string;
  name: string;
  payload: Record<string, unknown>;
  created_at: string;
};

export async function insertLead(input: {
  role: LeadRole;
  email: string;
  name: string;
  payload: Record<string, unknown>;
}) {
  await ensureSchema();
  const sql = getSql();

  const [row] = await sql<{ id: string }[]>`
    INSERT INTO leads (role, email, name, payload)
    VALUES (
      ${input.role},
      ${input.email},
      ${input.name},
      ${sql.json(input.payload as never)}
    )
    RETURNING id
  `;

  return row;
}

export async function listLeads(role?: LeadRole) {
  await ensureSchema();
  const sql = getSql();

  if (role) {
    return sql<Lead[]>`
      SELECT id, role, email, name, payload, created_at
      FROM leads
      WHERE role = ${role}
      ORDER BY created_at DESC
    `;
  }

  return sql<Lead[]>`
    SELECT id, role, email, name, payload, created_at
    FROM leads
    ORDER BY created_at DESC
  `;
}

export async function listLeadsByIds(ids: string[]) {
  await ensureSchema();
  if (ids.length === 0) return [] as Lead[];
  const sql = getSql();

  return sql<Lead[]>`
    SELECT id, role, email, name, payload, created_at
    FROM leads
    WHERE id IN ${sql(ids)}
    ORDER BY created_at DESC
  `;
}

export async function deleteLeadsByIds(ids: string[]) {
  await ensureSchema();
  if (ids.length === 0) return 0;
  const sql = getSql();

  const rows = await sql<{ id: string }[]>`
    DELETE FROM leads
    WHERE id IN ${sql(ids)}
    RETURNING id
  `;

  return rows.length;
}

export type ImpressumData = {
  text: string;
};

export function defaultImpressum(): ImpressumData {
  const lines = [
    "Diensteanbieter",
    "",
    site.legal.providerName,
    site.legal.street,
    site.legal.city,
    site.legal.country,
    "",
    "Kontakt",
    "",
    `E-Mail: ${site.contact.email}`,
  ];
  if (site.contact.phone) {
    lines.push(`Telefon: ${site.contact.phone}`);
  }
  return { text: lines.join("\n") };
}

function normalizeImpressum(raw: unknown): ImpressumData {
  const base = defaultImpressum();
  if (!raw || typeof raw !== "object") return base;
  const data = raw as Record<string, unknown>;

  if (typeof data.text === "string") {
    return { text: data.text };
  }

  // Altes strukturiertes Format → Freitext
  const providerName = String(data.providerName ?? "");
  const street = String(data.street ?? "");
  const city = String(data.city ?? "");
  const country = String(data.country ?? "");
  const email = String(data.email ?? "");
  const phone = String(data.phone ?? "");
  if (providerName || street || city || country || email || phone) {
    return {
      text: [
        "Diensteanbieter",
        "",
        providerName,
        street,
        city,
        country,
        "",
        "Kontakt",
        "",
        email ? `E-Mail: ${email}` : null,
        phone ? `Telefon: ${phone}` : null,
      ]
        .filter((line): line is string => line !== null)
        .join("\n"),
    };
  }

  return base;
}

export async function getImpressum() {
  try {
    await ensureSchema();
    const sql = getSql();
    const rows = await sql<{ value: unknown }[]>`
      SELECT value FROM site_settings WHERE key = 'impressum' LIMIT 1
    `;
    if (rows.length === 0) return defaultImpressum();
    return normalizeImpressum(rows[0].value);
  } catch (error) {
    console.error("[getImpressum]", error);
    return defaultImpressum();
  }
}

export async function saveImpressum(data: ImpressumData) {
  await ensureSchema();
  const sql = getSql();
  const value = normalizeImpressum(data);

  await sql`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES ('impressum', ${sql.json(value as never)}, now())
    ON CONFLICT (key) DO UPDATE
    SET value = EXCLUDED.value, updated_at = now()
  `;

  return value;
}
