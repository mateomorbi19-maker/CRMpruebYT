import { db } from "@/lib/db";
import { formatARS } from "@/lib/format";
import { MessagesSquare, Users, Package, Bot, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const [products, contacts, conversations] = await Promise.all([
    db.getProducts(),
    db.getContacts(),
    db.getConversations(),
  ]);

  const clients = contacts.filter((c) => c.status === "client").length;
  const qualified = contacts.filter((c) => c.status === "qualified_lead").length;
  const unread = conversations.reduce((acc, c) => acc + c.unread, 0);
  const botActive = conversations.filter((c) => c.botEnabled).length;
  const totalRevenue = contacts.reduce((a, c) => a + c.totalSpent, 0);

  const stats = [
    {
      label: "Conversaciones activas",
      value: conversations.length,
      sub: `${unread} sin leer`,
      icon: MessagesSquare,
      href: "/conversaciones",
    },
    {
      label: "Bot encendido",
      value: `${botActive}/${conversations.length}`,
      sub: "Chats con agente activo",
      icon: Bot,
      href: "/conversaciones",
    },
    {
      label: "Contactos",
      value: contacts.length,
      sub: `${clients} clientes · ${qualified} leads calif.`,
      icon: Users,
      href: "/contactos",
    },
    {
      label: "Productos",
      value: products.length,
      sub: "Sincronizados con el agente",
      icon: Package,
      href: "/productos",
    },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8 hidden lg:block">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Hola <span className="text-brand-greenSoft">Mateo</span>,
        </h1>
        <p className="text-white/50">
          Este es el estado actual del agente de Ready Golf.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="card p-4 sm:p-5 hover:border-brand-green/40 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-white/50">
                  {s.label}
                </span>
                <Icon size={18} className="text-brand-greenSoft" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold">{s.value}</div>
              <div className="text-xs text-white/40 mt-1">{s.sub}</div>
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Últimas conversaciones</h2>
            <Link
              href="/conversaciones"
              className="text-xs text-brand-greenSoft hover:underline"
            >
              Ver todas →
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {conversations
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.lastMessageAt).getTime() -
                  new Date(a.lastMessageAt).getTime(),
              )
              .slice(0, 5)
              .map((c) => (
                <div
                  key={c.id}
                  className="py-3 flex items-center gap-3 text-sm"
                >
                  <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center font-semibold">
                    {c.contactName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{c.contactName}</div>
                    <div className="text-white/50 truncate text-xs">
                      {c.preview}
                    </div>
                  </div>
                  <span
                    className={
                      c.botEnabled ? "chip-green" : "chip text-white/40"
                    }
                  >
                    <Bot size={12} /> {c.botEnabled ? "On" : "Off"}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Resumen comercial</h2>
            <TrendingUp size={16} className="text-brand-greenSoft" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-white/50">
                Ventas totales (contactos registrados)
              </div>
              <div className="text-2xl font-bold">{formatARS(totalRevenue)}</div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="chip-green">{clients} clientes</span>
              <span className="chip">{qualified} leads calificados</span>
              <span className="chip">
                {contacts.length - clients - qualified} leads
              </span>
            </div>
            <div className="text-xs text-white/40 pt-2 border-t border-white/5">
              Los datos se sincronizan con el agente de WhatsApp de Ready Golf.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
