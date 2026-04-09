import { NextResponse } from "next/server";
import { getRazxrUid } from "@/lib/cookies";
import { submitDebugAttempt } from "@/lib/razxr-state";

export async function POST(
  request: Request,
  context: { params: Promise<{ challengeId: string }> },
) {
  const uid = await getRazxrUid();
  if (!uid) {
    return NextResponse.json({ ok: false, error: "Missing session" }, { status: 401 });
  }

  const { challengeId } = await context.params;
  const body = (await request.json()) as {
    fixedCode?: string;
    explanation?: string;
    timeTakenS?: number;
  };

  const result = submitDebugAttempt(uid, {
    challengeId,
    fixedCode: body.fixedCode ?? "",
    explanation: body.explanation ?? "",
    timeTakenS: body.timeTakenS ?? 0,
  });

  if (!result) {
    return NextResponse.json({ ok: false, error: "Submit failed" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, data: result });
}
