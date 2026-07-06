import { createClient } from "@/lib/supabase/server";

export async function getRecentExtractionCount(
  userId: string,
  windowMs: number,
): Promise<number> {
  const supabase = await createClient();
  const since = new Date(Date.now() - windowMs).toISOString();
  const { count, error } = await supabase
    .from("extraction_usage")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", since);

  if (error) {
    throw new Error("Failed to read extraction usage");
  }

  return count ?? 0;
}

export async function recordExtraction(userId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("extraction_usage")
    .insert({ user_id: userId });

  if (error) {
    throw new Error("Failed to record extraction");
  }
}
