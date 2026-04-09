import { NextResponse } from "next/server";
import { getRazxrUid } from "@/lib/cookies";

export async function GET() {
  const uid = await getRazxrUid();
  return NextResponse.json({ ok: true, data: { uid } });
}
