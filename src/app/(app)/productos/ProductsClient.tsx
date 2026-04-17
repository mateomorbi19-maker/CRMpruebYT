"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Search,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import type { Product } from "@/lib/types";
import { formatARS } from "@/lib/format";

type Draft = Pick<Product, "name" | "price" | "category" | "stock">;

export default function ProductsClient({ initial }: { initial: Product[] }) {
  const [products, setProducts] = useState(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>({
    name: "",
    price: 0,
    category: "",
    stock: 0,
  });
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products],
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return products
      .filter((p) => (cat === "all" ? true : p.category === cat))
      .filter(
        (p) =>
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products, query, cat]);

  function startEdit(p: Product) {
    setEditingId(p.id);
    setDraft({
      name: p.name,
      price: p.price,
      category: p.category,
      stock: p.stock,
    });
  }
  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (data.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? data.product : p)),
        );
        setEditingId(null);
      }
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("¿Eliminar este producto del catálogo del agente?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  async function createProduct() {
    if (!draft.name || draft.price <= 0) return;
    setSaving(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (data.ok) {
        setProducts((prev) => [...prev, data.product]);
        setCreating(false);
        setDraft({ name: "", price: 0, category: "", stock: 0 });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-brand-ink/50 text-sm">
            Edición directa. Los cambios se envían a la memoria del agente.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-ink/40"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar producto"
              className="input pl-9"
            />
          </div>
          <button
            onClick={() => {
              setCreating(true);
              setEditingId(null);
              setDraft({ name: "", price: 0, category: "", stock: 0 });
            }}
            className="btn-primary shrink-0"
          >
            <Plus size={16} /> <span className="hidden sm:inline">Nuevo</span>
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        <button
          onClick={() => setCat("all")}
          className={`px-3 py-1.5 rounded-xl text-sm border whitespace-nowrap ${
            cat === "all"
              ? "bg-brand-green text-white border-brand-green"
              : "border-brand-border text-brand-ink/70"
          }`}
        >
          Todas ({products.length})
        </button>
        {categories.map((c) => {
          const count = products.filter((p) => p.category === c).length;
          const active = cat === c;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-xl text-sm border whitespace-nowrap ${
                active
                  ? "bg-brand-green text-white border-brand-green"
                  : "border-brand-border text-brand-ink/70"
              }`}
            >
              {c} ({count})
            </button>
          );
        })}
      </div>

      {creating && (
        <div className="card p-4 mb-4 border-brand-green/40">
          <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_1fr_auto] items-center">
            <input
              autoFocus
              value={draft.name}
              onChange={(e) =>
                setDraft((d) => ({ ...d, name: e.target.value }))
              }
              placeholder="Nombre del producto"
              className="input"
            />
            <input
              value={draft.price || ""}
              onChange={(e) =>
                setDraft((d) => ({ ...d, price: Number(e.target.value) || 0 }))
              }
              placeholder="Precio (ARS)"
              type="number"
              className="input"
            />
            <input
              value={draft.category}
              onChange={(e) =>
                setDraft((d) => ({ ...d, category: e.target.value }))
              }
              placeholder="Categoría"
              className="input"
            />
            <input
              value={draft.stock}
              onChange={(e) =>
                setDraft((d) => ({ ...d, stock: Number(e.target.value) || 0 }))
              }
              placeholder="Stock"
              type="number"
              className="input"
            />
            <div className="flex gap-2">
              <button
                onClick={createProduct}
                disabled={saving}
                className="btn-primary"
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => setCreating(false)}
                className="btn-ghost"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 text-xs uppercase tracking-wider text-brand-ink/40 border-b border-brand-border">
          <div className="col-span-5">Producto</div>
          <div className="col-span-2">Categoría</div>
          <div className="col-span-2 text-right">Precio</div>
          <div className="col-span-1 text-right">Stock</div>
          <div className="col-span-2 text-right">Acciones</div>
        </div>
        <div className="divide-y divide-white/5">
          {filtered.length === 0 && (
            <div className="p-8 text-center text-brand-ink/40 text-sm">
              Sin productos en este filtro.
            </div>
          )}
          {filtered.map((p) => {
            const editing = editingId === p.id;
            return (
              <div
                key={p.id}
                className="px-4 sm:px-5 py-4 md:grid md:grid-cols-12 md:gap-4 flex flex-col gap-2 hover:bg-brand-paper/60 transition"
              >
                <div className="md:col-span-5">
                  {editing ? (
                    <input
                      value={draft.name}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, name: e.target.value }))
                      }
                      className="input"
                    />
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="font-medium text-sm sm:text-base">
                        {p.name}
                      </div>
                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          className="text-brand-ink/40 hover:text-brand-green shrink-0 mt-0.5"
                          aria-label="Ver en tienda"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  {editing ? (
                    <input
                      value={draft.category}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, category: e.target.value }))
                      }
                      className="input"
                    />
                  ) : (
                    <span className="chip">{p.category}</span>
                  )}
                </div>

                <div className="md:col-span-2 md:text-right">
                  {editing ? (
                    <input
                      type="number"
                      value={draft.price}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          price: Number(e.target.value) || 0,
                        }))
                      }
                      className="input md:text-right"
                    />
                  ) : (
                    <div>
                      <div className="md:hidden text-xs text-brand-ink/40 uppercase tracking-wider">
                        Precio
                      </div>
                      <div className="text-brand-green font-semibold">
                        {formatARS(p.price)}
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:col-span-1 md:text-right">
                  {editing ? (
                    <input
                      type="number"
                      value={draft.stock}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          stock: Number(e.target.value) || 0,
                        }))
                      }
                      className="input md:text-right"
                    />
                  ) : (
                    <div>
                      <div className="md:hidden text-xs text-brand-ink/40 uppercase tracking-wider">
                        Stock
                      </div>
                      <div
                        className={
                          p.stock > 0 ? "text-brand-ink" : "text-red-500"
                        }
                      >
                        {p.stock}
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 flex md:justify-end gap-2">
                  {editing ? (
                    <>
                      <button
                        onClick={() => saveEdit(p.id)}
                        disabled={saving}
                        className="btn-primary"
                      >
                        {saving ? (
                          <RefreshCw size={14} className="animate-spin" />
                        ) : (
                          <Check size={14} />
                        )}
                        <span className="hidden sm:inline">Guardar</span>
                      </button>
                      <button onClick={cancelEdit} className="btn-ghost">
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(p)}
                        className="btn-ghost"
                      >
                        <Pencil size={14} />
                        <span className="hidden sm:inline">Editar</span>
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="btn-ghost hover:!text-red-400 hover:!border-red-400/40"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-brand-ink/40 mt-4">
        Los cambios se notifican al agente vía{" "}
        <code className="text-brand-ink/60">AGENT_SYNC_WEBHOOK</code> para actualizar
        su memoria en tiempo real.
      </p>
    </div>
  );
}
