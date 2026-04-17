import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, USERS } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  if (!USERS.find((u) => u.id === userId)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(AUTH_COOKIE);
  return res;
}
