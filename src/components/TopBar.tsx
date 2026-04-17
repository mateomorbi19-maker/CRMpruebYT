"use client";

import { Menu } from "lucide-react";
import Logo from "./Logo";

export default function TopBar({
  onMenu,
  title,
}: {
  onMenu: () => void;
  title: string;
}) {
  return (
    <header className="lg:hidden sticky top-0 z-20 bg-brand-white/90 backdrop-blur border-b border-brand-border">
      <div className="flex items-center gap-3 px-4 h-14">
        <button
          onClick={onMenu}
          className="p-2 -ml-2 text-brand-ink/70 hover:text-brand-green"
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>
        <Logo size="sm" variant="dark" className="w-[90px] h-auto" />
        <div className="flex-1" />
        <span className="text-xs text-brand-ink/50 uppercase tracking-wider">
          {title}
        </span>
      </div>
    </header>
  );
}
