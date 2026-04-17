export const AUTH_COOKIE = "rg_user";

export const USERS = [
  {
    id: "mateo",
    name: "Mateo",
    role: "Owner",
    avatarInitials: "M",
  },
  {
    id: "ulises",
    name: "Ulises",
    role: "Operador",
    avatarInitials: "U",
  },
] as const;

export type AppUser = (typeof USERS)[number];
