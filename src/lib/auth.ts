export const AUTH_COOKIE = "rg_user";

export const USERS = [
  {
    id: "mateo",
    name: "Mateo",
    role: "Owner",
    avatarInitials: "M",
  },
] as const;

export type AppUser = (typeof USERS)[number];
