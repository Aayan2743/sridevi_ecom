/**
 * Import login side WebP as base64-only into data/login-hero.b64
 *
 * Usage (PowerShell):
 *   Set-Content -Path .\my-hero.txt -Value 'data:image/webp;base64,UklGR...' -NoNewline
 *   node scripts/import-login-hero.mjs .\my-hero.txt
 *
 * Or paste base64 only (no data: prefix) into my-hero.txt
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcPath = process.argv[2];
if (!srcPath) {
  console.error("Usage: node scripts/import-login-hero.mjs <path-to-text-file>");
  process.exit(1);
}
let raw = fs.readFileSync(path.resolve(srcPath), "utf8").trim();
if (raw.includes("base64,")) {
  raw = raw.split("base64,")[1].trim();
}
raw = raw.replace(/\s+/g, "");
const out = path.join(__dirname, "../data/login-hero.b64");
fs.writeFileSync(out, raw + "\n", "utf8");
console.log("Wrote", out, "(" + raw.length + " chars)");
