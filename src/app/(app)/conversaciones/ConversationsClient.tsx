"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  BotOff,
  Search,
  ArrowLeft,
  Phone,
  Send,
  Loader2,
} from "lucide-react";
import type { Conversation } from "@/lib/types";
import { formatRelative, formatTime } from "@/lib/format";

export default function ConversationsClient({
  initial,
  userName,
}: {
  initial: Conversation[];
  userName: string;
}) {
  const [list, setList] = useState(initial);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [toggling, setToggling] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    if (mq.matches && selectedId === null && initial[0]) {
      setSelectedId(initial[0].id);
    }
  }, [initial, selectedId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedId, selected?.messages.length]);

  useEffect(() => {
    setDraft("");
    textareaRef.current?.focus();
  }, [selectedId]);

  async function sendMessage(pauseBot = false) {
    if (!selected) return;
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    const optimistic = {
      id: `tmp${Date.now()}`,
      from: "operator" as const,
      operatorName: userName,
      text,
      at: new Date().toISOString(),
    };
    setList((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? {
              ...c,
              messages: [...c.messages, optimistic],
              preview: text,
              lastMessageAt: optimistic.at,
              botEnabled: pauseBot ? false : c.botEnabled,
            }
          : c,
      ),
    );
    setDraft("");
    try {
      const res = await fetch(`/api/conversations/${selected.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, pauseBot }),
      });
      const data = await res.json();
      if (data.ok) {
        setList((prev) =>
          prev.map((c) => (c.id === selected.id ? data.conversation : c)),
        );
      }
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(false);
    }
  }

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
    <div className="h-[calc(100dvh-3.5rem)] lg:h-screen flex bg-brand-white overflow-hidden">
      {/* Lista */}
      <div
        className={`${selected ? "hidden md:flex" : "flex"} flex-col w-full md:w-96 border-r border-brand-border bg-brand-paper`}
      >
        <div className="p-4 border-b border-brand-border">
          <h2 className="text-lg font-semibold text-brand-ink mb-3">
            Conversaciones
          </h2>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-ink/40"
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
            <div className="p-6 text-center text-brand-ink/40 text-sm">
              Sin resultados.
            </div>
          )}
          {filtered.map((c) => {
            const active = c.id === selectedId;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full text-left px-4 py-3 border-b border-brand-border hover:bg-white transition flex gap-3 ${
                  active
                    ? "bg-white border-l-4 border-l-brand-green"
                    : "border-l-4 border-l-transparent"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-brand-paper border border-brand-border flex items-center justify-center font-semibold shrink-0 text-brand-ink">
                  {c.contactName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate text-brand-ink">
                      {c.contactName}
                    </span>
                    <span className="ml-auto text-xs text-brand-ink/40 shrink-0">
                      {formatRelative(c.lastMessageAt)}
                    </span>
                  </div>
                  <div className="text-xs text-brand-ink/55 truncate mt-0.5">
                    {c.preview}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={c.botEnabled ? "chip-green" : "chip"}>
                      {c.botEnabled ? <Bot size={12} /> : <BotOff size={12} />}
                      {c.botEnabled ? "Bot activo" : "Bot pausado"}
                    </span>
                    {c.unread > 0 && (
                      <span className="ml-auto text-[10px] bg-brand-green text-white rounded-full px-1.5 py-0.5 font-bold">
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
        className={`${selected ? "flex" : "hidden md:flex"} flex-col flex-1 min-w-0 bg-brand-white`}
      >
        {!selected ? (
          <div className="flex-1 flex items-center justify-center text-brand-ink/40 text-sm">
            Seleccioná una conversación.
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 border-b border-brand-border bg-brand-white">
              <button
                onClick={() => setSelectedId(null)}
                className="md:hidden p-1 -ml-1 text-brand-ink/70 shrink-0"
                aria-label="Volver"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-green text-white font-bold flex items-center justify-center shrink-0">
                {selected.contactName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate text-brand-ink text-sm sm:text-base">
                  {selected.contactName}
                </div>
                <div className="text-[11px] sm:text-xs text-brand-ink/55 truncate flex items-center gap-1">
                  <Phone size={10} /> {selected.phone}
                </div>
              </div>

              <button
                onClick={() => toggleBot(selected.id)}
                disabled={toggling === selected.id}
                className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl sm:border text-sm font-medium transition shrink-0 ${
                  selected.botEnabled
                    ? "sm:border-brand-green/40 sm:bg-brand-greenTint text-brand-green"
                    : "sm:border-brand-border text-brand-ink/60 sm:bg-brand-paper"
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
                  className={`relative inline-block w-8 h-5 rounded-full transition ${
                    selected.botEnabled ? "bg-brand-green" : "bg-brand-border"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 ${
                      selected.botEnabled ? "left-3.5" : "left-0.5"
                    } w-4 h-4 rounded-full bg-white shadow transition-all`}
                  />
                </span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-brand-paper">
              {selected.messages.length === 0 && (
                <div className="text-center text-brand-ink/30 text-sm py-8">
                  Sin mensajes todavía.
                </div>
              )}
              {selected.messages.map((m) => {
                const isClient = m.from === "client";
                const isOperator = m.from === "operator";
                return (
                  <div
                    key={m.id}
                    className={`flex ${isClient ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm shadow-card break-words ${
                        isClient
                          ? "bg-white text-brand-ink border border-brand-border"
                          : isOperator
                            ? "bg-brand-ink text-white"
                            : "bg-brand-green text-white"
                      }`}
                    >
                      {!isClient && (
                        <div className="text-[10px] uppercase tracking-wider opacity-75 mb-0.5">
                          {isOperator
                            ? (m.operatorName ?? "Operador")
                            : "Agente IA"}
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{m.text}</div>
                      <div className="text-[10px] opacity-70 text-right mt-1">
                        {formatTime(m.at)}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-brand-border bg-brand-white">
              {selected.botEnabled && (
                <div className="px-4 pt-2 text-[11px] text-brand-green flex items-center gap-1.5">
                  <Bot size={12} />
                  El bot está activo. Si enviás vos, vas a responder en
                  paralelo.
                </div>
              )}
              <div className="flex items-end gap-2 p-3 sm:p-4">
                <textarea
                  ref={textareaRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={onKeyDown}
                  rows={1}
                  placeholder={`Escribí un mensaje como ${userName}...`}
                  className="input resize-none max-h-40 leading-6"
                  style={{
                    height: "auto",
                    minHeight: "42px",
                  }}
                  onInput={(e) => {
                    const el = e.currentTarget;
                    el.style.height = "auto";
                    el.style.height = Math.min(el.scrollHeight, 160) + "px";
                  }}
                />
                {selected.botEnabled && draft.trim() && (
                  <button
                    onClick={() => sendMessage(true)}
                    disabled={sending}
                    className="btn-ghost hidden sm:inline-flex"
                    title="Enviar y pausar el bot en este chat"
                  >
                    <BotOff size={14} />
                    <span className="text-xs">Enviar y pausar bot</span>
                  </button>
                )}
                <button
                  onClick={() => sendMessage(false)}
                  disabled={sending || !draft.trim()}
                  className="btn-primary shrink-0"
                  aria-label="Enviar"
                >
                  {sending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  <span className="hidden sm:inline">Enviar</span>
                </button>
              </div>
              <div className="px-4 pb-2 text-[10px] text-brand-ink/40">
                Enter envía · Shift + Enter salto de línea · Tu mensaje lo
                reenvía el agente por WhatsApp.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
