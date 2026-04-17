import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth.server";
import AppShell from "@/components/AppShell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  return <AppShell userName={user.name}>{children}</AppShell>;
}
