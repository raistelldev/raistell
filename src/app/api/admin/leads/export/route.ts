import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { csvCell } from "@/lib/csv";
import {
  listLeads,
  listLeadsByIds,
  type Lead,
  type LeadRole,
} from "@/lib/db";

export const runtime = "nodejs";

function payloadSummary(payload: Record<string, unknown>) {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(payload)) {
    if (value == null || value === "") continue;
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      parts.push(`${key}: ${value.join("; ")}`);
    } else {
      parts.push(`${key}: ${String(value)}`);
    }
  }
  return parts.join(" | ");
}

function leadsToCsv(leads: Lead[]) {
  const header = ["id", "role", "name", "email", "created_at", "collaboration_started_at", "retention_expires_at", "details"];
  const rows = leads.map((lead) => [
    lead.id,
    lead.role,
    lead.name,
    lead.email,
    new Date(lead.created_at).toISOString(),
    lead.collaboration_started_at ? new Date(lead.collaboration_started_at).toISOString() : "",
    lead.retention_expires_at ? new Date(lead.retention_expires_at).toISOString() : "",
    payloadSummary(lead.payload ?? {}),
  ]);

  return [header, ...rows]
    .map((cols) => cols.map((c) => csvCell(String(c))).join(","))
    .join("\n");
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }
  const body = input as Record<string, unknown>;

  const mode = body.mode;
  if (
    mode !== "all" &&
    mode !== "firma" &&
    mode !== "creator" &&
    mode !== "selected"
  ) {
    return NextResponse.json({ error: "Ungültiger Export-Modus." }, { status: 400 });
  }

  try {
    let leads: Lead[];
    if (mode === "selected") {
      const ids = Array.isArray(body.ids)
        ? body.ids.filter((id): id is string => typeof id === "string")
        : [];
      if (ids.length === 0) {
        return NextResponse.json(
          { error: "Keine Einträge ausgewählt." },
          { status: 400 },
        );
      }
      leads = await listLeadsByIds(ids);
    } else if (mode === "all") {
      leads = await listLeads();
    } else {
      leads = await listLeads(mode as LeadRole);
    }

    const csv = leadsToCsv(leads);
    const stamp = new Date().toISOString().slice(0, 10);
    const filename = `raistell-leads-${mode}-${stamp}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("[api/admin/leads/export]", error);
    return NextResponse.json(
      { error: "Export fehlgeschlagen." },
      { status: 500 },
    );
  }
}
