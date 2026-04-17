"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessagesSquare,
  Users,
  Package,
  LogOut,
  X,
} from "lucide-react";
import Logo from "./Logo";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/conversaciones", label: "Conversaciones", icon: MessagesSquare },
  { href: "/contactos", label: "Contactos", icon: Users },
  { href: "/productos", label: "Productos", icon: Package },
];

export default function Sidebar({
  open,
  onClose,
  userName,
}: {
  open: boolean;
  onClose: () => void;
  userName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/");
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-brand-night border-r border-white/5 z-40 transform transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 flex flex-col`}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3 lg:pb-6">
          <Logo size="sm" className="w-[110px] h-auto" />
          <button
            className="lg:hidden text-white/60 hover:text-white"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`nav-item ${active ? "nav-item-active" : ""}`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-brand-green text-black font-bold flex items-center justify-center">
              {userName[0]}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">{userName}</div>
              <div className="text-xs text-white/40">Conectado</div>
            </div>
            <button
              onClick={logout}
              className="text-white/50 hover:text-brand-greenSoft"
              aria-label="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
