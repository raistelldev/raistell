import { test } from "node:test";
import assert from "node:assert/strict";
import { getRetentionExpiresAt, isRetentionCleanupEnabled, runLeadRetention } from "../src/lib/lead-retention.mjs";

test("six calendar months keep UTC time and the precise expiry boundary", () => {
  const expires = getRetentionExpiresAt("2026-09-24T10:11:12.345Z", null);
  assert.equal(expires, "2027-03-24T10:11:12.345Z");
  const boundary = Date.parse(expires);
  assert.equal(boundary <= Date.parse("2027-03-24T10:11:12.344Z"), false);
  assert.equal(boundary <= Date.parse("2027-03-24T10:11:12.345Z"), true);
});

test("month-end expiry clamps to February including leap years", () => {
  assert.equal(getRetentionExpiresAt("2023-08-31T23:59:59.999Z", null), "2024-02-29T23:59:59.999Z");
  assert.equal(getRetentionExpiresAt("2024-08-31T23:59:59.999Z", null), "2025-02-28T23:59:59.999Z");
  assert.equal(getRetentionExpiresAt("2026-03-31T12:00:00.000Z", null), "2026-09-30T12:00:00.000Z");
});

test("expiry uses the UTC receipt date across offsets and daylight-saving changes", () => {
  assert.equal(getRetentionExpiresAt("2026-03-29T03:30:00+02:00", null), "2026-09-29T01:30:00.000Z");
  assert.equal(getRetentionExpiresAt("2026-09-01T00:30:00+02:00", null), "2027-02-28T22:30:00.000Z");
});

test("established collaborations are excluded without extending the original receipt date", () => {
  const received = "2026-01-31T12:00:00Z";
  assert.equal(getRetentionExpiresAt(received, "2026-02-10T12:00:00Z"), null);
  assert.equal(getRetentionExpiresAt(received, null), "2026-07-31T12:00:00.000Z");
});

test("invalid receipt dates fail visibly", () => {
  assert.throws(() => getRetentionExpiresAt("not a timestamp", null), TypeError);
});

test("cleanup needs an exact activation value and production context", () => {
  assert.equal(isRetentionCleanupEnabled({ LEAD_RETENTION_ENABLED: "true", CONTEXT: "production" }), true);
  for (const flag of [undefined, "", "false", "TRUE", "1", " true", "true "]) {
    assert.equal(isRetentionCleanupEnabled({ LEAD_RETENTION_ENABLED: flag, CONTEXT: "production" }), false);
  }
  for (const context of [undefined, "", "dev", "deploy-preview", "branch-deploy", "Production"]) {
    assert.equal(isRetentionCleanupEnabled({ LEAD_RETENTION_ENABLED: "true", CONTEXT: context }), false);
  }
});

test("paused and non-production jobs never open a database connection", async () => {
  for (const environment of [{}, { LEAD_RETENTION_ENABLED: "true", CONTEXT: "deploy-preview" }, { CONTEXT: "production" }]) {
    const result = await runLeadRetention(environment, () => { assert.fail("Database connection must stay closed"); });
    assert.deepEqual(result, { enabled: false, deleted: 0 });
  }
});

test("active job returns only a count and closes its pool", async () => {
  let ended = false;
  const sql = async () => ({ count: 3 });
  sql.end = async () => { ended = true; };
  const result = await runLeadRetention({ LEAD_RETENTION_ENABLED: "true", CONTEXT: "production" }, () => sql);
  assert.deepEqual(result, { enabled: true, deleted: 3 });
  assert.equal(ended, true);
});

test("failed cleanup still closes its pool and propagates failure", async () => {
  let ended = false;
  const sql = async () => { throw new Error("Simulated database failure"); };
  sql.end = async () => { ended = true; };
  await assert.rejects(runLeadRetention({ LEAD_RETENTION_ENABLED: "true", CONTEXT: "production" }, () => sql), /Simulated database failure/);
  assert.equal(ended, true);
});
