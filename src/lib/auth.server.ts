import "server-only";
import { cookies } from "next/headers";
import { AUTH_COOKIE, USERS, type AppUser } from "./auth";

export async function getCurrentUser(): Promise<AppUser | null> {
  const store = await cookies();
  const id = store.get(AUTH_COOKIE)?.value;
  if (!id) return null;
  return USERS.find((u) => u.id === id) ?? null;
}
