import { NextResponse } from "next/server";
import { list, get } from "@vercel/blob";

export async function GET() {
  try {
    // List all saved checklists
    const { blobs } = await list({ prefix: "checklists/" });
    if (!blobs.length) return NextResponse.json({ ok: true, data: null });

    // Sort by creation date descending (latest first)
    blobs.sort((a, b) => (a.uploadedAt! < b.uploadedAt! ? 1 : -1));
    const latest = blobs[0];

    // Fetch the file contents
    const res = await fetch(latest.url);
    const data = await res.json();

    return NextResponse.json({ ok: true, data, latest: { url: latest.url, pathname: latest.pathname } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "LOAD_FAILED" }, { status: 500 });
  }
}

