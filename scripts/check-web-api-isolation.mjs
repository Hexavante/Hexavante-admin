import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("src");
const forbidden = [
  /api\.hexavante\.com\.br/g,
  /desktop-api\.hexavante\.com\.br/g,
  /mobile-api\.hexavante\.com\.br/g,
  /AUTH_API_URL/g,
  /NEXT_PUBLIC_API_URL/g,
  /SERVER_API_URL/g,
  /CLIENT_API_URL/g,
  /fetch\s*\(\s*[`'"]https?:\/\/[^`'"]*(?:desktop-api|mobile-api|api)\.hexavante\.com\.br/gi,
];
const findings = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(target);
    else if (/\.(?:ts|tsx|js|jsx|mjs|cjs)$/.test(entry.name)) {
      const text = await readFile(target, "utf8");
      const lines = text.split(/\r?\n/);
      for (let index = 0; index < lines.length; index++) {
        if (forbidden.some((pattern) => { pattern.lastIndex = 0; return pattern.test(lines[index]); })) findings.push(`${path.relative(process.cwd(), target)}:${index + 1}: ${lines[index].trim()}`);
      }
    }
  }
}
await walk(root);
if (findings.length) {
  console.error("O Web voltou a depender de uma API nativa:\n" + findings.join("\n"));
  process.exit(1);
}
console.log("Web isolado das APIs Desktop, Mobile e legado.");
