import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteLeadsByIds, listLeads, type LeadRole } from "@/lib/db";

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
    return NextResponse.json({ leads });
  } catch (error) {
    console.error("[api/admin/leads]", error);
    return NextResponse.json(
      { error: "Leads konnten nicht geladen werden." },
      { status: 500 },
    );
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
