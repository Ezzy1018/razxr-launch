import { NextResponse } from "next/server";
import { buildPassport } from "@/lib/razxr-state";

export async function GET(
  _request: Request,
  context: { params: Promise<{ uid: string }> },
) {
  const { uid } = await context.params;
  const passport = buildPassport(uid);
  return NextResponse.json({ ok: true, data: passport });
}
