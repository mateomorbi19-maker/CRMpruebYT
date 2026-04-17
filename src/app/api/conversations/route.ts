import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const conversations = await db.getConversations();
  return NextResponse.json(conversations);
}
