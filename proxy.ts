import { NextResponse, type NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { RAZXR_UID_COOKIE } from "@/types";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const hasUid = request.cookies.has(RAZXR_UID_COOKIE);

  if (!hasUid) {
    response.cookies.set({
      name: RAZXR_UID_COOKIE,
      value: uuidv4(),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: ONE_YEAR_SECONDS,
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
