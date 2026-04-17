"use client";

import { useMemo, useState } from "react";
import { Phone, Search, Tag } from "lucide-react";
import type { Contact, ContactStatus } from "@/lib/types";
import { formatARS, formatRelative } from "@/lib/format";

type Filter = "all" | "client" | "qualified_lead";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "client", label: "Clientes" },
  { id: "qualified_lead", label: "Leads calificados" },
];

const STATUS_LABEL: Record<ContactStatus, string> = {
  client: "Cliente",
  qualified_lead: "Lead calificado",
  lead: "Lead",
};

export default function ContactsClient({ contacts }: { contacts: Contact[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  const counts = useMemo(
    () => ({
      all: contacts.length,
      client: contacts.filter((c) => c.status === "client").length,
      qualified_lead: contacts.filter((c) => c.status === "qualified_lead")
        .length,
    }),
    [contacts],
  );

  const filtered = useMemo(() => {
    return contacts
      .filter((c) => (filter === "all" ? true : c.status === filter))
      .filter((c) => {
        const s = q.toLowerCase();
        return (
          !s ||
          c.name.toLowerCase().includes(s) ||
          c.phone.includes(s) ||
          c.tags.some((t) => t.toLowerCase().includes(s))
        );
      })
      .sort(
        (a, b) =>
          new Date(b.lastInteraction).getTime() -
          new Date(a.lastInteraction).getTime(),
      );
  }, [contacts, filter, q]);

  return (
    <div className="p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-ink">
            Contactos
          </h1>
          <p className="text-brand-ink/50 text-sm">
            Clientes y leads generados por el agente de WhatsApp.
          </p>
        </div>
        <div className="relative sm:w-80">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-ink/40"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar nombre, teléfono o tag"
            className="input pl-9"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-sm font-medium border transition flex items-center gap-2 ${
                active
                  ? "bg-brand-green text-white border-brand-green"
                  : "border-brand-border text-brand-ink/70 hover:border-brand-ink/30"
              }`}
            >
              {f.label}
              <span
                className={`text-xs rounded-full px-1.5 py-0.5 ${
                  active ? "bg-white/25" : "bg-brand-paper"
                }`}
              >
                {counts[f.id]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="card overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 text-xs uppercase tracking-wider text-brand-ink/40 border-b border-brand-border">
          <div className="col-span-4">Contacto</div>
          <div className="col-span-2">Estado</div>
          <div className="col-span-3">Tags</div>
          <div className="col-span-2 text-right">Gastado</div>
          <div className="col-span-1 text-right">Últ.</div>
        </div>
        <div className="divide-y divide-white/5">
          {filtered.length === 0 && (
            <div className="p-8 text-center text-brand-ink/40 text-sm">
              Sin contactos en este filtro.
            </div>
          )}
          {filtered.map((c) => (
            <div
              key={c.id}
              className="px-4 sm:px-5 py-4 md:grid md:grid-cols-12 md:gap-4 flex flex-col gap-2 hover:bg-brand-paper/60 transition"
            >
              <div className="md:col-span-4 flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-brand-paper border border-brand-border flex items-center justify-center font-semibold shrink-0 text-brand-ink">
                  {c.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate text-brand-ink">
                    {c.name}
                  </div>
                  <div className="text-xs text-brand-ink/50 flex items-center gap-1.5 truncate">
                    <Phone size={11} className="shrink-0" />
                    <span className="truncate">{c.phone}</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex items-center">
                <span
                  className={
                    c.status === "client"
                      ? "chip-green"
                      : c.status === "qualified_lead"
                        ? "chip-green"
                        : "chip"
                  }
                >
                  {STATUS_LABEL[c.status]}
                </span>
              </div>

              <div className="md:col-span-3 flex flex-wrap gap-1">
                {c.tags.map((t) => (
                  <span key={t} className="chip">
                    <Tag size={10} /> {t}
                  </span>
                ))}
              </div>

              <div className="md:col-span-2 md:text-right text-sm flex md:block items-center gap-2">
                <span className="md:hidden text-brand-ink/40 text-xs uppercase tracking-wider">
                  Gastado:
                </span>
                <span
                  className={
                    c.totalSpent > 0 ? "text-brand-green font-medium" : ""
                  }
                >
                  {formatARS(c.totalSpent)}
                </span>
              </div>

              <div className="md:col-span-1 md:text-right text-xs text-brand-ink/50">
                {formatRelative(c.lastInteraction)}
              </div>

              {c.notes && (
                <div className="md:col-span-12 text-xs text-brand-ink/60 md:pl-14 md:pt-2 md:border-t md:border-brand-border break-words">
                  <span className="text-brand-ink/40 uppercase tracking-wider mr-1">
                    Nota:
                  </span>
                  {c.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
