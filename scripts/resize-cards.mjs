/**
 * Generates display-sized variants of the game card art.
 *
 * The cards render in a ~190px CSS slot. Handing the browser a 1024px source
 * means a 5.4x downscale, and inside the flip card's 3D layer that downscale is
 * done with cheap bilinear filtering — high-detail art aliases into a blocky
 * mess on DPR 1 screens. Pre-resizing with a proper Lanczos filter fixes it.
 *
 * Run: node scripts/resize-cards.mjs
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
// Full-size originals stay out of public/ so they are never shipped to the browser.
const SRC_DIR = path.join(ROOT, "assets-src", "cards");
const OUT_DIR = path.join(ROOT, "public", "cards");

// The card slot is ~190px wide, so 1x/2x/3x cover every device pixel ratio.
const WIDTHS = [190, 380, 570];

const SOURCES = ["rapunzel-play-card.png", "flynn-poster.png", "gbr.jpeg", "jilan.jpeg"];

await mkdir(OUT_DIR, { recursive: true });

for (const file of SOURCES) {
  const { name } = path.parse(file);
  const input = path.join(SRC_DIR, file);

  for (const width of WIDTHS) {
    const output = path.join(OUT_DIR, `${name}-${width}.webp`);
    const { width: w, height: h } = await sharp(input)
      .resize({ width, kernel: "lanczos3", withoutEnlargement: true })
      .webp({ quality: 90 })
      .toFile(output);
    console.log(`${path.relative(ROOT, output)} — ${w}x${h}`);
  }
}
