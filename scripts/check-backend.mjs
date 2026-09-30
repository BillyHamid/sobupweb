import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";

nextEnv.loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Variables Supabase serveur manquantes.");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

async function checkTable(name, column) {
  const { error } = await db.from(name).select(column).limit(1);
  if (error) {
    console.error(`${name} : absent ou inaccessible (${error.code ?? "erreur"}).`);
    return false;
  }
  console.log(`${name} : OK`);
  return true;
}

async function main() {
  const checks = await Promise.all([
    checkTable("formation_applications", "id"),
    checkTable("member_surveys", "id"),
    checkTable("member_survey_options", "id"),
    checkTable("member_survey_participations", "survey_id"),
    checkTable("member_survey_ballots", "survey_id"),
  ]);
  const { data: buckets, error } = await db.storage.listBuckets();
  const bucket = buckets?.find(({ name }) => name === "formation-applications");
  const privateBucket = !error && bucket && !bucket.public;
  console[privateBucket ? "log" : "error"](`Bucket privé formation-applications : ${privateBucket ? "OK" : "absent ou public"}`);
  if (checks.some((ok) => !ok) || !privateBucket) process.exitCode = 1;
}

main().catch((error) => {
  console.error("Vérification Supabase impossible :", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
