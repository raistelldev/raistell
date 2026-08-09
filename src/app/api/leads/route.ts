import { NextResponse } from "next/server";
import { insertLead, type LeadRole } from "@/lib/db";

export const runtime = "nodejs";

type LeadBody = {
  role?: string;
  [key: string]: unknown;
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let body: LeadBody;

  try {
    body = (await request.json()) as LeadBody;
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const role = body.role;
  if (role !== "firma" && role !== "creator") {
    return NextResponse.json({ error: "Ungültige Rolle." }, { status: 400 });
  }

  const email = asString(body.email);
  if (!email || !isEmail(email)) {
    return NextResponse.json(
      { error: "Bitte eine gültige E-Mail angeben." },
      { status: 400 },
    );
  }

  const name =
    role === "firma"
      ? asString(body.contact) || asString(body.company)
      : asString(body.name);

  if (!name) {
    return NextResponse.json(
      { error: "Bitte einen Namen angeben." },
      { status: 400 },
    );
  }

  if (role === "creator") {
    const platforms = asStringArray(body.platforms);
    if (platforms.length === 0) {
      return NextResponse.json(
        { error: "Bitte mindestens eine Plattform wählen." },
        { status: 400 },
      );
    }
  }

  const payload: Record<string, unknown> = { ...body };
  delete payload.role;

  if (role === "creator") {
    payload.platforms = asStringArray(body.platforms);
  } else {
    payload.seeking = asStringArray(body.seeking);
  }

  try {
    const lead = await insertLead({
      role: role as LeadRole,
      email,
      name,
      payload,
    });

    return NextResponse.json({
      ok: true,
      id: lead.id,
      name,
      email,
      role,
    });
  } catch (error) {
    console.error("[api/leads]", error);
    return NextResponse.json(
      {
        error:
          "Anfrage konnte nicht gespeichert werden. Bitte später erneut versuchen.",
      },
      { status: 500 },
    );
  }
}
