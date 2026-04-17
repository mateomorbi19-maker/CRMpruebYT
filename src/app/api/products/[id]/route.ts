import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const products = await db.getProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) {
    return NextResponse.json({ ok: false, error: "No existe" }, { status: 404 });
  }
  const updated = {
    ...products[idx],
    ...(typeof body.name === "string" ? { name: body.name } : {}),
    ...(typeof body.price === "number" ? { price: body.price } : {}),
    ...(typeof body.category === "string" ? { category: body.category } : {}),
    ...(typeof body.stock === "number" ? { stock: body.stock } : {}),
    updatedAt: new Date().toISOString(),
  };
  products[idx] = updated;
  await db.saveProducts(products);
  await notifyAgent("product_updated", updated);
  return NextResponse.json({ ok: true, product: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const products = await db.getProducts();
  const next = products.filter((p) => p.id !== id);
  await db.saveProducts(next);
  await notifyAgent("product_deleted", { id });
  return NextResponse.json({ ok: true });
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
