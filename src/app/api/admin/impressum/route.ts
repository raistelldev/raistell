import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getImpressum,
  saveImpressum,
  type ImpressumData,
} from "@/lib/db";

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

  let body: Partial<ImpressumData>;
  try {
    body = (await request.json()) as Partial<ImpressumData>;
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  try {
    const current = await getImpressum();
    const next: ImpressumData = {
      providerName: String(body.providerName ?? current.providerName),
      street: String(body.street ?? current.street),
      city: String(body.city ?? current.city),
      country: String(body.country ?? current.country),
      registerInfo: String(body.registerInfo ?? current.registerInfo),
      vatInfo: String(body.vatInfo ?? current.vatInfo),
      phone: String(body.phone ?? current.phone),
      email: String(body.email ?? current.email),
      euRepresentative: {
        name: String(
          body.euRepresentative?.name ?? current.euRepresentative.name,
        ),
        address: String(
          body.euRepresentative?.address ?? current.euRepresentative.address,
        ),
        email: String(
          body.euRepresentative?.email ?? current.euRepresentative.email,
        ),
      },
    };

    const impressum = await saveImpressum(next);
    return NextResponse.json({ ok: true, impressum });
  } catch (error) {
    console.error("[api/admin/impressum PUT]", error);
    return NextResponse.json(
      { error: "Impressum konnte nicht gespeichert werden." },
      { status: 500 },
    );
  }
}
