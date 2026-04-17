import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth.server";
import ConversationsClient from "./ConversationsClient";

export default async function ConversationsPage() {
  const [conversations, user] = await Promise.all([
    db.getConversations(),
    getCurrentUser(),
  ]);
  return (
    <ConversationsClient
      initial={conversations}
      userName={user?.name ?? "Operador"}
    />
  );
}
