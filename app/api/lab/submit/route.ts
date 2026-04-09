import { NextResponse } from "next/server";
import { getRazxrUid } from "@/lib/cookies";
import { submitProjectWork } from "@/lib/razxr-state";

export async function POST(request: Request) {
  const uid = await getRazxrUid();
  if (!uid) {
    return NextResponse.json({ ok: false, error: "Missing session" }, { status: 401 });
  }

  const body = (await request.json()) as {
    projectId?: string;
    ticketId?: string;
    files?: Record<string, string>;
    notes?: string;
  };

  if (!body.projectId || !body.ticketId) {
    return NextResponse.json({ ok: false, error: "Missing projectId or ticketId" }, { status: 400 });
  }

  const result = await submitProjectWork(uid, {
    projectId: body.projectId,
    ticketId: body.ticketId,
    files: body.files ?? {},
    notes: body.notes,
  });

  if (!result) {
    return NextResponse.json({ ok: false, error: "Submission failed" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, data: result });
}
