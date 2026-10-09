import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteWebSession } from "@/services/web-session.service";

export async function POST() {
  const store = await cookies();
  const token = store.get("__Secure-hexavante.session_token")?.value ?? store.get("hexavante.session_token")?.value;
  await deleteWebSession(token);
  const response = NextResponse.json({ success: true });
  response.cookies.delete("__Secure-hexavante.session_token");
  response.cookies.delete("hexavante.session_token");
  return response;
}
