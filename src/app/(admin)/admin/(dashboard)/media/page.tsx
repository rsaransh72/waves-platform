import { createServerSupabaseClient } from "@/lib/supabase-server";
import { MediaList } from "@/components/admin/MediaList";

export const revalidate = 0;

export default async function MediaLibraryPage() {
  const supabase = await createServerSupabaseClient();
  const { data: media, error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching media:", error);
  }

  return (
    <MediaList initialMedia={media || []} />
  );
}
