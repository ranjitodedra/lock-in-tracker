import { notFound } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { requireUser } from "@/lib/auth/session";

export const ADMIN_EMAIL = "ranjitodedra.dev@gmail.com";

export function isAdmin(user: Pick<User, "email">): boolean {
  return user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

export async function requireAdmin(): Promise<User> {
  const user = await requireUser();
  if (!isAdmin(user)) {
    notFound();
  }
  return user;
}
