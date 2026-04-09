import { NextResponse } from "next/server";
import { getRazxrUid } from "@/lib/cookies";
import { getDashboard } from "@/lib/razxr-state";

export async function GET() {
  const uid = await getRazxrUid();
  if (!uid) {
    return NextResponse.json({ ok: false, error: "Missing session" }, { status: 401 });
  }

  return NextResponse.json({ ok: true, data: getDashboard(uid) });
}
