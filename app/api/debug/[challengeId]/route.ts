import { NextResponse } from "next/server";
import { getDebugChallenge } from "@/lib/razxr-state";

export async function GET(
  _request: Request,
  context: { params: Promise<{ challengeId: string }> },
) {
  const { challengeId } = await context.params;
  const challenge = getDebugChallenge(challengeId);

  if (!challenge) {
    return NextResponse.json({ ok: false, error: "Challenge not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, data: challenge });
}
