import { notFound } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { isAdmin } from "@/lib/auth/admin-check";
import { requireUser } from "@/lib/auth/session";

export { ADMIN_EMAIL, isAdmin } from "@/lib/auth/admin-check";

export async function requireAdmin(): Promise<User> {
  const user = await requireUser();
  if (!isAdmin(user)) {
    notFound();
  }
  return user;
}
