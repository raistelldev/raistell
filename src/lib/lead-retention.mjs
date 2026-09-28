/**
 * Six calendar months from receipt, in UTC. A missing day in the target month
 * is clamped to its last day, matching PostgreSQL's interval '6 months'.
 *
 * @param {string | Date} createdAt
 * @param {string | Date | null} collaborationStartedAt
 * @returns {string | null}
 */
export function getRetentionExpiresAt(createdAt, collaborationStartedAt) {
  if (collaborationStartedAt !== null) return null;
  const received = new Date(createdAt);
  if (!Number.isFinite(received.getTime())) throw new TypeError("Invalid lead receipt date");

  const expiry = new Date(received);
  const day = expiry.getUTCDate();
  expiry.setUTCDate(1);
  expiry.setUTCMonth(expiry.getUTCMonth() + 6);
  const monthEnd = new Date(expiry);
  monthEnd.setUTCMonth(monthEnd.getUTCMonth() + 1, 0);
  expiry.setUTCDate(Math.min(day, monthEnd.getUTCDate()));
  return expiry.toISOString();
}

/** @param {{ LEAD_RETENTION_ENABLED?: string, CONTEXT?: string }} environment */
export function isRetentionCleanupEnabled(environment) {
  return environment.LEAD_RETENTION_ENABLED === "true" && environment.CONTEXT === "production";
}

/**
 * Only called by the scheduled function after its activation checks. The single
 * DELETE rechecks collaboration status and expiry atomically; no HTTP route
 * invokes this function. Timestamp arithmetic is independent of DB timezone.
 *
 * @param {import("postgres").Sql} sql
 * @returns {Promise<number>}
 */
export async function cleanupExpiredLeads(sql) {
  const result = await sql`
    DELETE FROM leads
    WHERE collaboration_started_at IS NULL
      AND (((created_at AT TIME ZONE 'UTC') + INTERVAL '6 months') AT TIME ZONE 'UTC') <= now()
  `;
  return result.count;
}

/**
 * A paused or non-production invocation never opens a database connection.
 * The job owns its pool and always closes it, including after a failed delete.
 *
 * @param {{ LEAD_RETENTION_ENABLED?: string, CONTEXT?: string }} environment
 * @param {() => import("postgres").Sql} openSql
 * @returns {Promise<{ enabled: boolean, deleted: number }>}
 */
export async function runLeadRetention(environment, openSql) {
  if (!isRetentionCleanupEnabled(environment)) return { enabled: false, deleted: 0 };
  const sql = openSql();
  try {
    return { enabled: true, deleted: await cleanupExpiredLeads(sql) };
  } finally {
    await sql.end({ timeout: 5 });
  }
}
