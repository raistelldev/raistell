import { NextResponse } from "next/server";
import {
  adminCookieOptions,
  checkAdminPassword,
  createAdminSessionToken,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { password?: string };

  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const password = typeof body.password === "string" ? body.password : "";
  if (!checkAdminPassword(password)) {
    return NextResponse.json({ error: "Falsches Passwort." }, { status: 401 });
  }

  if (!process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json(
      { error: "ADMIN_SESSION_SECRET fehlt in der Server-Konfiguration." },
      { status: 500 },
    );
  }

  const token = createAdminSessionToken();
  const response = NextResponse.json({ ok: true });
  const cookie = adminCookieOptions(token);
  response.cookies.set(cookie.name, cookie.value, cookie);
  return response;
}
