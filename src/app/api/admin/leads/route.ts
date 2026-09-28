import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteLeadsByIds, listLeads, setLeadCollaboration, type LeadRole } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const roleParam = searchParams.get("role");
  const role =
    roleParam === "firma" || roleParam === "creator"
      ? (roleParam as LeadRole)
      : undefined;

  try {
    const leads = await listLeads(role);
    return NextResponse.json({
      leads,
      retention: {
        automaticDeletionEnabled:
          process.env.LEAD_RETENTION_ENABLED === "true" &&
          process.env.CONTEXT === "production",
      },
    });
  } catch (error) {
    console.error("[api/admin/leads]", error);
    return NextResponse.json(
      { error: "Leads konnten nicht geladen werden." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Ungültige Statusänderung." }, { status: 400 });
  }
  const { id, hasCollaboration } = body as Record<string, unknown>;
  if (
    typeof id !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) ||
    typeof hasCollaboration !== "boolean"
  ) {
    return NextResponse.json({ error: "Ungültige Statusänderung." }, { status: 400 });
  }

  try {
    const lead = await setLeadCollaboration(id, hasCollaboration);
    if (!lead) {
      return NextResponse.json({ error: "Eintrag nicht gefunden." }, { status: 404 });
    }
    return NextResponse.json({ lead });
  } catch {
    console.error("[api/admin/leads PATCH] Collaboration status could not be saved.");
    return NextResponse.json({ error: "Status konnte nicht gespeichert werden." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { ids?: unknown };
    const ids = Array.isArray(body.ids)
      ? body.ids.filter((id): id is string => typeof id === "string" && id.length > 0)
      : [];

    if (ids.length === 0) {
      return NextResponse.json(
        { error: "Keine Einträge ausgewählt." },
        { status: 400 },
      );
    }

    const deleted = await deleteLeadsByIds(ids);
    return NextResponse.json({ deleted });
  } catch (error) {
    console.error("[api/admin/leads DELETE]", error);
    return NextResponse.json(
      { error: "Löschen fehlgeschlagen." },
      { status: 500 },
    );
  }
}
