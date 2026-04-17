import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { Product } from "@/lib/types";

export async function GET() {
  return NextResponse.json(await db.getProducts());
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<Product>;
  if (!body.name || typeof body.price !== "number") {
    return NextResponse.json({ ok: false, error: "Datos inválidos" }, { status: 400 });
  }
  const products = await db.getProducts();
  const newProduct: Product = {
    id: `p${Date.now()}`,
    name: body.name,
    price: body.price,
    category: body.category ?? "Sin categoría",
    stock: body.stock ?? 0,
    url: body.url,
    updatedAt: new Date().toISOString(),
  };
  products.push(newProduct);
  await db.saveProducts(products);
  await notifyAgent("product_created", newProduct);
  return NextResponse.json({ ok: true, product: newProduct });
}

async function notifyAgent(event: string, payload: unknown) {
  const hook = process.env.AGENT_SYNC_WEBHOOK;
  if (!hook) return;
  try {
    await fetch(hook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.AGENT_SYNC_TOKEN
          ? { Authorization: `Bearer ${process.env.AGENT_SYNC_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({ event, payload }),
    });
  } catch {}
}
