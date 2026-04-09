import { NextResponse } from "next/server";
import { getRazxrUid } from "@/lib/cookies";
import { getAssessmentQuestions, submitAssessment } from "@/lib/razxr-state";
import type { AssessmentAnswer } from "@/types";

export async function GET() {
  return NextResponse.json({ ok: true, data: { questions: getAssessmentQuestions() } });
}

export async function POST(request: Request) {
  const uid = await getRazxrUid();
  if (!uid) {
    return NextResponse.json({ ok: false, error: "Missing session" }, { status: 401 });
  }

  const body = (await request.json()) as { answers?: AssessmentAnswer[] };
  const result = submitAssessment(uid, body.answers ?? []);

  return NextResponse.json({ ok: true, data: result });
}
