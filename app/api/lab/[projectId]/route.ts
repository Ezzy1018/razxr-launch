import { NextResponse } from "next/server";
import { getRazxrUid } from "@/lib/cookies";
import { getProjectSession } from "@/lib/razxr-state";

export async function GET(
  _request: Request,
  context: { params: Promise<{ projectId: string }> },
) {
  const uid = await getRazxrUid();
  if (!uid) {
    return NextResponse.json({ ok: false, error: "Missing session" }, { status: 401 });
  }

  const { projectId } = await context.params;
  const result = getProjectSession(uid, projectId);
  if (!result) {
    return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, data: result });
}
