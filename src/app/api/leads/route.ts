import { NextResponse } from "next/server";
import { insertLead } from "@/lib/db";
import { validateLead } from "@/lib/lead-validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 }); }
  const validation = validateLead(body);
  if (!validation.ok) return NextResponse.json({ error: validation.error }, { status: 400 });
  try {
    const lead = await insertLead(validation.lead);
    return NextResponse.json({ ok: true, id: lead.id, role: validation.lead.role });
  } catch {
    console.error("[api/leads] Lead could not be saved.");
    return NextResponse.json({ error: "Anfrage konnte nicht gespeichert werden. Bitte später erneut versuchen." }, { status: 500 });
  }
}
