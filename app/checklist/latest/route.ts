import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export async function GET() {
  try {
    // List alle blob-filer med prefix "checklists/"
    const { blobs } = await list({ prefix: "checklists/" });
    if (!blobs.length) {
      return NextResponse.json({ ok: true, data: null });
    }

    // Finn nyeste (sorter på uploadedAt)
    blobs.sort((a, b) => (a.uploadedAt! < b.uploadedAt! ? 1 : -1));
    const latest = blobs[0];

    // Bruk vanlig fetch for å hente JSON-innholdet
    const res = await fetch(latest.url);
    const data = await res.json();

    return NextResponse.json({
      ok: true,
      data,
      latest: { url: latest.url, pathname: latest.pathname },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: "LOAD_FAILED" },
      { status: 500 }
    );
  }
}
