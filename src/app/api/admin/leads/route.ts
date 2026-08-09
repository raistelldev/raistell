import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listLeads, type LeadRole } from "@/lib/db";

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
