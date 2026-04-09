import { NextResponse } from "next/server";
import { listDebugChallenges } from "@/lib/razxr-state";

export async function GET() {
  return NextResponse.json({ ok: true, data: { challenges: listDebugChallenges() } });
}
