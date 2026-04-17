import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth.server";
import type { Message } from "@/lib/types";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = await req.json();
  const text: string = (body?.text ?? "").toString().trim();
  const pauseBot: boolean = !!body?.pauseBot;

  if (!text) {
    return NextResponse.json({ ok: false, error: "Texto vacío" }, { status: 400 });
  }

  const conversations = await db.getConversations();
  const idx = conversations.findIndex((c) => c.id === id);
  if (idx === -1) {
    return NextResponse.json({ ok: false, error: "No existe" }, { status: 404 });
  }

  const message: Message = {
    id: `m${Date.now()}`,
    from: "operator",
    operatorName: user.name,
    text,
    at: new Date().toISOString(),
  };

  const conv = conversations[idx];
  conv.messages.push(message);
  conv.preview = text;
  conv.lastMessageAt = message.at;
  conv.unread = 0;
  if (pauseBot) conv.botEnabled = false;
  conversations[idx] = conv;
  await db.saveConversations(conversations);

  const hook = process.env.AGENT_SYNC_WEBHOOK;
  if (hook) {
    try {
      await fetch(hook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.AGENT_SYNC_TOKEN
            ? { Authorization: `Bearer ${process.env.AGENT_SYNC_TOKEN}` }
            : {}),
        },
        body: JSON.stringify({
          event: "operator_message",
          conversationId: id,
          phone: conv.phone,
          operator: user.name,
          text,
          pauseBot,
          botEnabled: conv.botEnabled,
          at: message.at,
        }),
      });
    } catch {}
  }

  return NextResponse.json({ ok: true, message, conversation: conv });
}
