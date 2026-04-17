import { db } from "@/lib/db";
import ContactsClient from "./ContactsClient";

export default async function ContactsPage() {
  const contacts = await db.getContacts();
  return <ContactsClient contacts={contacts} />;
}
