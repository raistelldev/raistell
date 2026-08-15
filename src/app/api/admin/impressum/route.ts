import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getImpressum, saveImpressum } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const impressum = await getImpressum();
    return NextResponse.json({ impressum });
  } catch (error) {
    console.error("[api/admin/impressum GET]", error);
    return NextResponse.json(
      { error: "Impressum konnte nicht geladen werden." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { text?: unknown };
  try {
    body = (await request.json()) as { text?: unknown };
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (typeof body.text !== "string") {
    return NextResponse.json(
      { error: "Text ist erforderlich." },
      { status: 400 },
    );
  }

  try {
    const impressum = await saveImpressum({ text: body.text });
    return NextResponse.json({ ok: true, impressum });
  } catch (error) {
    console.error("[api/admin/impressum PUT]", error);
    return NextResponse.json(
      { error: "Impressum konnte nicht gespeichert werden." },
      { status: 500 },
    );
  }
}
