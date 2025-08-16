import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // { items, issues }
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const pathname = `checklists/vidjeveien4-${stamp}.json`;

    const blob = await put(pathname, JSON.stringify(body, null, 2), {
      access: "public", // 👈 FIX: must be "public" with current SDK
      contentType: "application/json",
      addRandomSuffix: false,
    });

    return NextResponse.json({ ok: true, url: blob.url, pathname });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: "SAVE_FAILED" },
      { status: 500 }
    );
  }
}
