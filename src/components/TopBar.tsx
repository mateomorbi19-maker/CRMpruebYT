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
    <header className="lg:hidden sticky top-0 z-20 bg-brand-black/85 backdrop-blur border-b border-white/5">
      <div className="flex items-center gap-3 px-4 h-14">
        <button
          onClick={onMenu}
          className="p-2 -ml-2 text-white/80 hover:text-brand-greenSoft"
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>
        <Logo size="sm" className="w-[90px] h-auto" />
        <div className="flex-1" />
        <span className="text-xs text-white/50 uppercase tracking-wider">
          {title}
        </span>
      </div>
    </header>
  );
}
