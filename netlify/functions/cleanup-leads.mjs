import postgres from "postgres";
import { runLeadRetention } from "../../src/lib/lead-retention.mjs";

export default async function cleanupLeads() {
  const result = await runLeadRetention(process.env, () => {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set for lead retention");
    return postgres(url, {
      max: 1,
      connect_timeout: 10,
      idle_timeout: 5,
      connection: { statement_timeout: 15000 },
    });
  });

  // Counts only: never log submitted data or connection credentials.
  console.info("[lead-retention]", result.enabled ? { deleted: result.deleted } : { paused: true });
}

// Netlify schedules this only on published deploys; it has no public HTTP URL.
// Cleanup still stays paused until LEAD_RETENTION_ENABLED is exactly "true".
export const config = { schedule: "0 3 * * *" };
