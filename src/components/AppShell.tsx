"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/conversaciones": "Conversaciones",
  "/contactos": "Contactos",
  "/productos": "Productos",
};

export default function AppShell({
  userName,
  children,
}: {
  userName: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const title =
    Object.entries(TITLES).find(([k]) => pathname.startsWith(k))?.[1] ??
    "Ready Golf CRM";

  return (
    <div className="min-h-screen flex bg-brand-black bg-grid">
      <Sidebar
        open={open}
        onClose={() => setOpen(false)}
        userName={userName}
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar onMenu={() => setOpen(true)} title={title} />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
