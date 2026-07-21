import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Incrémente le compteur global de visites du site.
 * Appelé côté client une seule fois par session (via localStorage flag).
 * Retourne le nouveau total pour affichage immédiat.
 */
export async function POST() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc("increment_site_views");
    if (error) {
      console.error("[analytics/track]", error);
      return NextResponse.json({ error: "counter unavailable" }, { status: 500 });
    }
    return NextResponse.json({ total: data });
  } catch (err) {
    console.error("[analytics/track]", err);
    return NextResponse.json({ error: "counter unavailable" }, { status: 500 });
  }
}

/**
 * Lit le compteur sans incrémenter — pour affichage.
 */
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("site_stats").select("total_views").eq("id", 1).single();
    if (error || !data) return NextResponse.json({ total: 0 });
    return NextResponse.json({ total: data.total_views });
  } catch {
    return NextResponse.json({ total: 0 });
  }
}
