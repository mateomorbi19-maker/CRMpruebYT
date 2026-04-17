import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const conversations = await db.getConversations();
  const idx = conversations.findIndex((c) => c.id === id);
  if (idx === -1) return NextResponse.json({ ok: false }, { status: 404 });

  if (typeof body.botEnabled === "boolean") {
    conversations[idx].botEnabled = body.botEnabled;

    // Disparar webhook al agente para que apague/prenda el bot en su lógica.
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
            event: "bot_toggle",
            conversationId: id,
            phone: conversations[idx].phone,
            botEnabled: conversations[idx].botEnabled,
          }),
        });
      } catch {}
    }
  }

  if (body.unread === 0) conversations[idx].unread = 0;
  await db.saveConversations(conversations);
  return NextResponse.json({ ok: true, conversation: conversations[idx] });
}
