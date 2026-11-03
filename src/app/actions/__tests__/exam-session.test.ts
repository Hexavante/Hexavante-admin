import { expect, it, vi } from "vitest";
import { getAdminSession } from "@/lib/admin-auth";
import { createExam } from "@/services/exam-admin.service";
import { createExamAction } from "../exam-admin";

vi.mock("@/lib/admin-auth", () => ({ getAdminSession: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: {} }));
vi.mock("@/services/content-moderation.service", () => ({}));
vi.mock("@/services/exam-admin.service", () => ({ createExam: vi.fn(async () => ({id: "exam"})) }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: (url: string) => { throw new Error(url); } }));

it("cria com a sessão de moderação e recusa quem não tem o papel", async () => {
  const user = {id:"u", name:"Aluno", username:"aluno", email:"aluno@example.com", avatarUrl:null, roles:["USER"]};
  const form = new FormData();
  form.set("title", "Geometria");
  form.set("examType", "ENEM");
  vi.mocked(getAdminSession).mockResolvedValueOnce(user);
  expect((await createExamAction({success:false}, form)).success).toBe(false);
  expect(createExam).not.toHaveBeenCalled();
  vi.mocked(getAdminSession).mockResolvedValueOnce({...user, roles:["MODERATOR"]});
  await expect(createExamAction({success:false}, form)).rejects.toThrow("/admin/simulados/exam/edit");
  expect(createExam).toHaveBeenCalledTimes(1);
});
