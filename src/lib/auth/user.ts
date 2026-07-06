import type { User } from "@supabase/supabase-js";

export function userInitials(user: User): string {
  const email = user.email ?? "";
  const local = email.split("@")[0] ?? "";
  if (!local) return "?";
  const parts = local.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return local.slice(0, 2).toUpperCase();
}
