import { db } from "@/lib/db";
import { formatARS } from "@/lib/format";
import { MessagesSquare, Users, Package, Bot, TrendingUp } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth.server";

export default async function DashboardPage() {
  const [user, products, contacts, conversations] = await Promise.all([
    getCurrentUser(),
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
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-ink">
          Hola <span className="text-brand-green">{user?.name ?? ""}</span>,
        </h1>
        <p className="text-brand-ink/50">
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
              className="card p-4 sm:p-5 hover:border-brand-green/60 hover:shadow-glow transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-brand-ink/50">
                  {s.label}
                </span>
                <Icon size={18} className="text-brand-green" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-brand-ink">
                {s.value}
              </div>
              <div className="text-xs text-brand-ink/50 mt-1">{s.sub}</div>
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-brand-ink">Últimas conversaciones</h2>
            <Link
              href="/conversaciones"
              className="text-xs text-brand-green hover:underline"
            >
              Ver todas →
            </Link>
          </div>
          <div className="divide-y divide-brand-border">
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
                  <div className="w-9 h-9 rounded-full bg-brand-paper border border-brand-border flex items-center justify-center font-semibold text-brand-ink">
                    {c.contactName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate text-brand-ink">
                      {c.contactName}
                    </div>
                    <div className="text-brand-ink/50 truncate text-xs">
                      {c.preview}
                    </div>
                  </div>
                  <span className={c.botEnabled ? "chip-green" : "chip"}>
                    <Bot size={12} /> {c.botEnabled ? "On" : "Off"}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-brand-ink">Resumen comercial</h2>
            <TrendingUp size={16} className="text-brand-green" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-brand-ink/50">
                Ventas totales (contactos registrados)
              </div>
              <div className="text-2xl font-bold text-brand-ink">
                {formatARS(totalRevenue)}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="chip-green">{clients} clientes</span>
              <span className="chip">{qualified} leads calificados</span>
              <span className="chip">
                {contacts.length - clients - qualified} leads
              </span>
            </div>
            <div className="text-xs text-brand-ink/40 pt-2 border-t border-brand-border">
              Los datos se sincronizan con el agente de WhatsApp de Ready Golf.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
