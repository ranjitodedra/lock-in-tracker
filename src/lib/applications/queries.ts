import type { ApplicationRow } from "@/types/application";
import { createClient } from "@/lib/supabase/server";

export async function listApplications(): Promise<ApplicationRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getApplication(
  id: string,
): Promise<ApplicationRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
