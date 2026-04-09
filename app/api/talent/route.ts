import { NextResponse } from "next/server";
import { listTalent } from "@/lib/razxr-state";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level");
  const track = searchParams.get("track");
  const minScoreValue = searchParams.get("minScore");
  const minScore = minScoreValue ? Number(minScoreValue) : null;

  const data = listTalent({
    level,
    track,
    minScore: Number.isFinite(minScore) ? minScore : null,
  });

  return NextResponse.json({ ok: true, data });
}
