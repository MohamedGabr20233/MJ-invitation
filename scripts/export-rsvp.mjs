/**
 * Pulls every RSVP out of Supabase — rows plus the photos guests attached.
 *
 * The site itself can never read this data: `rsvp_responses` has an insert and
 * an update policy and deliberately no select policy, so the anon key in the
 * bundle cannot list answers. Reading is this script's job, and it runs on your
 * machine with the service_role key, which bypasses row-level security.
 *
 * The key goes in `.env.local` as SUPABASE_SERVICE_ROLE_KEY — no VITE_ prefix,
 * because anything named VITE_* gets inlined into the shipped bundle and this
 * key is full read/write on the whole project.
 *
 * Run: npm run rsvp:export
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = path.resolve(import.meta.dirname, "..");
// Git-ignored: real names, notes and faces of the guest list.
const OUT_DIR = path.join(ROOT, "exports");
const PHOTO_DIR = path.join(OUT_DIR, "photos");

const PHOTO_BUCKET = "rsvp-photos";

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\nAdd them to .env.local — Supabase dashboard → Project Settings → API → service_role.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

const { data: responses, error: selectError } = await supabase.from("rsvp_responses").select("*").order("created_at", { ascending: true });

if (selectError) {
  console.error(`Could not read rsvp_responses: ${selectError.message}`);
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });

/* ── json: everything, exactly as stored ─────────────────────────────────── */
await writeFile(path.join(OUT_DIR, "rsvp.json"), `${JSON.stringify(responses, null, 2)}\n`);

/* ── csv: the version you can open in Sheets ─────────────────────────────── */
const CSV_COLUMNS = ["created_at", "updated_at", "guest_name", "is_attending", "guest_count", "message", "photo_path", "id"];

/** Quotes every field, so commas, quotes and newlines in a message stay put. */
const csvCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

const csvRows = [CSV_COLUMNS.join(","), ...responses.map((response) => CSV_COLUMNS.map((column) => csvCell(response[column])).join(","))];

await writeFile(path.join(OUT_DIR, "rsvp.csv"), `${csvRows.join("\n")}\n`);

/* ── photos ──────────────────────────────────────────────────────────────── */
const withPhoto = responses.filter((response) => response.photo_path);

if (withPhoto.length) await mkdir(PHOTO_DIR, { recursive: true });

let downloadedPhotos = 0;

for (const response of withPhoto) {
  const { data: photoBlob, error: downloadError } = await supabase.storage.from(PHOTO_BUCKET).download(response.photo_path);

  if (downloadError || !photoBlob) {
    console.warn(`  ! photo for ${response.guest_name} failed: ${downloadError?.message ?? "empty file"}`);
    continue;
  }

  // Named after the guest so the folder is readable, suffixed with the row id
  // because two guests can share a first name.
  const safeName = response.guest_name.replace(/[^\p{L}\p{N}]+/gu, "-").slice(0, 40);
  const extension = path.extname(response.photo_path) || ".jpg";

  await writeFile(path.join(PHOTO_DIR, `${safeName}-${response.id.slice(0, 8)}${extension}`), Buffer.from(await photoBlob.arrayBuffer()));
  downloadedPhotos += 1;
}

/* ── the summary you actually wanted ─────────────────────────────────────── */
const attending = responses.filter((response) => response.is_attending);
const totalHeads = attending.reduce((runningTotal, response) => runningTotal + response.guest_count, 0);
const messages = responses.filter((response) => response.message);

console.log(`\n  ${responses.length} answers — ${attending.length} yes, ${responses.length - attending.length} no`);
console.log(`  ${totalHeads} people coming (guest counts included)`);
console.log(`  ${messages.length} messages, ${downloadedPhotos}/${withPhoto.length} photos downloaded`);
console.log(`\n  exports/rsvp.json  exports/rsvp.csv  exports/photos/\n`);
