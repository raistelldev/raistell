import postgres from "postgres";

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

export async function ensureLeadsSchema() {
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
    })();
  }

  await globalForDb.schemaReady;
}

export type LeadRole = "firma" | "creator";

export async function insertLead(input: {
  role: LeadRole;
  email: string;
  name: string;
  payload: Record<string, unknown>;
}) {
  await ensureLeadsSchema();
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
