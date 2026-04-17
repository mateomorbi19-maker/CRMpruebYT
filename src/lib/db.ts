import { promises as fs } from "node:fs";
import path from "node:path";
import type { Contact, Conversation, Product } from "./types";

const DATA_DIR = path.join(process.cwd(), "src", "data");

async function read<T>(file: string): Promise<T> {
  const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
  return JSON.parse(raw) as T;
}

async function write<T>(file: string, data: T): Promise<void> {
  await fs.writeFile(
    path.join(DATA_DIR, file),
    JSON.stringify(data, null, 2),
    "utf8",
  );
}

export const db = {
  async getProducts(): Promise<Product[]> {
    return read<Product[]>("products.json");
  },
  async saveProducts(products: Product[]): Promise<void> {
    await write("products.json", products);
  },
  async getContacts(): Promise<Contact[]> {
    return read<Contact[]>("contacts.json");
  },
  async getConversations(): Promise<Conversation[]> {
    return read<Conversation[]>("conversations.json");
  },
  async saveConversations(conversations: Conversation[]): Promise<void> {
    await write("conversations.json", conversations);
  },
};
