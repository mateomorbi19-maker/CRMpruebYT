"use client";

import { useMemo, useState } from "react";
import { Bot, BotOff, Search, ArrowLeft, Phone } from "lucide-react";
import type { Conversation } from "@/lib/types";
import { formatRelative, formatTime } from "@/lib/format";

export default function ConversationsClient({
  initial,
}: {
  initial: Conversation[];
}) {
  const [list, setList] = useState(initial);
  const [selectedId, setSelectedId] = useState<string | null>(
    initial[0]?.id ?? null,
  );
  const [query, setQuery] = useState("");
  const [toggling, setToggling] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return list
      .filter(
        (c) =>
          c.contactName.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.preview.toLowerCase().includes(q),
      )
      .sort(
        (a, b) =>
          new Date(b.lastMessageAt).getTime() -
          new Date(a.lastMessageAt).getTime(),
      );
  }, [list, query]);

  const selected = list.find((c) => c.id === selectedId) ?? null;

  async function toggleBot(id: string) {
    const current = list.find((c) => c.id === id);
    if (!current) return;
    const next = !current.botEnabled;
    setToggling(id);
    setList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, botEnabled: next } : c)),
    );
    try {
      await fetch(`/api/conversations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botEnabled: next }),
      });
    } finally {
      setToggling(null);
    }
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] lg:h-screen flex">
      {/* Lista */}
      <div
        className={`${selected ? "hidden md:flex" : "flex"} flex-col w-full md:w-96 border-r border-white/5 bg-brand-night/60`}
      >
        <div className="p-4 border-b border-white/5">
          <h2 className="text-lg font-semibold mb-3">Conversaciones</h2>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, teléfono o mensaje"
              className="input pl-9"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <div className="p-6 text-center text-white/40 text-sm">
              Sin resultados.
            </div>
          )}
          {filtered.map((c) => {
            const active = c.id === selectedId;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/5 transition flex gap-3 ${
                  active ? "bg-brand-green/10 border-l-2 border-l-brand-green" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-semibold shrink-0">
                  {c.contactName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">
                      {c.contactName}
                    </span>
                    <span className="ml-auto text-xs text-white/40 shrink-0">
                      {formatRelative(c.lastMessageAt)}
                    </span>
                  </div>
                  <div className="text-xs text-white/50 truncate mt-0.5">
                    {c.preview}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span
                      className={
                        c.botEnabled ? "chip-green" : "chip text-white/40"
                      }
                    >
                      {c.botEnabled ? <Bot size={12} /> : <BotOff size={12} />}
                      {c.botEnabled ? "Bot activo" : "Bot pausado"}
                    </span>
                    {c.unread > 0 && (
                      <span className="ml-auto text-[10px] bg-brand-green text-black rounded-full px-1.5 py-0.5 font-bold">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat */}
      <div
        className={`${selected ? "flex" : "hidden md:flex"} flex-col flex-1 min-w-0`}
      >
        {!selected ? (
          <div className="flex-1 flex items-center justify-center text-white/40 text-sm">
            Seleccioná una conversación.
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-brand-night/60">
              <button
                onClick={() => setSelectedId(null)}
                className="md:hidden text-white/70"
                aria-label="Volver"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="w-10 h-10 rounded-full bg-brand-green text-black font-bold flex items-center justify-center">
                {selected.contactName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">
                  {selected.contactName}
                </div>
                <div className="text-xs text-white/50 truncate flex items-center gap-1.5">
                  <Phone size={11} /> {selected.phone}
                </div>
              </div>

              <button
                onClick={() => toggleBot(selected.id)}
                disabled={toggling === selected.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-medium transition ${
                  selected.botEnabled
                    ? "border-brand-green/40 bg-brand-green/15 text-brand-greenSoft"
                    : "border-white/10 text-white/60 hover:border-white/20"
                }`}
                title={
                  selected.botEnabled
                    ? "Pausar el bot en este chat"
                    : "Activar el bot en este chat"
                }
              >
                {selected.botEnabled ? <Bot size={16} /> : <BotOff size={16} />}
                <span className="hidden sm:inline">
                  {selected.botEnabled ? "Bot activo" : "Bot pausado"}
                </span>
                <span
                  className={`relative inline-block w-9 h-5 rounded-full transition ${
                    selected.botEnabled ? "bg-brand-green" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 ${
                      selected.botEnabled ? "left-4" : "left-0.5"
                    } w-4 h-4 rounded-full bg-white transition-all`}
                  />
                </span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-brand-black">
              {selected.messages.map((m) => {
                const isClient = m.from === "client";
                const isMateo = m.from === "mateo";
                return (
                  <div
                    key={m.id}
                    className={`flex ${isClient ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                        isClient
                          ? "bg-white/10 text-white"
                          : isMateo
                            ? "bg-white text-black"
                            : "bg-brand-green text-black"
                      }`}
                    >
                      {!isClient && (
                        <div className="text-[10px] uppercase tracking-wider opacity-70 mb-0.5">
                          {isMateo ? "Mateo" : "Agente IA"}
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{m.text}</div>
                      <div className="text-[10px] opacity-60 text-right mt-1">
                        {formatTime(m.at)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-4 py-3 border-t border-white/5 bg-brand-night/60 text-xs text-white/50">
              Este es un panel de monitoreo. Los mensajes los envía el agente
              de WhatsApp de Ready Golf.
              {!selected.botEnabled && (
                <span className="text-brand-greenSoft">
                  {" "}
                  · Bot pausado en este chat, podés responder desde WhatsApp.
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
