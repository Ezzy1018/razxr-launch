import { NextResponse } from "next/server";
import { buildSolidAtsResume } from "@/lib/hero-resume-fixer";
import type { HeroResumeFixRequest } from "@/types";

export const runtime = "nodejs";

const MIN_TEXT_LENGTH = 80;
const MAX_TEXT_LENGTH = 12000;

export async function POST(request: Request) {
  const body = (await request.json()) as HeroResumeFixRequest;

  const resumeText = body.resumeText?.trim() ?? "";
  const jobDescription = body.jobDescription?.trim() ?? "";

  if (!resumeText || !jobDescription) {
    return NextResponse.json(
      { ok: false, error: "resumeText and jobDescription are required." },
      { status: 400 },
    );
  }

  if (resumeText.length < MIN_TEXT_LENGTH || jobDescription.length < MIN_TEXT_LENGTH) {
    return NextResponse.json(
      { ok: false, error: "Provide richer resume/job description content (80+ chars each)." },
      { status: 400 },
    );
  }

  if (resumeText.length > MAX_TEXT_LENGTH || jobDescription.length > MAX_TEXT_LENGTH) {
    return NextResponse.json(
      { ok: false, error: "Input too long. Keep each field under 12,000 characters." },
      { status: 400 },
    );
  }

  const data = await buildSolidAtsResume({ resumeText, jobDescription });
  return NextResponse.json({ ok: true, data });
}