import { NextResponse } from "next/server";
import { analyzeAtsFit } from "@/lib/hero-space";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    resumeText?: string;
    jobDescription?: string;
  };

  const resumeText = body.resumeText?.trim() ?? "";
  const jobDescription = body.jobDescription?.trim() ?? "";

  if (!resumeText || !jobDescription) {
    return NextResponse.json(
      { ok: false, error: "resumeText and jobDescription are required" },
      { status: 400 },
    );
  }

  if (resumeText.length < 80 || jobDescription.length < 80) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please provide richer inputs (at least 80 characters each).",
      },
      { status: 400 },
    );
  }

  const analysis = await analyzeAtsFit({ resumeText, jobDescription });
  return NextResponse.json({ ok: true, data: analysis });
}