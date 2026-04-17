export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  url?: string;
  updatedAt: string;
};

export type ContactStatus = "lead" | "qualified_lead" | "client";

export type Contact = {
  id: string;
  name: string;
  phone: string;
  status: ContactStatus;
  tags: string[];
  lastInteraction: string;
  totalSpent: number;
  notes?: string;
};

export type MessageFrom = "bot" | "client" | "operator";

export type Message = {
  id: string;
  from: MessageFrom;
  text: string;
  at: string;
  operatorName?: string;
};

export type Conversation = {
  id: string;
  contactId: string;
  contactName: string;
  phone: string;
  status: ContactStatus;
  botEnabled: boolean;
  unread: number;
  lastMessageAt: string;
  preview: string;
  messages: Message[];
};
