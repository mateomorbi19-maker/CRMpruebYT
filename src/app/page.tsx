"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/Logo";
import { USERS } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function loginAs(userId: string) {
    setLoading(userId);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) router.push("/dashboard");
    else setLoading(null);
  }

  return (
    <main className="min-h-screen bg-hero flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-6 mb-10">
          <Logo
            size="xl"
            variant="dark"
            className="w-[260px] sm:w-[340px] h-auto"
          />
          <div className="h-px w-24 bg-brand-green/60" />
          <p className="text-brand-ink/60 text-sm tracking-wide uppercase">
            Panel de control del agente
          </p>
        </div>

        <div className="card p-6 sm:p-8 shadow-glow">
          <h1 className="text-brand-ink text-lg font-semibold mb-1">
            Seleccioná tu usuario
          </h1>
          <p className="text-brand-ink/50 text-sm mb-6">
            Acceso directo, sin contraseña.
          </p>

          <div className="space-y-3">
            {USERS.map((u) => (
              <button
                key={u.id}
                onClick={() => loginAs(u.id)}
                disabled={loading !== null}
                className="group w-full flex items-center gap-4 p-4 rounded-2xl border border-brand-border hover:border-brand-green/60 hover:bg-brand-greenTint/40 transition text-left disabled:opacity-60"
              >
                <div className="w-12 h-12 rounded-full bg-brand-green text-white font-bold text-lg flex items-center justify-center">
                  {u.avatarInitials}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-brand-ink">{u.name}</div>
                  <div className="text-xs text-brand-ink/50">{u.role}</div>
                </div>
                <div className="text-brand-green text-sm opacity-0 group-hover:opacity-100 transition">
                  {loading === u.id ? "Entrando..." : "Entrar →"}
                </div>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-brand-ink/40 text-xs mt-8">
          © {new Date().getFullYear()} Ready Golf Shop · CRM interno
        </p>
      </div>
    </main>
  );
}
