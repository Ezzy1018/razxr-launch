import { cookies } from "next/headers";
import { RAZXR_UID_COOKIE } from "@/types";

export async function getRazxrUid(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(RAZXR_UID_COOKIE)?.value ?? null;
}

export async function requireRazxrUid(): Promise<string> {
  const uid = await getRazxrUid();
  if (!uid) {
    throw new Error("Missing anonymous session cookie");
  }
  return uid;
}
