import type { User } from "@supabase/supabase-js";

export const ADMIN_EMAIL = "ranjitodedra.dev@gmail.com";

export function isAdmin(user: Pick<User, "email">): boolean {
  return user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
