import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export function loadProjectEnv(root, baseEnv = process.env) {
  const env = { ...baseEnv };
  for (const name of [".env", ".env.local", ".env.production"]) {
    const path = join(root, name);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      env[key] = value;
    }
  }
  return env;
}
