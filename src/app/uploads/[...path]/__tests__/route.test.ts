// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { GET } from "../route";
let directory: string | undefined;
afterEach(async () => { vi.restoreAllMocks(); if (directory) await rm(directory, { recursive: true, force: true }); directory = undefined; });
it("serve uma capa criada depois que a rota já foi carregada", async () => {
 directory = await mkdtemp(path.join(tmpdir(), "hexavante-upload-test-"));
 vi.spyOn(process, "cwd").mockReturnValue(directory);
 await mkdir(path.join(directory, "public/uploads/exams"), { recursive: true });
 await writeFile(path.join(directory, "public/uploads/exams/new.webp"), "image-bytes");
 const response = await GET(new Request("http://localhost/uploads/exams/new.webp"), { params: Promise.resolve({ path: ["exams", "new.webp"] }) });
 expect(response.status).toBe(200);
 expect(response.headers.get("content-type")).toBe("image/webp");
 expect(await response.text()).toBe("image-bytes");
});
it.each([["..", "secret"], ["exams", "../secret"], ["private", "secret"]])("rejeita caminho fora das pastas públicas %j", async (...segments) => {
 const response = await GET(new Request("http://localhost/uploads/test"), { params: Promise.resolve({ path: segments }) });
 expect(response.status).toBe(404);
});
