import { db } from "@/lib/db";
import ConversationsClient from "./ConversationsClient";

export default async function ConversationsPage() {
  const conversations = await db.getConversations();
  return <ConversationsClient initial={conversations} />;
}
